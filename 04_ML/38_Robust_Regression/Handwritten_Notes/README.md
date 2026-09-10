# Handwritten notes — Robust Regression

Photos or scans of your handwritten notes for this topic go here.

Anything you drop in this folder (`.png`, `.jpg`) is picked up automatically
and shown as a gallery on the lesson page the next time you run:

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py
```

Name the files so they sort in reading order:
`Robust_Regression_01.png`, `Robust_Regression_02.png`, …

Suggested page plan for a generated set:

1. Why least squares breaks — the square, and one row buying influence
2. Breakdown point, and the loss-shape comparison (squared / absolute / Huber)
3. RANSAC as a voting loop — sample, fit, count inliers, refit
4. Huber's epsilon, and Theil–Sen as the median of pair slopes
5. Which one to reach for, and the 50% limit

The page spec is in
`17_Learning_As_Of_Now/shared/CODEX_HANDWRITTEN_NOTES_PROMPT.md`.
