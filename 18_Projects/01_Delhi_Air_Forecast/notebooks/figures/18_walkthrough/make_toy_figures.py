"""Draws the toy pictures at the end of 18_visual_walkthrough.ipynb.

Everything here uses a MADE-UP town of 22 days. No project data is read.
Run from the project root:  .venv/bin/python notebooks/figures/18_walkthrough/make_toy_figures.py
"""
import sys
import tempfile
from pathlib import Path

import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.patches import FancyBboxPatch, Rectangle
from sklearn.linear_model import Ridge

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1]))
from recap_style import (ACCENT, ACCENT_FILL, ALERT, ALERT_FILL, BAR, CARD_EDGE, CARD_FILL, GRID, INK,  # noqa: E402
                         MUTED, style_axis)

OUT = HERE / "toy"
OUT.mkdir(exist_ok=True)
POOR = 91
GREY = BAR

# ---------------------------------------------------------------------------
# The toy data: one PM2.5 reading per day for 22 days.
# Row d uses reading d as "today" and reading d+1 as "tomorrow" (the answer).
# ---------------------------------------------------------------------------
READINGS = [115, 103, 113, 71, 69, 83, 87, 108, 120, 110, 68,
            85, 93, 89, 116, 123, 109, 91, 73, 85, 64, 104]
df = pd.DataFrame({"day": range(1, 22), "today": READINGS[:-1], "tomorrow": READINGS[1:]})
study = df[df.day <= 14]
test = df[df.day >= 15].copy()

# Step 1: rebuild the model from the signed recipe, fit on study days only.
model = Ridge(alpha=1.0).fit(study[["today"]], study["tomorrow"])
slope, intercept = model.coef_[0], model.intercept_
fingerprint = int(study["tomorrow"].sum())

# Step 3: open the envelope ONCE.
test["persistence"] = test["today"]
test["ridge"] = model.predict(test[["today"]]).round(1)
test["err_p"] = (test["persistence"] - test["tomorrow"]).abs()
test["err_r"] = (test["ridge"] - test["tomorrow"]).abs().round(1)
mae_p, mae_r = test["err_p"].mean(), test["err_r"].mean()
improve = (mae_p - mae_r) / mae_p

poor_days = test[test["tomorrow"] >= POOR]
caught_p = int((poor_days["persistence"] >= POOR).sum())
caught_r = int((poor_days["ridge"] >= POOR).sum())

# Step 4: second opinion, walk-forward on the study days only.
FOLDS = [(7, 10), (10, 14)]
walk = []
for train_end, check_end in FOLDS:
    fit_rows = df[df.day <= train_end]
    check_rows = df[(df.day > train_end) & (df.day <= check_end)]
    fold_model = Ridge(alpha=1.0).fit(fit_rows[["today"]], fit_rows["tomorrow"])
    walk.append({
        "train_end": train_end, "check_end": check_end,
        "mae_p": (check_rows["today"] - check_rows["tomorrow"]).abs().mean(),
        "mae_r": (fold_model.predict(check_rows[["today"]]) - check_rows["tomorrow"]).abs().mean(),
    })

# Step 6: worst days.
worst = test.sort_values("err_r", ascending=False)

# Step 7: save, forget, load again.
with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "pm25_toy_v1.joblib"
    joblib.dump({"model": model, "features": ["today"], "train_days": "1-14"}, path)
    before = float(model.predict(test[["today"]].iloc[[0]])[0])
    loaded = joblib.load(path)
    after = float(loaded["model"].predict(test[["today"]].iloc[[0]])[0])


def save(fig, name):
    fig.savefig(OUT / name, dpi=130, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def box(ax, x, y, w, h, text, edge=CARD_EDGE, fill=CARD_FILL, size=11, weight="normal", color=INK):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=1.2",
                                facecolor=fill, edgecolor=edge, linewidth=1.6))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=size, fontweight=weight,
            color=color, linespacing=1.5)


def arrow(ax, x1, y1, x2, y2):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.6, mutation_scale=16))


# ---------------------------------------------------------------------------
# T0 The plan: the whole ticket in nine boxes
# ---------------------------------------------------------------------------
def t0_plan():
    fig, ax = plt.subplots(figsize=(14, 7.6))
    ax.set_xlim(0, 100), ax.set_ylim(0, 62), ax.axis("off")
    ax.text(0, 61, "The whole of DAF-18 in nine boxes", fontsize=18, fontweight="bold", color=INK, va="top")
    ax.text(0, 57.5, "Only box 3 touches the sealed days, and only once. Every box after it just reads box 3's numbers.",
            fontsize=11, color=MUTED, va="top")
    steps = [
        ("1", "Rebuild", "cook the model again\nfrom the signed recipe"),
        ("2", "Pass marks", "write the rules\nBEFORE the test"),
        ("3", "Open envelope", "score model and\nold method, ONCE"),
        ("4", "Second opinion", "do the monthly\ntests agree?"),
        ("5", "Verdict", "met or not met,\nsaid honestly"),
        ("6", "Worst days", "where did it\nlose marks?"),
        ("7", "Save + reload", "same answer after\nloading the file?"),
        ("8", "Model card", "one page: when to\ntrust, when not"),
        ("9", "Log", "one row in\nexperiments.csv"),
    ]
    w, gap, h = 17.6, 2.9, 19
    for i, (n, title, sub) in enumerate(steps):
        row, col = divmod(i, 5)
        x, y0 = col * (w + gap), 30 - row * 27
        hot = n == "3"
        edge, fill = (ALERT, ALERT_FILL) if hot else (CARD_EDGE, CARD_FILL)
        ax.add_patch(FancyBboxPatch((x, y0), w, h, boxstyle="round,pad=0,rounding_size=1.2",
                                    facecolor=fill, edgecolor=edge, linewidth=2 if hot else 1.2))
        ax.scatter([x + w / 2], [y0 + 15.5], s=480, color=ALERT if hot else ACCENT, zorder=3)
        ax.text(x + w / 2, y0 + 15.5, n, ha="center", va="center", color="white", fontweight="bold", fontsize=11, zorder=4)
        ax.text(x + w / 2, y0 + 10.5, title, ha="center", va="center", fontsize=12, fontweight="bold", color=INK)
        ax.text(x + w / 2, y0 + 4.5, sub, ha="center", va="center", fontsize=10, color=MUTED, linespacing=1.4)
        if i < len(steps) - 1 and col < 4:
            arrow(ax, x + w + 0.1, y0 + h / 2, x + w + gap - 0.1, y0 + h / 2)
    last_x = 4 * (w + gap) + w / 2
    ax.plot([last_x, last_x, w / 2], [30, 26.5, 26.5], color=MUTED, lw=1.6)
    arrow(ax, w / 2, 26.5, w / 2, 22.2)
    ax.text(2 * (w + gap) + w / 2, 51, "touches the sealed days", ha="center", fontsize=9.5, color=ALERT,
            fontweight="bold")
    save(fig, "toy_00_plan.png")


# ---------------------------------------------------------------------------
# T1 The data: study days and sealed days
# ---------------------------------------------------------------------------
def t1_data():
    fig, ax = plt.subplots(figsize=(13, 5))
    days = list(range(1, 23))
    ax.axvspan(0.5, 15.5, color=GRID, alpha=0.45, lw=0)
    ax.add_patch(Rectangle((15.6, 52), 6.8, 75, fill=False, edgecolor=ALERT, lw=1.8, ls="--"))
    ax.plot(days, READINGS, color=INK, lw=1.4, zorder=2)
    ax.scatter(days[:15], READINGS[:15], color=GREY, s=42, zorder=3, edgecolor="white")
    ax.scatter(days[15:], READINGS[15:], color=ALERT, s=42, zorder=3, edgecolor="white")
    ax.axhline(POOR, color=ALERT, lw=1, ls=":")
    ax.text(22.6, POOR, " 91 = Poor", color=ALERT, fontsize=9.5, va="center")
    ax.text(8, 133, "STUDY: rows 1-14\nthe model may learn from these", ha="center", fontsize=11, color=INK,
            fontweight="bold")
    ax.text(19, 133, "SEALED ENVELOPE\nthe answers of rows 15-21", ha="center", fontsize=11, color=ALERT,
            fontweight="bold")
    ax.text(14.7, 118, "row 15 clue", ha="right", va="bottom", fontsize=9.5, color=MUTED)
    ax.text(16.3, 123, "row 15 answer\n(sealed)", ha="left", va="center", fontsize=9.5, color=ALERT)
    ax.set_xlim(0.5, 24.5), ax.set_ylim(50, 142), ax.set_xticks(days)
    ax.set_xlabel("day", color=MUTED)
    ax.set_ylabel("PM2.5 reading at 5 pm", color=MUTED)
    style_axis(ax, "Toy town: 22 days of made-up PM2.5",
               "Row d = one question: the clue is day d's reading, the answer is day d+1's reading.")
    save(fig, "toy_01_data.png")


# ---------------------------------------------------------------------------
# T2 Pass marks written first
# ---------------------------------------------------------------------------
def t2_pass_marks():
    fig, ax = plt.subplots(figsize=(12, 4.6))
    ax.set_xlim(0, 100), ax.set_ylim(0, 44), ax.axis("off")
    ax.text(0, 43, "Step 2 - Write the pass marks BEFORE opening the envelope", fontsize=16, fontweight="bold",
            color=INK, va="top")
    ax.text(0, 38.5, "Like the principal writing the pass marks on the blackboard before the paper is given out.",
            fontsize=11, color=MUTED, va="top")
    rules = [
        ("Rule 1  -  average mistake (MAE)",
         "Ridge's average mistake must be at least\n10% SMALLER than the old method's."),
        ("Rule 2  -  catching Poor days",
         "Of the days that really were Poor (91+),\nRidge must catch AT LEAST as many as the old method."),
    ]
    for i, (title, text) in enumerate(rules):
        y = 20 - i * 17
        box(ax, 0, y, 62, 14, "", fill=CARD_FILL)
        ax.text(2, y + 10.5, title, fontsize=12, fontweight="bold", color=INK, va="center")
        ax.text(2, y + 5, text, fontsize=10.5, color=MUTED, va="center", linespacing=1.4)
        box(ax, 66, y + 2, 14, 10, "?", fill="white", size=22, weight="bold", color=MUTED)
        ax.text(81.5, y + 7, "result goes here\nafter step 3", fontsize=9.5, color=MUTED, va="center")
    save(fig, "toy_02_pass_marks.png")


# ---------------------------------------------------------------------------
# T3 What each method believes (fit on study days)
# ---------------------------------------------------------------------------
def t3_learn():
    fig, ax = plt.subplots(figsize=(10, 7))
    xs = pd.Series([60, 125])
    ax.plot(xs, xs, color=GREY, lw=2.4, label="old method (persistence): tomorrow = today")
    ax.plot(xs, slope * xs + intercept, color=ACCENT, lw=2.4,
            label=f"Ridge learnt: tomorrow = {slope:.2f} x today + {intercept:.0f}")
    ax.scatter(study["today"], study["tomorrow"], s=70, color=INK, zorder=3, edgecolor="white",
               label="the 14 study days (real)")
    for _, r in study.iterrows():
        ax.text(r.today + 0.9, r.tomorrow + 0.9, str(int(r.day)), fontsize=8, color=MUTED)
    ax.annotate("high today  ->  Ridge says\n'tomorrow will be a bit lower'",
                xy=(120, slope * 120 + intercept), xytext=(95, 77), fontsize=10, color=ACCENT,
                arrowprops=dict(arrowstyle="-|>", color=ACCENT, lw=1.2))
    ax.annotate("low today  ->  Ridge says\n'tomorrow will be a bit higher'",
                xy=(68, slope * 68 + intercept), xytext=(60, 112), fontsize=10, color=ACCENT,
                arrowprops=dict(arrowstyle="-|>", color=ACCENT, lw=1.2))
    ax.set_xlim(58, 128), ax.set_ylim(58, 128)
    ax.set_xlabel("today's reading (the clue)", color=MUTED)
    ax.set_ylabel("tomorrow's reading (the answer)", color=MUTED)
    ax.legend(loc="upper left", frameon=False, fontsize=9.5, labelcolor=INK)
    style_axis(ax, "Step 1 - What each method believes",
               "Ridge is fitted on the 14 study days only. The sealed days are not in this picture.", grid_axis="both")
    save(fig, "toy_03_learn.png")


# ---------------------------------------------------------------------------
# T4 Open the envelope once
# ---------------------------------------------------------------------------
def t4_envelope():
    fig, (ax, bx) = plt.subplots(1, 2, figsize=(14, 5.8), gridspec_kw={"width_ratios": [3, 1.1], "wspace": 0.25})
    d = test["day"].values
    for i, r in enumerate(test.itertuples()):
        ax.plot([r.day - 0.12] * 2, [r.tomorrow, r.persistence], color=GREY, lw=1.4)
        ax.plot([r.day + 0.12] * 2, [r.tomorrow, r.ridge], color=ACCENT, lw=1.4)
        ax.text(r.day - 0.18, (r.tomorrow + r.persistence) / 2, f"{r.err_p:.0f}", ha="right", va="center",
                fontsize=8.5, color=MUTED)
        ax.text(r.day + 0.18, (r.tomorrow + r.ridge) / 2, f"{r.err_r:.0f}", ha="left", va="center",
                fontsize=8.5, color=ACCENT)
    ax.scatter(d - 0.12, test["persistence"], marker="s", s=60, color=GREY, zorder=3, label="old method says")
    ax.scatter(d + 0.12, test["ridge"], s=60, color=ACCENT, zorder=3, label="Ridge says")
    ax.scatter(d, test["tomorrow"], marker="_", s=900, lw=2.6, color=INK, zorder=4, label="what really happened")
    ax.axhline(POOR, color=ALERT, lw=1, ls=":")
    ax.text(21.45, POOR, " 91 Poor", color=ALERT, fontsize=9, va="center")
    ax.set_xticks(d), ax.set_xticklabels([f"row {x}" for x in d])
    ax.set_xlim(14.5, 22.0), ax.set_ylim(55, 136)
    ax.set_ylabel("tomorrow's PM2.5", color=MUTED)
    ax.legend(loc="upper left", frameon=False, fontsize=9.5, labelcolor=INK, ncol=3)
    style_axis(ax, "Step 3 - The envelope is opened once: 7 sealed days",
               "Each line is a mistake: the gap between what was said and what really happened.")

    bars = bx.bar(["old method", "Ridge"], [mae_p, mae_r], color=[GREY, ACCENT], width=0.6)
    for b, v in zip(bars, [mae_p, mae_r]):
        bx.text(b.get_x() + b.get_width() / 2, v + 0.4, f"{v:.1f}", ha="center", fontsize=12, fontweight="bold",
                color=INK)
    bx.set_ylim(0, mae_p * 1.25)
    style_axis(bx, "Average mistake (MAE)", "add the 7 gaps, divide by 7. Smaller is better")
    save(fig, "toy_04_open_envelope.png")


# ---------------------------------------------------------------------------
# T5 Second opinion: walk-forward on study days
# ---------------------------------------------------------------------------
def t5_second_opinion():
    fig, (ax, bx) = plt.subplots(1, 2, figsize=(14, 4.8), gridspec_kw={"width_ratios": [2.2, 1], "wspace": 0.22})
    rows = [("fold 1", 7, 10), ("fold 2", 10, 14), ("main test", 14, 21)]
    for i, (name, a, b) in enumerate(rows):
        y = 2 - i
        for day in range(1, 22):
            if day <= a:
                color, alpha = GREY, 0.55
            elif day <= b:
                color, alpha = (ALERT if name == "main test" else ACCENT), 0.9
            else:
                color, alpha = GRID, 0.4
            ax.add_patch(Rectangle((day - 0.45, y - 0.32), 0.9, 0.64, color=color, alpha=alpha, lw=0))
        ax.text(0.2, y, name, ha="right", va="center", fontsize=10.5, fontweight="bold", color=INK)
    ax.set_xlim(-2.6, 21.8), ax.set_ylim(-0.7, 2.9)
    ax.set_xticks(range(1, 22)), ax.set_yticks([])
    ax.text(1, 2.62, "grey = learn from", fontsize=9.5, color=MUTED)
    ax.text(6.2, 2.62, "blue = small check (still study rows)", fontsize=9.5, color=ACCENT)
    ax.text(15.6, 2.62, "red = sealed days", fontsize=9.5, color=ALERT)
    style_axis(ax, "Step 4 - Second opinion: small exams inside the study days", "Always learn from the past, check on the next few days.", grid_axis=None)
    ax.set_xlabel("row", color=MUTED)

    labels = ["fold 1\nrows 8-10", "fold 2\nrows 11-14", "main test\nrows 15-21"]
    p = [w["mae_p"] for w in walk] + [mae_p]
    r = [w["mae_r"] for w in walk] + [mae_r]
    x = range(3)
    bp = bx.bar([i - 0.18 for i in x], p, width=0.36, color=GREY, label="old method")
    br = bx.bar([i + 0.18 for i in x], r, width=0.36, color=ACCENT, label="Ridge")
    for bars in (bp, br):
        for b in bars:
            bx.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.4, f"{b.get_height():.1f}", ha="center",
                    fontsize=9, color=INK)
    bx.set_xticks(list(x)), bx.set_xticklabels(labels, fontsize=9)
    bx.set_ylim(0, max(p) * 1.3)
    bx.legend(frameon=False, fontsize=9, labelcolor=INK, loc="upper right")
    style_axis(bx, "Average mistake in each exam", "Ridge is lower in all three -> the win is not luck")
    save(fig, "toy_05_second_opinion.png")


# ---------------------------------------------------------------------------
# T6 Verdict
# ---------------------------------------------------------------------------
def t6_verdict():
    fig, (ax, bx) = plt.subplots(1, 2, figsize=(14, 4.8), gridspec_kw={"width_ratios": [1, 1.25], "wspace": 0.3})
    ax.barh(["needed", "Ridge got"], [10, improve * 100], color=[GRID, ACCENT], height=0.4)
    ax.axvline(10, color=ALERT, lw=1.4, ls="--")
    ax.text(10.4, 0.5, "pass mark 10%", color=ALERT, fontsize=9.5, va="center")
    ax.text(improve * 100 + 0.6, 1, f"{improve * 100:.0f}%   " + ("MET" if improve >= 0.10 else "NOT MET"),
            va="center", fontsize=13, fontweight="bold", color=ACCENT)
    ax.set_xlim(0, 36)
    style_axis(ax, "Rule 1 - MAE at least 10% smaller",
               f"({mae_p:.1f} - {mae_r:.1f}) / {mae_p:.1f} = {improve * 100:.0f}% smaller mistake", grid_axis="x")

    bx.set_xlim(0, 10), bx.set_ylim(0, len(poor_days) + 1.6), bx.axis("off")
    bx.text(0, len(poor_days) + 1.25, "Rule 2 - catch at least as many Poor days", fontsize=13, fontweight="bold",
            color=INK)
    bx.text(0, len(poor_days) + 0.75, "these days really were Poor (91+). Did each method say 91+?", fontsize=9.5,
            color=MUTED)
    bx.text(3.6, len(poor_days) + 0.2, "old method", ha="center", fontsize=10, fontweight="bold", color=MUTED)
    bx.text(6.6, len(poor_days) + 0.2, "Ridge", ha="center", fontsize=10, fontweight="bold", color=ACCENT)
    for i, r in enumerate(poor_days.itertuples()):
        y = len(poor_days) - 0.5 - i
        bx.text(0, y, f"row {r.day}  real {r.tomorrow}", va="center", fontsize=10, color=INK)
        for xpos, said in ((3.6, r.persistence), (6.6, r.ridge)):
            ok = said >= POOR
            bx.text(xpos, y, f"{said:.0f}  {'caught' if ok else 'missed'}", ha="center", va="center", fontsize=10,
                    color=INK if ok else ALERT, fontweight="bold" if not ok else "normal")
    bx.text(3.6, -0.15, f"{caught_p} of {len(poor_days)}", ha="center", fontsize=12, fontweight="bold", color=INK)
    bx.text(6.6, -0.15, f"{caught_r} of {len(poor_days)}", ha="center", fontsize=12, fontweight="bold", color=ACCENT)
    bx.text(8.3, -0.15, "MET" if caught_r >= caught_p else "NOT MET", fontsize=12, fontweight="bold", color=ACCENT)

    met = improve >= 0.10 and caught_r >= caught_p
    fig.suptitle(f"Step 5 - Verdict: both rules {'MET' if met else 'not both met'}  ->  "
                 f"{'Ridge is worth keeping' if met else 'keep the old method'}",
                 x=0.06, ha="left", y=1.09, fontsize=16, fontweight="bold", color=INK)
    save(fig, "toy_06_verdict.png")


# ---------------------------------------------------------------------------
# T7 Worst days
# ---------------------------------------------------------------------------
REASONS = {
    20: "sudden clean-up: the air fell from 85 to 64 overnight",
    15: "smog stayed high (116 -> 123), but Ridge pulls guesses to the middle",
}


def t7_worst():
    fig, ax = plt.subplots(figsize=(13, 4.8))
    order = worst.iloc[::-1]
    colors = [ALERT if d in REASONS else GREY for d in order["day"]]
    ax.barh([f"row {d}" for d in order["day"]], order["err_r"], color=colors, height=0.6)
    for i, r in enumerate(order.itertuples()):
        ax.text(r.err_r + 0.4, i, f"{r.err_r:.0f}", va="center", fontsize=10, color=INK)
        if r.day in REASONS:
            ax.text(r.err_r + 3, i, REASONS[r.day], va="center", fontsize=10, color=ALERT)
    ax.set_xlim(0, 60)
    ax.set_xlabel("Ridge's mistake that day (µg/m³)", color=MUTED)
    style_axis(ax, "Step 6 - Where did Ridge lose the most marks?",
               "Sorted biggest first. The reasons are patterns, and patterns go into the model card.",
               grid_axis="x")
    save(fig, "toy_07_worst_days.png")


# ---------------------------------------------------------------------------
# T8 Save and reload
# ---------------------------------------------------------------------------
def t8_save():
    fig, ax = plt.subplots(figsize=(13, 4.2))
    ax.set_xlim(0, 100), ax.set_ylim(0, 34), ax.axis("off")
    ax.text(0, 33, "Step 7 - Save it, forget everything, load it again", fontsize=16, fontweight="bold", color=INK,
            va="top")
    ax.text(0, 29, "The live service (DAF-19/20) will only have the file. So the file must give the same answer.",
            fontsize=11, color=MUTED, va="top")
    box(ax, 0, 3, 27, 20, f"BEFORE saving\n\nrow 15, today = {test.today.iloc[0]}\nRidge says {before:.1f}")
    box(ax, 36, 3, 27, 20,
        f"pm25_toy_v1.joblib\n\nslope {slope:.2f}, start {intercept:.1f}\nfeature: today\ntrain rows: 1-14",
        edge=ACCENT, fill=ACCENT_FILL)
    box(ax, 72, 3, 27, 20, f"NEW session, file loaded\n\nrow 15, today = {test.today.iloc[0]}\nRidge says {after:.1f}")
    arrow(ax, 27.3, 13, 35.7, 13)
    arrow(ax, 63.3, 13, 71.7, 13)
    ax.text(31.5, 15, "dump", ha="center", fontsize=9.5, color=MUTED)
    ax.text(67.5, 15, "load", ha="center", fontsize=9.5, color=MUTED)
    same = abs(before - after) < 1e-9
    ax.text(85.5, 0.2, "same answer -> OK" if same else "DIFFERENT -> broken", ha="center", fontsize=11,
            fontweight="bold", color=ACCENT if same else ALERT)
    save(fig, "toy_08_save_reload.png")


# ---------------------------------------------------------------------------
# T9 Model card
# ---------------------------------------------------------------------------
def t9_card():
    fig, ax = plt.subplots(figsize=(12, 7.4))
    ax.set_xlim(0, 100), ax.set_ylim(0, 58), ax.axis("off")
    ax.text(0, 57.5, "Step 8 - The model card (the paper inside the medicine box)", fontsize=16, fontweight="bold",
            color=INK, va="top")
    facts = [
        ("What it is for", "Guess tomorrow's PM2.5 at 6 pm, so the\nschool can decide on outdoor assembly."),
        ("Data", "Toy town, one sensor.\nLearnt from rows 1-14, tested on rows 15-21."),
        ("Feature", "today's 5 pm reading.\nRule: 0.30 x today + 65."),
        ("Marks on sealed days",
         f"MAE {mae_r:.1f} vs old method {mae_p:.1f} ({improve * 100:.0f}% better).\n"
         f"Caught {caught_r} of {len(poor_days)} Poor days (old: {caught_p})."),
    ]
    for i, (t, body) in enumerate(facts):
        col, row = i % 2, i // 2
        x, y = col * 50.5, 40 - row * 15
        box(ax, x, y, 49, 13, "", edge=ACCENT, fill=ACCENT_FILL)
        ax.text(x + 2, y + 10, t, fontsize=11.5, fontweight="bold", color=ACCENT, va="center")
        ax.text(x + 2, y + 4.5, body, fontsize=10, color=INK, va="center", linespacing=1.4)
    warns = [
        ("Known failure cases", "Sudden swings: drop on row 20, jump on row 21.\n"
                                "Long smog spells: it pulls guesses to the middle.\n"
                                f"Missed {len(poor_days) - caught_r} Poor day: row 21, real 104, said 85."),
        ("Do NOT use for", "Other sensors or other towns.\nReadings far outside 68-120, which it\nnever saw while learning."),
    ]
    for i, (t, body) in enumerate(warns):
        x = i * 50.5
        box(ax, x, 1, 49, 21, "", edge=ALERT, fill=ALERT_FILL)
        ax.text(x + 2, 18.5, t, fontsize=11.5, fontweight="bold", color=ALERT, va="center")
        ax.text(x + 2, 9.5, body, fontsize=10, color=INK, va="center", linespacing=1.5)
    save(fig, "toy_09_model_card.png")


if __name__ == "__main__":
    t0_plan(); t1_data(); t2_pass_marks(); t3_learn(); t4_envelope(); t5_second_opinion()
    t6_verdict(); t7_worst(); t8_save(); t9_card()
    print(f"slope={slope:.3f} intercept={intercept:.2f} fingerprint={fingerprint}")
    print(test.to_string(index=False))
    print(f"MAE persistence={mae_p:.2f} ridge={mae_r:.2f} improve={improve:.3f}")
    print(f"poor days={list(poor_days.day)} caught persistence={caught_p} ridge={caught_r}")
    print("walk", walk)
    print("reload", before, after)
