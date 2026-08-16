# Seaborn

**Curriculum module:** M02 - Data Visualization with Python  
**Status:** 🟡 Learning

Seaborn is a statistical plotting layer built on top of Matplotlib. You hand it a
Pandas DataFrame and the *names* of columns; it does the grouping, runs the
statistics, picks the colours, builds the legend, and returns a Matplotlib
`Axes`. Matplotlib draws exactly the numbers you pass it — seaborn computes
first, then draws.

## Files

| File | Contents |
|---|---|
| [`example_01.ipynb`](./example_01.ipynb) | The full tour: relational, distribution, categorical, regression, grid, and styling plots. **All explanation lives in this notebook**, in the Markdown cells above each group of code cells. |

## The one pattern

```text
sns.<plot>(x=<column>, y=<column>, hue=<column>, data=<DataFrame>)
```

You name columns, not numbers. `hue` is a `GROUP BY` whose output channel is
colour. Learn that shape once and the plot name becomes the only thing that
changes.

## Covered so far

`lineplot`, `scatterplot`, the `hue` / `size` / `style` semantic channels,
`histplot` and `kdeplot`, `pairplot`, `violinplot`, `countplot`, `barplot`,
`boxplot`, `stripplot`, `swarmplot`, `regplot`, `FacetGrid` with `.map`,
`set_theme` styles, and `set_palette`. Also the seaborn 0.13 rules that changed:
`palette` now requires `hue`, and `dodge=False` is needed when `hue` merely
repeats `x`.

**Not covered yet:** the figure-level wrappers (`relplot`, `displot`, `catplot`,
`lmplot`), `heatmap` and correlation matrices, `jointplot`, building custom
palettes with `color_palette`, and saving figures to file. The instructor module
also includes Plotly, now started in [`06_plotly/`](../06_plotly/).

## Version note

Written against **seaborn 0.13.2**. Two behaviours changed in 0.13 and older
tutorials will mislead you:

| Rule | Consequence |
|---|---|
| `palette=` is ignored without `hue=` | a palette with no `hue` gives **one** colour, not many |
| `dodge="auto"` still splits when `hue` repeats `x` | bars land off-centre at a fraction of `width` unless you pass `dodge=False` |

Both are demonstrated with measured numbers in the notebook.

## Key takeaway

**If you remember only one thing:** seaborn plots *columns*, not numbers — and it
runs statistics on them before drawing. A bar is a mean, a shaded band is a
confidence interval, and `lineplot` aggregates rows that share an `x`. Know what
has been computed before you trust the picture.
