import Plotly from "plotly.js-dist";

export const plot = async (data) => {
  const left = data.qcDatastream.valueCount;
  const right = data.dataValues.length - left;

  const plotlyOptions = {
    traces: [
      {
        x: data.datetimes,
        y: data.dataValues,
        type: "scattergl",
        mode: "lines+markers",
        marker: {
          // COLOR QC DATA AND RAW DATA DIFFERENTLY
          color: [
            ...new Array(left).fill("royalblue"),
            ...new Array(right).fill("indianred"),
          ],
        },
      },
    ],
    layout: {
      xaxis: {
        type: "date",
        title: { text: "Datetime" },
        autorange: true,
      },
      yaxis: {
        title: {
          text: data.qcDatastream.observedProperty.name,
        },
        autorange: true,
      },
      dragmode: "pan",
      title: {
        text: data.qcDatastream.name,
      },
    },
    config: {
      displayModeBar: true,
      scrollZoom: true,
    },
  };

  await Plotly.newPlot(
    document.querySelector("#plot"),
    plotlyOptions.traces,
    plotlyOptions.layout,
    plotlyOptions.config
  );
};
