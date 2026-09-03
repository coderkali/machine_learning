"use strict";

(() => {
  const labConfigs = {
    "linear-regression": {
      type: "linear",
      title: "Fit the line yourself",
      prompt: "Move slope and intercept. Residuals and R² react immediately.",
      source: "05_Linear_Regression.ipynb · best-fit line and cost plots",
    },
    "r-squared": {
      type: "linear",
      title: "See what changes R²",
      prompt: "Add noise or move the model away from the data-generating line.",
      source: "05_Linear_Regression.ipynb + 06_multiple_linear_regression.ipynb",
    },
    "multiple-linear-regression": {
      type: "plane",
      title: "Build a two-feature prediction surface",
      prompt: "Each coefficient changes the direction and steepness of the prediction plane.",
      source: "06_multiple_linear_regression.ipynb · coefficient and partial-effect experiments",
    },
    "train-test-leakage": {
      type: "split",
      title: "Partition the dataset",
      prompt: "Change test size and shuffling to see exactly which rows stay unseen.",
      source: "01_train_test_split_data.ipynb · test_size, shuffle, and random_state",
    },
    "ridge-regression": {
      type: "regularization",
      method: "ridge",
      title: "Shrink coefficients with Ridge",
      prompt: "Increase α. Every coefficient contracts smoothly toward zero.",
      source: "07_Ridge.ipynb · alpha sweep and S/(S+alpha) shrinkage",
    },
    "lasso-regression": {
      type: "regularization",
      method: "lasso",
      title: "Let Lasso remove features",
      prompt: "Increase α. Small coefficients become exactly zero first.",
      source: "08_Lasso.ipynb · repeated alpha experiments",
    },
    "elastic-net": {
      type: "regularization",
      method: "elastic",
      title: "Mix L1 and L2 regularization",
      prompt: "Use α for strength and l1_ratio to move between Ridge-like and Lasso-like behavior.",
      source: "09_ElasticNet.ipynb · alpha experiments and L1/L2 mixture",
    },
    "polynomial-regression": {
      type: "polynomial",
      title: "Increase polynomial degree",
      prompt: "Watch a straight line become flexible—and eventually memorize the eight training points.",
      source: "10_Polynomial Regression.ipynb · degree 2 through 9 plots",
    },
    "cross-validation": {
      type: "crossValidation",
      title: "Move the validation fold",
      prompt: "Each row becomes validation once while all remaining rows train the model.",
      source: "11_Corss_validation.ipynb · KFold and StratifiedKFold",
    },
    "kmeans-clustering": {
      type: "kmeans",
      title: "Run K-Means step by step",
      prompt: "Choose K and an iteration. Points reassign and centroids move toward cluster means.",
      source: "12_clustering.ipynb · make_blobs, KMeans, centroids, and moon failure",
    },
    "hierarchical-clustering": {
      type: "dendrogram",
      title: "Cut the dendrogram",
      prompt: "Change linkage and cut height. The same nine points produce different group stories.",
      source: "13_Hirerachical_Clustering.ipynb · linkage comparisons and cut-height plots",
    },
    "classification-metrics": {
      type: "classificationMetrics",
      title: "Rebuild the confusion matrix",
      prompt: "Change missed malignant cases and false alarms. Every metric updates from the four counts.",
      source: "15_Model_Evaluation.ipynb · 114-row breast-cancer test set",
    },
    "roc-auc": {
      type: "roc",
      title: "Move the decision threshold",
      prompt: "Lower the cutoff to catch more positives, then watch the ROC point move with the false-positive cost.",
      source: "14_roc.ipynb + 14_ROC_Curve.png · probability threshold experiment",
    },
    "decision-tree-classification": {
      type: "treeClassification",
      title: "Grow the classification tree",
      prompt: "Compare candidate first questions, then send a new student through the learned decision path.",
      source: "16_Descison_Tree_Classfication.ipynb + dt.tree",
    },
    "decision-tree-regression": {
      type: "treeRegression",
      title: "Grow the regression tree",
      prompt: "Compare variance reduction and follow a student to the leaf-average mark.",
      source: "17_Descison_Tree_Regression.ipynb + dt1.tree",
    },
    "naive-bayes": {
      type: "naiveBayes",
      title: "Move evidence through two bell curves",
      prompt: "Change the student's mark or the class prior. Gaussian likelihoods and the winning class react immediately.",
      source: "18_Naive_Bayers.ipynb · 14-student GaussianNB experiment",
    },
    "hyperparameter-tuning": {
      type: "hyperparameterSearch",
      title: "Explore the search budget",
      prompt: "Compare all 24 grid combinations with a smaller random sample and see how cross-validation multiplies the work.",
      source: "19_Hyperparameter_Tuning.ipynb · saved 24-combination CV results",
    },
  };

  let cleanupCurrent = null;

  function has(id) {
    return Boolean(labConfigs[id]);
  }

  function rangeControl(name, label, min, max, step, value, suffix = "") {
    return `<label class="lab-control"><span>${label}<output data-output="${name}">${value}${suffix}</output></span><input type="range" data-control="${name}" min="${min}" max="${max}" step="${step}" value="${value}" data-suffix="${suffix}"></label>`;
  }

  function selectControl(name, label, options) {
    return `<label class="lab-control"><span>${label}</span><select data-control="${name}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}</select></label>`;
  }

  function controlsFor(config) {
    switch (config.type) {
      case "linear":
        return rangeControl("slope", "Model slope", -30, 30, 1, 18)
          + rangeControl("intercept", "Model intercept", -40, 40, 1, 5)
          + rangeControl("noise", "Data noise", 0, 35, 1, 10);
      case "plane":
        return rangeControl("b1", "Feature 1 coefficient", -4, 4, .1, 2.2)
          + rangeControl("b2", "Feature 2 coefficient", -4, 4, .1, -1.4)
          + rangeControl("intercept", "Intercept", -3, 3, .1, .5);
      case "split":
        return rangeControl("testSize", "Test size", 10, 50, 5, 20, "%")
          + rangeControl("seed", "Random state", 1, 10, 1, 4)
          + `<label class="lab-check"><input type="checkbox" data-control="shuffle" checked><span>Shuffle rows before splitting</span></label>`;
      case "regularization":
        return rangeControl("alpha", "Regularization α", 0, 10, .1, config.method === "ridge" ? 2 : 1)
          + (config.method === "elastic" ? rangeControl("l1Ratio", "L1 ratio", 0, 1, .05, .5) : "");
      case "polynomial":
        return rangeControl("degree", "Polynomial degree", 1, 7, 1, 2);
      case "crossValidation":
        return rangeControl("folds", "Number of folds", 2, 8, 1, 5)
          + rangeControl("activeFold", "Validation fold", 1, 5, 1, 1);
      case "kmeans":
        return rangeControl("clusters", "Number of clusters K", 2, 6, 1, 4)
          + rangeControl("iteration", "K-Means iteration", 0, 8, 1, 1);
      case "dendrogram":
        return selectControl("linkage", "Linkage", [["ward", "Ward"], ["single", "Single"], ["complete", "Complete"], ["average", "Average"]])
          + rangeControl("cutHeight", "Cut height", 5, 130, 1, 80);
      case "classificationMetrics":
        return rangeControl("falseNegatives", "Missed malignant (FN)", 0, 47, 1, 4)
          + rangeControl("falsePositives", "Benign false alarms (FP)", 0, 67, 1, 4);
      case "roc":
        return rangeControl("threshold", "Positive threshold", .01, .99, .01, .5);
      case "treeClassification":
        return selectControl("firstSplit", "Compare first question", [["videos", "Watched videos?"], ["guide", "Used guide?"]])
          + selectControl("studentVideos", "New student · videos", [["1", "Yes"], ["0", "No"]])
          + selectControl("studentGuide", "New student · guide", [["1", "Yes"], ["0", "No"]]);
      case "treeRegression":
        return selectControl("firstSplit", "Compare first question", [["guide", "Used guide?"], ["videos", "Watched videos?"]])
          + selectControl("studentVideos", "New student · videos", [["1", "Yes"], ["0", "No"]])
          + selectControl("studentGuide", "New student · guide", [["1", "Yes"], ["0", "No"]]);
      case "naiveBayes":
        return rangeControl("mark", "Student mark", 50, 115, 1, 74)
          + rangeControl("watchedPrior", "Hypothetical watched prior", 10, 90, 1, 64, "%");
      case "hyperparameterSearch":
        return selectControl("searchMethod", "Search strategy", [["grid", "Grid · try every combination"], ["random", "Random · sample combinations"]])
          + rangeControl("randomSamples", "Random combinations", 1, 24, 1, 5)
          + rangeControl("cvFolds", "Cross-validation folds", 2, 10, 1, 5);
      default:
        return "";
    }
  }

  function markup(concept) {
    const config = labConfigs[concept.id];
    return `<section id="interactive-lab" class="interactive-lab" data-lab-type="${config.type}" aria-labelledby="lab-title">
      <div class="lab-heading">
        <div><span class="section-kicker">Interactive concept lab</span><h3 id="lab-title">${config.title}</h3><p>${config.prompt}</p></div>
        <small>From ${config.source}</small>
      </div>
      <div class="lab-controls">${controlsFor(config)}</div>
      <div class="lab-plot">
        <canvas id="lab-canvas" role="img" aria-label="${config.title}. Change the controls to update the graph."></canvas>
      </div>
      <div id="lab-readout" class="lab-readout" aria-live="polite"></div>
    </section>`;
  }

  function value(root, name) {
    const input = root.querySelector(`[data-control="${name}"]`);
    if (!input) return 0;
    return input.type === "checkbox" ? input.checked : (input.tagName === "SELECT" ? input.value : Number(input.value));
  }

  function updateOutputs(root) {
    root.querySelectorAll("input[type=range]").forEach((input) => {
      const output = root.querySelector(`[data-output="${input.dataset.control}"]`);
      if (output) output.value = `${input.value}${input.dataset.suffix || ""}`;
    });
  }

  function cssColors() {
    const style = getComputedStyle(document.documentElement);
    const read = (name) => style.getPropertyValue(name).trim();
    return {
      ink: read("--ink"),
      muted: read("--muted"),
      paper: read("--paper-strong"),
      line: read("--line"),
      forest: read("--forest"),
      amber: read("--amber"),
      series: [1, 2, 3, 4, 5, 6].map((index) => read(`--plot-${index}`)),
    };
  }

  function prepareCanvas(canvas, height = 340) {
    const width = Math.max(300, canvas.getBoundingClientRect().width || 600);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    return { ctx, width, height, colors: cssColors() };
  }

  function frame(canvas, xDomain, yDomain, labels = ["Input x", "Output y"]) {
    const kit = prepareCanvas(canvas);
    const { ctx, width, height, colors } = kit;
    const pad = { left: 50, right: 18, top: 18, bottom: 42 };
    const x = (number) => pad.left + ((number - xDomain[0]) / (xDomain[1] - xDomain[0])) * (width - pad.left - pad.right);
    const y = (number) => height - pad.bottom - ((number - yDomain[0]) / (yDomain[1] - yDomain[0])) * (height - pad.top - pad.bottom);

    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.font = "11px system-ui";
    ctx.fillStyle = colors.muted;
    for (let index = 0; index <= 4; index += 1) {
      const xv = xDomain[0] + ((xDomain[1] - xDomain[0]) * index) / 4;
      const yv = yDomain[0] + ((yDomain[1] - yDomain[0]) * index) / 4;
      ctx.beginPath();
      ctx.moveTo(x(xv), pad.top);
      ctx.lineTo(x(xv), height - pad.bottom);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad.left, y(yv));
      ctx.lineTo(width - pad.right, y(yv));
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(formatNumber(xv), x(xv), height - 22);
      ctx.textAlign = "right";
      ctx.fillText(formatNumber(yv), pad.left - 7, y(yv) + 4);
    }
    ctx.fillStyle = colors.ink;
    ctx.textAlign = "center";
    ctx.fillText(labels[0], (pad.left + width - pad.right) / 2, height - 5);
    ctx.save();
    ctx.translate(12, (pad.top + height - pad.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(labels[1], 0, 0);
    ctx.restore();
    return { ...kit, pad, x, y };
  }

  function formatNumber(number) {
    const absolute = Math.abs(number);
    if (absolute >= 100) return number.toFixed(0);
    if (absolute >= 10) return number.toFixed(1);
    return number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  function deterministicNoise(index) {
    const raw = Math.sin((index + 1) * 12.9898) * 43758.5453;
    return ((raw - Math.floor(raw)) * 2) - 1;
  }

  function metric(readout, items, insight) {
    readout.innerHTML = `${items.map(([label, number]) => `<span><small>${label}</small><strong>${number}</strong></span>`).join("")}<p>${insight}</p>`;
  }

  function drawLinear(root, canvas, readout) {
    const slope = value(root, "slope");
    const intercept = value(root, "intercept");
    const noise = value(root, "noise");
    const points = Array.from({ length: 34 }, (_, index) => {
      const x = -4 + (8 * index) / 33;
      return { x, y: 18 * x + 5 + deterministicNoise(index) * noise };
    });
    const model = (x) => slope * x + intercept;
    const allY = points.flatMap((point) => [point.y, model(point.x)]);
    const low = Math.min(...allY) - 12;
    const high = Math.max(...allY) + 12;
    const plot = frame(canvas, [-4.2, 4.2], [low, high]);
    const { ctx, x, y, colors } = plot;

    ctx.strokeStyle = colors.amber;
    ctx.globalAlpha = .34;
    points.forEach((point) => {
      ctx.beginPath();
      ctx.moveTo(x(point.x), y(point.y));
      ctx.lineTo(x(point.x), y(model(point.x)));
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = colors.series[1];
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(x(point.x), y(point.y), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = colors.series[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x(-4.2), y(model(-4.2)));
    ctx.lineTo(x(4.2), y(model(4.2)));
    ctx.stroke();

    const mean = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    const sse = points.reduce((sum, point) => sum + (point.y - model(point.x)) ** 2, 0);
    const sst = points.reduce((sum, point) => sum + (point.y - mean) ** 2, 0);
    const r2 = 1 - sse / sst;
    const mse = sse / points.length;
    metric(readout, [["R²", r2.toFixed(3)], ["MSE", mse.toFixed(1)], ["Line", `ŷ = ${slope}x ${intercept >= 0 ? "+" : "−"} ${Math.abs(intercept)}`]], r2 > .9 ? "The line follows the signal closely." : r2 > .5 ? "The line explains part of the pattern, but residual gaps remain." : "The chosen line misses much of the structure.");
  }

  function drawPlane(root, canvas, readout) {
    const b1 = value(root, "b1");
    const b2 = value(root, "b2");
    const intercept = value(root, "intercept");
    const { ctx, width, height, colors } = prepareCanvas(canvas);
    const pad = 40;
    const grid = 18;
    const cellW = (width - pad * 2) / grid;
    const cellH = (height - pad * 2) / grid;
    const max = Math.max(1, Math.abs(intercept) + Math.abs(b1) * 2 + Math.abs(b2) * 2);

    for (let row = 0; row < grid; row += 1) {
      for (let column = 0; column < grid; column += 1) {
        const x1 = -2 + (4 * column) / (grid - 1);
        const x2 = 2 - (4 * row) / (grid - 1);
        const prediction = intercept + b1 * x1 + b2 * x2;
        const strength = Math.min(.86, .14 + Math.abs(prediction / max) * .7);
        ctx.globalAlpha = strength;
        ctx.fillStyle = prediction >= 0 ? colors.series[0] : colors.series[1];
        ctx.fillRect(pad + column * cellW, pad + row * cellH, cellW + .5, cellH + .5);
      }
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.ink;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
    ctx.fillStyle = colors.ink;
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Feature 1 →", width / 2, height - 10);
    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Feature 2 →", 0, 0);
    ctx.restore();
    ctx.fillText("warm = negative prediction   ·   green = positive prediction", width / 2, 22);

    const sampleX1 = 1.2;
    const sampleX2 = -.8;
    const c1 = b1 * sampleX1;
    const c2 = b2 * sampleX2;
    const prediction = intercept + c1 + c2;
    metric(readout, [["x₁ contribution", c1.toFixed(2)], ["x₂ contribution", c2.toFixed(2)], ["Prediction", prediction.toFixed(2)]], `For x₁=${sampleX1} and x₂=${sampleX2}, each coefficient adds its own partial effect.`);
  }

  function drawSplit(root, canvas, readout) {
    const testPercent = value(root, "testSize");
    const seed = value(root, "seed");
    const shuffle = Boolean(value(root, "shuffle"));
    const total = 40;
    const testCount = Math.round(total * testPercent / 100);
    const order = Array.from({ length: total }, (_, index) => index);
    if (shuffle) {
      order.sort((a, b) => deterministicNoise(a + seed * 13) - deterministicNoise(b + seed * 13));
    }
    const tests = new Set(shuffle ? order.slice(0, testCount) : order.slice(total - testCount));
    const { ctx, width, height, colors } = prepareCanvas(canvas, 280);
    const columns = 10;
    const gap = 7;
    const cellW = Math.min(52, (width - 70 - gap * (columns - 1)) / columns);
    const cellH = 38;
    const startX = (width - (columns * cellW + gap * (columns - 1))) / 2;
    const startY = 36;

    for (let index = 0; index < total; index += 1) {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const px = startX + column * (cellW + gap);
      const py = startY + row * (cellH + gap);
      ctx.globalAlpha = .18;
      ctx.fillStyle = tests.has(index) ? colors.amber : colors.forest;
      ctx.fillRect(px, py, cellW, cellH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = tests.has(index) ? colors.amber : colors.forest;
      ctx.strokeRect(px, py, cellW, cellH);
      ctx.fillStyle = colors.ink;
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(index + 1), px + cellW / 2, py + 23);
    }
    ctx.fillStyle = colors.forest;
    ctx.fillRect(startX, height - 32, 13, 13);
    ctx.fillStyle = colors.ink;
    ctx.textAlign = "left";
    ctx.fillText("training row", startX + 19, height - 21);
    ctx.fillStyle = colors.amber;
    ctx.fillRect(startX + 120, height - 32, 13, 13);
    ctx.fillStyle = colors.ink;
    ctx.fillText("unseen test row", startX + 139, height - 21);
    metric(readout, [["Training rows", total - testCount], ["Test rows", testCount], ["Shuffled", shuffle ? "Yes" : "No"]], shuffle ? "random_state changes which rows enter the test set while keeping the count fixed." : "Without shuffling, the last rows become the test set—important for ordered data.");
  }

  function regularizedCoefficients(method, alpha, ratio) {
    const original = [2.8, -2.1, 1.35, .72, .24];
    return original.map((coefficient) => {
      if (method === "ridge") return coefficient / (1 + alpha * .24);
      if (method === "lasso") return Math.sign(coefficient) * Math.max(0, Math.abs(coefficient) - alpha * .28);
      const ridgePart = coefficient / (1 + alpha * (1 - ratio) * .2);
      return Math.sign(ridgePart) * Math.max(0, Math.abs(ridgePart) - alpha * ratio * .24);
    });
  }

  function drawRegularization(root, canvas, readout, method) {
    const alpha = value(root, "alpha");
    const ratio = method === "elastic" ? value(root, "l1Ratio") : (method === "lasso" ? 1 : 0);
    const original = [2.8, -2.1, 1.35, .72, .24];
    const current = regularizedCoefficients(method, alpha, ratio);
    const plot = frame(canvas, [-.6, 4.6], [-3.3, 3.3], ["Feature coefficient", "Coefficient value"]);
    const { ctx, x, y, colors } = plot;
    const baseY = y(0);
    const barWidth = Math.max(17, Math.min(42, (x(1) - x(0)) * .36));

    original.forEach((coefficient, index) => {
      const center = x(index);
      ctx.globalAlpha = .22;
      ctx.fillStyle = colors.muted;
      ctx.fillRect(center - barWidth / 2, Math.min(baseY, y(coefficient)), barWidth, Math.abs(y(coefficient) - baseY));
      ctx.globalAlpha = 1;
      const valueNow = current[index];
      ctx.fillStyle = valueNow >= 0 ? colors.series[0] : colors.series[1];
      ctx.fillRect(center - barWidth / 2, Math.min(baseY, y(valueNow)), barWidth, Math.max(1.5, Math.abs(y(valueNow) - baseY)));
      ctx.fillStyle = colors.ink;
      ctx.textAlign = "center";
      ctx.font = "11px system-ui";
      ctx.fillText(`x${index + 1}`, center, y(-3.05));
    });

    const zeros = current.filter((coefficient) => Math.abs(coefficient) < .001).length;
    const norm = current.reduce((sum, coefficient) => sum + coefficient ** 2, 0) ** .5;
    metric(readout, [["α", alpha.toFixed(1)], ["Coefficient norm", norm.toFixed(2)], ["Exactly zero", zeros]], method === "ridge" ? "Ridge keeps every feature but reduces its influence smoothly." : method === "lasso" ? "Lasso creates sparsity: weak features disappear as α grows." : `l1_ratio=${ratio.toFixed(2)} balances smooth shrinkage and exact zeros.`);
  }

  function solveLinearSystem(matrix, vector) {
    const n = vector.length;
    const augmented = matrix.map((row, index) => [...row, vector[index]]);
    for (let column = 0; column < n; column += 1) {
      let pivot = column;
      for (let row = column + 1; row < n; row += 1) {
        if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
      }
      [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
      const divisor = augmented[column][column] || 1e-12;
      for (let item = column; item <= n; item += 1) augmented[column][item] /= divisor;
      for (let row = 0; row < n; row += 1) {
        if (row === column) continue;
        const factor = augmented[row][column];
        for (let item = column; item <= n; item += 1) augmented[row][item] -= factor * augmented[column][item];
      }
    }
    return augmented.map((row) => row[n]);
  }

  function polynomialFit(xs, ys, degree) {
    const scaled = xs.map((x) => (x - 5.5) / 3.5);
    const size = degree + 1;
    const matrix = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => scaled.reduce((sum, x) => sum + x ** (row + column), 0)));
    const vector = Array.from({ length: size }, (_, power) => scaled.reduce((sum, x, index) => sum + ys[index] * x ** power, 0));
    const coefficients = solveLinearSystem(matrix, vector);
    return (x) => {
      const scaledX = (x - 5.5) / 3.5;
      return coefficients.reduce((sum, coefficient, power) => sum + coefficient * scaledX ** power, 0);
    };
  }

  function drawPolynomial(root, canvas, readout) {
    const degree = value(root, "degree");
    const xs = [2, 3, 4, 5, 6, 7, 8, 9];
    const ys = [4, 6, 8, 6, 5, 4, 7, 8];
    const predict = polynomialFit(xs, ys, degree);
    const curve = Array.from({ length: 160 }, (_, index) => {
      const x = 2 + (7 * index) / 159;
      return { x, y: predict(x) };
    });
    const allY = [...ys, ...curve.map((point) => point.y)];
    const low = Math.min(...allY) - .8;
    const high = Math.max(...allY) + .8;
    const plot = frame(canvas, [1.7, 9.3], [low, high]);
    const { ctx, x, y, colors } = plot;
    ctx.strokeStyle = colors.series[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    curve.forEach((point, index) => {
      if (index === 0) ctx.moveTo(x(point.x), y(point.y));
      else ctx.lineTo(x(point.x), y(point.y));
    });
    ctx.stroke();
    ctx.fillStyle = colors.series[1];
    xs.forEach((number, index) => {
      ctx.beginPath();
      ctx.arc(x(number), y(ys[index]), 5, 0, Math.PI * 2);
      ctx.fill();
    });
    const mse = xs.reduce((sum, number, index) => sum + (ys[index] - predict(number)) ** 2, 0) / xs.length;
    metric(readout, [["Degree", degree], ["Generated features", degree + 1], ["Training MSE", mse.toFixed(3)]], degree <= 2 ? "The curve is intentionally simple and may underfit." : degree >= 6 ? "Training error is tiny, but the curve is becoming sensitive to individual points." : "The curve has enough flexibility to follow the broad pattern.");
  }

  function drawCrossValidation(root, canvas, readout) {
    const folds = value(root, "folds");
    const activeInput = root.querySelector('[data-control="activeFold"]');
    activeInput.max = folds;
    if (Number(activeInput.value) > folds) activeInput.value = folds;
    const activeOutput = root.querySelector('[data-output="activeFold"]');
    if (activeOutput) activeOutput.value = activeInput.value;
    const active = Number(activeInput.value);
    const total = 40;
    const start = Math.floor(((active - 1) * total) / folds);
    const end = Math.floor((active * total) / folds);
    const { ctx, width, height, colors } = prepareCanvas(canvas, 285);
    const left = 36;
    const right = 18;
    const cellW = (width - left - right) / total;
    const top = 74;
    const cellH = 72;
    for (let index = 0; index < total; index += 1) {
      const validation = index >= start && index < end;
      ctx.fillStyle = validation ? colors.amber : colors.forest;
      ctx.globalAlpha = .78;
      ctx.fillRect(left + index * cellW + .5, top, Math.max(2, cellW - 1), cellH);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = colors.ink;
    ctx.font = "11px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`Fold ${active} of ${folds}`, left, 32);
    ctx.fillStyle = colors.forest;
    ctx.fillRect(left, 181, 13, 13);
    ctx.fillStyle = colors.ink;
    ctx.fillText("training", left + 19, 192);
    ctx.fillStyle = colors.amber;
    ctx.fillRect(left + 100, 181, 13, 13);
    ctx.fillStyle = colors.ink;
    ctx.fillText("validation", left + 119, 192);
    ctx.fillStyle = colors.muted;
    ctx.fillText("Each new fold moves the amber holdout window.", left, 230);
    metric(readout, [["Folds", folds], ["Training rows", total - (end - start)], ["Validation rows", end - start]], "Across the full cycle, every row is evaluated once without being used to fit that fold.");
  }

  function blobPoints() {
    const centers = [[18, 22], [28, 76], [72, 68], [78, 20]];
    const points = [];
    centers.forEach((center, group) => {
      for (let index = 0; index < 20; index += 1) {
        points.push({
          x: center[0] + deterministicNoise(index + group * 43) * 11,
          y: center[1] + deterministicNoise(index + group * 47 + 7) * 11,
        });
      }
    });
    return points;
  }

  function kmeansState(points, k, iterations) {
    let centers = Array.from({ length: k }, (_, index) => {
      const point = points[Math.min(points.length - 1, Math.floor((index + .5) * points.length / k))];
      return { ...point };
    });
    let assignments = Array(points.length).fill(0);
    for (let step = 0; step <= iterations; step += 1) {
      assignments = points.map((point) => {
        let best = 0;
        let bestDistance = Infinity;
        centers.forEach((center, index) => {
          const distance = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        return best;
      });
      if (step === iterations) break;
      centers = centers.map((center, cluster) => {
        const members = points.filter((point, index) => assignments[index] === cluster);
        if (!members.length) return center;
        return {
          x: members.reduce((sum, point) => sum + point.x, 0) / members.length,
          y: members.reduce((sum, point) => sum + point.y, 0) / members.length,
        };
      });
    }
    return { centers, assignments };
  }

  function drawKMeans(root, canvas, readout) {
    const k = value(root, "clusters");
    const iteration = value(root, "iteration");
    const points = blobPoints();
    const result = kmeansState(points, k, iteration);
    const plot = frame(canvas, [0, 100], [0, 100], ["Feature 1", "Feature 2"]);
    const { ctx, x, y, colors } = plot;
    points.forEach((point, index) => {
      ctx.fillStyle = colors.series[result.assignments[index] % colors.series.length];
      ctx.globalAlpha = .78;
      ctx.beginPath();
      ctx.arc(x(point.x), y(point.y), 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    result.centers.forEach((center, index) => {
      ctx.strokeStyle = colors.series[index % colors.series.length];
      ctx.lineWidth = 4;
      const px = x(center.x);
      const py = y(center.y);
      ctx.beginPath();
      ctx.moveTo(px - 8, py - 8);
      ctx.lineTo(px + 8, py + 8);
      ctx.moveTo(px + 8, py - 8);
      ctx.lineTo(px - 8, py + 8);
      ctx.stroke();
    });
    const inertia = points.reduce((sum, point, index) => {
      const center = result.centers[result.assignments[index]];
      return sum + (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
    }, 0);
    metric(readout, [["K", k], ["Iteration", iteration], ["Inertia", inertia.toFixed(0)]], iteration === 0 ? "These are the initial assignments before centroids move." : iteration >= 4 ? "The centroids have nearly stabilized." : "Points assign to the nearest X, then each X moves to its group mean.");
  }

  const hierarchyPoints = [
    [5, 3], [10, 15], [15, 12], [24, 10], [30, 30],
    [85, 70], [71, 80], [60, 78], [70, 55],
  ];

  function euclidean(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }

  function clusterDistance(a, b, method) {
    const distances = a.members.flatMap((left) => b.members.map((right) => euclidean(hierarchyPoints[left], hierarchyPoints[right])));
    if (method === "single") return Math.min(...distances);
    if (method === "complete") return Math.max(...distances);
    if (method === "average") return distances.reduce((sum, number) => sum + number, 0) / distances.length;
    const centroid = (cluster) => [
      cluster.members.reduce((sum, index) => sum + hierarchyPoints[index][0], 0) / cluster.members.length,
      cluster.members.reduce((sum, index) => sum + hierarchyPoints[index][1], 0) / cluster.members.length,
    ];
    const ca = centroid(a);
    const cb = centroid(b);
    return Math.sqrt((2 * a.members.length * b.members.length) / (a.members.length + b.members.length)) * euclidean(ca, cb);
  }

  function buildHierarchy(method) {
    let clusters = hierarchyPoints.map((point, index) => ({ members: [index], leaf: index, height: 0 }));
    while (clusters.length > 1) {
      let best = [0, 1];
      let distance = Infinity;
      for (let left = 0; left < clusters.length; left += 1) {
        for (let right = left + 1; right < clusters.length; right += 1) {
          const candidate = clusterDistance(clusters[left], clusters[right], method);
          if (candidate < distance) {
            distance = candidate;
            best = [left, right];
          }
        }
      }
      const [a, b] = best;
      const merged = {
        members: [...clusters[a].members, ...clusters[b].members],
        left: clusters[a],
        right: clusters[b],
        height: Math.max(distance, clusters[a].height, clusters[b].height),
      };
      clusters = clusters.filter((cluster, index) => index !== a && index !== b);
      clusters.push(merged);
    }
    return clusters[0];
  }

  function leaves(node) {
    return node.leaf !== undefined ? [node.leaf] : [...leaves(node.left), ...leaves(node.right)];
  }

  function groupsAtCut(node, cut) {
    if (node.leaf !== undefined || node.height <= cut) return [leaves(node)];
    return [...groupsAtCut(node.left, cut), ...groupsAtCut(node.right, cut)];
  }

  function drawDendrogram(root, canvas, readout) {
    const method = value(root, "linkage");
    const cut = value(root, "cutHeight");
    const tree = buildHierarchy(method);
    const order = leaves(tree);
    const groups = groupsAtCut(tree, cut);
    const membership = new Map();
    groups.forEach((group, groupIndex) => group.forEach((leaf) => membership.set(leaf, groupIndex)));
    const { ctx, width, height, colors } = prepareCanvas(canvas, 360);
    const pad = { left: 48, right: 18, top: 20, bottom: 52 };
    const maxHeight = Math.max(tree.height * 1.08, cut * 1.08, 10);
    const leafX = new Map(order.map((leaf, index) => [leaf, pad.left + (index + .5) * (width - pad.left - pad.right) / order.length]));
    const y = (number) => height - pad.bottom - (number / maxHeight) * (height - pad.top - pad.bottom);

    ctx.strokeStyle = colors.line;
    ctx.fillStyle = colors.muted;
    ctx.font = "10px system-ui";
    ctx.textAlign = "right";
    for (let tick = 0; tick <= 4; tick += 1) {
      const number = maxHeight * tick / 4;
      ctx.beginPath();
      ctx.moveTo(pad.left, y(number));
      ctx.lineTo(width - pad.right, y(number));
      ctx.stroke();
      ctx.fillText(number.toFixed(0), pad.left - 6, y(number) + 3);
    }

    function drawNode(node) {
      if (node.leaf !== undefined) return { x: leafX.get(node.leaf), y: y(0) };
      const left = drawNode(node.left);
      const right = drawNode(node.right);
      const nodeY = y(node.height);
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(left.x, nodeY);
      ctx.lineTo(right.x, nodeY);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();
      return { x: (left.x + right.x) / 2, y: nodeY };
    }
    drawNode(tree);

    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, y(cut));
    ctx.lineTo(width - pad.right, y(cut));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.amber;
    ctx.textAlign = "left";
    ctx.fillText(`cut = ${cut}`, pad.left + 5, y(cut) - 7);

    order.forEach((leaf) => {
      ctx.fillStyle = colors.series[membership.get(leaf) % colors.series.length];
      ctx.beginPath();
      ctx.arc(leafX.get(leaf), height - pad.bottom + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.ink;
      ctx.textAlign = "center";
      ctx.fillText(`P${leaf + 1}`, leafX.get(leaf), height - 14);
    });
    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = colors.ink;
    ctx.textAlign = "center";
    ctx.fillText("Merge distance", 0, 0);
    ctx.restore();
    metric(readout, [["Linkage", method], ["Cut height", cut], ["Clusters", groups.length]], groups.length === 1 ? "The cut is above the final merge, so every point belongs to one cluster." : `The horizontal cut crosses ${groups.length} surviving branches, producing ${groups.length} clusters.`);
  }

  function drawClassificationMetrics(root, canvas, readout) {
    const actualPositive = 47;
    const actualNegative = 67;
    const fn = value(root, "falseNegatives");
    const fp = value(root, "falsePositives");
    const tp = actualPositive - fn;
    const tn = actualNegative - fp;
    const total = actualPositive + actualNegative;
    const accuracy = (tp + tn) / total;
    const precision = tp + fp ? tp / (tp + fp) : 0;
    const recall = tp / actualPositive;
    const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    const { ctx, width, height, colors } = prepareCanvas(canvas, 350);
    const gridSize = Math.min(238, width - 112);
    const cell = gridSize / 2;
    const left = Math.max(76, (width - gridSize) / 2);
    const top = 68;
    const cells = [
      { row: 0, column: 0, label: "TP", detail: "malignant found", count: tp, color: colors.forest },
      { row: 0, column: 1, label: "FN", detail: "malignant missed", count: fn, color: colors.amber },
      { row: 1, column: 0, label: "FP", detail: "false alarm", count: fp, color: colors.amber },
      { row: 1, column: 1, label: "TN", detail: "benign cleared", count: tn, color: colors.forest },
    ];

    ctx.font = "11px system-ui";
    ctx.fillStyle = colors.ink;
    ctx.textAlign = "center";
    ctx.fillText("Predicted malignant", left + cell / 2, 43);
    ctx.fillText("Predicted benign", left + cell * 1.5, 43);
    ctx.save();
    ctx.translate(left - 54, top + cell);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Actual class", 0, 0);
    ctx.restore();

    cells.forEach((item) => {
      const x = left + item.column * cell;
      const y = top + item.row * cell;
      ctx.globalAlpha = .14 + .5 * (item.count / 67);
      ctx.fillStyle = item.color;
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.fillStyle = colors.ink;
      ctx.textAlign = "center";
      ctx.font = "600 25px system-ui";
      ctx.fillText(String(item.count), x + cell / 2, y + cell / 2 - 4);
      ctx.font = "600 11px system-ui";
      ctx.fillText(item.label, x + cell / 2, y + cell / 2 + 18);
      ctx.fillStyle = colors.muted;
      ctx.font = "10px system-ui";
      ctx.fillText(item.detail, x + cell / 2, y + cell / 2 + 35);
    });
    ctx.fillStyle = colors.muted;
    ctx.textAlign = "left";
    ctx.font = "10px system-ui";
    ctx.fillText("Malignant is the positive class (label 0 in the notebook).", left, height - 17);
    metric(readout, [["Accuracy", accuracy.toFixed(3)], ["Precision", precision.toFixed(3)], ["Recall", recall.toFixed(3)], ["F1", f1.toFixed(3)]], fn > fp ? "Missed malignant cases are pulling recall down faster than precision." : fp > fn ? "False alarms are pulling precision down faster than recall." : "Equal FN and FP counts make precision and recall similar here, but they represent different real-world costs.");
  }

  const rocSamples = [
    { score: .95, label: 1 }, { score: .90, label: 1 }, { score: .80, label: 1 },
    { score: .70, label: 0 }, { score: .40, label: 1 }, { score: .30, label: 0 },
    { score: .20, label: 0 }, { score: .10, label: 0 }, { score: .05, label: 0 },
    { score: .01, label: 0 },
  ];

  function rocCounts(threshold) {
    return rocSamples.reduce((counts, sample) => {
      const predicted = sample.score >= threshold ? 1 : 0;
      if (sample.label === 1 && predicted === 1) counts.tp += 1;
      if (sample.label === 1 && predicted === 0) counts.fn += 1;
      if (sample.label === 0 && predicted === 1) counts.fp += 1;
      if (sample.label === 0 && predicted === 0) counts.tn += 1;
      return counts;
    }, { tp: 0, fn: 0, fp: 0, tn: 0 });
  }

  function rocCurvePoints() {
    const positives = rocSamples.filter((sample) => sample.label === 1).length;
    const negatives = rocSamples.length - positives;
    let tp = 0;
    let fp = 0;
    const points = [{ fpr: 0, tpr: 0 }];
    rocSamples.slice().sort((a, b) => b.score - a.score).forEach((sample) => {
      if (sample.label === 1) tp += 1;
      else fp += 1;
      points.push({ fpr: fp / negatives, tpr: tp / positives });
    });
    return points;
  }

  function drawRoc(root, canvas, readout) {
    const threshold = value(root, "threshold");
    const counts = rocCounts(threshold);
    const positives = counts.tp + counts.fn;
    const negatives = counts.fp + counts.tn;
    const tpr = counts.tp / positives;
    const fpr = counts.fp / negatives;
    const precision = counts.tp + counts.fp ? counts.tp / (counts.tp + counts.fp) : 0;
    const points = rocCurvePoints();
    const auc = points.slice(1).reduce((area, point, index) => {
      const previous = points[index];
      return area + (point.fpr - previous.fpr) * (point.tpr + previous.tpr) / 2;
    }, 0);
    const plot = frame(canvas, [0, 1], [0, 1], ["False-positive rate", "True-positive rate"]);
    const { ctx, x, y, colors } = plot;

    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = colors.muted;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x(0), y(0));
    ctx.lineTo(x(1), y(1));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = colors.series[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(x(point.fpr), y(point.tpr));
      else {
        const previous = points[index - 1];
        ctx.lineTo(x(point.fpr), y(previous.tpr));
        ctx.lineTo(x(point.fpr), y(point.tpr));
      }
    });
    ctx.stroke();

    ctx.fillStyle = colors.amber;
    ctx.beginPath();
    ctx.arc(x(fpr), y(tpr), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.paper;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = colors.ink;
    ctx.font = "11px system-ui";
    ctx.textAlign = fpr > .72 ? "right" : "left";
    ctx.fillText(`threshold ${threshold.toFixed(2)}`, x(fpr) + (fpr > .72 ? -10 : 10), y(tpr) - 10);
    metric(readout, [["TPR / recall", tpr.toFixed(2)], ["FPR", fpr.toFixed(2)], ["Precision", precision.toFixed(2)], ["Toy AUC", auc.toFixed(2)]], threshold < .4 ? "A permissive threshold catches nearly every positive, but more negatives cross the gate." : threshold > .75 ? "A strict threshold reduces false alarms, but some real positives are now missed." : "This threshold balances the two error types on the score example from the visual note.");
  }

  const classificationRows = [
    { videos: 0, guide: 0, result: 0 }, { videos: 1, guide: 1, result: 1 },
    { videos: 1, guide: 0, result: 1 }, { videos: 0, guide: 0, result: 0 },
    { videos: 0, guide: 0, result: 0 }, { videos: 1, guide: 1, result: 1 },
    { videos: 0, guide: 1, result: 0 }, { videos: 1, guide: 1, result: 1 },
    { videos: 1, guide: 0, result: 0 }, { videos: 1, guide: 1, result: 1 },
  ];

  function entropy(rows) {
    if (!rows.length) return 0;
    const pass = rows.filter((row) => row.result === 1).length;
    const probabilities = [pass / rows.length, (rows.length - pass) / rows.length];
    return probabilities.reduce((sum, probability) => probability ? sum - probability * Math.log2(probability) : sum, 0);
  }

  function classificationGain(feature) {
    const parent = entropy(classificationRows);
    const groups = [0, 1].map((answer) => classificationRows.filter((row) => row[feature] === answer));
    const after = groups.reduce((sum, group) => sum + group.length / classificationRows.length * entropy(group), 0);
    return { parent, after, gain: parent - after, groups };
  }

  function connectTreeNodes(ctx, from, to, colors, active) {
    ctx.strokeStyle = active ? colors.amber : colors.line;
    ctx.lineWidth = active ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function treeBox(ctx, centerX, centerY, width, title, detail, colors, active, leaf) {
    const height = leaf ? 54 : 62;
    const left = centerX - width / 2;
    const top = centerY - height / 2;
    ctx.globalAlpha = active ? .18 : .08;
    ctx.fillStyle = leaf ? colors.forest : colors.series[0];
    ctx.fillRect(left, top, width, height);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = active ? colors.amber : colors.line;
    ctx.lineWidth = active ? 2.5 : 1.2;
    ctx.strokeRect(left, top, width, height);
    ctx.fillStyle = colors.ink;
    ctx.textAlign = "center";
    ctx.font = "600 11px system-ui";
    ctx.fillText(title, centerX, centerY - 5);
    ctx.fillStyle = colors.muted;
    ctx.font = "10px system-ui";
    ctx.fillText(detail, centerX, centerY + 13);
    return { top: { x: centerX, y: top }, bottom: { x: centerX, y: top + height } };
  }

  function drawTreeClassification(root, canvas, readout) {
    const comparedFeature = value(root, "firstSplit");
    const videos = Number(value(root, "studentVideos"));
    const guide = Number(value(root, "studentGuide"));
    const comparison = classificationGain(comparedFeature);
    const videosGain = classificationGain("videos").gain;
    const guideGain = classificationGain("guide").gain;
    const prediction = videos === 0 ? "Fail" : guide === 1 ? "Pass" : "Fail (tie leaf)";
    const pathRoot = true;
    const pathNoVideos = videos === 0;
    const pathGuide = videos === 1;
    const pathNoGuide = videos === 1 && guide === 0;
    const pathYesGuide = videos === 1 && guide === 1;
    const { ctx, width, colors } = prepareCanvas(canvas, 380);
    const nodeWidth = Math.max(92, Math.min(146, width * .21));
    const rootNode = treeBox(ctx, width / 2, 58, nodeWidth, "Watched videos?", "entropy 1.00 · 10 rows", colors, pathRoot, false);
    const failNode = treeBox(ctx, width * .22, 172, nodeWidth, "Predict Fail", "4 fail · pure", colors, pathNoVideos, true);
    const guideNode = treeBox(ctx, width * .68, 172, nodeWidth, "Used guide?", "entropy 0.65 · 6 rows", colors, pathGuide, false);
    const tieNode = treeBox(ctx, width * .53, 300, nodeWidth, "Predict Fail", "1 fail / 1 pass · tie", colors, pathNoGuide, true);
    const passNode = treeBox(ctx, width * .84, 300, nodeWidth, "Predict Pass", "4 pass · pure", colors, pathYesGuide, true);
    connectTreeNodes(ctx, rootNode.bottom, failNode.top, colors, pathNoVideos);
    connectTreeNodes(ctx, rootNode.bottom, guideNode.top, colors, pathGuide);
    connectTreeNodes(ctx, guideNode.bottom, tieNode.top, colors, pathNoGuide);
    connectTreeNodes(ctx, guideNode.bottom, passNode.top, colors, pathYesGuide);
    ctx.fillStyle = colors.muted;
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("No", width * .34, 118);
    ctx.fillText("Yes", width * .59, 118);
    ctx.fillText("No", width * .59, 238);
    ctx.fillText("Yes", width * .77, 238);
    metric(readout, [["Videos gain", videosGain.toFixed(3)], ["Guide gain", guideGain.toFixed(3)], ["Compared after-entropy", comparison.after.toFixed(3)], ["Prediction", prediction]], comparedFeature === "videos" ? "Videos wins the first split because 0.610 information gain removes more uncertainty than Guide's 0.278." : "Guide is a valid candidate, but its 0.278 gain leaves more uncertainty—so the learned tree chooses Videos first.");
  }

  const regressionRows = [
    { videos: 0, guide: 0, result: 30 }, { videos: 1, guide: 1, result: 89 },
    { videos: 0, guide: 0, result: 31 }, { videos: 0, guide: 0, result: 32 },
    { videos: 1, guide: 1, result: 90 }, { videos: 0, guide: 1, result: 25 },
    { videos: 1, guide: 1, result: 91 }, { videos: 1, guide: 0, result: 20 },
    { videos: 1, guide: 1, result: 90 },
  ];

  function variance(rows) {
    if (!rows.length) return 0;
    const mean = rows.reduce((sum, row) => sum + row.result, 0) / rows.length;
    return rows.reduce((sum, row) => sum + (row.result - mean) ** 2, 0) / rows.length;
  }

  function regressionReduction(feature) {
    const parent = variance(regressionRows);
    const groups = [0, 1].map((answer) => regressionRows.filter((row) => row[feature] === answer));
    const after = groups.reduce((sum, group) => sum + group.length / regressionRows.length * variance(group), 0);
    return { parent, after, reduction: parent - after };
  }

  function drawTreeRegression(root, canvas, readout) {
    const comparedFeature = value(root, "firstSplit");
    const videos = Number(value(root, "studentVideos"));
    const guide = Number(value(root, "studentGuide"));
    const compared = regressionReduction(comparedFeature);
    const guideReduction = regressionReduction("guide").reduction;
    const videosReduction = regressionReduction("videos").reduction;
    const prediction = guide === 0 ? (videos === 0 ? 31 : 20) : (videos === 0 ? 25 : 90);
    const { ctx, width, colors } = prepareCanvas(canvas, 410);
    const nodeWidth = Math.max(84, Math.min(135, width * .2));
    const rootNode = treeBox(ctx, width / 2, 50, nodeWidth, "Used guide?", "variance 972.89", colors, true, false);
    const leftNode = treeBox(ctx, width * .27, 155, nodeWidth, "Videos?", "mean 28.25 · 4 rows", colors, guide === 0, false);
    const rightNode = treeBox(ctx, width * .73, 155, nodeWidth, "Videos?", "mean 77.00 · 5 rows", colors, guide === 1, false);
    const leafPositions = [width * .12, width * .36, width * .64, width * .88];
    const leafValues = [31, 20, 25, 90];
    const activeLeaves = [guide === 0 && videos === 0, guide === 0 && videos === 1, guide === 1 && videos === 0, guide === 1 && videos === 1];
    const leafNodes = leafValues.map((number, index) => treeBox(ctx, leafPositions[index], 300, nodeWidth * .8, `Predict ${number}`, index === 3 ? "mean of 4 rows" : index === 0 ? "mean of 3 rows" : "one row", colors, activeLeaves[index], true));
    connectTreeNodes(ctx, rootNode.bottom, leftNode.top, colors, guide === 0);
    connectTreeNodes(ctx, rootNode.bottom, rightNode.top, colors, guide === 1);
    connectTreeNodes(ctx, leftNode.bottom, leafNodes[0].top, colors, activeLeaves[0]);
    connectTreeNodes(ctx, leftNode.bottom, leafNodes[1].top, colors, activeLeaves[1]);
    connectTreeNodes(ctx, rightNode.bottom, leafNodes[2].top, colors, activeLeaves[2]);
    connectTreeNodes(ctx, rightNode.bottom, leafNodes[3].top, colors, activeLeaves[3]);
    ctx.fillStyle = colors.muted;
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("No", width * .38, 101);
    ctx.fillText("Yes", width * .62, 101);
    ctx.fillText("No", width * .18, 230);
    ctx.fillText("Yes", width * .33, 230);
    ctx.fillText("No", width * .67, 230);
    ctx.fillText("Yes", width * .82, 230);
    metric(readout, [["Guide reduction", guideReduction.toFixed(2)], ["Videos reduction", videosReduction.toFixed(2)], ["Compared after-variance", compared.after.toFixed(2)], ["Predicted marks", prediction]], comparedFeature === "guide" ? "Guide produces the larger first variance reduction, so it becomes the root question." : "Videos reduces some spread, but Guide creates more similar mark groups and wins the root split.");
  }

  function gaussianDensity(x, mean, deviation) {
    return Math.exp(-((x - mean) ** 2) / (2 * deviation ** 2)) / (Math.sqrt(2 * Math.PI) * deviation);
  }

  function drawNaiveBayes(root, canvas, readout) {
    const mark = value(root, "mark");
    const watchedPrior = value(root, "watchedPrior") / 100;
    const notWatchedPrior = 1 - watchedPrior;
    const classes = [
      { name: "Watched", mean: 79.11, deviation: 9.56, prior: watchedPrior, colorIndex: 0 },
      { name: "Did not watch", mean: 86.20, deviation: 8.70, prior: notWatchedPrior, colorIndex: 1 },
    ];
    const scores = classes.map((item) => gaussianDensity(mark, item.mean, item.deviation) * item.prior);
    const scoreTotal = scores[0] + scores[1];
    const posteriors = scores.map((score) => scoreTotal ? score / scoreTotal : 0);
    const winner = posteriors[0] >= posteriors[1] ? 0 : 1;
    const plot = frame(canvas, [50, 115], [0, .055], ["Student mark", "Probability density"]);
    const { ctx, x, y, colors } = plot;

    classes.forEach((item) => {
      ctx.strokeStyle = colors.series[item.colorIndex];
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let index = 0; index <= 220; index += 1) {
        const number = 50 + (65 * index) / 220;
        const density = gaussianDensity(number, item.mean, item.deviation);
        if (index === 0) ctx.moveTo(x(number), y(density));
        else ctx.lineTo(x(number), y(density));
      }
      ctx.stroke();
      ctx.fillStyle = colors.series[item.colorIndex];
      ctx.font = "600 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${item.name} · μ ${item.mean.toFixed(1)}`, x(item.mean), y(gaussianDensity(item.mean, item.mean, item.deviation)) - 10);
    });

    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = colors.amber;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x(mark), y(0));
    ctx.lineTo(x(mark), y(.052));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.amber;
    ctx.textAlign = mark > 103 ? "right" : "left";
    ctx.font = "600 11px system-ui";
    ctx.fillText(`new mark ${mark}`, x(mark) + (mark > 103 ? -8 : 8), y(.051));

    classes.forEach((item, index) => {
      const density = gaussianDensity(mark, item.mean, item.deviation);
      ctx.fillStyle = colors.series[item.colorIndex];
      ctx.beginPath();
      ctx.arc(x(mark), y(density), index === winner ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
    });

    metric(readout, [["Watched posterior", `${(posteriors[0] * 100).toFixed(1)}%`], ["Not-watched posterior", `${(posteriors[1] * 100).toFixed(1)}%`], ["Prediction", classes[winner].name], ["Class prior", `${(watchedPrior * 100).toFixed(0)} / ${(notWatchedPrior * 100).toFixed(0)}`]], `At mark ${mark}, each bell-curve height is multiplied by its class prior. The larger weighted likelihood becomes the prediction.`);
  }

  const tuningGrid = [
    { label: "gini / best", scores: [.691667, .950000, .933333, .925000, .933333, .925000] },
    { label: "gini / random", scores: [.691667, .766667, .958333, .975000, .950000, .925000] },
    { label: "entropy / best", scores: [.691667, .933333, .933333, .933333, .933333, .925000] },
    { label: "entropy / random", scores: [.683333, .900000, .908333, .866667, .925000, .925000] },
  ];
  const randomSearchOrder = [1, 4, 16, 18, 7, 12, 20, 3, 15, 9, 22, 0, 6, 11, 14, 5, 19, 2, 13, 21, 10, 17, 8, 23];

  function drawHyperparameterSearch(root, canvas, readout) {
    const method = value(root, "searchMethod");
    const requestedSamples = value(root, "randomSamples");
    const folds = value(root, "cvFolds");
    const testedCount = method === "grid" ? 24 : requestedSamples;
    const tested = method === "grid"
      ? new Set(Array.from({ length: 24 }, (_, index) => index))
      : new Set(randomSearchOrder.slice(0, requestedSamples));
    const visible = [];
    tuningGrid.forEach((row, rowIndex) => row.scores.forEach((score, columnIndex) => {
      const flatIndex = rowIndex * 6 + columnIndex;
      if (tested.has(flatIndex)) visible.push({ rowIndex, columnIndex, flatIndex, score });
    }));
    const best = visible.reduce((winner, candidate) => !winner || candidate.score > winner.score ? candidate : winner, null);
    const { ctx, width, height, colors } = prepareCanvas(canvas, 365);
    const pad = { left: Math.min(112, width * .34), right: 14, top: 66, bottom: 48 };
    const cellWidth = (width - pad.left - pad.right) / 6;
    const cellHeight = (height - pad.top - pad.bottom) / 4;

    ctx.fillStyle = colors.ink;
    ctx.font = "600 11px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(method === "grid" ? "GridSearchCV · all combinations" : `RandomizedSearchCV · ${testedCount} sampled combinations`, pad.left, 24);
    ctx.fillStyle = colors.muted;
    ctx.font = "10px system-ui";
    ctx.fillText("Cell value = saved mean 5-fold CV accuracy", pad.left, 43);

    for (let column = 0; column < 6; column += 1) {
      ctx.fillStyle = colors.muted;
      ctx.textAlign = "center";
      ctx.fillText(`depth ${column + 1}`, pad.left + (column + .5) * cellWidth, pad.top - 12);
    }

    tuningGrid.forEach((row, rowIndex) => {
      ctx.fillStyle = colors.ink;
      ctx.textAlign = "right";
      ctx.font = "10px system-ui";
      ctx.fillText(row.label, pad.left - 9, pad.top + (rowIndex + .5) * cellHeight + 4);
      row.scores.forEach((score, columnIndex) => {
        const flatIndex = rowIndex * 6 + columnIndex;
        const isTested = tested.has(flatIndex);
        const cellX = pad.left + columnIndex * cellWidth;
        const cellY = pad.top + rowIndex * cellHeight;
        ctx.globalAlpha = isTested ? .16 + .7 * Math.max(0, Math.min(1, (score - .65) / .35)) : .05;
        ctx.fillStyle = isTested ? colors.series[0] : colors.muted;
        ctx.fillRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = best && flatIndex === best.flatIndex ? colors.amber : colors.line;
        ctx.lineWidth = best && flatIndex === best.flatIndex ? 3 : 1;
        ctx.strokeRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);
        ctx.fillStyle = isTested ? colors.ink : colors.muted;
        ctx.textAlign = "center";
        ctx.font = "10px system-ui";
        ctx.fillText(isTested ? score.toFixed(3) : "—", cellX + cellWidth / 2, cellY + cellHeight / 2 + 4);
      });
    });

    ctx.fillStyle = colors.amber;
    ctx.fillRect(pad.left, height - 22, 11, 11);
    ctx.fillStyle = colors.muted;
    ctx.textAlign = "left";
    ctx.fillText("outline = best tested setting", pad.left + 17, height - 13);
    const bestRow = tuningGrid[best.rowIndex];
    const bestParams = `${bestRow.label} / depth ${best.columnIndex + 1}`;
    metric(readout, [["Configurations", testedCount], ["CV comparison fits", testedCount * folds], ["Best visible CV", best.score.toFixed(3)], ["Best visible settings", bestParams]], method === "grid" ? "Grid search covers every declared combination. The final refit is additional to the CV comparison fits shown here." : "This is a deterministic illustration sampled from the notebook's saved grid scores. A real unseeded RandomizedSearchCV run may choose different cells and scores.");
  }

  function draw(config, root, canvas, readout) {
    if (config.type === "linear") drawLinear(root, canvas, readout);
    if (config.type === "plane") drawPlane(root, canvas, readout);
    if (config.type === "split") drawSplit(root, canvas, readout);
    if (config.type === "regularization") drawRegularization(root, canvas, readout, config.method);
    if (config.type === "polynomial") drawPolynomial(root, canvas, readout);
    if (config.type === "crossValidation") drawCrossValidation(root, canvas, readout);
    if (config.type === "kmeans") drawKMeans(root, canvas, readout);
    if (config.type === "dendrogram") drawDendrogram(root, canvas, readout);
    if (config.type === "classificationMetrics") drawClassificationMetrics(root, canvas, readout);
    if (config.type === "roc") drawRoc(root, canvas, readout);
    if (config.type === "treeClassification") drawTreeClassification(root, canvas, readout);
    if (config.type === "treeRegression") drawTreeRegression(root, canvas, readout);
    if (config.type === "naiveBayes") drawNaiveBayes(root, canvas, readout);
    if (config.type === "hyperparameterSearch") drawHyperparameterSearch(root, canvas, readout);
  }

  function mount(id) {
    if (cleanupCurrent) cleanupCurrent();
    const config = labConfigs[id];
    const root = document.getElementById("interactive-lab");
    const canvas = document.getElementById("lab-canvas");
    const readout = document.getElementById("lab-readout");
    if (!config || !root || !canvas || !readout) return;

    const render = () => {
      updateOutputs(root);
      draw(config, root, canvas, readout);
    };
    root.addEventListener("input", render);
    root.addEventListener("change", render);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(render) : null;
    if (observer) observer.observe(canvas);
    const themeObserver = typeof MutationObserver === "function" ? new MutationObserver(render) : null;
    if (themeObserver) themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", render);
    requestAnimationFrame(render);

    cleanupCurrent = () => {
      root.removeEventListener("input", render);
      root.removeEventListener("change", render);
      observer?.disconnect();
      themeObserver?.disconnect();
      window.removeEventListener("resize", render);
    };
  }

  function unmount() {
    if (cleanupCurrent) cleanupCurrent();
    cleanupCurrent = null;
  }

  window.LearningLabs = { has, markup, mount, unmount };
})();
