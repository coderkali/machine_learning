# Episode 01 — Linear Discriminant Analysis ("Meera reads biopsy slides")
### v2 — rewritten to actually teach the mechanism with real numbers

Source of truth: `04_ML/36_Linear_Discriminant_Analysis/Concept/34_LDA_explained.ipynb`
(the notebook's own hand-computable 4-point toy example — every number below is
copied directly from its cells, not invented for the video.)

**Why v2 exists:** v1 animated dots moving around but never explained *how* LDA
finds its direction — no real numbers, no formula, no "here's the obvious wrong
guess and why it fails" beat. This version teaches the actual 4-step computation
with the notebook's real numbers, the way a KodeKloud or devoops explainer walks
through a real mechanism step by step instead of just showing a pretty result.

Toy data (from the notebook, cell 5): Class 1 = (2,3), (3,4). Class 2 = (6,7), (7,10).

## Shot-by-shot plan

| # | Time | Screen | Caption | Voiceover | Notes |
|---|------|--------|---------|-----------|-------|
| 1 | 0:00–0:07 | 4 toy points plotted, class 1 orange, class 2 teal | "30 numbers. One word: malignant, or benign." | "Meera reads biopsy slides. Every one comes back as thirty numbers — and she needs one word: malignant, or benign." | Open on the visual immediately |
| 2 | 0:07–0:16 | Dashed grey line drawn straight from class-1 centre toward class-2 centre, labeled "(4, 5)" | "The obvious guess: point straight at the other group." | "The obvious move is to point straight at the other group's average — the difference between the centres. Here that's (4, 5). It's often wrong." | Sets up the "everyone reaches for the wrong first move" beat, same shape as the reference reels |
| 3 | 0:16–0:28 | Points re-shown; X-marker centres animate in with coordinates | "Step 1 — find each group's centre." / shows "μ₁=(2.5, 3.5)" "μ₂=(6.5, 8.5)" | "Step one: average each class. Class one centres at two-point-five, three-point-five. Class two at six-point-five, eight-point-five." | Real numbers on screen, matches notebook cell 7 exactly |
| 4 | 0:28–0:40 | Tilted translucent ellipse over class 2 (visibly stretched diagonally) vs tighter circle over class 1 | "Step 2 — how much does each class lean?" | "Step two: measure how each class spreads around its own centre. Class two isn't round — it leans hard in one direction. LDA has to know that lean before it can pick a direction." | Visualizes S_w conceptually without requiring the viewer to read a matrix |
| 5 | 0:40–0:54 | Naive dashed grey line (4,5) fades down; yellow solid line w=(10,-3) draws in at a visibly different angle | "Step 3 — correct for the lean: w = (10, −3)" | "Step three: correct the naive guess for that lean. The real answer is ten, minus three — tilted away from the obvious guess, specifically to avoid running along class two's own stretch." | The contrast (grey naive line vs yellow correct line) is the "aha" |
| 6 | 0:54–1:08 | Every point drops a perpendicular line onto the yellow axis; z-values appear at each foot: 11, 18, 39, 40; class centres marked 14.5 and 39.5 with a visible gap | "Step 4 — project: z = 10x − 3y" | "Step four: project every point onto that line. Two numbers become one. Class one lands at eleven and eighteen. Class two lands at thirty-nine and forty. A clean gap, with nothing in between." | This is the payoff visual — now it's earned by the preceding steps, not the whole video |
| 7 | 1:08–1:18 | Two verification cards: "hand math ✓" / "569 real biopsies, sklearn ✓" | "Same math. Real data: 30 features, 569 samples." | "Check it against scikit-learn on the same toy points — same direction. Then scale it up: thirty real features, five hundred sixty-nine real biopsies. Same method." | |
| 8 | 1:18–1:28 | Takeaway text, two lines | "Don't chase the biggest spread. Chase the widest gap." | "Don't chase the direction with the most spread — that's a different technique, PCA, and it can pick the wrong axis entirely. Chase the direction with the widest gap between groups." | Names the common confusion (PCA vs LDA) explicitly, since that's the notebook's own framing |
| 9 | 1:28–1:34 | Brief outro tag | "Follow · one ML concept a day" | (no VO, or "More tomorrow.") | Short, as before |

**Target runtime: ~85–95 seconds.** Longer than v1 on purpose — the extra 30-40s
is the actual mechanism (steps 1-4 with real numbers), which is the part that
was missing.

## What changed from v1
- Added the "obvious wrong guess" beat (naive direction (4,5) vs corrected w=(10,-3)) — mirrors the "everyone tries X first, it's usually wrong" structure of both reference reels.
- Every number shown on screen is copied from the notebook's actual hand-computation (cells 5, 7, 9-10, 16-17, 20-22), not invented.
- Explicit PCA-vs-LDA contrast in the takeaway, since that's the notebook's own "why not PCA" section — gives the ending a real point instead of a generic platitude.
- Formula text on screen (`w = Sw⁻¹(μ₂ − μ₁)`, `z = 10x − 3y`) so the viewer sees actual notation, not just shapes moving.

## Voice
Switched to **Brian** ("Deep, Resonant and Comforting") per your pick — updated
in `.env` (`ELEVEN_VOICE_NAME`), which every episode reads from `style.py`.
