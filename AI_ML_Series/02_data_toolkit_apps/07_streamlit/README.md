# Streamlit

**Curriculum module:** M04 - Streamlit  
**Status:** 🟡 Learning

Streamlit turns a plain Python script into a web app. There is no HTML, no CSS, no
JavaScript, no route table, and no front-end build. You write top-to-bottom Python;
Streamlit renders it in a browser and re-runs it whenever the user touches something.

## Files

| File | Contents |
|---|---|
| [`sales_analysis.py`](./sales_analysis.py) | 🧪 **My app.** Sales Analysis Project — sidebar bounds, a generated dataset, summary statistics, and charts across matplotlib, seaborn, and plotly. |
| [`sales_analysis_explained.md`](./sales_analysis_explained.md) | Line-by-line review of that app: data flow, two verified bugs with minimal fixes, and design observations. |
| [`app.py`](./app.py) | Tips Explorer — reference app. Sidebar filters, metrics, tabs, plotly charts, a data table, a CSV download, and session state. Explanation lives in the comments, section by section. |
| [`requirements.txt`](./requirements.txt) | Dependency manifest. Exists because Streamlit Community Cloud needs it to build the app. |

## Run it locally

```bash
streamlit run AI_ML_Series/02_data_toolkit_apps/07_streamlit/app.py
```

It opens on `http://localhost:8501`. Edit `app.py`, save, and the browser offers to
re-run — that loop is the whole development experience.

## The mental model — the one thing to get right

**The entire script re-runs, top to bottom, on every interaction.**

```text
   user moves a slider
            |
            v
   Streamlit re-runs app.py FROM LINE 1
            |
            +--> every widget returns its CURRENT value
            +--> every chart is rebuilt
            +--> every variable is recreated
            |
            v
   the browser is patched with the new output
```

There is no callback, no `onChange`, no component lifecycle. A widget call like

```python
chosen_days = st.sidebar.multiselect("Day", options=all_days, default=all_days)
```

does two jobs at once: it **draws** the widget and it **returns** what the user
currently has selected. That is why the code below it can just use `chosen_days` as an
ordinary list.

> 💡 **Engineering Extension** — *Recommended Extension - Not part of instructor curriculum.*
>
> Coming from React, the instinct is to look for state, effects, and re-render rules.
> Drop it. Streamlit is closer to a **stateless request handler**: each interaction is a
> fresh request that recomputes the whole response. Your Spring Boot controller does not
> remember the last request either — and for the same reason, it is much easier to reason
> about.
>
> Two consequences follow directly from that:
> - **`@st.cache_data`** is your caching layer. Without it, a slow query or file read
>   happens on *every* keystroke. With it, the function body runs once per distinct set
>   of arguments.
> - **`st.session_state`** is the only thing that survives a re-run. It is the session
>   store. Everything else is rebuilt from scratch.

## Covered so far

| Area | What `app.py` uses |
|---|---|
| Page setup | `st.set_page_config` (must be the first Streamlit call) |
| Text | `st.title`, `st.caption`, `st.write`, `st.divider` |
| Inputs | `st.multiselect`, `st.slider` (range), `st.checkbox`, `st.selectbox`, `st.button` |
| Layout | `st.sidebar`, `st.columns`, `st.tabs` |
| Data display | `st.metric`, `st.dataframe`, `st.download_button` |
| Charts | `st.plotly_chart(fig, width="stretch")` |
| Control flow | `st.warning` + `st.stop` for the empty-result path |
| Performance | `@st.cache_data` |
| State | `st.session_state` |

**Not covered yet:** forms (`st.form`), file upload, `st.chat_message` and chat apps,
multipage apps (`pages/`), `st.secrets`, theming via `.streamlit/config.toml`,
`st.fragment` for partial re-runs, and `st.connection` for databases.

## Verified behaviour

`app.py` was executed through Streamlit's own test harness
(`streamlit.testing.v1.AppTest`), not just eyeballed:

| Check | Result |
|---|---|
| Script runs clean | 0 exceptions |
| Default metrics | 244 bills · $4,827.77 total · 16.1% average tip |
| Filter to Saturday | 87 bills · $1,778.40 — matches the plotly notebook's verified sum |
| Empty filter | shows the warning and stops, no traceback |
| Button + session state | click counter increments across re-runs |

---

## Deploying it

### First, the thing to be clear about

**GitHub cannot run this app.** GitHub stores the code; GitHub Pages serves *static*
files only. A Streamlit app is a **Python server** — it needs a running process, a
WebSocket connection, and a Python environment.

```text
   GitHub            = where the code lives
   Streamlit Cloud   = what actually runs it, reading from GitHub
```

So "deploy to GitHub" is really two steps: push the code to GitHub, then point a host at
that repo.

### Hosting options

| Host | Cost | Good for | Notes |
|---|---|---|---|
| **Streamlit Community Cloud** | free | this repo, learning, sharing a link | deploys straight from a public GitHub repo; **start here** |
| Hugging Face Spaces | free tier | ML demos | needs its own repo layout |
| Render / Railway / Fly.io | small paid | apps that need a real backend | you manage the container |
| AWS (ECS / App Runner / EC2) | paid | production, private data, VPC access | the route that matches your day job |

### The plan — Streamlit Community Cloud

This repo is already public at `github.com/coderkali/machine_learning`, so the
prerequisites are met.

```text
   1. requirements.txt sits next to app.py            [done]
   2. commit and push to main
   3. share.streamlit.io -> sign in with GitHub
   4. "New app" -> "Deploy a public app from GitHub"
        Repository    coderkali/machine_learning
        Branch        main
        Main file     AI_ML_Series/02_data_toolkit_apps/07_streamlit/app.py
   5. Advanced settings -> Python version
   6. Deploy
```

**Step 5 matters.** This machine runs Python 3.14, which Streamlit Cloud may not offer
yet. Pick the newest version in its list (3.12 or 3.13 at time of writing). Nothing in
`app.py` or `requirements.txt` depends on 3.14, so it will run fine on either.

**Step 1 matters too.** Streamlit Cloud looks for the dependency file next to the
entrypoint. Keeping `requirements.txt` in this folder — rather than at the repo root —
means the app installs three packages, not everything this learning repo has ever used.

After deploying you get a public URL like
`https://<something>.streamlit.app`. Every push to `main` redeploys automatically.

### Deployment checklist

- [ ] `requirements.txt` lists every third-party import in `app.py`
- [ ] No absolute paths — this app uses `px.data.tips()`, which ships inside plotly, so
      there is no dataset file to find and nothing to break on a different machine
- [ ] No secrets in the code. Streamlit Cloud has a **Secrets** UI; read them with
      `st.secrets["key"]`. Never commit a `.env`
- [ ] The virtualenvs (`pizza_env/`, `.venv/`) stay out of git — Python's `venv` writes
      its own `.gitignore` containing `*`, so this is already handled
- [ ] App is public — do not deploy anything with private data to the free tier

> 💡 **Engineering Extension** — *Recommended Extension - Not part of instructor curriculum.*
>
> Community Cloud gives you one container, sleeping after inactivity, with no horizontal
> scaling and no private networking. That is correct for a demo and wrong for production.
> The moment an app needs a VPC, a real database, or an SLA, it belongs in a container on
> your own infrastructure — and `streamlit run` behind a load balancer is the same
> deployment shape you already know.

## Common mistakes

1. Expecting a widget to fire a callback. It does not — the script re-runs and the widget
   returns its new value.
2. Loading data without `@st.cache_data`, then wondering why every click is slow.
3. Putting a `st.set_page_config` call anywhere but first. It raises.
4. Assuming a variable survives the re-run. Only `st.session_state` does.
5. Deploying without `requirements.txt` and getting `ModuleNotFoundError` in the build log.

## Key takeaway

**If you remember only one thing:** Streamlit re-runs your whole script on every
interaction. Widgets are not event sources — they are functions that return the current
value. Once that clicks, the rest of the API is just a widget catalogue.
