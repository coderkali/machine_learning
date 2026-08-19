# Pandas

**Curriculum module:** M03 - Python for Data Science (NumPy and Pandas)
**Status:** 🟡 Learning

Pandas puts **labels** on NumPy. A NumPy array is one typed block addressed by position;
a DataFrame is a set of named columns, each with its own dtype, addressed by label *or*
position. That is the whole difference, and almost every Pandas surprise traces back to
it.

If you know SQL, you already know most of this library: `df[df.Age > 25]` is `WHERE`,
`groupby` is `GROUP BY`, `merge` is `JOIN`, and the index is a primary key.

## Files

| File | Contents |
|---|---|
| [`example_01.ipynb`](./example_01.ipynb) | **The shapes and first operations.** Series, DataFrame, reading a real file, `rename` and the `inplace` trap, selecting columns and rows, filtering, missing values, dropping columns, `concat`, and `merge`. |
| [`example_02.ipynb`](./example_02.ipynb) | **The working toolkit.** Attribute vs method, file I/O in all three formats, `info`/`describe`, `loc` vs `iloc` with a changed index, `query`, duplicates, `astype`, `replace`, `get_dummies`, `sort_values`/`rank`, `groupby`, `pivot_table`, `.dt`, and `.str`. |
| [`DataSet/`](./DataSet/) | 13 small CSVs used by the notebooks and available for practice — salary, income, exam, encoding, PCA, and others. |
| `data.csv` | Generated output, written by `example_02`'s `to_csv` cell. Not source data. |

Explanation lives **inside the notebooks**, in the Markdown cells above each group of
code cells. This README is the map, not the lesson.

## The two ideas that carry everything

**1. A DataFrame is a dictionary of columns, not a grid of cells.**

Each column is a Series with its own dtype. That is why `df['Age']` is the natural move,
why one column can be `int64` next to a text column, and why a single *row* comes back
with `dtype: object` — a row mixes types, a column does not.

**2. The index is labels, not row numbers.**

```text
   position:   0     1     2       <- iloc uses these, always 0,1,2...
   label:    101   102   103       <- loc uses these, and they are yours to change
```

They start identical, so nothing goes wrong until you filter, sort, or set an index —
and then `df.loc[0]` raises `KeyError: 1`-style errors that look like missing rows but
mean "no such label". `example_02` section 8 demonstrates this deliberately.

## The five gotchas the notebooks verify

| Gotcha | The correction |
|---|---|
| `df.shape` vs `df.head()` | No parentheses = a **fact** about the frame. Parentheses = an **action**. `<bound method ...>` in your output means you forgot the `()`. |
| `df.fillna(0)` did nothing | Almost every method returns a **copy**. `fillna`, `rename`, `sort_values`, `drop_duplicates`, `replace` — assign the result back. |
| `KeyError: 1` after filtering | `loc` is labels, `iloc` is positions. Filtering keeps the original labels; use `reset_index(drop=True)` for fresh numbering. |
| An int column printed as `1.0` | One missing value promotes the whole column to `float64`, because `NaN` is a float. |
| A junk `Unnamed: 0` column | `to_csv` writes the index by default. Pass `index=False` unless the index is real data. |

## Covered so far

Series and DataFrame construction; attributes vs methods; `read_csv`/`read_excel`/
`read_json` and their `to_*` counterparts; `info`, `shape`, `describe`, `dtypes`;
`loc`, `iloc`, and index reassignment; boolean masks and `query`; `isnull`, `notnull`,
`fillna`, `dropna`; `duplicated` and `drop_duplicates`; `rename`, `astype`, `replace`;
`get_dummies`; `sort_values` and `rank`; `groupby` with `sum`/`mean`; `pivot_table`;
`to_datetime` with the `.dt` accessor; and the `.str` accessor. `example_01` adds
`concat` and `merge`.

**Not covered yet:** `apply` and `map`, `value_counts` and `nunique`, multi-column
`groupby`, `agg` with several functions, `MultiIndex`, `resample` and time-series
indexing, `crosstab`, `cut` for binning, `pipe`, chained-assignment warnings, and reading
from a database. Most of these want a real dataset — [`DataSet/`](./DataSet/) has 13.

## Known issues in `example_02`

Two cells do not run, both left in place on purpose because the errors are worth more
explained than deleted:

1. The `read_csv` cell runs **before** the `to_csv` cell that creates the file, so it
   raises `FileNotFoundError`. Move it below, or create the file first.
2. `to_excel` needs `openpyxl` (`pip install openpyxl`, then restart the kernel). The cell
   raises before `to_json` on the next line, so that file is never written — but
   `data.csv` on the line above **was** already written. A failed cell does not undo its
   side effects.

Tracked in [`docs/review-queue.md`](../../../docs/review-queue.md).

## Version note

Written and verified against **pandas 3.0.3** and numpy 2.4.6 on Python 3.14
(`pizza_env`). Pandas 3.0 introduced a real string dtype, so `info()` shows **`str`**
where older tutorials show **`object`**. Both are correct; the library moved.

## Key takeaway

**If you remember only one thing:** a DataFrame is **labelled columns**, and nearly every
method hands you a **copy**. Assign the result back, and never assume the index is still
`0, 1, 2`.
