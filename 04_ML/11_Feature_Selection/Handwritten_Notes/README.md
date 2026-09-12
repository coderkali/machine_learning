# Handwritten notes — Feature Selection

Scans and generated pages for this topic. Anything in this folder (`.png`,
`.jpg`) is shown as a gallery on the lesson page the next time you run:

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py
```

## Already here

`Feature_Selection_01.png` – `_03.png` and `Feature_Selection_Page_1of3.png` –
`_3of3.png` were made before Session 23.

## Session 23 — `44_Feature_Selection_Filter_Methods.ipynb`

Two validated handwritten pages, named `Feature_Selection_04.png` and
`Feature_Selection_05.png` (each exactly 1055 × 1491 px).
Follow Kavya's breast-cancer story and use only the numbers the notebook prints.

1. **Kavya's 30 columns, and the first two rules.** Why "keep the big numbers"
   fails (`mean area` ≈ 1001 against `mean smoothness` ≈ 0.12). Mutual
   information as "how much does this column tell me about cancer?": top three
   `worst perimeter` ≈ 0.47, `worst area` ≈ 0.46, `worst radius` ≈ 0.45; bottom
   `texture error` ≈ 0. Correlation: `mean radius` ↔ `mean perimeter` = 0.998
   (perimeter = 2πr), and the loop that marks the later column of any pair above
   0.9 — 10 columns to drop, 20 kept.
2. **Variance threshold, and the unit trap.** `x1 = 3 5 6 7 3 4 8 9 5 1` (mean
   5.1, variance 5.49) against `x2` = all 1s (variance 0). `VarianceThreshold(0.5)`
   kept 10 columns, all measured in big numbers (`worst area` 323 598 down to
   `perimeter error` 4.1), and dropped `mean concave points` (variance 0.0015,
   yet 4th on mutual information at ≈ 0.44). End with the three-rule summary —
   what each asks, which one uses `y` — and "split first".

The page spec is in
`17_Learning_As_Of_Now/shared/CODEX_HANDWRITTEN_NOTES_PROMPT.md`. Keep each page
readable in about a minute.
