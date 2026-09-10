# Handwritten notes — PCA

Photos or scans of your handwritten notes for this topic go here.

Anything you drop in this folder (`.png`, `.jpg`) is picked up automatically
and shown as a gallery on the lesson page the next time you run:

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py
```

Name the files so they sort in reading order:
`PCA_01.png`, `PCA_02.png`, …

## Complete handwritten lesson

The five `PCA_*.png` pages form a story-led revision sequence:

1. Why dropping columns failed — overlapping signal, and the word "drop"
2. What a component is — a direction of largest spread, and the blend behind it
3. Scale first: variance has units, and insulin would win on units alone
4. Reading the scree and cumulative-variance curves — `PCA(0.90)` vs `n_components=6`
5. What PCA cannot do — it never sees `y`, and it does not reduce what you measure

Each page is a 1024 x 1536 portrait PNG. The examples follow Ritu's clinic
story and use the exact variance, loading and SVC results from the topic
notebooks.

The page spec is in
`17_Learning_As_Of_Now/shared/CODEX_HANDWRITTEN_NOTES_PROMPT.md`.
