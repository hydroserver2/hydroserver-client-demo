import { HydroServer } from "@hydroserver/client";

let hs;

/**
 * Starts a HydroServer session.
 */
export const initHydroServer = async () => {
  // START SESSION
  hs = await HydroServer.initialize({
    host: import.meta.env.VITE_HYDROSERVER,
  });

  await hs.session.login(
    import.meta.env.VITE_HYDROSERVER_USERNAME,
    import.meta.env.VITE_HYDROSERVER_PASSWORD
  );
};

/**
 * Loads the datastream observations for a given datastream.
 * @param {string} id: the datastream id
 * @returns
 */
export const loadData = async (id) => {
  const datastream = (await hs.datastreams.get(id, { expand_related: true }))
    .data;

  if (!datastream.phenomenonBeginTime || !datastream.phenomenonEndTime) {
    return { datetimes: [], dataValues: [] };
  }

  const pageSize = 50_000;
  const maxPages = Math.ceil(datastream.valueCount / pageSize);
  let page = 1;

  // START PAGINATION
  try {
    let datetimes = [];
    let dataValues = [];
    while (page <= maxPages) {
      const result = await hs.datastreams.getObservations(datastream.id, {
        page_size: pageSize,
        phenomenon_time_min: datastream.phenomenonBeginTime,
        phenomenon_time_max: datastream.phenomenonEndTime,
        page: page,
        order_by: ["phenomenonTime"],
        format: "column",
        result_qualifier_code: null,
      });

      // IN CASE THERE IS NO MORE DATA FOR SOME REASON
      if (!result.data.result.length) {
        break;
      }

      // TRANSFORM THE DATETIMES TO DATE OBJECTS SO WE CAN USE THEM IN PLOTLY
      datetimes = [
        ...datetimes,
        ...result.data.phenomenonTime.map((d) => new Date(d).getTime()),
      ];
      dataValues = [...dataValues, ...result.data.result];
      page++;
    }

    return {
      datetimes,
      dataValues,
      datastream, // TO READ SOME METADATA TO USE IN PLOT LEGEND
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return Promise.reject(error);
  }
};
