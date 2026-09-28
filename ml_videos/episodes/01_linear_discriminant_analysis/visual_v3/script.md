# Episode 01 — LDA, shown step by step (visual v3)

**Format:** 1080 × 1920, 30 fps, about 85 seconds  
**Visual engine:** Remotion + React/SVG  
**Narration:** existing Brian voice tracks, reused from the earlier episode  
**Source:** `04_ML/36_Linear_Discriminant_Analysis/Concept/34_LDA_explained.ipynb`

## Teaching sequence

1. **The problem:** Start with Meera's 30 feature measurements, then make the mechanism checkable with the notebook's two-feature, four-point toy example.
2. **The direct guess:** Draw the vector between class means, `(4, 5)`. It does separate these four points, so the video does not claim that it overlaps them. It fails to account for the classes' different spreads. Its Fisher score is `7.61`.
3. **Class centres:** Average each pair to get `μA = (2.5, 3.5)` and `μB = (6.5, 8.5)`.
4. **Within-class scatter:** Animate each point's deviation from its own centre. Class B's points differ by 1 across and 3 vertically. Show `S_w = [[1,2],[2,5]]`.
5. **Direction:** Rotate from the direct guess toward `w = S_w⁻¹(μB − μA) = (10, −3)`. Projected class spread contracts along the useful direction. The Fisher score reaches `25`.
6. **Projection:** Animate perpendicular drops to the axis, then move the values to a one-dimensional number line. Compute `z = 10x − 3y` for each point: `11, 18, 39, 40`.
7. **Scale:** Show the verified dataset shape, 569 samples by 30 features, becoming one score per sample for this two-class example. Feature blocks are marked as a shape illustration, not patient measurements.
8. **Takeaway:** Compare both directions after scaling them to equal total within-class scatter. The score ratio is `25 / 7.61 = 3.29`. PCA maximizes total variance; LDA uses class labels to maximize separation relative to within-class scatter.

## Accuracy note

The `(4, 5)` direction is not a failed classifier on the four toy points: it separates them. The lesson is that centre-to-centre distance alone ignores within-class scatter. LDA optimizes a ratio that accounts for both. The video keeps the existing narration but uses on-screen labels and the measured score to make this distinction clear.
