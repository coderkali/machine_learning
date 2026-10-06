# DAF-03 · script v1 — two short videos, one question each (2026-10-05)

Format = the approved DAF-02 v3 template: max 3 ideas per video · one sentence per visual · a real table pinned
at the top all video · no decision-record names in the voice (D-003, D-004 stay on GitHub).

Sources (real numbers only): docs/backlog/DAF-03_station_list.md · notebooks/03_station_discovery.ipynb outputs
(page 1 = 100, page 2 = 2 → 102 locations → 147 PM2.5 sensors; 50 with ≥ 730 days) · docs/project_status_summary.md
(44 in the latest four-year window) · data/raw/stations.csv (example rows below).

Ids: A = `day_303` → DAF/Episodes/DAF-03/Part1 · B = `day_353` → Part2.

## A · `day_303` · "Why do we need OpenAQ?" — v2 (v1 rejected 2026-10-05: explained API mechanics; Kali wants why → how we got here → what we get)
Ideas: ① we need real past readings and own no sensor ② measured, not modelled (why OpenAQ, not a weather API's PM2.5)
③ first we only ask "what exists?" → the station list. Pinned table: real rows from data/raw/stations.csv (station · run by · first · last).
Sources: docs/phases/02_data_collection.md ("Why not Open-Meteo's air quality API": model output, ~45 km, from Aug 2022);
notebook 03 (102 locations, 147 PM2.5 sensors); providers in stations.csv (CPCB 106 sensors).

| # | id | Who | Line |
|---|---|---|---|
| 1 | why | NAR | Our model must learn from the past. Thousands of real days of Delhi's air. But we do not own a single sensor. So where does that past come from? That is why we need OpenAQ. |
| 2 | reached | NAR | Let's see how we reached here. In DAF-01, we built the house for the project. In DAF-02, we decided exactly what to predict. Tomorrow's PM2.5, at six pm. That gave us a table. But right now, that table is empty. |
| 3 | openaq | NAR | OpenAQ is a free, open library of air readings. Government monitors in Delhi, like the CPCB network, send their readings there. So in one place, we find many stations, all in one format. |
| 4 | doubt1 | RISHI | Sir, a weather website also gives PM2.5, with no sign-up. Why not use that? |
| 5 | answer1 | NAR | Because that PM2.5 is a model's guess, not a measurement. If we learn from it, our model learns to copy another model, not what the air really did. And one of its boxes is about forty-five kilometres wide. All of Delhi becomes one pixel. We want what the sensors actually measured. |
| 6 | list | NAR | So what does OpenAQ give us first? A list. Every monitoring location around Delhi, one hundred and two of them. And for each one, its PM2.5 sensor. Who runs it, where it stands, and the first and last day it reported. One hundred forty-seven sensors. |
| 7 | first | NAR | Here's the catch. We do not download years of readings yet. First, we only ask one question. What exists? The real readings come later. |
| 8 | recall | NAR | So, remember. We need OpenAQ because our model must learn from real air, and we have no sensors of our own. Measured, not modelled. And first, we only look at the list. Next, which of these stations can we trust? |

## B · `day_353` · "Which stations can we trust?" — ideas: risk first · rule by a number (≥ 730 days) · recent matters
Pinned table (real rows, data/raw/stations.csv): station · first reading · last reading · days · ≥ 730? · still reporting?

| Station (location id) | first | last | days |
|---|---|---|---|
| New Delhi · AirNow (8118) | 10 Nov 2016 | 16 Sep 2026 | 3,598 |
| Mandir Marg · DPCC (6358) | 10 Aug 2018 | 31 Oct 2022 | 1,543 |
| ITO · CPCB (5613) | 9 Mar 2018 | 20 Jan 2020 | 682 |
| Pusa · IMD (5581) | 9 Mar 2018 | 14 May 2018 | 66 |
| Punjabi Bagh · DPCC (50) | 5 Feb 2016 | 22 Feb 2018 | 747 |

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap | NAR | Last time, OpenAQ gave us one hundred forty-seven PM2.5 sensors. Now, before we download years of data, we must check one thing. Is there enough good data at all? |
| 2 | risk | NAR | See, everything we build later assumes Delhi has many stations with years of readings. Very likely, yes. But very likely is not checked. So we check it now, in week one, while changing course is still cheap. |
| 3 | gate | NAR | We set a simple gate. At least five stations with two years of data. If fewer pass, we stop, and find another data source. |
| 4 | table | NAR | Look at our table. Each sensor has a first reading and a last reading. The gap between them is its coverage, in days. |
| 5 | doubt1 | RISHI | Sir, why not just pick the big famous stations, like ITO? |
| 6 | answer1 | NAR | Because a famous name tells you nothing about the data. Look at ITO. Only six hundred eighty-two days. Pusa, only sixty-six. So the rule must be a number we can measure. Two years, which means at least seven hundred thirty days. |
| 7 | result | NAR | Now we apply this rule to all one hundred forty-seven sensors. Fifty pass. Far more than five. The gate is passed, and the project can go on. |
| 8 | stale | NAR | But here's the catch. Punjabi Bagh passes, with seven hundred forty-seven days. But its readings stopped in February twenty eighteen. Old air is not today's air. So we keep only stations that also report in the last four years. Fifty becomes forty-four. |
| 9 | recall | NAR | So, remember. Check the biggest risk first. Choose stations by a number, not by a name. And the data must be recent, not just long. Next, we download the real readings. |
