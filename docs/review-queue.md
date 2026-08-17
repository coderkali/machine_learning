# Review Queue

This queue contains only topics that need a real correction, fresh practice,
or a reproducibility check. Use only these review states:

- 🟢 **Strong** — independently reimplemented and verified
- 🟡 **Review Later** — understood before, but should be refreshed
- 🔴 **Needs Practice** — incomplete, incorrect, or not yet demonstrated

When an item is fixed and verified, remove its row. This is a working queue,
not a completion history; completed fix items are not kept here as green rows.

| Topic | Status | Why it is here | Remove when |
|---|---|---|---|
| Linear algebra self-explanation | 🔴 Needs Practice | The [linear algebra notes](../Foundations_Archive/math_for_ml/phase_3_linear_algebra/linear_algebra_notes.md) cover the concepts, but all nine personal memory-hook prompts are still blank | Explain vector, matrix, shape, dot product, matrix multiplication, and transpose from memory, then complete a small executed NumPy example |
| Paired vs. independent T-test | 🔴 Needs Practice | The [paired T-test notebook](../Foundations_Archive/DataScience_Y/14_Hypothesis_Testing_T-Test_Paired.ipynb) first calculates an independent-groups standard error before later using the correct paired-difference formula and `ttest_rel` | Explain why matched rows require differences, use the paired formula consistently, and verify the result with SciPy |
| Leakage-safe preprocessing | 🔴 Needs Practice | The [employee attrition project](../Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb) transforms the full dataset before any train/test split and does not use `Pipeline` or `ColumnTransformer` | Split first, fit every learned preprocessing step on training data only, transform test data without refitting, and evaluate one model |
| Practical RMSE | 🔴 Needs Practice | The [MAE/MSE/RMSE practical notebook](../Foundations_Archive/ML/33_Cost_Functions_MAE_MSE_RMSE_Practical.ipynb) currently implements MSE and gradient descent but not MAE/RMSE side by side as its title promises | Implement all three from scratch on the same predictions and cross-check their values with scikit-learn |
| NumPy minimum check | 🔴 Needs Practice | In the [pizza NumPy notebook](../Foundations_Archive/irisData_Exploration/numpy/pizza_numpy.ipynb), the line labeled `Worst Day` calls `np.max` instead of `np.min` | Correct the call, re-run the notebook, and verify the saved output shows the true minimum |
| Streamlit re-run model | 🔴 Needs Practice | The learner-written [Sales Analysis app](../AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis.py) has two verified defects that both trace to one gap: `st.button` returns `True` for only one re-run, so the dashboard disappears on any later widget change; and a `min_value`/`value` contradiction crashes with `StreamlitValueBelowMinError`. Both are diagnosed in [the review](../AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis_explained.md), neither is fixed in the file | Fix both bugs by hand, then explain from memory what `st.button` returns on each re-run and what `st.session_state` is for |
| Archived path reproducibility | 🟡 Review Later | Some archived files use stale absolute paths, such as [Pandas/example_01.py](../Foundations_Archive/Pandas/example_01.py), while pizza plotting notebooks load a CSV that now lives in a sibling folder | Replace stale paths with repository-relative paths and complete one clean run from a documented working directory |
