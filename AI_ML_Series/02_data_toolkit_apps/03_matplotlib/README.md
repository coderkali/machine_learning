# Matplotlib

**Curriculum module:** M02 - Data Visualization with Python  
**Status:** 🟡 Learning

Matplotlib is Python's base plotting library. It turns arrays and lists into
figures — lines, scatters, bars, histograms, pies — and writes them to a
notebook or to an image file. Seaborn and Pandas' own `.plot()` are built on
top of it.

## Files

| File | Contents |
|---|---|
| [`example_01.ipynb`](./example_01.ipynb) | Chart-type fundamentals: line, scatter, bar, histogram, pie, fill, annotations, subplots, and saving to file. **All explanation lives in this notebook**, in the Markdown cells above each group of code cells. |
| [`chart.png`](./chart.png) | Output written by the notebook's last cell via `plt.savefig` |

## Covered so far

Line plots and format strings, marker and line-style keywords, titles and axis
labels, grid, subplots, scatter with colormaps and bubble sizes, bar and barh,
histograms, pie charts with labels and explode, annotations with arrows,
`fill_between`, and `savefig`.

**Not covered yet:** legends, `autopct` on pie charts, the object-oriented
`fig, ax = plt.subplots()` style, and plotting directly from a Pandas
DataFrame. The instructor module also includes Seaborn and Plotly — add those
folders when those lessons begin.
