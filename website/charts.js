/* Charts — Chart.js 4.x */
document.addEventListener("DOMContentLoaded", function () {
  var C = {
    blue: "rgba(88,166,255,1)", purple: "rgba(188,140,255,1)",
    green: "rgba(63,185,80,1)", red: "rgba(248,81,73,1)",
    orange: "rgba(210,153,34,1)", cyan: "rgba(63,215,202,1)",
    blueA: "rgba(88,166,255,.25)", purpleA: "rgba(188,140,255,.25)",
    greenA: "rgba(63,185,80,.25)", redA: "rgba(248,81,73,.25)",
    orangeA: "rgba(210,153,34,.15)", cyanA: "rgba(63,215,202,.25)",
    grid: "rgba(48,54,61,.6)", text: "#8b949e", white: "#e6edf3"
  };
  Chart.defaults.color = C.text;
  Chart.defaults.borderColor = C.grid;
  Chart.defaults.font.family = "'Segoe UI',system-ui,sans-serif";

  /* ── BO1: Target Class Balance ── */
  new Chart(document.getElementById("bo1-class-balance"), {
    type: "doughnut",
    data: {
      labels: ["Healthy — 64.6%", "Alzheimer's — 35.4%"],
      datasets: [{ data: [1389, 760], backgroundColor: [C.green, C.red], borderColor: "rgba(22,27,34,1)", borderWidth: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: "60%",
      plugins: {
        title: { display: true, text: "Target Variable Distribution (n = 2,149)", color: C.white, font: { size: 14, weight: 600 } },
        legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } }
      }
    }
  });

  /* ── BO1: PCA Scree ── */
  var bo1Var = [.0722,.0706,.0699,.0667,.0660,.0649,.0641,.0638,.0621,.0608,.0601,.0592,.0585,.0575,.0555,.0520];
  new Chart(document.getElementById("bo1-pca-scree"), {
    type: "bar",
    data: {
      labels: bo1Var.map(function(_, i) { return "PC" + (i + 1); }),
      datasets: [{ label: "Variance Ratio", data: bo1Var, backgroundColor: C.blue, borderRadius: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "PCA — Individual Variance per Component", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false } },
      scales: { y: { beginAtZero: true, max: .08, grid: { color: C.grid }, ticks: { callback: function(v) { return (v * 100).toFixed(0) + "%"; } } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } }
    }
  });

  /* ── BO1: PCA Cumulative Variance ── */
  var bo1Cum = [], s = 0;
  bo1Var.forEach(function(v) { s += v; bo1Cum.push(+(s).toFixed(4)); });
  new Chart(document.getElementById("bo1-pca-cumvar"), {
    type: "line",
    data: {
      labels: bo1Var.map(function(_, i) { return "" + (i + 1); }),
      datasets: [
        { label: "Cumulative Variance", data: bo1Cum, borderColor: C.orange, backgroundColor: C.orangeA, fill: true, pointBackgroundColor: C.orange, pointRadius: 5, tension: .3 },
        { label: "95% Threshold", data: Array(16).fill(.95), borderColor: C.red, borderDash: [8, 4], pointRadius: 0, borderWidth: 2 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Cumulative Variance — All 16 Components Retained (95% line)", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { y: { min: 0, max: 1.05, grid: { color: C.grid }, ticks: { callback: function(v) { return (v * 100).toFixed(0) + "%"; } } }, x: { title: { display: true, text: "Components", color: C.text }, grid: { display: false } } }
    }
  });

  /* ── BO1: Radar ── */
  new Chart(document.getElementById("bo1-radar"), {
    type: "radar",
    data: {
      labels: ["Accuracy", "ROC-AUC", "F1-Score", "Precision", "Recall"],
      datasets: [
        { label: "SVM (RBF)", data: [.8442,.91,.7976,.7374,.8684], borderColor: C.blue, backgroundColor: C.blueA, pointBackgroundColor: C.blue },
        { label: "Random Forest", data: [.8279,.8841,.7319,.8145,.6645], borderColor: C.green, backgroundColor: C.greenA, pointBackgroundColor: C.green },
        { label: "Logistic Reg.", data: [.807,.885,.7552,.6845,.8421], borderColor: C.purple, backgroundColor: C.purpleA, pointBackgroundColor: C.purple },
        { label: "Gradient Boost.", data: [.8163,.8744,.7304,.7589,.7039], borderColor: C.orange, backgroundColor: C.orangeA, pointBackgroundColor: C.orange }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Model Metric Profiles", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { r: { beginAtZero: false, min: .5, max: 1, ticks: { stepSize: .1, backdropColor: "transparent" }, grid: { color: C.grid }, angleLines: { color: C.grid }, pointLabels: { font: { size: 12 }, color: C.white } } }
    }
  });

  /* ── BO1: Grouped Bar ── */
  new Chart(document.getElementById("bo1-bar"), {
    type: "bar",
    data: {
      labels: ["SVM (RBF)", "Random Forest", "Logistic Reg.", "Gradient Boost."],
      datasets: [
        { label: "Accuracy", data: [.8442,.8279,.807,.8163], backgroundColor: C.blue },
        { label: "ROC-AUC", data: [.91,.8841,.885,.8744], backgroundColor: C.purple },
        { label: "F1-Score", data: [.7976,.7319,.7552,.7304], backgroundColor: C.green },
        { label: "Precision", data: [.7374,.8145,.6845,.7589], backgroundColor: C.orange },
        { label: "Recall", data: [.8684,.6645,.8421,.7039], backgroundColor: C.red }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Metrics by Model", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { y: { beginAtZero: false, min: .5, max: 1, grid: { color: C.grid } }, x: { grid: { display: false } } }
    }
  });

  /* ── BO1: ROC-AUC Ranking ── */
  new Chart(document.getElementById("bo1-roc"), {
    type: "bar",
    data: {
      labels: ["SVM (RBF)", "Logistic Reg.", "Random Forest", "Gradient Boost."],
      datasets: [{ label: "ROC-AUC", data: [.91,.885,.8841,.8744], backgroundColor: [C.blue, C.purple, C.green, C.orange], borderRadius: 6, barThickness: 32 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, indexAxis: "y",
      plugins: { title: { display: true, text: "ROC-AUC Score Ranking", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { return "AUC: " + ctx.raw.toFixed(4); } } } },
      scales: { x: { min: .85, max: .92, grid: { color: C.grid } }, y: { grid: { display: false } } }
    }
  });

  /* ── BO1: Confusion Matrix ── */
  new Chart(document.getElementById("bo1-cm"), {
    type: "bar",
    data: {
      labels: ["SVM (RBF)", "Random Forest", "Logistic Reg.", "Gradient Boost."],
      datasets: [
        { label: "True Neg", data: [231, 255, 219, 244], backgroundColor: "rgba(63,185,80,.7)" },
        { label: "True Pos", data: [132, 101, 128, 107], backgroundColor: "rgba(88,166,255,.7)" },
        { label: "False Pos", data: [47, 23, 59, 34], backgroundColor: "rgba(210,153,34,.7)" },
        { label: "False Neg", data: [20, 51, 24, 45], backgroundColor: "rgba(248,81,73,.85)" }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true, indexAxis: "y",
      plugins: { title: { display: true, text: "Confusion Matrix Breakdown — FN (red) = Missed Diagnoses", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { x: { stacked: true, grid: { color: C.grid } }, y: { stacked: true, grid: { display: false } } }
    }
  });

  /* ── BO2: Model Comparison ── */
  new Chart(document.getElementById("bo2-bar"), {
    type: "bar",
    data: {
      labels: ["CNN Custom", "EfficientNetB0", "ResNet50"],
      datasets: [
        { label: "Accuracy %", data: [50.7, 35, 1.95], backgroundColor: C.blue },
        { label: "F1 Macro %", data: [18.1, 12.96, 1.43], backgroundColor: C.purple },
        { label: "F1 Weighted %", data: [35.37, 18.15, 1.88], backgroundColor: C.green }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Model Performance (Fast Training)", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { y: { beginAtZero: true, max: 60, grid: { color: C.grid }, ticks: { callback: function(v) { return v + "%"; } } }, x: { grid: { display: false } } }
    }
  });

  /* ── BO2: Class Distribution ── */
  new Chart(document.getElementById("bo2-doughnut"), {
    type: "doughnut",
    data: {
      labels: ["NonDemented (50%)", "VeryMild (35%)", "Mild (14%)", "Moderate (1%)"],
      datasets: [{ data: [3200, 2240, 896, 64], backgroundColor: [C.green, C.blue, C.orange, C.red], borderColor: "rgba(22,27,34,1)", borderWidth: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Training Set Class Distribution", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } }
    }
  });

  /* ── BO2: CNN Confusion Matrix ── */
  new Chart(document.getElementById("bo2-cm-cnn"), {
    type: "bar",
    data: {
      labels: ["Mild (896)", "Moderate (64)", "Healthy (3200)", "Very Mild (2240)"],
      datasets: [
        { label: "Pred: Healthy", data: [889, 64, 3181, 2176], backgroundColor: "rgba(63,185,80,.6)" },
        { label: "Pred: Very Mild", data: [7, 0, 19, 64], backgroundColor: "rgba(88,166,255,.6)" },
        { label: "Pred: Mild", data: [0, 0, 0, 0], backgroundColor: "rgba(210,153,34,.6)" },
        { label: "Pred: Moderate", data: [0, 0, 0, 0], backgroundColor: "rgba(248,81,73,.6)" }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "CNN Confusion — Predictions Skew 'Healthy'", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 12 } } },
      scales: { x: { title: { display: true, text: "True Label", color: C.text }, grid: { display: false } }, y: { stacked: true, grid: { color: C.grid }, title: { display: true, text: "Count", color: C.text } } }
    }
  });

  /* ── BO2: Per-Class Recall ── */
  new Chart(document.getElementById("bo2-per-class"), {
    type: "polarArea",
    data: {
      labels: ["Healthy (99.4%)", "Very Mild (2.9%)", "Mild (0%)", "Moderate (0%)"],
      datasets: [{ data: [99.4, 2.9, .1, .1], backgroundColor: ["rgba(63,185,80,.7)", "rgba(88,166,255,.7)", "rgba(210,153,34,.7)", "rgba(248,81,73,.7)"] }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Per-Class Recall — Heavy Majority Bias", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 12 } } },
      scales: { r: { grid: { color: C.grid }, ticks: { backdropColor: "transparent" } } }
    }
  });

  /* ── BO2: Sample Probabilities ── */
  new Chart(document.getElementById("bo2-proba"), {
    type: "bar",
    data: {
      labels: ["Healthy (Sain)", "Very Mild", "Moderate", "Mild"],
      datasets: [{ label: "Probability %", data: [26.04, 25.87, 25.44, 22.65], backgroundColor: [C.green, C.blue, C.orange, C.red], borderRadius: 6, barThickness: 40 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, indexAxis: "y",
      plugins: { title: { display: true, text: "Sample MRI — Nearly Uniform Probabilities (~25% each)", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { return ctx.raw + "%"; } } } },
      scales: { x: { min: 0, max: 35, grid: { color: C.grid }, ticks: { callback: function(v) { return v + "%"; } } }, y: { grid: { display: false } } }
    }
  });

  /* ── BO3: PCA Scree ── */
  var bo3Var = [.0722,.0705,.0699,.0666,.066,.0648,.0641,.0637,.062,.0606,.06,.059,.0583,.0574,.0553,.052];
  new Chart(document.getElementById("bo3-pca-scree"), {
    type: "bar",
    data: {
      labels: bo3Var.map(function(_, i) { return "PC" + (i + 1); }),
      datasets: [{ label: "Variance", data: bo3Var, backgroundColor: bo3Var.map(function(_, i) { return i < 15 ? C.blue : "rgba(88,166,255,.3)"; }), borderRadius: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Scree Plot — 15 PCs retained (PC16 dimmed)", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false } },
      scales: { y: { beginAtZero: true, max: .08, grid: { color: C.grid }, ticks: { callback: function(v) { return (v * 100).toFixed(0) + "%"; } } }, x: { grid: { display: false }, ticks: { font: { size: 9 } } } }
    }
  });

  /* ── BO3: Elbow Method ── */
  new Chart(document.getElementById("bo3-elbow"), {
    type: "line",
    data: {
      labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      datasets: [{ label: "Inertia", data: [30400, 28700, 27100, 25900, 24850, 23900, 23100, 22600, 22200], borderColor: C.blue, backgroundColor: C.blueA, fill: true, pointBackgroundColor: C.blue, pointRadius: 5, tension: .3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Elbow Method — WCSS (15-D PCA Space)", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false } },
      scales: { y: { grid: { color: C.grid }, title: { display: true, text: "Inertia", color: C.text } }, x: { grid: { display: false }, title: { display: true, text: "K", color: C.text } } }
    }
  });

  /* ── BO3: Silhouette vs K ── */
  new Chart(document.getElementById("bo3-silhouette-k"), {
    type: "line",
    data: {
      labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      datasets: [{ label: "Silhouette", data: [.1272,.085,.092,.077,.087,.071,.07,.059,.065], borderColor: C.orange, backgroundColor: "rgba(210,153,34,.1)", fill: true, pointBackgroundColor: C.orange, pointRadius: 5, tension: .3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Silhouette Score vs K — Best at K=2 (0.127)", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false } },
      scales: { y: { min: .04, max: .15, grid: { color: C.grid }, title: { display: true, text: "Silhouette", color: C.text } }, x: { grid: { display: false }, title: { display: true, text: "K", color: C.text } } }
    }
  });

  /* ── BO3: Algorithm Comparison ── */
  new Chart(document.getElementById("bo3-cluster-bar"), {
    type: "bar",
    data: {
      labels: ["KMeans", "Agglomerative", "DBSCAN"],
      datasets: [
        { label: "Silhouette", data: [.1272, .1265, .1476], backgroundColor: C.blue },
        { label: "Purity", data: [.6463, .6463, .6495], backgroundColor: C.purple }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Clustering Algorithm Comparison", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { y: { beginAtZero: true, max: .8, grid: { color: C.grid } }, x: { grid: { display: false } } }
    }
  });

  /* ── BO3: Consensus Accuracy ── */
  new Chart(document.getElementById("bo3-consensus"), {
    type: "doughnut",
    data: {
      labels: ["Correct (87)", "Incorrect (13)"],
      datasets: [{ data: [87, 13], backgroundColor: [C.green, "rgba(248,81,73,.35)"], borderColor: "rgba(22,27,34,1)", borderWidth: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: "65%",
      plugins: { title: { display: true, text: "KNN Consensus Accuracy (100 patients)", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } }
    }
  });

  /* ── BO3: Cluster Profiles ── */
  var fl = ["Age", "Edu", "Smok", "Sleep", "CVD", "HeadInj", "Hyper", "LDL", "HDL", "Trig", "MMSE", "FuncAs", "MemCo", "BehPr", "ADL", "Disor"];
  new Chart(document.getElementById("bo3-cluster-profile"), {
    type: "bar",
    data: {
      labels: fl,
      datasets: [
        { label: "Cluster 0 (Healthier)", data: [-.71,.71,.71,.71,.71,.71,-.71,.71,-.71,-.71,.71,-.71,.71,-.71,-.71,.71], backgroundColor: "rgba(63,185,80,.65)", borderRadius: 3 },
        { label: "Cluster 1 (At-Risk)", data: [.71,-.71,-.71,-.71,-.71,-.71,-.71,-.71,-.71,.71,.71,.71,-.71,.71,.71,-.71], backgroundColor: "rgba(248,81,73,.65)", borderRadius: 3 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Z-Scored Feature Means — Patient Archetypes", color: C.white, font: { size: 14, weight: 600 } }, legend: { position: "bottom", labels: { usePointStyle: true, padding: 14 } } },
      scales: { y: { min: -1, max: 1, grid: { color: C.grid }, title: { display: true, text: "Z-Score", color: C.text } }, x: { grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 } } }
    }
  });

  /* ── BO3: Risk Distribution ── */
  new Chart(document.getElementById("bo3-risk-dist"), {
    type: "bar",
    data: {
      labels: ["HIGH", "MEDIUM", "LOW"],
      datasets: [{ label: "Patients", data: [1620, 265, 264], backgroundColor: [C.red, C.orange, C.green], borderRadius: 6, barThickness: 50 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Risk Level Distribution", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: C.grid }, title: { display: true, text: "Patients", color: C.text } }, x: { grid: { display: false } } }
    }
  });

  /* ── BO3: Focus Distribution ── */
  new Chart(document.getElementById("bo3-focus-dist"), {
    type: "bar",
    data: {
      labels: ["Daily Assistance", "Cognitive Decline", "Preventive Care"],
      datasets: [{ label: "Patients", data: [880, 860, 409], backgroundColor: [C.cyan, C.blue, C.purple], borderRadius: 6, barThickness: 50 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { title: { display: true, text: "Primary Focus Distribution", color: C.white, font: { size: 14, weight: 600 } }, legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: C.grid }, title: { display: true, text: "Patients", color: C.text } }, x: { grid: { display: false } } }
    }
  });
});
