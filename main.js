import { getData } from "./data";
// set the height of chart element.
$("#chart").height(700);

// define amchart'theme.
am4core.useTheme(am4themes_animated);

// create amchart and initailize the chart.
var chart = am4core.create("chart", am4charts.XYChart);
chart.colors.step = 2;
chart.legend = new am4charts.Legend();
// create the x-axis to show date
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.labels.template.rotation = -45; 
dateAxis.renderer.minGridDistance = 1;
dateAxis.baseInterval = {
  timeUnit: "minute",
  count: 2
};
var interfaceColors = new am4core.InterfaceColorSet();
// Add scrollbar
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.marginBottom = 50;
chart.scrollbarX.paddingBottom = -10;

// define the fucntion to crate the y-axis
// input: field, name, opposite
function createAxisAndSeries(field, name, opposite) {
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  if (chart.yAxes.indexOf(valueAxis) != 0) {
    valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
  }
  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = "time";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.name = name;
  series.tooltipText = "{name}: [bold]{valueY}[/]";
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 100;
  series.tooltip.label.minWidth = 100;
  series.tooltip.label.minHeight = 100;
  series.tooltip.label.textAlign = "middle";
  series.tooltip.label.textValign = "middle";
  chart.scrollbarX.series.push(series);
  chart.mouseWheelBehavior = "panX";
  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 1;
  valueAxis.renderer.line.stroke = series.stroke;
  valueAxis.renderer.labels.template.fill = series.stroke;
  valueAxis.renderer.opposite = opposite;
}

createAxisAndSeries("visits", "Visits", false);
createAxisAndSeries("views", "Views", true);
createAxisAndSeries("hits", "Hits", true);

function generateChartData(data) {
  var chartData = [];
  for (var i = 0; i < 204; i++) {
    const dateX = new Date(data[0][i]);
    chartData.push({time: dateX, visits: data[1][i], hits: data[2][i], views: data[3][i]
    });
  }
  return chartData;
}
// get the data from server- to call getData funciton of data.js file.
// input: start date and end date
// output: date displayed to interface
const startEl = document.getElementById("start");
const endEl = document.getElementById("end");
getData(new Date(startEl.value), new Date(endEl.value))
  .then((data) => {
   // set the data displayed to interface.
    chart.data = generateChartData(data.data);
  });

// add events to date inputs- to define the function excuted when the values of date inputs are changed.
function onChange(e) {
  console.log('changed')
  const start = new Date(startEl.value);
  const end = new Date(endEl.value);

  getData(start, end);
  startEl.max = endEl.value;
  endEl.min = startEl.value;
}
startEl.addEventListener("change", onChange);
endEl.addEventListener("change", onChange);

