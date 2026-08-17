# Sales Analysis Project — Code Review and Walkthrough

> 🧪 **My Experiment** — learner-written Streamlit app, reviewed line by line.
>
> Source: [`sales_analysis.py`](./sales_analysis.py). The file is kept **exactly as
> written**. Every fix below is shown here as the smallest change; none of them has been
> applied to your file.

Verified against **Streamlit 1.61.1**, pandas 3.0.3, plotly 6.9.0, Python 3.14. Behaviour
claims come from running the app through `streamlit.testing.v1.AppTest`, not from reading
it.

---

## 1. What the app does

A synthetic sales dashboard. You set four bounds in the sidebar, click a button, and the
app invents twelve months of data and describes it six ways.

```text
   SIDEBAR                    BUTTON            BODY
   -------                    ------            ----
   Minimum Sales    5000  \                  /  DataFrame (12 x 6)
   Maximum Sales   20000   \   Generate     /   Basic calculations
   Minimum Profit   1000   /   Dataset     /    Summary statistics
   Maximum Profit   7000  /       |       /     4 matplotlib figures
                                  |             1 plotly figure
                                  v
                          np.random.randint  ->  df
```

### The data flow

```text
   min/max inputs
        |
        v
   np.random.seed(10)                 <- fixes the sequence
        |
        v
   np.random.randint(low, high+1, 12) <- 4 columns x 12 months
        |
        v
   df["Profit_Margin"] = Profit / Sales * 100   <- derived column
        |
        +--> st.dataframe        raw table
        +--> st.write            mean, sum, describe()
        +--> ax.hist x2          distribution of Sales, of Profit
        +--> ax.plot             monthly trend
        +--> sns.heatmap         correlation matrix
        +--> px.line             interactive Sales + Profit
```

**What is good here, genuinely:** the structure is clean, every widget has an explicit
`key`, the `else` branch handles the empty state, `high + 1` correctly compensates for
`randint` being exclusive at the top, and `select_dtypes(include=np.number)` correctly
keeps the `Month` string column out of the correlation. Those are not beginner instincts.

---

## 2. Verified run — what actually happens

| Step | Result |
|---|---|
| First load | `st.info` message only. 0 dataframes, 0 subheaders. Correct. |
| Click **Generate Dataset** | 7 subheaders, 2 dataframes, 5 figures, no exceptions. Correct. |
| Then change **Minimum Sales** | **The whole dashboard disappears.** Back to 0 dataframes and the info message. |
| Set **Minimum Sales** to 25000 | **App crashes** with `StreamlitValueBelowMinError`. |

The first two rows are your app working. The last two are the two bugs.

---

## 3. Issue 1 — the dashboard vanishes (the button re-run trap)

### What happens

```text
   click "Generate Dataset"
        -> re-run: button returns True   -> dashboard renders

   change "Minimum Sales"
        -> re-run: button returns FALSE  -> else branch -> everything gone
```

Verified: after clicking Generate and then changing one number input, the app drops from
7 subheaders and 2 dataframes back to `['Select inputs from the sidebar and click
Generate Dataset']`.

### Why

This is the re-run model from the [README](./README.md) biting for real:

> **`st.button` returns `True` for exactly one re-run — the one caused by the click.**
> On every later re-run it returns `False` again.

A button is not a switch. It does not stay pressed. It is a one-shot signal, and
`if generate_data:` gates your entire dashboard on that one-shot.

For a Spring engineer: the button is not a stateful toggle in a session, it is a single
`POST` that you have not persisted anywhere. The next request knows nothing about it.

### The smallest fix

Latch the click into session state, which is the only thing that survives a re-run:

```python
generate_data = st.sidebar.button(
    "Generate Dataset",
    key="generate_sales_data")

# --- add these two lines ---
if generate_data:
    st.session_state.show_dashboard = True

if st.session_state.get("show_dashboard"):   # <- was: if generate_data:
```

Everything below stays exactly as you wrote it. One flag, one changed condition.

> 💡 **Engineering Extension** — *Recommended Extension - Not part of instructor curriculum.*
>
> There are three standard shapes for this, and it is worth knowing which one you want:
>
> | Shape | Behaviour | Use when |
> |---|---|---|
> | `st.session_state` latch (above) | dashboard stays; **data regenerates on every widget change** | you want live updating |
> | `st.form` + `st.form_submit_button` | nothing re-runs until Submit is pressed | inputs are expensive or must be applied together |
> | move generation into `@st.cache_data` | dashboard stays; data only changes when inputs change | the generation step is slow |
>
> Your app is a good candidate for `st.form`, because the four inputs are meant to be set
> together and only then applied.

---

## 4. Issue 2 — raising Minimum Sales crashes the app

### What happens

Set **Minimum Sales** to `25000` and the app dies:

```text
streamlit.errors.StreamlitValueBelowMinError:
    The `value` 20000 is less than the `min_value` 25000.
    at sales_analysis.py line 20, in number_input("Maximum Sales", ...)
```

### Why

Look at the coupling you created:

```python
max_sales = st.sidebar.number_input(
    "Maximum Sales",
    min_value=min_sales,     # <-- follows the other widget
    value=20000,             # <-- but this is a FIXED literal
    key="max_sales")
```

The intent is right — max should never fall below min. But the two arguments disagree the
moment `min_sales` climbs past `20000`:

```text
   min_sales = 5000    ->  min_value=5000,  stored value 20000   OK
   min_sales = 25000   ->  min_value=25000, stored value 20000   CONTRADICTION -> raise
```

`value=` is only the *initial* value, used on the first run. After that the widget's
value lives in `st.session_state["max_sales"]`. Streamlit re-validates it against
`min_value` on every re-run, and refuses to silently move a value the user chose.

### The smallest fix

Clamp the stored value up to the new floor before the widget is created:

```python
# --- add above the max_sales widget ---
if st.session_state.get("max_sales", 20000) < min_sales:
    st.session_state.max_sales = min_sales

max_sales = st.sidebar.number_input(
    "Maximum Sales",
    min_value=min_sales,
    value=20000,
    key="max_sales")
```

The same contradiction exists between `min_profit` and `max_profit` — it just needs a
larger number to trigger. Fix both or neither.

> **Alternative worth knowing:** one `st.slider` with a tuple gives you a range that
> cannot invert, and removes the whole class of bug:
> ```python
> min_sales, max_sales = st.sidebar.slider(
>     "Sales range", 1000, 50000, (5000, 20000))
> ```

---

## 5. Issue 3 — a deprecated argument that is already past its removal date

```python
st.plotly_chart(fig, use_container_width=True)
```

Running the app prints:

```text
Please replace `use_container_width` with `width`.
`use_container_width` will be removed after 2025-12-31.
```

**Fix:**

```python
st.plotly_chart(fig, width="stretch")
```

Same change as in [`app.py`](./app.py). Worth grepping for whenever you upgrade Streamlit.

---

## 6. Design observations — not bugs, but worth deciding on

### 6.1 "Generate Dataset" does not generate a new dataset

```python
np.random.seed(10)
```

The seed is reset inside the `if`, so **every click produces byte-identical data**. Jan is
always `6289` in sales.

That is a legitimate choice — reproducibility is why seeds exist, and it makes the app
easy to teach from. But the button says *Generate*, which promises new numbers. Pick one:

| You want | Do this |
|---|---|
| the same data every time (reproducible) | keep the seed, rename the button "Build Dashboard" |
| new data on every click | delete the `np.random.seed(10)` line |
| reproducible but controllable | add a seed input: `np.random.seed(st.sidebar.number_input("Seed", value=10))` |

### 6.2 The correlation heatmap has a built-in artifact

`Profit_Margin` is computed *from* `Sales` and `Profit`, then correlated *against* them.
The verified matrix at default settings:

```text
                 Sales  Profit  Orders  Customers  Profit_Margin
   Sales         1.000   0.247  -0.030      0.186     -0.597
   Profit        0.247   1.000   0.426     -0.020      0.586
   Profit_Margin -0.597   0.586   0.470     -0.006      1.000
                 ^^^^^^  ^^^^^
                 these two are guaranteed by the formula, not discovered
```

`Profit_Margin = Profit / Sales`, so of course it rises with Profit and falls with Sales.
Those two cells carry no information — they are arithmetic showing up as a finding.

This matters far beyond this app. Feeding a derived column and its own inputs into a
correlation matrix (or a model) is how people convince themselves they have found a
strong signal. **Correlate inputs with inputs; keep derived columns out, or drop their
parents.**

The other numbers *are* real, and they show the data is pure noise: Sales↔Profit is
`0.247`, Orders↔Customers `0.568` — random columns, so any structure is accidental. Fine
for a layout exercise, but there is nothing to analyse here. A real next step would be
replacing `randint` with data that has a relationship you can then go and detect.

### 6.3 Matplotlib figures are never closed

Each click builds 4 figures via `plt.subplots()` and never closes them. Matplotlib warns
after 20 open figures — so **on the 5th click** you get a `RuntimeWarning` in the logs,
and memory grows all session.

```python
st.pyplot(fig)
plt.close(fig)     # <- one line after each st.pyplot
```

### 6.4 The metrics could use `st.metric`

```python
st.write("Average Sales")
st.write(round(df["Sales"].mean(), 2))
```

Works, but produces two stacked blocks per number and eight in total. `st.metric` in
columns is one line each and reads as a dashboard:

```python
c1, c2, c3, c4 = st.columns(4)
c1.metric("Average Sales", f"{df['Sales'].mean():,.2f}")
c2.metric("Average Profit", f"{df['Profit'].mean():,.2f}")
c3.metric("Total Sales", f"{df['Sales'].sum():,}")
c4.metric("Total Profit", f"{df['Profit'].sum():,}")
```

### 6.5 Three plotting libraries in one app

You used matplotlib, seaborn, **and** plotly here. For learning, that is a good deliberate
comparison — you can see the same data through all three in one screen. For a real app,
pick one: plotly, since Streamlit renders it interactively and it is the only one of the
three the user can hover and zoom.

---

## 7. Fix priority

| # | Issue | Severity | Fix size |
|---|---|---|---|
| 1 | Dashboard vanishes on any widget change | **breaks the app for users** | 3 lines |
| 2 | `StreamlitValueBelowMinError` on high Minimum Sales | **crashes** | 2 lines |
| 3 | `use_container_width` past removal date | breaks on upgrade | 1 word |
| 4 | Figures never closed | slow leak, warning at 5 clicks | 1 line x4 |
| 5 | Seed makes "Generate" a misnomer | confusing, not broken | 1 line |
| 6 | Derived column in the correlation matrix | misleading analysis | 1 line |

Issues 1 and 2 are the ones a user would hit in the first thirty seconds.

---

## 8. What this app demonstrates you can already do

- Sidebar inputs with explicit `key`s, and coupled bounds (`min_value=min_sales`) — the
  right instinct, executed one step short
- Conditional rendering with a sensible empty state
- Building a DataFrame from NumPy and adding a derived column
- Four different chart types across three libraries, each wired into Streamlit correctly
  (`st.pyplot` for matplotlib/seaborn, `st.plotly_chart` for plotly)
- `select_dtypes(include=np.number)` before `.corr()` — a real correctness detail that
  beginners usually miss

The gap is not layout or syntax. It is **the re-run model**: what a widget returns, when
it returns it, and what survives to the next run. Both real bugs come from that single
idea, which is why it is worth fixing them yourself rather than reading a patched file.

---

## 9. Try it in this order

1. Reproduce issue 1: click Generate, then change any sidebar number. Watch the dashboard
   disappear. Sit with *why* before fixing it.
2. Apply the session-state latch. Confirm the dashboard now survives.
3. Reproduce issue 2: set Minimum Sales to 25000. Read the traceback — it names the exact
   line and both conflicting numbers.
4. Fix it, then decide whether a range slider would have been the better design.
5. Rebuild the four `st.write` pairs as `st.metric` in columns.
6. Replace the four numeric columns with data that has a real relationship (for example,
   `Profit = Sales * margin + noise`), then see whether the heatmap finds it.

**If you remember only one thing:** `st.button` is true for exactly one re-run. Anything
you want to keep on screen after that has to live in `st.session_state`.
