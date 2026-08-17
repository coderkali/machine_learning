"""Tips Explorer — a first Streamlit app.

Phase 02 · M04 Streamlit. Built on the plotly `tips` dataset so the charts carry
straight over from 06_plotly.

Run it locally:
    streamlit run AI_ML_Series/02_data_toolkit_apps/07_streamlit/app.py

The script runs TOP TO BOTTOM on every interaction. There is no callback and no
event loop to reason about — a widget just returns its current value, and
Streamlit re-runs the file to redraw. Read it in that order.
"""

import plotly.express as px
import streamlit as st

# --------------------------------------------------------------------------
# 1. Page config — must be the first Streamlit call in the script
# --------------------------------------------------------------------------
st.set_page_config(page_title="Tips Explorer", page_icon="🍽️", layout="wide")


# --------------------------------------------------------------------------
# 2. Data — @st.cache_data stops the reload on every re-run
# --------------------------------------------------------------------------
@st.cache_data
def load_tips():
    """Return the 244-row tips frame. Cached, so this body runs once."""
    return px.data.tips()


tips = load_tips()

# --------------------------------------------------------------------------
# 3. Header
# --------------------------------------------------------------------------
st.title("🍽️ Tips Explorer")
st.caption("Phase 02 · M04 Streamlit — a first app over the plotly `tips` dataset")

# --------------------------------------------------------------------------
# 4. Sidebar — the input widgets
#    Each widget RETURNS its current value. That value is all you need.
# --------------------------------------------------------------------------
st.sidebar.header("Filters")

all_days = list(tips["day"].unique())
chosen_days = st.sidebar.multiselect("Day", options=all_days, default=all_days)

min_bill, max_bill = st.sidebar.slider(
    "Total bill range ($)",
    min_value=float(tips["total_bill"].min()),
    max_value=float(tips["total_bill"].max()),
    value=(float(tips["total_bill"].min()), float(tips["total_bill"].max())),
)

smokers_only = st.sidebar.checkbox("Smoking tables only", value=False)

color_by = st.sidebar.selectbox("Colour the chart by", ["sex", "smoker", "time", "day"])

# --------------------------------------------------------------------------
# 5. Filtering — plain pandas. Streamlit adds no query language of its own.
# --------------------------------------------------------------------------
view = tips[
    tips["day"].isin(chosen_days)
    & tips["total_bill"].between(min_bill, max_bill)
]
if smokers_only:
    view = view[view["smoker"] == "Yes"]

if view.empty:
    st.warning("No rows match these filters. Widen the range in the sidebar.")
    st.stop()  # ends the re-run here; nothing below is drawn

# --------------------------------------------------------------------------
# 6. Metrics row — st.columns splits the width into side-by-side containers
# --------------------------------------------------------------------------
left, middle, right = st.columns(3)
left.metric("Bills", f"{len(view):,}")
middle.metric("Total billed", f"${view['total_bill'].sum():,.2f}")
right.metric("Average tip", f"{(view['tip'] / view['total_bill']).mean():.1%}")

# --------------------------------------------------------------------------
# 7. Tabs — one visible at a time, but ALL of them are computed every re-run
# --------------------------------------------------------------------------
chart_tab, table_tab = st.tabs(["Chart", "Data"])

with chart_tab:
    fig = px.scatter(
        view,
        x="total_bill",
        y="tip",
        color=color_by,
        size="size",
        hover_data=["day", "time"],
        title=f"Tip vs total bill, coloured by {color_by}",
    )
    # width="stretch" makes the plotly figure follow the container width.
    # (The older use_container_width=True is deprecated as of Streamlit 1.61.)
    st.plotly_chart(fig, width="stretch")

    # Bar chart of MEAN bill per day — aggregate in pandas first.
    # px.bar would otherwise stack one rectangle per row and show a sum.
    by_day = view.groupby("day", as_index=False)["total_bill"].mean()
    st.plotly_chart(
        px.bar(by_day, x="day", y="total_bill", title="Average bill per day"),
        width="stretch",
    )

with table_tab:
    st.dataframe(view, width="stretch")
    st.download_button(
        "Download this view as CSV",
        data=view.to_csv(index=False).encode("utf-8"),
        file_name="tips_filtered.csv",
        mime="text/csv",
    )

# --------------------------------------------------------------------------
# 8. Session state — the one thing that SURVIVES a re-run
#    Everything else is rebuilt from scratch each time.
# --------------------------------------------------------------------------
st.divider()
if "clicks" not in st.session_state:
    st.session_state.clicks = 0
if st.button("Click me"):
    st.session_state.clicks += 1
st.write(f"Button clicked **{st.session_state.clicks}** times this session.")
