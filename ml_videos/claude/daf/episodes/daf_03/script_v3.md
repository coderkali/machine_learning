# DAF-03 · script v3 — B in simple English (2026-10-06)

v3 = v2 with **Video B rewritten in simple, everyday English** (Kali: "unable to understand… make it simplified").
Video A is unchanged from v2. v1 and v2 are kept.

(v2 header below)

v1 kept as is (`script_v1.md`). v2 = same ideas, sources and pinned tables, rewritten with the
**SCRIPT_MOMENTS_GUIDE** (≥ 3 of M1–M6 per video, each with its 🎬 animation). Still: max 3 ideas · each beat answers
the last · desi-teacher phrases · concepts only (no keys, headers, paging or status codes) · no decision-record names.

## Sources (every number checked 2026-10-06)

| Number in the voice | Where it was checked |
|---|---|
| 102 locations · 147 PM2.5 sensors | notebook 03 output ("Total locations collected: 102", "Rows in table: 147"); `data/raw/stations.csv` (147 rows, 102 location ids) |
| CPCB network is the biggest provider | `stations.csv` provider column: CPCB 106 of 147 sensors |
| one box ≈ 45 km · "Delhi is one pixel" | `docs/phases/02_data_collection.md` §"Why not Open-Meteo's air quality API" |
| Dwarka, Connaught Place, Noida fit in one 45 km box | great-circle distance Dwarka ↔ Noida ≈ 26 km (computed from coordinates) |
| New Delhi since Nov 2016 · 3,598 days ("almost ten years") | `stations.csv` loc 8118: 2016-11-10 → 2026-09-16 |
| Mandir Marg since Aug 2018 · 1,543 days ("about four years") | loc 6358: 2018-08-10 → 2022-10-31 |
| ITO 682 days | loc 5613: 2018-03-09 → 2020-01-20 |
| Pusa 66 days | loc 5581: 2018-03-09 → 2018-05-14 |
| Punjabi Bagh 747 days, stopped Feb 2018 | loc 50: 2016-02-05 → 2018-02-22 |
| gate: ≥ 5 stations with 2 years | `docs/backlog/DAF-03_station_list.md` step 8 (risk gate) |
| ≥ 10 days → 144 pass · ≥ 10 years → 0 pass · ≥ 730 days → 50 pass | computed from `stations.csv` (145 sensors have both dates); 50 matches notebook 03 output |
| shortest real sensors ≈ two weeks (13–15 days) | `stations.csv` coverage: 13.1, 14.0, 14.2, 14.9 days |
| 50 → 44 still reporting in the last four years | `docs/project_status_summary.md`; `data/processed/valid_stations_recent_4y.csv` = 44 rows (8118, 6358 in; 50 out) |

Guide example corrected: "ten years and almost nothing passes" → really **zero** pass (longest record is 3,598 days).

Moments legend: M1 make it talk · M2 viewer computes first · M3 knob to both extremes · M4 "wait, really?" ·
M5 against what they know (Java) · M6 picture first ("Imagine…").

---

## A · `day_303` · "Why do we need OpenAQ?"

Ideas: ① our model needs real past readings and we own no sensor ② measured, not modelled ③ first we only ask
"what exists?" → the station list.
Pinned table (top, all video): `data/raw/stations.csv` rows — station · run by · first reading · last reading
(New Delhi · AirNow · Nov 2016 → Sep 2026 · Mandir Marg · DPCC · Aug 2018 → Oct 2022 · ITO · CPCB · Mar 2018 → Jan 2020 ·
Pusa · IMD · Mar 2018 → May 2018). Rows start as "?" and fill in at beat 7.
**Moments: M5, M6, M4, M1** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | why | NAR | — | Our model must learn from the past. Thousands of real days of Delhi's air. But we do not own a single sensor. So where does that past come from? That is why we need OpenAQ. | Pinned table shows only "?" cells; a sensor icon with "0 of our own" gets crossed out. |
| 2 | reached | NAR | — | Let's see how we reached here. In DAF-01, we built the house for the project. In DAF-02, we decided exactly what to predict. Tomorrow's PM2.5, at six pm. That gave us a table. But right now, that table is empty. | DAF-01 house → DAF-02 target table slide in; the target column stays empty and pulses. |
| 3 | openaq | NAR | **M5** | So where do Delhi's readings live? Think of Maven Central. We do not download every library from each company's own website. We go to one repository, and everything comes in one format. OpenAQ is that, for air. Government monitors in Delhi, like the CPCB network, publish their readings there. | Many monitor icons (CPCB, DPCC, IMD, AirNow) send arrows into one box labelled "Maven Central" that morphs into "OpenAQ". |
| 4 | doubt1 | RISHI | — | Sir, a weather website also gives PM2.5, with no sign-up. Why not use that? | Yellow doubt card (low, never over the table). |
| 5 | box | NAR | **M6** | Let me show you. Imagine one box, forty-five kilometres wide, dropped over Delhi. Connaught Place, Dwarka, Noida. All inside that one box. All get the same number. | Delhi outline with three pins; one grey square falls and swallows the map; all three pins show the same value. |
| 6 | pixel | NAR | **M4** | That is how that weather website sees our city. All of Delhi becomes one pixel. And that number is a model's guess, not a measurement. If we learn from it, our model learns to copy another model, not what the air really did. | Everything fades except one grey pixel; tag "model's guess" vs a sensor icon tagged "measured". |
| 7 | list | NAR | **M1** | So we want what the sensors actually measured. And OpenAQ first gives us a list. One hundred and two locations around Delhi, one hundred forty-seven PM2.5 sensors. Let's ask a few of them. Since when have you been watching Delhi's air? New Delhi says, since November twenty sixteen. Mandir Marg says, since August twenty eighteen. | Pinned table rows fill from "?" ; counter 102 → 147; the New Delhi and Mandir Marg rows light up and answer in speech bubbles. |
| 8 | first | NAR | — | Here's the catch. We do not download years of readings yet. First, we only ask one question. What exists? The real readings come later. | A "download years" button stays greyed; the list glows with "what exists?". |
| 9 | recall | NAR | — | So, remember. We need OpenAQ because our model must learn from real air, and we have no sensors of our own. Measured, not modelled. And first, we only look at the list. Next, which of these sensors can we trust? | Three takeaway cards; NEXT chip "which sensors can we trust?". |

**Voice characters (A): 1,814** (narrator 1,739 + Rishi 75) · 327 words ≈ 2:10 at the DAF pace.

---

## B · `day_353` · "Which sensors can we trust?" — simple-English rewrite

Ideas (same as v2): ① check the biggest problem first ② choose by a number, not a name ③ the data must be recent.
Pinned table (top, all video), real rows from `data/raw/stations.csv`:

| Sensor (location id) | first reading | last reading | days | 2 years or more? | readings in the last 4 years? |
|---|---|---|---|---|---|
| New Delhi · AirNow (8118) | 10 Nov 2016 | 16 Sep 2026 | 3,598 | ✓ | ✓ |
| Mandir Marg · DPCC (6358) | 10 Aug 2018 | 31 Oct 2022 | 1,543 | ✓ | ✓ |
| ITO · CPCB (5613) | 9 Mar 2018 | 20 Jan 2020 | 682 | ✗ | — |
| Pusa · IMD (5581) | 9 Mar 2018 | 14 May 2018 | 66 | ✗ | — |
| Punjabi Bagh · DPCC (50) | 5 Feb 2016 | 22 Feb 2018 | 747 | ✓ | ✗ |

**Moments: M1, M3, M2, M5** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | Last time, OpenAQ gave us a list of one hundred forty-seven sensors. Before we download their readings, let's ask one simple question. Do we have enough good data? | Pinned table appears with names and dates; the "days" column is empty. |
| 2 | risk | NAR | — | See, our whole project depends on this. If Delhi does not have enough sensors with long records, nothing we build later will work. So we check it now, at the very start, when changing our plan is still easy. | The project map shows DAF-04 … DAF-24 stacked on one small block labelled "enough data?"; the block wobbles. |
| 3 | gate | NAR | — | Our test is simple. We need at least five sensors with two years of readings. If we find fewer than five, we stop, and look for other data. | A big "need 5 sensors × 2 years" card drops under the table. |
| 4 | talk | NAR | **M1** | So let's ask each sensor. How long have you been recording Delhi's air? New Delhi says, almost ten years. Mandir Marg says, about four years. ITO says, six hundred eighty-two days. And Pusa says, only sixty-six days, sir. | Each row lights up in turn and answers in a speech bubble; its "days" cell fills (3,598 · 1,543 · 682 · 66). |
| 5 | doubt1 | RISHI | — | Sir, ITO is a famous station. Why not just pick the famous ones? | Yellow doubt card (low, never over the table). |
| 6 | answer1 | NAR | — | Because famous does not mean long data. ITO has less than two years. So we do not choose by name. We choose by a number. Two years, which is seven hundred thirty days. | ITO's name gets crossed; its 682 turns red; the "2 years or more?" column fills ✓ / ✗. |
| 7 | knob | NAR | **M3** | Why two years? Let's try a very small rule, and a very big rule. Ask for only ten days, and one hundred forty-four sensors pass. Even ones that worked for just two weeks. Too easy. Ask for ten years, and not one sensor passes. Too hard. Two years is in the middle. It covers every season, twice. | A slider moves 10 days → 10 years → 2 years; a big counter shows 144 → 0; rows flip green/red live. |
| 8 | compute | NAR | **M2** | We need only five. So with two years, how many sensors pass? Think once. … Fifty. Much more than five. Our test is passed. | Pause on "?"; the counter ticks up, crosses the 5 line and keeps going to 50; a big ✓. |
| 9 | stale | NAR | **M5** | But here's the catch. Punjabi Bagh has seven hundred forty-seven days, so it passes. But it stopped recording in February twenty eighteen. That is old data. Like an old cache in your app that nobody refreshed. Delhi's air today is different. So we keep only sensors with readings from the last four years. Fifty becomes forty-four. | Punjabi Bagh row gets an "OLD · stopped 2018" stamp; the last column fills; counter 50 → 44. |
| 10 | recall | NAR | — | So, remember. Check the biggest problem first. Choose sensors by a number, not by a name. And the data must be recent, not just long. Next, we download the real readings. | Three takeaway cards; NEXT chip "download the real readings". |

