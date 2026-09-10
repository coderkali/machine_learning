# Handwritten notes — Logistic Regression

Photos or scans of your handwritten notes for this topic go here.

Anything you drop in this folder (`.png`, `.jpg`) is picked up automatically
and shown as a gallery on the lesson page the next time you run:

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py
```

Name the files so they sort in reading order:
`Logistic_Regression_01.png`, `Logistic_Regression_02.png`, …

## Complete handwritten lesson

The five `Logistic_Regression_*.png` pages form a story-led revision sequence:

1. Why a straight line cannot answer yes/no — 441 of 2 000 predictions outside 0–1
2. The sigmoid — `z` unbounded in, probability out, and `z = 0` as the boundary
3. Log loss against squared error — what each one charges for
4. Reading the weights — per-unit `w`, `exp(w)` as an odds multiplier, and `w × sd`
5. 95.95% of what — the 70/30 class split, the confusion matrix, and moving the threshold

Each page is a 1024 x 1536 portrait PNG. The examples follow Arjun's spam
filter story and use the exact scores, coefficients, confusion-matrix counts
and threshold results from the topic notebook.

The page spec is in
`17_Learning_As_Of_Now/shared/CODEX_HANDWRITTEN_NOTES_PROMPT.md`.
