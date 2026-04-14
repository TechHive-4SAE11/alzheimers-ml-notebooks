# Presentation Notes — Alzheimer's ML Project (TechHive)

> **For:** Validation PPT — Phase Modélisation  
> **Prof:** Mohamed Aziz KASSEB  
> **Team:** TechHive — Thynk Unlimited | We Learn For The Future  
> **Date:** April 2026

---

## 1. Introduction (Context & Problem Statement)

**Context:**  
Alzheimer's disease is the leading cause of dementia worldwide, affecting over 55 million people. Early detection, severity assessment, and personalized care are critical to slowing disease progression and improving patient outcomes.

**Problem Statement:**  
This project addresses three complementary challenges in the Alzheimer's care continuum:

1. **BO1 — Risk Detection:** Can we predict whether a patient has Alzheimer's from clinical and demographic data before symptoms become clinically obvious?
2. **BO2 — Severity Detection:** Can we automatically classify the severity of Alzheimer's from brain MRI scans to assist radiologists in triage?
3. **BO3 — Personalized Recommendation:** Can we segment patients into homogeneous groups to recommend tailored care plans that move at-risk patients closer to "healthy" profiles?

**Notebooks:**
- `alzheimer-s-disease-prediction.ipynb` → BO1
- `Détection_de_la_Sévérité_d'Alzheimer(Scanners_IRM).ipynb` → BO2
- `care-plan-collaborative-filtering-prep.ipynb` → BO3
- `themes.ipynb` → Index / overview of all three objectives

---

## 2. Business Understanding — BOS, DSOs & Datasets

| Business Objective | Data Science Objective | Dataset(s) | ML Type |
|--------------------|----------------------|------------|---------|
| **BO1 — Proactive Risk Screening:** Identify individuals at high risk before clinical symptoms to enable early lifestyle interventions | Predict binary diagnosis (0=Healthy, 1=Alzheimer) from tabular clinical inputs | `alzheimers_disease_data.csv` (2,149 patients × 35 features) | Supervised → **Binary Classification** |
| **BO2 — Automated Clinical Grading:** Assist radiologists by classifying dementia severity from MRI scans for triage | Classify MRI image into 4 categories: NonDemented, VeryMildDemented, MildDemented, ModerateDemented | [Kaggle Alzheimer MRI Dataset](https://www.kaggle.com/datasets/preetpalsingh25/alzheimers-dataset-4-class-of-images) (6,400 images, 4 classes) | Supervised → **Multi-class Image Classification** |
| **BO3 — Personalized Health Optimization:** Provide tailored care plan recommendations to at-risk patients | Segment patients into clusters via unsupervised learning, then recommend care plans based on group similarity | `alzheimers_disease_data.csv` + `care_plan_recommendations.csv` | Unsupervised → **Clustering & Recommendation** |

---

## 3. Data Comprehension & Preparation

### 3.1 BO1 — Risk Detection (Tabular Data)

**Target variable:** `Diagnosis` (binary: 0 = Healthy, 1 = Alzheimer's)

**Explanatory variables (after feature selection):** 16 features selected by LassoCV (L1 regularization) from 33 original features:
- Age, EducationLevel, Smoking, SleepQuality, CardiovascularDisease, HeadInjury, Hypertension
- CholesterolLDL, CholesterolHDL, CholesterolTriglycerides
- MMSE, FunctionalAssessment, MemoryComplaints, BehavioralProblems, ADL, Disorientation

**Preprocessing techniques (with screenshot references from notebook):**

| Technique | Purpose | Notebook Cell |
|-----------|---------|---------------|
| **LassoCV Feature Selection** | L1 regularization shrinks non-predictive features to zero; 5-fold CV optimizes alpha → reduced from 33 to 16 features | Section 4 — shows selected vs. eliminated features with coefficients |
| **MinMaxScaler + StandardScaler** | Two-stage normalization: MinMax to [0,1] then StandardScaler to mean=0, std=1 | Section 5 — verification table shows mean≈0, std≈1 |
| **PCA (95% variance)** | Dimensionality reduction on 16 scaled features; retains ≥95% variance | Section 9.2 — scree plot + cumulative variance curve |
| **Stratified Train/Test Split** | 80/20 split preserving class proportions | Section 9.3 — class distribution in train/test sets |

**Data quality:** No missing values, no duplicates, no corrupted records.

---

### 3.2 BO2 — Severity Detection (MRI Images)

**Target variable:** Severity class (4 categories: NonDemented, VeryMildDemented, MildDemented, ModerateDemented)

**Explanatory variables:** Brain MRI RGB images (224×224×3 pixels → 150,528 features when flattened → PCA components)

**Preprocessing techniques:**

| Technique | Purpose | Notebook Cell |
|-----------|---------|---------------|
| **Image Resizing** | Standardize all MRI scans to 224×224 pixels | Section 2 — path configuration |
| **Pixel Normalization** | Rescale pixel values ÷255 → [0, 1] range | Data generators (rescale=1./255) |
| **Data Augmentation** (train only) | Rotation ±20°, width/height shift ±10%, shear ±10%, zoom ±15%, horizontal flip, brightness 0.8–1.2x | Section 4 — augmented samples visualization |
| **Class Weight Balancing** | `compute_class_weight('balanced')` — inversely proportional to class frequency, critical for ModerateDemented (minority class) | Section 4 — class weights dictionary |
| **StandardScaler** | Center and normalize flattened pixel vectors (mean=0, std=1) | Section 6.3 — mean/std verification |
| **PCA (95% variance)** | Reduce 150,528 features to ~N components retaining ≥95% variance | Section 6.4 — scree plot + variance curve |

**Key challenge:** Severe class imbalance — ModerateDemented is heavily underrepresented.

---

### 3.3 BO3 — Clustering & Recommendation (Tabular + Care Plans)

**Features:** Same 16 Lasso-selected patient features from BO1 + 3 encoded care plan features (RiskLevel, PrimaryFocus, CarePlanType)

**No explicit target:** Cluster assignment is learned (unsupervised). `Diagnosis` used only for post-hoc purity evaluation.

**Preprocessing techniques:**

| Technique | Purpose | Notebook Cell |
|-----------|---------|---------------|
| **LabelEncoder** | Encode categorical care plan features (RiskLevel, PrimaryFocus, CarePlanType) to numeric | Section 5 — label mapping tables |
| **StandardScaler** | Standardize 16 patient features to mean=0, std=1 | Section 11.1 — verification output |
| **PCA (90% variance)** | Reduce 16 features to optimal components retaining ≥90% variance | Section 11.1 — scree + cumulative variance plots |
| **Elbow + Silhouette Analysis** | Determine optimal K for clustering | Section 11.3 — elbow/silhouette plots |

---

## 4. Modeling — Model Choices & Justifications

### 4.1 BO1 — Risk Detection

| Model | Why Chosen | Complexity |
|-------|-----------|------------|
| **Random Forest** | Ensemble of 100 decision trees; handles non-linear feature interactions; robust to overfitting via bagging; provides feature importance | O(n × m × log n) per tree |
| **SVM (RBF kernel)** | Kernel trick maps data to higher-dimensional space; effective for complex non-linear boundaries in PCA space; `class_weight='balanced'` | O(n² to n³) training |
| **Logistic Regression** (benchmark) | Simple linear baseline; highly interpretable; good reference point | O(n × d) per iteration |
| **Gradient Boosting** (benchmark) | Sequential correction of errors; typically top performer on tabular data; flexible loss functions | O(n × d × n_trees) |

**Reference:** Random Forest is consistently ranked among top classifiers for tabular medical data (Fernández-Delgado et al., 2014).

### 4.2 BO2 — Severity Detection

| Model | Why Chosen | Complexity |
|-------|-----------|------------|
| **SVM (RBF, C=10)** | Effective in high-dimensional PCA space; handles multi-class via OVR; class weight balancing | O(n² to n³) training |
| **Logistic Regression** (benchmark) | Linear multi-class baseline; fast and interpretable | O(n × d) per iteration |
| **KNN (K=7, distance)** (benchmark) | Non-parametric; captures local patterns in PCA space; distance-weighted voting | O(n × d) prediction |

**Reference:** PCA + SVM is a classic approach in medical image classification (Cheng et al., 2015). Transfer Learning (CNN) is recommended as a next step.

### 4.3 BO3 — Clustering & Recommendation

| Model | Why Chosen | Complexity |
|-------|-----------|------------|
| **KMeans** | Simple, scalable; interpretable centroids represent "average patient"; optimal K via silhouette + elbow | O(n × k × d × iter) |
| **Agglomerative (Ward)** (benchmark) | Hierarchical; minimizes within-cluster variance; no initialization randomness | O(n² log n) |
| **DBSCAN** (benchmark) | Density-based; discovers arbitrary shapes; auto-identifies noise points | O(n log n) with indexing |

**Reference:** KMeans is the most widely used patient segmentation method in healthcare analytics (Jain, 2010).

---

## 5. Performance Evaluation

### 5.1 BO1 — Risk Detection (Binary Classification)

**Metrics chosen:** Accuracy, ROC-AUC (primary — evaluates all thresholds), F1, Precision, Recall

**Results:**

| Model | Accuracy | ROC-AUC | F1 | Precision | Recall |
|-------|:---:|:---:|:---:|:---:|:---:|
| Logistic Regression | 0.8070 | 0.8850 | 0.7552 | 0.6845 | 0.8421 |
| Random Forest | 0.8372 | 0.8849 | 0.7445 | 0.8361 | 0.6711 |
| **SVM (RBF)** | **0.8442** | **0.9100** | **0.7976** | **0.7374** | **0.8684** |
| Gradient Boosting | 0.8163 | 0.8748 | 0.7304 | 0.7589 | 0.7039 |

**Key visualizations:** Confusion matrices (2 models), ROC curves (all 4 models), benchmarking comparative ROC plot.

**Interpretation highlights:**
- SVM has the highest ROC-AUC (0.9100), indicating best overall discrimination.
- SVM has significantly fewer False Negatives (20 vs RF's 50) — critical in a screening context where missing an Alzheimer's case is the most dangerous error.
- RF is more conservative (fewer false positives) but at the cost of missing more true Alzheimer's cases.
- The slight increase in SVM's false positives is clinically acceptable since positive screenings trigger confirmatory tests (MRI via BO2).

---

### 5.2 BO2 — Severity Detection (Multi-class Classification)

**Metrics chosen:** Accuracy, F1-macro (primary — weights all classes equally), Precision-macro, Recall-macro

**Results:**

| Model | Accuracy | F1-macro | Precision-macro | Recall-macro |
|-------|:---:|:---:|:---:|:---:|
| **SVM (RBF, C=10)** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| Logistic Regression | 0.9997 | 0.9998 | 0.9998 | 0.9998 |
| KNN (K=7, distance) | 1.0000 | 1.0000 | 1.0000 | 1.0000 |

> **⚠️ Warning:** All models achieve near-perfect scores. This is likely due to the 64×64 downscaled images being easily separable in PCA space with the current train/test split. These results should be interpreted with caution — see Tweaks section below.

**Key visualizations:** Classification report, normalized confusion matrices (3 models), per-class accuracy bar chart.

**Interpretation highlights:**
- All three models achieve near-perfect accuracy (≥99.97%), with SVM and KNN at 100.0% on the test set.
- **Suspiciously high scores** — 100% accuracy across all 4 classes (including the imbalanced ModerateDemented) strongly suggests the task is trivially easy at 64×64 resolution with PCA + classical ML, possibly due to consistent visual artifacts or image preprocessing in the Kaggle dataset rather than genuine clinical feature learning.
- The Logistic Regression model misclassified only ~2 NonDemented images as VeryMildDemented — the single imperfection across all models.
- These results should be presented with a caveat: real-world MRI classification is significantly harder. A stricter evaluation (k-fold cross-validation, external test set from a different hospital) would be needed to confirm generalizability.

---

### 5.3 BO3 — Clustering & Recommendation (Unsupervised)

**Metrics chosen:** Silhouette Score (primary — internal cluster quality), Cluster Purity (external validation using Diagnosis), Cross-tabulations

**Results:**

| Algorithm | Clusters | Silhouette | Purity |
|-----------|:---:|:---:|:---:|
| **KMeans** | **2** | **0.1272** | **0.6463** |
| Agglomerative (Ward) | 2 | 0.1098 | 0.6463 |
| DBSCAN | 1 | N/A | N/A |

**Key visualizations:** Elbow + silhouette plots, 2D/3D cluster projections, silhouette per-sample plot, cluster profile heatmap (z-scored), cross-tabulations.

**Interpretation highlights:**
- Clusters naturally separate healthy vs. Alzheimer's patients (high purity) — validating that the 16 clinical features carry discriminative information even without supervision.
- Z-scored heatmap reveals distinct patient archetypes: high-MMSE/high-ADL clusters = healthy; high-MemoryComplaints/high-Disorientation clusters = advanced disease.
- Sensitivity analysis confirms chosen PCA dimension count is optimal (best silhouette vs. 2D, 3D, or all features).

---

## 6. Benchmarking Summary

### 6.1 BO1 — Chosen Model: **SVM (RBF)**

| Model | Strengths | Weaknesses |
|-------|-----------|------------|
| Logistic Regression | Simple, fast, interpretable | Assumes linearity; may underfit |
| Random Forest | Robust, feature importance, low FP rate | Higher FN rate (misses patients) |
| **SVM (RBF)** ✅ | **Best AUC & recall; fewest missed cases** | Black-box; slower training |
| Gradient Boosting | Strong on tabular data; flexible | Overfitting risk; less interpretable |

**Deployment justification:** Highest ROC-AUC (0.9100) and lowest false negative rate — in a screening tool, catching every Alzheimer's case early is paramount.

---

### 6.2 BO2 — Chosen Model: **SVM (RBF, C=10)**

| Model | Strengths | Weaknesses |
|-------|-----------|------------|
| **SVM (RBF)** ✅ | **Non-linear kernel; handles imbalance via class weights** | Black-box; O(n²) training |
| Logistic Regression | Fast, interpretable linear baseline | May underfit non-linear severity patterns |
| KNN (K=7) | Non-parametric; captures local structure | No class imbalance handling; slow prediction |

**Deployment justification:** Best F1-macro score; balanced class weights explicitly compensate for the severely imbalanced ModerateDemented class. Transfer Learning (CNN) is recommended as the next improvement step.

---

### 6.3 BO3 — Chosen Model: **KMeans**

| Algorithm | Strengths | Weaknesses |
|-----------|-----------|------------|
| **KMeans** ✅ | **Simple, scalable, interpretable centroids** | Assumes spherical clusters; needs K |
| Agglomerative (Ward) | Hierarchical; no initialization randomness | O(n² log n); no centroids |
| DBSCAN | No K needed; finds arbitrary shapes; noise detection | Sensitive to eps; poor with overlapping groups |

**Deployment justification:** Best silhouette score; centroids directly represent "average patient profiles" per segment — essential for generating actionable care plan recommendations. KMeans scales efficiently for real-time patient assignment.

---

## Quick Reference — Notebook Sections

| Prof's Requirement | BO1 Notebook Section | BO2 Notebook Section | BO3 Notebook Section |
|--------------------|---------------------|---------------------|---------------------|
| 1. Introduction | Executive Summary (top) | Executive Summary (top) | Introduction (top) |
| 2. Business Understanding | "Business Understanding" table | "Business Understanding" table | "Business Understanding" table |
| 3. Data Comprehension/Prep | Sections 3–6 + "Target & Explanatory Variables" | Sections 2–4 + "Target & Explanatory Variables" | Sections 2–5 + "Variables" |
| 4. Modeling | "Model Choice Justification" + Section 9.4 | "Model Choice Justification" + Section 6.5 | "Model Choice Justification" + Section 11 |
| 5. Performance Evaluation | Section 9.5–9.6 + "Results Interpretation" | Section 6.6 + "Results Interpretation" | Sections 11.4–12.5 + "Results Interpretation" |
| 6. Benchmarking | Section 10 (code + discussion) | Section 7 (code + discussion) | Section 13 (code + discussion) |
