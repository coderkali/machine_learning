# DAF-03 · script v2 — moments rewrite (2026-10-06)

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

## B · `day_353` · "Which stations can we trust?"

Ideas: ① check the biggest risk first (gate: ≥ 5 stations with 2 years) ② choose by a number, not a name (≥ 730 days)
③ recent matters, not just long (50 → 44).
Pinned table (top, all video), real rows from `data/raw/stations.csv`:

| Station (location id) | first | last | days | ≥ 730? | still reporting (last 4 years)? |
|---|---|---|---|---|---|
| New Delhi · AirNow (8118) | 10 Nov 2016 | 16 Sep 2026 | 3,598 | ✓ | ✓ |
| Mandir Marg · DPCC (6358) | 10 Aug 2018 | 31 Oct 2022 | 1,543 | ✓ | ✓ |
| ITO · CPCB (5613) | 9 Mar 2018 | 20 Jan 2020 | 682 | ✗ | — |
| Pusa · IMD (5581) | 9 Mar 2018 | 14 May 2018 | 66 | ✗ | — |
| Punjabi Bagh · DPCC (50) | 5 Feb 2016 | 22 Feb 2018 | 747 | ✓ | ✗ |

**Moments: M1, M3, M2, M5** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | Last time, OpenAQ gave us a list. One hundred forty-seven PM2.5 sensors. Now, before we download years of data, we must check one thing. Is there enough good data at all? | Pinned table appears with name, first and last dates; "days" column empty. |
| 2 | risk | NAR | — | See, everything we build later assumes Delhi has many sensors with years of readings. Very likely, yes. But very likely is not checked. So we check it now, in week one, while changing course is still cheap. | A "very likely" sticker gets stamped "NOT CHECKED"; a calendar shows week 1 highlighted. |
| 3 | gate | NAR | — | So we set a simple gate. At least five stations with two years of data. If fewer pass, we stop, and find another data source. | A gate with a "5" line drops across the zone under the table. |
| 4 | talk | NAR | **M1** | Let's ask each sensor one question. How long have you been watching Delhi's air? New Delhi says, almost ten years. Mandir Marg, about four years. ITO, six hundred eighty-two days. Pusa says, only sixty-six days, sir. | Each row lights up in turn and answers in a speech bubble; its "days" cell fills (3,598 · 1,543 · 682 · 66). |
| 5 | doubt1 | RISHI | — | Sir, but ITO is the famous one. Why not just pick the big famous stations? | Yellow doubt card (low). |
| 6 | answer1 | NAR | — | Because a famous name tells you nothing about the data. ITO is famous, but it has less than two years. So the rule must be a number we can measure. Two years, which means at least seven hundred thirty days. | ITO's name gets crossed; its 682 turns red; the "≥ 730?" column appears and fills ✓/✗. |
| 7 | knob | NAR | **M3** | But why two years? Let's push the rule to both ends. Ten days, and one hundred forty-four sensors pass. Even ones that worked for just two weeks. Ten years, and not a single one passes. Two years sits in between. Long enough to see every season twice. | A slider moves 10 days → 10 years → 2 years; a big counter shows 144 → 0; table rows flip green/red live. |
| 8 | compute | NAR | **M2** | Now, our gate needs only five. So at two years, how many pass? Think once. … Fifty. Far more than five. The gate is passed. | Pause on "?"; then the counter ticks up, crosses the "5" gate line and keeps going to 50; gate opens. |
| 9 | stale | NAR | **M5** | But here's the catch. Punjabi Bagh passes, with seven hundred forty-seven days. But its readings stopped in February twenty eighteen. It is like a cache entry. Big, but expired. You would never serve that to a user. So we keep only stations that also report in the last four years. Fifty becomes forty-four. | Punjabi Bagh row gets a "TTL EXPIRED · 2018" stamp; "still reporting?" column fills; counter 50 → 44. |
| 10 | recall | NAR | — | So, remember. Check the biggest risk first. Choose by a number, not by a name. And the data must be recent, not just long. Next, we download the real readings. | Three takeaway cards; NEXT chip "download the real readings". |

**Voice characters (B): 1,837** (narrator 1,763 + Rishi 74) · 339 words ≈ 2:15 at the DAF pace.

---

## Checklist (SCRIPT_MOMENTS_GUIDE)

| | A | B |
|---|---|---|
| ≤ 3 ideas, each beat answers the last | ✓ (why → how we got here → where readings live → doubt → box → pixel → so we want measured → list → catch → recall) | ✓ (is there enough? → risk → gate → ask sensors → doubt → rule → why 2 years → how many pass → catch → recall) |
| ≥ 3 moments, tagged | ✓ M5, M6, M4, M1 | ✓ M1, M3, M2, M5 |
| every moment has a 🎬 line | ✓ | ✓ |
| numbers real, sources cited | ✓ (table above) | ✓ |
| concepts only (no keys, headers, paging, status codes) | ✓ | ✓ |
