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
var croppedDataset = {
  label: "Within confidence",
  backgroundColor: "rgb(0,200,200)",
  data: [],
  order: 3,
};

// Chart
var ctx = document.getElementById("spies-chart").getContext("2d");
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "bar",

  // The data for our dataset
  data: {
    labels: labels,
    datasets: [dataset, croppedDataset],
  },

  // Configuration options go here
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
  newLabel.value = "";
  dataset.data.push(newValue.value);
  newValue.value = "";
  updateChart(chart, dataset, labels, croppedDataset);
}
function cropData(data, confidence) {
  croppedData = [...data];
  // crop the beginning
  var amountToCrop = confidence / 2;
  console.log(amountToCrop);
  for (var i = 0; i < data.length && amountToCrop > 0; ++i) {
    croppedData[i] = Math.max(data[i] - amountToCrop, 0);
    amountToCrop -= data[i];
  }
  // crop the end
  amountToCrop = confidence / 2;
  for (var i = data.length - 1; i >= 0 && amountToCrop > 0; --i) {
    croppedData[i] = Math.max(data[i] - amountToCrop, 0);
    amountToCrop -= data[i];
  }
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

document.getElementById("confidence-interval").oninput = () => {
  var confidenceLabel = document.getElementById("confidence-interval-label");
  var confidence = document.getElementById("confidence-interval").value;
  confidenceLabel.innerHTML = `Select desired confidence (${confidence}%)`;
  croppedDataset.data = cropData(dataset.data, confidence);
  updateChart(chart, dataset, labels, croppedDataset);
};
