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
    showline: true,
  };

  const yAxis = {
    title: {
      text: "some label",
    },
    autorange: true,
  };

  const plotlyOptions = {
    traces: [trace],
    layout: {
      spikedistance: 0, // https://github.com/plotly/plotly.js/issues/5927#issuecomment-1697679087
      // hoverdistance: 20,
      xaxis,
      yAxis,
      dragmode: "pan",
      hovermode: "x", // Disable if hovering is too costly
      title: {
        text: data.qcDatastream.name,
        // font: { color: COLORS[0], weight: "bold" },
      },
      showlegend: false,
    },
    config: {
      displayModeBar: true,
      showlegend: false,
      modeBarButtonsToRemove: ["toImage", "autoScale"],
      scrollZoom: true,
      responsive: true,
      doubleClick: false,
      plotGlPixelRatio: 1,
    },
  };

  await Plotly.newPlot(
    document.querySelector("#plot"),
    plotlyOptions.traces,
    plotlyOptions.layout,
    plotlyOptions.config
  );
};
