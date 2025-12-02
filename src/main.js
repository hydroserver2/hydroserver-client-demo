import { loadData, initHydroServer } from "./api";
import { plot } from "./plot";

const initData = async () => {
  await initHydroServer();
  const rawData = await loadData("019736de-8e13-7021-b124-3400a9c00c3b");
  const qcData = await loadData("019736de-47ad-719f-bea1-b3526ff86a71");

  const fullData = {
    dataValues: qcData.dataValues,
    datetimes: qcData.datetimes,
    qcDatastream: qcData.datastream,
  };

  const lastQcDatetime = qcData.datetimes[qcData.datetimes.length - 1];

  const appendRawIndex = rawData.datetimes.findIndex((d) => d > lastQcDatetime);
  if (appendRawIndex > -1) {
    rawData.dataValues.splice(0, appendRawIndex);
    rawData.datetimes.splice(0, appendRawIndex);

    fullData.dataValues = [...fullData.dataValues, ...rawData.dataValues];
    fullData.datetimes = [...fullData.datetimes, ...rawData.datetimes];
  }

  return fullData;
};

const start = async () => {
  const data = await initData();
  plot(data);
};

start();
