import Plotly from "plotly.js-dist";

export const plot = async (data) => {
  const left = data.qcDatastream.valueCount;
  const right = data.dataValues.length - left;
  const trace = {
    x: data.datetimes,
    y: data.dataValues,
    type: "scattergl",
    mode: "lines+markers",
    hoverinfo: "skip", // Fixes performance issues, but disables tooltips
    name: "Plot",
    showLegend: false,
    marker: {
      color: [
        ...new Array(left).fill("royalblue"),
        ...new Array(right).fill("indianred"),
      ],
    },
  };

  const xaxis = {
    type: "date",
    title: { text: "Datetime" },
    autorange: true,
  };

  const yAxis = {
    title: {
      text: data.qcDatastream.observedProperty.name,
    },
    autorange: true,
  };

  const plotlyOptions = {
    traces: [trace],
    layout: {
      xaxis,
      yAxis,
      dragmode: "pan",
      hovermode: "x",
      hovertemplate: "<b>%{y}</b><br>%{x}<extra></extra>",
      title: {
        text: data.qcDatastream.name,
      },
      spikedistance: 0,
    },
    config: {
      displayModeBar: true,
      showlegend: false,
      scrollZoom: true,
      responsive: true,
    },
  };

  await Plotly.newPlot(
    document.querySelector("#plot"),
    plotlyOptions.traces,
    plotlyOptions.layout,
    plotlyOptions.config
  );
};
