# Plotly

**Curriculum module:** M02 - Data Visualization with Python  
**Status:** 🟡 Learning

Plotly builds charts as **JSON in Python** and lets a JavaScript library draw them in the
browser. Matplotlib and seaborn produce pixels; plotly produces a description. That one
difference gives you zoom, hover, clickable legends, and a draggable 3D camera for free —
and it is also why some work you expect Python to do actually happens in the browser.

## Files

| File | Contents |
|---|---|
| [`example_01.ipynb`](./example_01.ipynb) | The full tour: line, scatter, bar, box, violin, pie, area, 3D scatter, and sunburst. **All explanation lives in this notebook**, in the Markdown cells above each group of code cells. |
| [`concept_3d_projection.md`](./concept_3d_projection.md) | Deep dive: how `px.scatter_3d` turns three columns into one pixel — the model, view, and projection matrices worked with real `iris` numbers, and what the projection costs you. |

## The one pattern

```text
px.<chart>(dataframe, x="col", y="col", color="col", size="col")
```

Same shape as seaborn — you name columns, not numbers. The key mechanism:
**`color=` splits the data into separate traces**, and a trace is the unit plotly can
show or hide. That is what makes the legend clickable.

## The trap worth knowing before you start

**Plotly looks like seaborn and behaves like matplotlib.**

```text
sns.barplot(x="day", y="total_bill", data=tips)   ->  bar height = MEAN, plus a 95% CI
px.bar(tips, x="day", y="total_bill")             ->  bar height = SUM of stacked rows
```

Verified in the notebook: `px.bar` sends all **244 rows** to the browser and stacks them.
Seaborn sends 4 aggregated numbers. Plotly express does not compute statistics — shape the
data in pandas first, then plot it.

## Covered so far

`px.data` datasets, `px.line` with `markers` and `title`, `px.scatter` with `color` and
`size`, `px.bar` with `color` and `orientation`, `px.box`, `px.violin`, `px.pie` from
lists and from row counts, `px.area`, `px.scatter_3d`, and `px.sunburst` with `path`.
Also the mechanics behind them: trace splitting, `sizeref` area scaling, browser-side
quartiles, category ordering, and the 3D projection pipeline.

**Not covered yet:** `px.histogram` (the one `px` chart that *does* aggregate, via
`histfunc`), faceting with `facet_row` / `facet_col`, `hover_data`, `fig.update_layout`
and `update_traces`, colour scales and templates, `animation_frame`, saving with
`write_html` / `write_image`, and the `plotly.graph_objects` API that the notebook imports
but never uses.

## Common mistakes this notebook fixes

| Mistake | Correction |
|---|---|
| `px.data_tips()` | `px.data.tips()` — `data` is a submodule, so it is a dot |
| Reading a `px.bar` height as an average | it is a **sum** of one stacked rectangle per row |
| Expecting alphabetical categories | order is **first appearance in the DataFrame**; use `category_orders=` |
| `color="red"` | `color` takes a **column name**; use `color_discrete_sequence=["red"]` |
| Trusting distances in a 3D scatter | each axis is normalised by its own span, so the unit cancels |

## Key takeaway

**If you remember only one thing:** plotly describes a chart in Python and the browser
draws it — so you get interactivity for free, but you never get statistics for free.
