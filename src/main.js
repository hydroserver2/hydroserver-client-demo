import { loadData, initHydroServer } from "./api";
import { plot } from "./plot";
import "./style.css";

const initData = async () => {
  await initHydroServer();

  // LOAD THE OBSERVATIONS
  const rawData = await loadData(import.meta.env.VITE_RAW_DATASTREAM);
  const qcData = await loadData(import.meta.env.VITE_QC_DATASTREAM);

  const fullData = {
    dataValues: qcData.dataValues,
    datetimes: qcData.datetimes,
    qcDatastream: qcData.datastream, // USED FOR PLOT METADATA
  };

  const lastQcDatetime = qcData.datetimes[qcData.datetimes.length - 1];
  const rawCutOffIndex = rawData.datetimes.findIndex((d) => d > lastQcDatetime);

  // APPEND RAW DATA TO THE QC DATA AFTER THE CUTOFF DATETIME
  if (rawCutOffIndex > -1) {
    rawData.dataValues.splice(0, rawCutOffIndex);
    rawData.datetimes.splice(0, rawCutOffIndex);

    fullData.dataValues = [...fullData.dataValues, ...rawData.dataValues];
    fullData.datetimes = [...fullData.datetimes, ...rawData.datetimes];
  }

  return fullData;
};

window.onload = async () => {
  const data = await initData();
  plot(data);
};
