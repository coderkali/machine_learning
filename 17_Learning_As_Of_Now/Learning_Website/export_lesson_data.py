"""Rebuild offline lesson assets with the repository's pizza_env Python.

Read saved notebook outputs without executing learner notebooks. Numeric data
are regenerated from their explicit seeds; unseeded fits are never presented as
the original run. Run from any directory; output stays beside this script.
"""
import base64
import json
from pathlib import Path

import numpy as np
import sklearn
from sklearn.cluster import DBSCAN
from sklearn.covariance import EllipticEnvelope
from sklearn.datasets import load_iris, make_blobs, make_regression
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / "02_data_toolkit_apps" / "08_sklearn"
ASSETS = HERE / "assets" / "notebook-plots"
ASSETS.mkdir(parents=True, exist_ok=True)


def array(values):
    return np.asarray(values).tolist()


def detector_case(model, x):
    labels = model.fit_predict(x)
    return {"labels": array(labels), "scores": array(-model.negative_outlier_factor_)}


def build():
    x, y = make_blobs(n_samples=500, centers=3, cluster_std=0.4, random_state=0)
    db_cases = {}
    for eps in [0.15, 0.3, 0.6]:
        db = DBSCAN(eps=eps, min_samples=10).fit(x)
        core = np.zeros(500, dtype=bool)
        core[db.core_sample_indices_] = True
        db_cases[str(eps)] = {"labels": array(db.labels_), "core": array(core)}
    iso = IsolationForest(random_state=0).fit(x)
    ellipse_x, ellipse_y = make_blobs(n_samples=2000, centers=2, cluster_std=0.9, random_state=0)
    ellipse = EllipticEnvelope(contamination=0.1, random_state=0).fit(ellipse_x)
    eigenvalues, eigenvectors = np.linalg.eigh(ellipse.covariance_)
    angles = np.linspace(0, 2 * np.pi, 181)
    circle = np.column_stack([np.cos(angles), np.sin(angles)])
    boundary = ellipse.location_ + (circle * np.sqrt(eigenvalues * -ellipse.offset_)) @ eigenvectors.T
    small = np.array([[1, 5], [1, 6], [1, 7], [2, 5], [2, 6], [6, 5], [9, 1]])
    lof_cases = {f"{dims}-{k}": detector_case(LocalOutlierFactor(n_neighbors=k), small[:, :dims])
                 for dims in [1, 2] for k in [2, 3, 6]}
    iris = load_iris()
    rx, ry = make_regression(n_features=1, noise=2, n_samples=10000, random_state=0)
    datasets = {
        "clouds": {"title": "Three clouds · all 500 rows", "columns": ["Feature 1", "Feature 2"],
                   "rows": array(x), "groups": array(y), "source": "21_Outliers.ipynb", "cell": 4,
                   "note": "Exact seeded make_blobs data. Source-cloud IDs are not anomaly labels."},
        "ellipse": {"title": "Two clouds · all 2,000 rows", "columns": ["Feature 1", "Feature 2"],
                    "rows": array(ellipse_x), "groups": array(ellipse_y), "source": "21_Outliers.ipynb", "cell": 16,
                    "note": "Exact seeded data. The ellipse is a separate reproducible fit with random_state=0; the original fit was unseeded."},
        "lof": {"title": "LOF · all seven requests", "columns": ["Feature 1", "Feature 2"],
                "rows": array(small), "source": "21_Outliers.ipynb", "cell": 46,
                "note": "Exact seven rows from the notebook. A–G correspond to row IDs 0–6."},
        "iris": {"title": "Ensembles · all 150 Iris flowers", "columns": list(iris.feature_names),
                 "rows": array(iris.data), "groups": array(iris.target), "source": "20_Ensemble_methods.ipynb", "cell": 2,
                 "note": "Bundled Iris data: 50 flowers per species. Notebook split: 105 training / 45 test, random_state=0."},
        "regression": {"title": "Forest regression · all 10,000 rows", "columns": ["Input x", "Target y"],
                       "rows": array(np.column_stack([rx[:, 0], ry])), "source": "20_Ensemble_methods.ipynb", "cell": 39,
                       "note": "Exact seeded make_regression data. Saved forest R² 0.9911716974 was measured on these same training rows."},
        "salary": {"title": "By hand · all five salary rows", "columns": ["Years", "Salary (thousands)"],
                   "rows": [[1, 30], [2, 35], [3, 50], [4, 55], [5, 60]],
                   "source": "05a_Coef_And_Intercept_By_Hand.ipynb", "cell": 2,
                   "note": "Exact hand-worked rows. Means (3, 46), numerator 80, denominator 10, slope 8, intercept 22."},
    }
    galleries = {}
    for name in ["05a_Coef_And_Intercept_By_Hand.ipynb", "20_Ensemble_methods.ipynb", "21_Outliers.ipynb"]:
        notebook = json.loads((SOURCE / name).read_text())
        plots = []
        for index, cell in enumerate(notebook["cells"]):
            for output_index, output in enumerate(cell.get("outputs", [])):
                encoded = output.get("data", {}).get("image/png")
                if not encoded:
                    continue
                filename = f"{name.split('_')[0]}-cell-{index}-{output_index}.png"
                (ASSETS / filename).write_bytes(base64.b64decode("".join(encoded)))
                plots.append({"src": f"assets/notebook-plots/{filename}", "cell": index,
                              "caption": f"{name} · saved cell {index} output"})
        galleries[name] = plots
    payload = {"generatedWith": {"sklearn": sklearn.__version__, "numpy": np.__version__},
               "datasets": datasets, "dbscan": db_cases,
               "isolation": {"raw": array(iso.score_samples(x)), "offset": iso.offset_, "labels": array(iso.predict(x))},
               "ellipse": {"scores": array(ellipse.score_samples(ellipse_x)), "offset": ellipse.offset_,
                           "labels": array(ellipse.predict(ellipse_x)), "boundary": array(boundary)},
               "lof": lof_cases, "galleries": galleries}
    (HERE / "lesson-data.js").write_text("// Generated by export_lesson_data.py; includes every row.\nwindow.LESSON_DATA = " + json.dumps(payload, separators=(",", ":")) + ";\n")
    assert [sum(np.array(db_cases[str(e)]["labels"]) == -1) for e in [.15, .3, .6]] == [256, 25, 0]
    assert sum(db_cases["0.3"]["core"]) == 415
    assert sum(ellipse.predict(ellipse_x) == -1) == 200
    assert np.allclose(lof_cases["2-3"]["scores"][-2:], [3.316, 4.139], atol=.001)
    print(f"Exported {sum(len(d['rows']) for d in datasets.values()):,} rows and {sum(map(len, galleries.values()))} saved charts.")


if __name__ == "__main__":
    build()
