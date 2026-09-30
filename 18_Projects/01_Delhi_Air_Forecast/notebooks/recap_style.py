"""Shared look for the recap figures at the end of each DAF notebook. Drawing only, no project logic."""
import math
import textwrap
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from matplotlib.ticker import MaxNLocator

INK, MUTED, GRID = "#1f2937", "#6b7280", "#e5e7eb"
BAR, BASE_BAR, ACCENT, ALERT = "#9ca3af", "#4b5563", "#2563eb", "#c2410c"
CARD_EDGE, CARD_FILL, ACCENT_FILL, ALERT_FILL = "#d1d5db", "#f9fafb", "#eff6ff", "#fff7ed"

CARD_H, ROW_GAP, GAP_X = 21, 8, 2.6
FIG_W = 18


def find_project_root():
    here = Path.cwd().resolve()
    for candidate in (here, *here.parents):
        if (candidate / "data/interim/daily_17.csv").is_file():
            return candidate
        if (candidate / "18_Projects/01_Delhi_Air_Forecast/data/interim/daily_17.csv").is_file():
            return candidate / "18_Projects/01_Delhi_Air_Forecast"
    raise FileNotFoundError("Could not find the Delhi_Air_Forecast project from this working directory.")


def flow_size(n_cards, cols):
    """Height in inches that the card area needs, so text and boxes keep their proportions."""
    rows = math.ceil(n_cards / cols)
    y_units = rows * CARD_H + (rows - 1) * ROW_GAP + 2
    return y_units * (FIG_W * 0.92 / 100)


def header(fig, title, subtitle):
    height = fig.get_figheight()
    fig.text(0.05, 1 - 0.32 / height, title, fontsize=21, fontweight="bold", color=INK, va="center")
    fig.text(0.05, 1 - 0.74 / height, subtitle, fontsize=11.5, color=MUTED, va="center")


def top_margin(fig, inches=1.9):
    """Grid top edge that leaves room for header() plus the axes titles."""
    return 1 - inches / fig.get_figheight()


def _wrap(text, width):
    lines = []
    for paragraph in text.split("\n"):
        lines.extend(textwrap.wrap(paragraph, width) or [""])
    return "\n".join(lines)


def draw_cards(ax, cards, cols=4):
    """cards: dicts with badge, title, adds, numbers, verdict, kind ('normal', 'final' or 'problem')."""
    rows = math.ceil(len(cards) / cols)
    y_units = rows * CARD_H + (rows - 1) * ROW_GAP + 2
    card_w = (98 - GAP_X * (cols - 1)) / cols
    wrap_chars = int(card_w * 2.05)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, y_units)
    ax.axis("off")
    boxes = []
    for index, card in enumerate(cards):
        row, col = divmod(index, cols)
        x = 1 + col * (card_w + GAP_X)
        y = y_units - 1 - (row + 1) * CARD_H - row * ROW_GAP
        kind = card.get("kind", "normal")
        edge, fill, tone = {
            "final": (ACCENT, ACCENT_FILL, ACCENT),
            "problem": (ALERT, ALERT_FILL, ALERT),
        }.get(kind, (CARD_EDGE, CARD_FILL, BASE_BAR))
        ax.add_patch(
            FancyBboxPatch(
                (x, y), card_w, CARD_H, boxstyle="round,pad=0.0,rounding_size=1.2",
                facecolor=fill, edgecolor=edge, linewidth=2.0 if kind != "normal" else 1.2,
            )
        )
        ax.scatter([x + 2.6], [y + CARD_H - 2.9], s=520, color=tone, zorder=3)
        ax.text(x + 2.6, y + CARD_H - 2.9, card["badge"], ha="center", va="center", fontsize=11,
                fontweight="bold", color="white", zorder=4)
        ax.text(x + 5.2, y + CARD_H - 2.9, _wrap(card["title"], wrap_chars - 6), ha="left", va="center",
                fontsize=13, fontweight="bold", color=INK)
        ax.text(x + 1.6, y + CARD_H - 6.6, _wrap(card["adds"], wrap_chars), ha="left", va="top",
                fontsize=10.2, color=MUTED, linespacing=1.45)
        ax.text(x + 1.6, y + 6.9, _wrap(card["numbers"], wrap_chars), ha="left", va="center",
                fontsize=10, color=INK, linespacing=1.45)
        ax.text(x + 1.6, y + 2.3, _wrap(card["verdict"], wrap_chars), ha="left", va="center",
                fontsize=10.3, fontweight="bold", color=tone if kind != "normal" else INK)
        boxes.append((x, y))

    arrow = dict(arrowstyle="-|>", color=MUTED, lw=1.6, mutation_scale=16)
    for index in range(len(cards) - 1):
        row, col = divmod(index, cols)
        x, y = boxes[index]
        nx, ny = boxes[index + 1]
        if (index + 1) // cols == row:
            ax.annotate("", xy=(nx - 0.2, ny + CARD_H / 2), xytext=(x + card_w + 0.2, y + CARD_H / 2), arrowprops=arrow)
        else:
            mid_y = y - ROW_GAP / 2
            ax.plot([x + card_w / 2, x + card_w / 2, nx + card_w / 2], [y - 0.2, mid_y, mid_y], color=MUTED, lw=1.6,
                    solid_capstyle="butt")
            ax.annotate("", xy=(nx + card_w / 2, ny + CARD_H + 0.2), xytext=(nx + card_w / 2, mid_y), arrowprops=arrow)


def style_axis(ax, title, subtitle="", grid_axis="y"):
    ax.set_title(title, loc="left", fontsize=13, fontweight="bold", color=INK, pad=26 if subtitle else 10)
    if subtitle:
        ax.annotate(subtitle, xy=(0, 1), xycoords="axes fraction", xytext=(0, 7), textcoords="offset points",
                    fontsize=9.5, color=MUTED, va="bottom", ha="left")
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(GRID)
    ax.tick_params(length=0, labelsize=9, colors=MUTED)
    ax.tick_params(axis="x", colors=INK)
    if grid_axis:
        ax.grid(axis=grid_axis, color=GRID, linewidth=0.8)
    ax.set_axisbelow(True)


def label_bars(ax, bars, fmt="{:.0f}", pad=0.012, fontsize=9.5):
    top = ax.get_ylim()[1]
    for bar in bars:
        value = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2, value + top * pad, fmt.format(value), ha="center", va="bottom",
                fontsize=fontsize, color=INK)


def legend(ax, items, loc="upper right", ncol=1, anchor=None):
    """items: list of (label, color, kind) where kind is 'bar' or 'line'."""
    from matplotlib.lines import Line2D
    from matplotlib.patches import Patch

    handles = [
        Patch(facecolor=color, edgecolor="none", label=label) if kind == "bar"
        else Line2D([0], [0], color=color, lw=2.2, label=label)
        for label, color, kind in items
    ]
    ax.legend(handles=handles, loc=loc, ncol=ncol, frameon=False, fontsize=9, labelcolor=INK, bbox_to_anchor=anchor)


def whole_numbers(ax, axis="y"):
    (ax.yaxis if axis == "y" else ax.xaxis).set_major_locator(MaxNLocator(integer=True))
