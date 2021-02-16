// Constants
Z_TABLE = [];

// State
var labels = [
  "Less than 1 month",
  "1-2 months",
  "2-3 months",
  "3-4 months",
  "4-5 months",
  "5-6 months",
  "greater than 6 months",
];
var dataset = {
  label: "Chance of occurring (%)",
  backgroundColor: "rgb(255, 99, 132)",
  borderColor: "rgb(255, 99, 132)",
  data: [0, 5, 35, 35, 15, 5, 5],
  order: 2,
};
// The values within confidence using SPIES
var croppedDataset = {
  label: "Within confidence",
  backgroundColor: "rgb(0,200,200)",
  data: [],
  order: 3,
};

var slicedDataset = {
  label: "Within confidence",
  backgroundColor: "rgb(0,200,200)",
  data: [],
};

// Charts
var ctx = document.getElementById("spies-chart").getContext("2d");
var spiesChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [dataset, croppedDataset],
  },
  options: {},
});

var normalChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [dataset, slicedDataset],
  },
  options: {},
});

function updateChart(chart, primaryDataset, labels, secondaryDataset) {
  chart.data.labels = labels;
  chart.data.datasets[0] = primaryDataset;
  chart.data.datasets[1] = secondaryDataset;
  chart.update();
}

// Inputs
var newLabel = document.getElementById("new-label");
var newValue = document.getElementById("new-value");
function isValidData() {
  // Checks form data is valid
  if (newLabel.value === "") return false;
  if (newValue.value === "") return false;
  if (Number(newValue.value) === NaN) return false;
  return true;
}

function addData() {
  // Inserts data into the chart
  if (!isValidData()) return;
  labels.push(newLabel.value);
  dataset.data.push(newValue.value);
  newLabel.value = "";
  newValue.value = "";
  updateChart(spiesChart, dataset, labels, croppedDataset);
  updateChart(normalChart, dataset, labels, slicedDataset);
}

function SPIES(data, confidenceLevel) {
  var croppedData = [...data];
  // crop the beginning
  var amountToCrop = (100 - confidenceLevel) / 2;
  for (var i = 0; i < data.length && amountToCrop > 0; ++i) {
    croppedData[i] = Math.max(data[i] - amountToCrop, 0);
    amountToCrop -= data[i];
  }
  console.log(croppedData);
  // crop the end
  amountToCrop = (100 - confidenceLevel) / 2;
  for (var i = data.length - 1; i >= 0 && amountToCrop > 0; --i) {
    croppedData[i] = Math.max(croppedData[i] - amountToCrop, 0);
    amountToCrop -= data[i];
  }
  console.log(croppedData);
  return croppedData;
}

// add Event listeners
document.getElementById("add-data").onclick = addData;
document.getElementById("new-label").onkeydown = (e) => {
  if (e.keyCode != 13) return;
  addData();
};
document.getElementById("new-value").onkeydown = (e) => {
  if (e.keyCode != 13) return;
  addData();
};

document.getElementById("confidence-level").oninput = () => {
  var confidenceLabel = document.getElementById("confidence-level-label");
  var confidence = document.getElementById("confidence-level").value;
  confidenceLabel.innerHTML = `Select desired confidence (${confidence}%)`;
  // calculate SPIES chart data
  croppedDataset.data = SPIES(dataset.data, confidence);
  updateChart(spiesChart, dataset, labels, croppedDataset);
  // calculate confidence interval
  updateChart(normalChart, dataset, labels, croppedDataset);
};
