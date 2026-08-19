# NumPy

**Curriculum module:** M03 - Python for Data Science (NumPy and Pandas)
**Status:** 🟡 Learning

NumPy gives Python a real array type. A Python list holds pointers to boxed objects
scattered across memory; a NumPy array holds **one type, packed into one block**. That
layout is why arithmetic on a million values is one expression instead of a loop, and it
is the foundation every other library here sits on — Pandas, Matplotlib, scikit-learn,
and PyTorch all pass NumPy arrays around underneath.

## Files

| File | Contents |
|---|---|
| [`example_01.ipynb`](./example_01.ipynb) | **Making and reading arrays.** Lists vs arrays, `ndim`, `dtype`, indexing, slicing, looping, `np.where`, sorting, insert/delete, `np.flip`, in-place edits, append. |
| [`example_02.ipynb`](./example_02.ipynb) | **Computing with arrays.** `shape`/`reshape`, element-wise maths, boolean masks, broadcasting, array builders, `arange`/`linspace`, random generators, statistics, `np.info`, dot product, matrix multiplication, `argsort`/`searchsorted`, stack/split, and `np.linalg`. |
| [`project_01_api_health.ipynb`](./project_01_api_health.ipynb) | 🧪 **In progress — Parts 1-2 of 12.** OrderHub API Health Monitor: pure NumPy analysis of a 6-service x 7-day latency and error matrix. Loading and inspection are done; data quality is done through median + MAD outlier detection. **Not complete — do not treat it as finished evidence.** |

Explanation lives **inside the notebooks**, in the Markdown cells above each group of
code cells. This README is the map, not the lesson.

## The two ideas that carry everything

**1. Vectorization — the expression replaces the loop.**

```text
   Python list                        NumPy array
   -----------                        -----------
   out = []
   for i in range(len(a)):            out = a + b
       out.append(a[i] + b[i])
```

The loop still runs, but in compiled C over packed memory instead of in the Python
interpreter. Same reason one batch query beats 10,000 single-row fetches.

**2. Shape is everything.**

```text
   (m, k) @ (k, n)  ->  (m, n)        the inner numbers must match
   (3, 1) +  (2,)   ->  (3, 2)        broadcasting stretches size-1 dimensions
```

Most NumPy bugs are shape bugs, not logic bugs. When something breaks, print `.shape`
before you print the values.

## The five gotchas the notebooks verify

| Gotcha | The correction |
|---|---|
| `a * b` looks like matrix multiplication | It is **element-wise**. The matrix product is `a @ b`. |
| `np.arange(0.1, 0.4, 0.1)` should give 3 values | It gives **4**. Floating point. Use `linspace` when the count matters. |
| NumPy and Pandas report different standard deviations | `np.std` is population (`ddof=0`); Pandas is sample (`ddof=1`). |
| `np.where(...)` looks like an array | It is a **tuple** of arrays — take `[0]` for a 1-D input. |
| `np.linalg.eig` eigenvectors read as rows | They are **columns**: `vecs[:, i]` pairs with `vals[i]`. |

## Covered so far

Array creation from lists, tuples, and nested lists; `ndim`, `shape`, `size`, `dtype`,
`itemsize`; `reshape` and views; indexing, slicing, and fancy indexing; boolean masks and
filtering; element-wise arithmetic and comparison; broadcasting; `zeros`, `ones`, `full`,
`eye`, `arange`, `linspace`; `randint`, `rand`, `randn`, `choice`, and seeding;
`sum`/`min`/`max`/`mean`/`median`/`std`/`var`; `np.info` and memory layout; `dot`,
`matmul`, and `@`; `sort`, `argsort`, `where`, `searchsorted`; `vstack`, `hstack`,
`split`, `array_split`; `np.linalg.inv`, `det`, and `eig`. The project adds `np.isnan`,
`nanmean`, copy-vs-view, z-score failure modes, and median + MAD outlier detection on a
2-D dataset.

**Not covered yet:** `axis` applied consistently across 2-D arrays, `np.concatenate` and
`np.stack`, `np.newaxis`, `np.unique`, `np.clip`, cumulative functions (`cumsum`,
`cumprod`), structured arrays, and `np.save`/`np.load`. Parts 3-12 of the API health
project cover several of these on real data.

## Version note

Written and verified against **numpy 2.4.6** on Python 3.14 (`pizza_env`).

## Key takeaway

**If you remember only one thing:** NumPy replaces loops with expressions over whole
arrays, and the price of that power is that **shape is everything**. Learn to read
`(m, k) @ (k, n) -> (m, n)` and to reach for `.shape` the moment an error appears.
