"use strict";

const FEATURES = [
  { key: "sepalLength", label: "Sepal length", short: "Sepal L" },
  { key: "sepalWidth", label: "Sepal width", short: "Sepal W" },
  { key: "petalLength", label: "Petal length", short: "Petal L" },
  { key: "petalWidth", label: "Petal width", short: "Petal W" },
];

const SPECIES = {
  setosa: { label: "Setosa", color: "#0173B2", shape: "circle" },
  versicolor: { label: "Versicolor", color: "#DE8F05", shape: "triangle" },
  virginica: { label: "Virginica", color: "#029E73", shape: "diamond" },
};

const speciesNames = ["setosa", "versicolor", "virginica"];

const rawData = String.raw`
5.1,3.5,1.4,0.2,0
4.9,3.0,1.4,0.2,0
4.7,3.2,1.3,0.2,0
4.6,3.1,1.5,0.2,0
5.0,3.6,1.4,0.2,0
5.4,3.9,1.7,0.4,0
4.6,3.4,1.4,0.3,0
5.0,3.4,1.5,0.2,0
4.4,2.9,1.4,0.2,0
4.9,3.1,1.5,0.1,0
5.4,3.7,1.5,0.2,0
4.8,3.4,1.6,0.2,0
4.8,3.0,1.4,0.1,0
4.3,3.0,1.1,0.1,0
5.8,4.0,1.2,0.2,0
5.7,4.4,1.5,0.4,0
5.4,3.9,1.3,0.4,0
5.1,3.5,1.4,0.3,0
5.7,3.8,1.7,0.3,0
5.1,3.8,1.5,0.3,0
5.4,3.4,1.7,0.2,0
5.1,3.7,1.5,0.4,0
4.6,3.6,1.0,0.2,0
5.1,3.3,1.7,0.5,0
4.8,3.4,1.9,0.2,0
5.0,3.0,1.6,0.2,0
5.0,3.4,1.6,0.4,0
5.2,3.5,1.5,0.2,0
5.2,3.4,1.4,0.2,0
4.7,3.2,1.6,0.2,0
4.8,3.1,1.6,0.2,0
5.4,3.4,1.5,0.4,0
5.2,4.1,1.5,0.1,0
5.5,4.2,1.4,0.2,0
4.9,3.1,1.5,0.2,0
5.0,3.2,1.2,0.2,0
5.5,3.5,1.3,0.2,0
4.9,3.6,1.4,0.1,0
4.4,3.0,1.3,0.2,0
5.1,3.4,1.5,0.2,0
5.0,3.5,1.3,0.3,0
4.5,2.3,1.3,0.3,0
4.4,3.2,1.3,0.2,0
5.0,3.5,1.6,0.6,0
5.1,3.8,1.9,0.4,0
4.8,3.0,1.4,0.3,0
5.1,3.8,1.6,0.2,0
4.6,3.2,1.4,0.2,0
5.3,3.7,1.5,0.2,0
5.0,3.3,1.4,0.2,0
7.0,3.2,4.7,1.4,1
6.4,3.2,4.5,1.5,1
6.9,3.1,4.9,1.5,1
5.5,2.3,4.0,1.3,1
6.5,2.8,4.6,1.5,1
5.7,2.8,4.5,1.3,1
6.3,3.3,4.7,1.6,1
4.9,2.4,3.3,1.0,1
6.6,2.9,4.6,1.3,1
5.2,2.7,3.9,1.4,1
5.0,2.0,3.5,1.0,1
5.9,3.0,4.2,1.5,1
6.0,2.2,4.0,1.0,1
6.1,2.9,4.7,1.4,1
5.6,2.9,3.6,1.3,1
6.7,3.1,4.4,1.4,1
5.6,3.0,4.5,1.5,1
5.8,2.7,4.1,1.0,1
6.2,2.2,4.5,1.5,1
5.6,2.5,3.9,1.1,1
5.9,3.2,4.8,1.8,1
6.1,2.8,4.0,1.3,1
6.3,2.5,4.9,1.5,1
6.1,2.8,4.7,1.2,1
6.4,2.9,4.3,1.3,1
6.6,3.0,4.4,1.4,1
6.8,2.8,4.8,1.4,1
6.7,3.0,5.0,1.7,1
6.0,2.9,4.5,1.5,1
5.7,2.6,3.5,1.0,1
5.5,2.4,3.8,1.1,1
5.5,2.4,3.7,1.0,1
5.8,2.7,3.9,1.2,1
6.0,2.7,5.1,1.6,1
5.4,3.0,4.5,1.5,1
6.0,3.4,4.5,1.6,1
6.7,3.1,4.7,1.5,1
6.3,2.3,4.4,1.3,1
5.6,3.0,4.1,1.3,1
5.5,2.5,4.0,1.3,1
5.5,2.6,4.4,1.2,1
6.1,3.0,4.6,1.4,1
5.8,2.6,4.0,1.2,1
5.0,2.3,3.3,1.0,1
5.6,2.7,4.2,1.3,1
5.7,3.0,4.2,1.2,1
5.7,2.9,4.2,1.3,1
6.2,2.9,4.3,1.3,1
5.1,2.5,3.0,1.1,1
5.7,2.8,4.1,1.3,1
6.3,3.3,6.0,2.5,2
5.8,2.7,5.1,1.9,2
7.1,3.0,5.9,2.1,2
6.3,2.9,5.6,1.8,2
6.5,3.0,5.8,2.2,2
7.6,3.0,6.6,2.1,2
4.9,2.5,4.5,1.7,2
7.3,2.9,6.3,1.8,2
6.7,2.5,5.8,1.8,2
7.2,3.6,6.1,2.5,2
6.5,3.2,5.1,2.0,2
6.4,2.7,5.3,1.9,2
6.8,3.0,5.5,2.1,2
5.7,2.5,5.0,2.0,2
5.8,2.8,5.1,2.4,2
6.4,3.2,5.3,2.3,2
6.5,3.0,5.5,1.8,2
7.7,3.8,6.7,2.2,2
7.7,2.6,6.9,2.3,2
6.0,2.2,5.0,1.5,2
6.9,3.2,5.7,2.3,2
5.6,2.8,4.9,2.0,2
7.7,2.8,6.7,2.0,2
6.3,2.7,4.9,1.8,2
6.7,3.3,5.7,2.1,2
7.2,3.2,6.0,1.8,2
6.2,2.8,4.8,1.8,2
6.1,3.0,4.9,1.8,2
6.4,2.8,5.6,2.1,2
7.2,3.0,5.8,1.6,2
7.4,2.8,6.1,1.9,2
7.9,3.8,6.4,2.0,2
6.4,2.8,5.6,2.2,2
6.3,2.8,5.1,1.5,2
6.1,2.6,5.6,1.4,2
7.7,3.0,6.1,2.3,2
6.3,3.4,5.6,2.4,2
6.4,3.1,5.5,1.8,2
6.0,3.0,4.8,1.8,2
6.9,3.1,5.4,2.1,2
6.7,3.1,5.6,2.4,2
6.9,3.1,5.1,2.3,2
5.8,2.7,5.1,1.9,2
6.8,3.2,5.9,2.3,2
6.7,3.3,5.7,2.5,2
6.7,3.0,5.2,2.3,2
6.3,2.5,5.0,1.9,2
6.5,3.0,5.2,2.0,2
6.2,3.4,5.4,2.3,2
5.9,3.0,5.1,1.8,2
`;

const irisData = rawData.trim().split("\n").map((row, index) => {
  const [sepalLength, sepalWidth, petalLength, petalWidth, speciesIndex] = row.split(",").map(Number);
  return {
    id: index + 1,
    sepalLength,
    sepalWidth,
    petalLength,
    petalWidth,
    species: speciesNames[speciesIndex],
  };
});

const state = {
  filter: "all",
  xFeature: "petalLength",
  yFeature: "petalWidth",
  selectedId: 75,
  hoveredId: null,
  selectedPair: { first: "petalLength", second: "petalWidth" },
  showRules: false,
  selectedAnatomyPart: null,
  selectedMeanSpecies: null,
  selectedDistribution: null,
};

const svg = document.getElementById("scatterplot");
const tooltip = document.getElementById("point-tooltip");
const details = document.getElementById("flower-details");
const heatmap = document.getElementById("heatmap");
const correlationDetails = document.getElementById("correlation-details");
const xSelect = document.getElementById("x-feature");
const ySelect = document.getElementById("y-feature");
const chartContext = document.getElementById("chart-context");
const chartPair = document.getElementById("chart-pair");
const heatmapContext = document.getElementById("heatmap-context");
const anatomyReadout = document.getElementById("anatomy-readout");
const anatomyFlower = document.querySelector(".anatomy-flower");
const meanFlowers = document.getElementById("mean-flowers");
const meanFlowerReadout = document.getElementById("mean-flower-readout");
const qualityChecks = document.getElementById("quality-checks");
const balanceBars = document.getElementById("balance-bars");
const summaryTable = document.getElementById("summary-table");
const distributionPlots = document.getElementById("distribution-plots");
const distributionReadout = document.getElementById("distribution-readout");
const ruleScore = document.getElementById("rule-score");
const confusionTable = document.getElementById("confusion-table");
const ruleButton = document.getElementById("show-rule-lines");

const chart = { width: 760, height: 470, left: 72, right: 26, top: 26, bottom: 66 };
const plotWidth = chart.width - chart.left - chart.right;
const plotHeight = chart.height - chart.top - chart.bottom;
const svgNamespace = "http://www.w3.org/2000/svg";

const domains = Object.fromEntries(FEATURES.map(({ key }) => {
  const values = irisData.map((flower) => flower[key]);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.08, 0.08);
  return [key, [minimum - padding, maximum + padding]];
}));

function visibleFlowers() {
  return state.filter === "all"
    ? irisData
    : irisData.filter((flower) => flower.species === state.filter);
}

function featureLabel(key) {
  return FEATURES.find((feature) => feature.key === key).label;
}

function speciesLabel(key) {
  return key === "all" ? "All species" : SPECIES[key].label;
}

function contextText() {
  return `${speciesLabel(state.filter)} · ${visibleFlowers().length} flowers`;
}

function makeSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function ticks([minimum, maximum], count = 5) {
  return Array.from({ length: count }, (_, index) => minimum + ((maximum - minimum) * index) / (count - 1));
}

function scale(value, [minimum, maximum], start, length) {
  return start + ((value - minimum) / (maximum - minimum)) * length;
}

function pearson(data, first, second) {
  if (first === second) return 1;
  const firstMean = data.reduce((sum, flower) => sum + flower[first], 0) / data.length;
  const secondMean = data.reduce((sum, flower) => sum + flower[second], 0) / data.length;
  let covariance = 0;
  let firstVariance = 0;
  let secondVariance = 0;

  data.forEach((flower) => {
    const firstDifference = flower[first] - firstMean;
    const secondDifference = flower[second] - secondMean;
    covariance += firstDifference * secondDifference;
    firstVariance += firstDifference ** 2;
    secondVariance += secondDifference ** 2;
  });

  return covariance / Math.sqrt(firstVariance * secondVariance);
}

function mean(data, feature) {
  return data.reduce((sum, flower) => sum + flower[feature], 0) / data.length;
}

function quantile(values, probability) {
  const sorted = [...values].sort((first, second) => first - second);
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function sampleStandardDeviation(values) {
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDifference = values.reduce((sum, value) => sum + (value - average) ** 2, 0);
  return Math.sqrt(squaredDifference / (values.length - 1));
}

function speciesMeans(species) {
  const rows = irisData.filter((flower) => flower.species === species);
  return Object.fromEntries(FEATURES.map(({ key }) => [key, mean(rows, key)]));
}

function predictionFor(flower) {
  if (flower.petalLength < 2.5) return "setosa";
  if (flower.petalWidth < 1.75) return "versicolor";
  return "virginica";
}

function heatmapColor(value) {
  const surface = [255, 253, 247];
  const target = value >= 0 ? [1, 115, 178] : [184, 76, 62];
  const mix = 0.1 + Math.abs(value) * 0.5;
  const color = surface.map((channel, index) => Math.round(channel * (1 - mix) + target[index] * mix));
  return `rgb(${color.join(", ")})`;
}

function relationshipText(value, first, second) {
  if (first === second) return `${featureLabel(first)} compared with itself is always a perfect relationship.`;
  const strength = Math.abs(value) >= 0.7 ? "strong" : Math.abs(value) >= 0.3 ? "moderate" : "weak";
  const direction = value >= 0 ? "positive" : "negative";
  const movement = value >= 0
    ? `larger ${featureLabel(first).toLowerCase()} usually appears with larger ${featureLabel(second).toLowerCase()}`
    : `larger ${featureLabel(first).toLowerCase()} usually appears with smaller ${featureLabel(second).toLowerCase()}`;
  return `This is a ${strength} ${direction} relationship: ${movement}.`;
}

function renderPointShape(group, flower) {
  const info = SPECIES[flower.species];
  let shape;
  if (info.shape === "circle") {
    shape = makeSvgElement("circle", { r: 6, fill: info.color });
  } else if (info.shape === "triangle") {
    shape = makeSvgElement("polygon", { points: "0,-7 7,6 -7,6", fill: info.color });
  } else {
    shape = makeSvgElement("polygon", { points: "0,-7 7,0 0,7 -7,0", fill: info.color });
  }
  group.append(shape);
}

function updatePointClasses() {
  const activeId = state.hoveredId ?? state.selectedId;
  svg.querySelectorAll(".scatter-point").forEach((point) => {
    const id = Number(point.dataset.id);
    point.classList.toggle("is-active", id === activeId);
    point.classList.toggle("is-muted", state.hoveredId !== null && id !== state.hoveredId);
  });
}

function showTooltip(flower, x, y) {
  const info = SPECIES[flower.species];
  tooltip.style.setProperty("--species-color", info.color);
  tooltip.innerHTML = `<strong>Iris #${flower.id} · ${info.label}</strong><span>Sepal ${flower.sepalLength.toFixed(1)} × ${flower.sepalWidth.toFixed(1)} cm<br>Petal ${flower.petalLength.toFixed(1)} × ${flower.petalWidth.toFixed(1)} cm</span>`;
  tooltip.hidden = false;

  const bounds = svg.getBoundingClientRect();
  const left = (x / chart.width) * bounds.width + 12;
  const top = (y / chart.height) * bounds.height - tooltip.offsetHeight - 8;
  const maximumLeft = Math.max(bounds.width - tooltip.offsetWidth - 8, 8);
  tooltip.style.left = `${Math.min(Math.max(left, 8), maximumLeft)}px`;
  tooltip.style.top = `${Math.max(top, 8)}px`;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function activeFlower() {
  const activeId = state.hoveredId ?? state.selectedId;
  return visibleFlowers().find((flower) => flower.id === activeId) ?? null;
}

function renderDetails() {
  const flower = activeFlower();
  if (!flower) {
    details.style.removeProperty("--species-color");
    details.innerHTML = `<p class="mini-label">Selected flower</p><h3>Choose any point</h3><p>Its species and all four measurements will appear here.</p>`;
    return;
  }

  const info = SPECIES[flower.species];
  details.style.setProperty("--species-color", info.color);
  details.innerHTML = `
    <p class="mini-label">${state.hoveredId ? "Hovering flower" : "Selected flower"}</p>
    <div class="detail-title">
      <i class="shape ${info.shape}" style="color:${info.color}" aria-hidden="true"></i>
      <div><h3>Iris #${flower.id}</h3><p>${info.label}</p></div>
    </div>
    <dl class="measurement-values">
      ${FEATURES.map((feature) => `<div><dt>${feature.label}</dt><dd>${flower[feature.key].toFixed(1)} cm</dd></div>`).join("")}
    </dl>
    <div class="pair-summary">
      <p><span>Sepal</span><strong>${flower.sepalLength.toFixed(1)} × ${flower.sepalWidth.toFixed(1)} cm</strong></p>
      <p><span>Petal</span><strong>${flower.petalLength.toFixed(1)} × ${flower.petalWidth.toFixed(1)} cm</strong></p>
    </div>`;
}

function setAnatomyPart(part) {
  const overall = Object.fromEntries(FEATURES.map(({ key }) => [key, mean(irisData, key)]));
  anatomyFlower.classList.toggle("show-sepal", part === "sepal");
  anatomyFlower.classList.toggle("show-petal", part === "petal");

  if (part === "sepal") {
    anatomyReadout.innerHTML = `<strong>Sepal = outer leaf</strong><span><code>sepal_length</code> ${overall.sepalLength.toFixed(1)} cm · <code>sepal_width</code> ${overall.sepalWidth.toFixed(1)} cm on average</span>`;
  } else {
    anatomyReadout.innerHTML = `<strong>Petal = inner leaf</strong><span><code>petal_length</code> ${overall.petalLength.toFixed(1)} cm · <code>petal_width</code> ${overall.petalWidth.toFixed(1)} cm on average</span>`;
  }
}

function resetAnatomyPart() {
  anatomyFlower.classList.remove("show-sepal", "show-petal");
  anatomyReadout.innerHTML = `<strong>Hover a petal or sepal</strong><span>The matching dataset columns will appear here.</span>`;
}

function updateAnatomyButtons() {
  document.querySelectorAll("[data-flower-part]").forEach((part) => {
    part.setAttribute("aria-pressed", String(part.dataset.flowerPart === state.selectedAnatomyPart));
  });
}

function flowerLeavesMarkup() {
  return `
    <span class="flower-leaf sepal leaf-1"></span>
    <span class="flower-leaf sepal leaf-2"></span>
    <span class="flower-leaf sepal leaf-3"></span>
    <span class="flower-leaf petal leaf-4"></span>
    <span class="flower-leaf petal leaf-5"></span>
    <span class="flower-leaf petal leaf-6"></span>
    <span class="flower-center"></span>`;
}

function renderMeanFlowers() {
  const pixelsPerCentimeter = 18;
  meanFlowers.innerHTML = Object.keys(SPECIES).map((species) => {
    const info = SPECIES[species];
    const values = speciesMeans(species);
    const flowerStyle = [
      `--species-color:${info.color}`,
      `--sepal-length:${(values.sepalLength * pixelsPerCentimeter).toFixed(1)}px`,
      `--sepal-width:${(values.sepalWidth * pixelsPerCentimeter).toFixed(1)}px`,
      `--petal-length:${(values.petalLength * pixelsPerCentimeter).toFixed(1)}px`,
      `--petal-width:${(values.petalWidth * pixelsPerCentimeter).toFixed(1)}px`,
    ].join(";");
    return `
      <article class="mean-flower-card" style="--species-color:${info.color}">
        <header><h3>${info.label}</h3><span>50 flowers</span></header>
        <div class="mean-flower-visual">
          <button class="mean-flower-button" type="button" data-mean-species="${species}" aria-pressed="false" aria-label="Inspect ${info.label} average flower measurements">
            <span class="flower-shape mean-flower" style="${flowerStyle}" role="img" aria-label="${info.label} flower scaled from all four averages using one common scale">
              ${flowerLeavesMarkup()}
            </span>
          </button>
        </div>
        <div class="mean-values">
          ${FEATURES.map((feature) => `<p><span>${feature.label}</span><strong>${values[feature.key].toFixed(2)} cm</strong></p>`).join("")}
        </div>
        <p>Petal: ${values.petalLength.toFixed(2)} × ${values.petalWidth.toFixed(2)} cm · Sepal: ${values.sepalLength.toFixed(2)} × ${values.sepalWidth.toFixed(2)} cm</p>
      </article>`;
  }).join("");

  document.querySelectorAll("[data-mean-species]").forEach((button) => {
    const showSpecies = () => showMeanFlower(button.dataset.meanSpecies);
    const restoreSpecies = () => state.selectedMeanSpecies ? showMeanFlower(state.selectedMeanSpecies) : resetMeanFlowerReadout();
    button.addEventListener("mouseenter", showSpecies);
    button.addEventListener("mouseleave", restoreSpecies);
    button.addEventListener("focus", showSpecies);
    button.addEventListener("blur", restoreSpecies);
    button.addEventListener("click", () => {
      state.selectedMeanSpecies = state.selectedMeanSpecies === button.dataset.meanSpecies ? null : button.dataset.meanSpecies;
      updateMeanFlowerButtons();
      state.selectedMeanSpecies ? showMeanFlower(state.selectedMeanSpecies) : resetMeanFlowerReadout();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        state.selectedMeanSpecies = null;
        updateMeanFlowerButtons();
        resetMeanFlowerReadout();
        button.blur();
      }
    });
  });
}

function showMeanFlower(species) {
  const info = SPECIES[species];
  const values = speciesMeans(species);
  meanFlowerReadout.style.setProperty("--readout-color", info.color);
  meanFlowerReadout.innerHTML = `<strong>${info.label} averages</strong><span>Sepal ${values.sepalLength.toFixed(2)} × ${values.sepalWidth.toFixed(2)} cm · Petal ${values.petalLength.toFixed(2)} × ${values.petalWidth.toFixed(2)} cm</span>`;
}

function resetMeanFlowerReadout() {
  meanFlowerReadout.style.removeProperty("--readout-color");
  meanFlowerReadout.innerHTML = `<strong>Compare the colored flowers</strong><span>Hover, focus, or tap one to inspect its four computed averages.</span>`;
}

function updateMeanFlowerButtons() {
  document.querySelectorAll("[data-mean-species]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.meanSpecies === state.selectedMeanSpecies));
  });
}

function renderComputations() {
  const duplicateKeys = new Set();
  let duplicates = 0;
  irisData.forEach((flower) => {
    const key = [flower.sepalLength, flower.sepalWidth, flower.petalLength, flower.petalWidth, flower.species].join("|");
    if (duplicateKeys.has(key)) duplicates += 1;
    duplicateKeys.add(key);
  });
  const missing = irisData.reduce((total, flower) => total + FEATURES.filter(({ key }) => !Number.isFinite(flower[key])).length + (flower.species ? 0 : 1), 0);
  const checks = [
    [irisData.length, "rows / flowers"],
    [5, "columns"],
    [missing, "missing values"],
    [duplicates, "duplicate row"],
    ["4 + 1", "numeric features + label"],
  ];
  qualityChecks.innerHTML = checks.map(([value, label]) => `<div class="quality-check"><strong>${value}</strong><span>${label}</span></div>`).join("");

  const counts = Object.fromEntries(Object.keys(SPECIES).map((species) => [species, irisData.filter((flower) => flower.species === species).length]));
  const maximumCount = Math.max(...Object.values(counts));
  balanceBars.innerHTML = Object.keys(SPECIES).map((species) => `
    <div class="balance-row" style="--species-color:${SPECIES[species].color};--bar-width:${(counts[species] / maximumCount) * 100}%">
      <span>${SPECIES[species].label}</span><span class="balance-track"><i></i></span><strong>${counts[species]}</strong>
    </div>`).join("");

  const columns = ["Feature", "Count", "Mean", "SD", "Min", "25%", "Median", "75%", "Max"];
  summaryTable.innerHTML = `
    <caption>Descriptive statistics in centimeters</caption>
    <thead><tr>${columns.map((column) => `<th scope="col">${column}</th>`).join("")}</tr></thead>
    <tbody>${FEATURES.map((feature) => {
      const values = irisData.map((flower) => flower[feature.key]);
      const statistics = [
        values.length,
        mean(irisData, feature.key),
        sampleStandardDeviation(values),
        Math.min(...values),
        quantile(values, 0.25),
        quantile(values, 0.5),
        quantile(values, 0.75),
        Math.max(...values),
      ];
      return `<tr><th scope="row">${feature.label}</th>${statistics.map((value, index) => `<td>${index === 0 ? value : value.toFixed(2)}</td>`).join("")}</tr>`;
    }).join("")}</tbody>`;
}

function distributionSummary(data, feature) {
  const values = data.map((flower) => flower[feature]);
  return {
    minimum: Math.min(...values),
    q1: quantile(values, 0.25),
    median: quantile(values, 0.5),
    q3: quantile(values, 0.75),
    maximum: Math.max(...values),
  };
}

function renderDistributions() {
  distributionPlots.innerHTML = FEATURES.map((feature) => {
    const allValues = irisData.map((flower) => flower[feature.key]);
    const domainMinimum = Math.min(...allValues);
    const domainMaximum = Math.max(...allValues);
    const position = (value) => `${((value - domainMinimum) / (domainMaximum - domainMinimum)) * 100}%`;
    const rows = speciesNames.map((species) => {
      const values = distributionSummary(irisData.filter((flower) => flower.species === species), feature.key);
      const style = [
        `--species-color:${SPECIES[species].color}`,
        `--minimum-position:${position(values.minimum)}`,
        `--q1-position:${position(values.q1)}`,
        `--median-position:${position(values.median)}`,
        `--q3-position:${position(values.q3)}`,
        `--maximum-position:${position(values.maximum)}`,
      ].join(";");
      const label = `${SPECIES[species].label} ${feature.label}: minimum ${values.minimum.toFixed(2)}, first quartile ${values.q1.toFixed(2)}, median ${values.median.toFixed(2)}, third quartile ${values.q3.toFixed(2)}, maximum ${values.maximum.toFixed(2)} centimeters`;
      return `
        <button class="distribution-row" type="button" data-distribution-feature="${feature.key}" data-distribution-species="${species}" style="${style}" aria-label="${label}" aria-pressed="false">
          <span class="distribution-name">${SPECIES[species].label}</span>
          <span class="distribution-track" aria-hidden="true"><i class="distribution-range"></i><i class="distribution-iqr"></i><i class="distribution-median"></i></span>
        </button>`;
    }).join("");
    return `
      <section class="distribution-feature" aria-labelledby="distribution-${feature.key}">
        <header><h4 id="distribution-${feature.key}">${feature.label}</h4><span>${domainMinimum.toFixed(1)}–${domainMaximum.toFixed(1)} cm</span></header>
        <div class="distribution-axis" aria-hidden="true"><span>${domainMinimum.toFixed(1)}</span><span>${domainMaximum.toFixed(1)} cm</span></div>
        <div class="distribution-species-list">${rows}</div>
      </section>`;
  }).join("");

  document.querySelectorAll("[data-distribution-feature]").forEach((button) => {
    const selection = `${button.dataset.distributionFeature}|${button.dataset.distributionSpecies}`;
    const showSelection = () => showDistribution(button.dataset.distributionFeature, button.dataset.distributionSpecies);
    const restoreSelection = () => state.selectedDistribution ? showDistribution(...state.selectedDistribution.split("|")) : resetDistributionReadout();
    button.addEventListener("mouseenter", showSelection);
    button.addEventListener("mouseleave", restoreSelection);
    button.addEventListener("focus", showSelection);
    button.addEventListener("blur", restoreSelection);
    button.addEventListener("click", () => {
      state.selectedDistribution = state.selectedDistribution === selection ? null : selection;
      updateDistributionButtons();
      state.selectedDistribution ? showDistribution(...state.selectedDistribution.split("|")) : resetDistributionReadout();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        state.selectedDistribution = null;
        updateDistributionButtons();
        resetDistributionReadout();
        button.blur();
      }
    });
  });
}

function showDistribution(feature, species) {
  const info = SPECIES[species];
  const values = distributionSummary(irisData.filter((flower) => flower.species === species), feature);
  distributionReadout.style.setProperty("--readout-color", info.color);
  distributionReadout.innerHTML = `<strong>${info.label} · ${featureLabel(feature)}</strong><span>min ${values.minimum.toFixed(2)} · Q1 ${values.q1.toFixed(2)} · median ${values.median.toFixed(2)} · Q3 ${values.q3.toFixed(2)} · max ${values.maximum.toFixed(2)} cm</span>`;
}

function resetDistributionReadout() {
  distributionReadout.style.removeProperty("--readout-color");
  distributionReadout.innerHTML = `<strong>Why this matters</strong><span>Setosa petals form a separate group, while Versicolor and Virginica overlap.</span>`;
}

function updateDistributionButtons() {
  document.querySelectorAll("[data-distribution-feature]").forEach((button) => {
    const selection = `${button.dataset.distributionFeature}|${button.dataset.distributionSpecies}`;
    button.setAttribute("aria-pressed", String(selection === state.selectedDistribution));
  });
}

function renderRuleResults() {
  const species = Object.keys(SPECIES);
  const matrix = Object.fromEntries(species.map((actual) => [actual, Object.fromEntries(species.map((predicted) => [predicted, 0]))]));
  let correct = 0;
  irisData.forEach((flower) => {
    const prediction = predictionFor(flower);
    matrix[flower.species][prediction] += 1;
    if (prediction === flower.species) correct += 1;
  });
  const errors = irisData.length - correct;
  const accuracy = (correct / irisData.length) * 100;
  ruleScore.innerHTML = `
    <p><strong>${accuracy.toFixed(0)}%</strong><span>accuracy</span></p>
    <p><strong>${correct}</strong><span>correct</span></p>
    <p><strong>${errors}</strong><span>mistakes</span></p>`;
  confusionTable.innerHTML = `
    <caption>Actual species compared with the two-rule prediction</caption>
    <thead><tr><th scope="col">Actual ↓ / Predicted →</th>${species.map((item) => `<th scope="col">${SPECIES[item].label}</th>`).join("")}</tr></thead>
    <tbody>${species.map((actual) => `<tr><th scope="row">${SPECIES[actual].label}</th>${species.map((predicted) => `<td>${matrix[actual][predicted]}</td>`).join("")}</tr>`).join("")}</tbody>`;
}

function updateRuleButton() {
  ruleButton.textContent = state.showRules ? "Hide rule lines" : "Show rule lines on the scatter plot";
  ruleButton.setAttribute("aria-pressed", String(state.showRules));
}

function renderScatter() {
  svg.replaceChildren();
  const title = makeSvgElement("title", { id: "scatter-title" });
  title.textContent = "Interactive Iris measurement scatter plot";
  const description = makeSvgElement("desc", { id: "scatter-description" });
  description.textContent = `${visibleFlowers().length} flowers plotted by ${featureLabel(state.xFeature)} and ${featureLabel(state.yFeature)}.`;
  svg.append(title, description);

  const xDomain = domains[state.xFeature];
  const yDomain = domains[state.yFeature];
  const xPosition = (value) => scale(value, xDomain, chart.left, plotWidth);
  const yPosition = (value) => chart.top + plotHeight - scale(value, yDomain, 0, plotHeight);

  ticks(xDomain).forEach((value) => {
    const x = xPosition(value);
    svg.append(makeSvgElement("line", { class: "grid-line", x1: x, x2: x, y1: chart.top, y2: chart.top + plotHeight }));
    const label = makeSvgElement("text", { class: "axis-tick", x, y: chart.top + plotHeight + 24, "text-anchor": "middle" });
    label.textContent = value.toFixed(1);
    svg.append(label);
  });

  ticks(yDomain).forEach((value) => {
    const y = yPosition(value);
    svg.append(makeSvgElement("line", { class: "grid-line", x1: chart.left, x2: chart.left + plotWidth, y1: y, y2: y }));
    const label = makeSvgElement("text", { class: "axis-tick", x: chart.left - 14, y: y + 4, "text-anchor": "end" });
    label.textContent = value.toFixed(1);
    svg.append(label);
  });

  svg.append(
    makeSvgElement("line", { class: "axis-line", x1: chart.left, x2: chart.left + plotWidth, y1: chart.top + plotHeight, y2: chart.top + plotHeight }),
    makeSvgElement("line", { class: "axis-line", x1: chart.left, x2: chart.left, y1: chart.top, y2: chart.top + plotHeight }),
  );

  const xLabel = makeSvgElement("text", { class: "axis-label", x: chart.left + plotWidth / 2, y: chart.height - 12, "text-anchor": "middle" });
  xLabel.textContent = `${featureLabel(state.xFeature)} (cm)`;
  const yLabel = makeSvgElement("text", { class: "axis-label", x: 18, y: chart.top + plotHeight / 2, "text-anchor": "middle", transform: `rotate(-90 18 ${chart.top + plotHeight / 2})` });
  yLabel.textContent = `${featureLabel(state.yFeature)} (cm)`;
  svg.append(xLabel, yLabel);

  if (state.showRules && state.xFeature === "petalLength" && state.yFeature === "petalWidth") {
    const ruleX = xPosition(2.5);
    const ruleY = yPosition(1.75);
    svg.append(
      makeSvgElement("line", { class: "rule-line", x1: ruleX, x2: ruleX, y1: chart.top, y2: chart.top + plotHeight }),
      makeSvgElement("line", { class: "rule-line", x1: ruleX, x2: chart.left + plotWidth, y1: ruleY, y2: ruleY }),
    );
    const verticalLabel = makeSvgElement("text", { class: "rule-label", x: ruleX - 10, y: chart.top + plotHeight / 2, "text-anchor": "middle", transform: `rotate(-90 ${ruleX - 10} ${chart.top + plotHeight / 2})` });
    verticalLabel.textContent = "petal length = 2.5";
    const horizontalLabel = makeSvgElement("text", { class: "rule-label", x: ruleX + 12, y: ruleY - 9 });
    horizontalLabel.textContent = "petal width = 1.75";
    svg.append(verticalLabel, horizontalLabel);

    [
      ["Setosa", 1.5, 0.82, SPECIES.setosa.color],
      ["Versicolor", 4.0, 0.58, SPECIES.versicolor.color],
      ["Virginica", 6.25, 2.58, SPECIES.virginica.color],
    ].forEach(([label, xValue, yValue, color]) => {
      const region = makeSvgElement("text", { class: "rule-region", x: xPosition(xValue), y: yPosition(yValue), fill: color, "text-anchor": "middle" });
      region.textContent = label;
      svg.append(region);
    });
  }

  visibleFlowers().forEach((flower) => {
    const x = xPosition(flower[state.xFeature]);
    const y = yPosition(flower[state.yFeature]);
    const group = makeSvgElement("g", {
      class: "scatter-point",
      transform: `translate(${x} ${y})`,
      role: "button",
      tabindex: "0",
      "aria-label": `Iris ${flower.id}, ${SPECIES[flower.species].label}: ${featureLabel(state.xFeature)} ${flower[state.xFeature].toFixed(1)} centimeters, ${featureLabel(state.yFeature)} ${flower[state.yFeature].toFixed(1)} centimeters`,
    });
    group.dataset.id = flower.id;
    renderPointShape(group, flower);

    const enter = () => {
      state.hoveredId = flower.id;
      updatePointClasses();
      renderDetails();
      showTooltip(flower, x, y);
    };
    const leave = () => {
      state.hoveredId = null;
      updatePointClasses();
      renderDetails();
      hideTooltip();
    };

    group.addEventListener("mouseenter", enter);
    group.addEventListener("mouseleave", leave);
    group.addEventListener("focus", enter);
    group.addEventListener("blur", leave);
    group.addEventListener("click", () => {
      state.selectedId = flower.id;
      renderDetails();
      updatePointClasses();
    });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.selectedId = flower.id;
        renderDetails();
        updatePointClasses();
      }
      if (event.key === "Escape") {
        state.selectedId = null;
        state.hoveredId = null;
        hideTooltip();
        renderDetails();
        updatePointClasses();
      }
    });
    svg.append(group);
  });

  updatePointClasses();
  chartContext.textContent = contextText();
  chartPair.textContent = `${featureLabel(state.xFeature)} × ${featureLabel(state.yFeature)}`;
}

function renderCorrelationDetails(pair) {
  const value = pearson(visibleFlowers(), pair.first, pair.second);
  const isPetalPair = new Set([pair.first, pair.second]).has("petalLength") && new Set([pair.first, pair.second]).has("petalWidth");
  const extra = isPetalPair && state.filter === "all"
    ? `<p><strong>Why it stands out:</strong> the three species clusters make this full-dataset relationship especially strong.</p>`
    : "";
  correlationDetails.innerHTML = `
    <p class="mini-label">Selected relationship</p>
    <h3>${featureLabel(pair.first)} + ${featureLabel(pair.second)}</h3>
    <div class="correlation-number"><strong>${value.toFixed(3)}</strong><span>Pearson r</span></div>
    <p>${relationshipText(value, pair.first, pair.second)}</p>
    ${extra}
    <small>Correlation describes a pattern; it does not prove that one measurement causes another.</small>`;
}

function selectPair(first, second) {
  state.selectedPair = { first, second };
  if (first !== second) {
    state.xFeature = first;
    state.yFeature = second;
    if (first !== "petalLength" || second !== "petalWidth") state.showRules = false;
    xSelect.value = first;
    ySelect.value = second;
    renderScatter();
  }
  updateRuleButton();
  renderHeatmap();
  renderCorrelationDetails(state.selectedPair);
}

function renderHeatmap() {
  heatmap.replaceChildren();
  heatmap.append(document.createElement("span"));
  FEATURES.forEach((feature) => {
    const header = document.createElement("span");
    header.className = "heatmap-header";
    header.textContent = feature.short;
    heatmap.append(header);
  });

  FEATURES.forEach((row) => {
    const rowHeader = document.createElement("span");
    rowHeader.className = "heatmap-header";
    rowHeader.textContent = row.short;
    heatmap.append(rowHeader);

    FEATURES.forEach((column) => {
      const value = pearson(visibleFlowers(), column.key, row.key);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "heatmap-cell";
      button.style.backgroundColor = heatmapColor(value);
      button.textContent = value.toFixed(2);
      button.setAttribute("aria-label", `${column.label} and ${row.label}: correlation ${value.toFixed(3)}`);
      button.classList.toggle("active", state.selectedPair.first === column.key && state.selectedPair.second === row.key);
      const pair = { first: column.key, second: row.key };
      button.addEventListener("mouseenter", () => renderCorrelationDetails(pair));
      button.addEventListener("mouseleave", () => renderCorrelationDetails(state.selectedPair));
      button.addEventListener("focus", () => renderCorrelationDetails(pair));
      button.addEventListener("blur", () => renderCorrelationDetails(state.selectedPair));
      button.addEventListener("click", () => selectPair(column.key, row.key));
      heatmap.append(button);
    });
  });

  heatmapContext.textContent = contextText();
}

function renderAll() {
  const visible = visibleFlowers();
  if (!visible.some((flower) => flower.id === state.selectedId)) state.selectedId = visible[0]?.id ?? null;
  state.hoveredId = null;
  hideTooltip();
  renderScatter();
  renderDetails();
  renderHeatmap();
  renderCorrelationDetails(state.selectedPair);
}

xSelect.addEventListener("change", () => {
  state.xFeature = xSelect.value;
  if (state.xFeature !== "petalLength" || state.yFeature !== "petalWidth") state.showRules = false;
  state.selectedPair = { first: state.xFeature, second: state.yFeature };
  updateRuleButton();
  renderScatter();
  renderHeatmap();
  renderCorrelationDetails(state.selectedPair);
});

ySelect.addEventListener("change", () => {
  state.yFeature = ySelect.value;
  if (state.xFeature !== "petalLength" || state.yFeature !== "petalWidth") state.showRules = false;
  state.selectedPair = { first: state.xFeature, second: state.yFeature };
  updateRuleButton();
  renderScatter();
  renderHeatmap();
  renderCorrelationDetails(state.selectedPair);
});

function setSpeciesFilter(filter) {
  state.filter = filter;
  document.querySelectorAll(".filter-button").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    setSpeciesFilter(button.dataset.filter);
    renderAll();
  });
});

document.querySelectorAll("[data-flower-part]").forEach((part) => {
  const showPart = () => setAnatomyPart(part.dataset.flowerPart);
  const restorePart = () => state.selectedAnatomyPart ? setAnatomyPart(state.selectedAnatomyPart) : resetAnatomyPart();
  part.addEventListener("mouseenter", showPart);
  part.addEventListener("mouseleave", restorePart);
  part.addEventListener("focus", showPart);
  part.addEventListener("blur", restorePart);
  part.addEventListener("click", () => {
    state.selectedAnatomyPart = state.selectedAnatomyPart === part.dataset.flowerPart ? null : part.dataset.flowerPart;
    updateAnatomyButtons();
    state.selectedAnatomyPart ? setAnatomyPart(state.selectedAnatomyPart) : resetAnatomyPart();
  });
  part.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      state.selectedAnatomyPart = null;
      updateAnatomyButtons();
      resetAnatomyPart();
      part.blur();
    }
  });
});

ruleButton.addEventListener("click", () => {
  state.showRules = !state.showRules;
  if (state.showRules) {
    setSpeciesFilter("all");
    state.xFeature = "petalLength";
    state.yFeature = "petalWidth";
    state.selectedPair = { first: "petalLength", second: "petalWidth" };
    xSelect.value = state.xFeature;
    ySelect.value = state.yFeature;
  }
  updateRuleButton();
  renderScatter();
  renderHeatmap();
  renderCorrelationDetails(state.selectedPair);
  if (state.showRules) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("explore").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }
});

renderMeanFlowers();
renderComputations();
renderDistributions();
renderRuleResults();
updateRuleButton();
renderAll();
