# DAF-04 · script v1 (2026-10-06) — "Download the sensor history"

Three short videos, one question each, max 3 ideas, following "How Kali wants a DAF episode" (UNIVERSE.md).
① why we need it (A) → ② how we reached here (B) → ③ what it gives us (C). Concepts only: no commands, folders,
file names, keys or decision-record names. Rishi = Raj, one doubt per video. Asha shown only.

## Sources (every number checked 2026-10-06)

| Number in the voice | Where it was checked |
|---|---|
| 50 sensors with long records, 44 recent | `docs/project_status_summary.md`; `data/processed/valid_stations_recent_4y.csv` = 44 rows |
| Shortcut gave 3,342 daily numbers (OpenAQ's daily averages) | `data/raw/pm25_daily_raw.csv` = 3,342 rows; notebook 01 uses the `/days` daily-average endpoint |
| A full day = 96 readings (one every 15 min) | raw files: readings at :00/:15/:30/:45 |
| 20 Jan 2026: only 13 PM2.5 readings, first at 20:45, day mean 431 | raw file R K Puram 2026-01-20 (13 pm25 rows, 20:45 → 23:45, mean 431.3) |
| 19 Feb 2025: 88 readings, mean 78 · 21 Oct 2025: 76, mean 549 · 11 Sep 2026: 86, mean 43 | raw files for those days |
| 42 of 44 listed sensors went quiet in Oct 2022; only 2 still recording (New Delhi, GK1) | `valid_stations_recent_4y.csv` last_reading: 35 on 31 Oct 2022, 6 on 16 Oct, 1 on 14 Oct, 2 on 16 Sep 2026 |
| Mandir Marg, Anand Vihar, R K Puram listed sensors stopped 31 Oct 2022; new sensors since 19 Feb 2025 | same file + `data/raw/stations.csv` (loc 6358, 235, 17) |
| Mandir Marg: ~6 weeks inside the four-year window | window starts 16 Sep 2022 → last reading 31 Oct 2022 = 45 days |
| ~64,000 possible sensor-days → 3,342 → about 5% · two sensors ≈ two-thirds | 44 × 1,461 = 64,284; 3,342 / 64,284 = 5.2% (matches D-005); New Delhi 1,400 + GK1 732 = 64% |
| R K Puram new sensor 19 Feb 2025 → 11 Sep 2026, 570 days, one winter | `stations.csv` loc 17 sensor 12234787; D-005 (winter Oct 2025 – Feb 2026) |
| One month first: 10 files, 5 seconds; second run 0 downloaded, 10 skipped | notebook 04 outputs (Feb 2025 run, 5.07 s; re-run 0 / 10) |
| Full run: 554 files, 16 missing days, 2.5 MB, 80 seconds | notebook 04 output (544 new + 10 skipped, 16 missing, 2,473,187 bytes, 79.96 s); 554 files on disk |
| 9 missing days in a row, 11–19 Jan 2026 | computed from the files on disk |
| 12 things measured; 467,816 rows, 44,139 PM2.5 (about 1 in 10) | all 554 raw files read 2026-10-06 |
| 1,753 at 3 am on 21 Oct 2025 = Diwali; ≈ 19 × the Poor line (91) | `docs/data_faults.md` "the biggest value is plausible"; 1,753 / 91 = 19.3 |

⚠️ One correction for the record: D-005 says "37 of them kept a sensor that stopped on 31 Oct 2022". The list itself
shows **35** stopped exactly on 31 Oct 2022 and **42 of 44** stopped in October 2022 (37 is the CPCB-provider count).
The script uses the checked number, 42 of 44.

Moments legend: M1 make it talk · M2 viewer computes first · M3 knob to both extremes · M4 "wait, really?" ·
M5 against what they know (Java) · M6 picture first ("Imagine…").

---

## A · `day_304` · "Why download the original files?"

Ideas: ① a list is not the readings ② a ready-made daily average hides the hours behind it ③ keep the original files,
exactly as they came.
Pinned table (top, all video), R K Puram, real days from the raw files:

| Day | one number for the day | readings behind it (of 96) | kept as it came |
|---|---|---|---|
| 19 Feb 2025 | 78 | 88 | 🔒 |
| 21 Oct 2025 | 549 | 76 | 🔒 |
| 20 Jan 2026 | 431 | **13** | 🔒 |
| 11 Sep 2026 | 43 | 86 | 🔒 |

Columns 2 → 3 → 4 appear with ideas ② and ③. **Moments: M2, M1, M4, M5** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | Last time, we found fifty sensors with long records, and forty-four with recent data. But see, that was only a list. A list tells us who was watching Delhi's air. It does not tell us what they saw. For that, we need the actual readings. | DAF-03 list card slides up; a counter "readings on our disk: 0" pulses. |
| 2 | shortcut | NAR | — | Now, there is a shortcut. OpenAQ can hand us one ready-made number per day, the daily average. Easy, right? We even tried it. It gave us three thousand three hundred forty-two daily numbers. | Pinned table appears with only "Day" and "one number for the day"; counter 0 → 3,342. |
| 3 | doubt1 | RISHI | — | Sir, an average is an average. Why does it matter who calculates it? | Yellow doubt card (low, never over the table). |
| 4 | count | NAR | **M2** | Let me show you. A sensor sends one reading every fifteen minutes. So in one full day, how many readings? Four per hour, twenty-four hours. Think once… ninety-six. | Clock face ticks in 15-minute steps; 4 × 24 builds; big "96". |
| 5 | talk | NAR | **M1 · M4** | Now let's ask one day. Twentieth January, how many readings are behind your number? It says, only thirteen, sir. The sensor woke up at a quarter to nine at night. | 20 Jan row lights up and answers in a speech bubble; "readings behind it" column fills (88 · 76 · 13 · 86); a 24-hour bar fills only its last three hours. |
| 6 | hides | NAR | — | So that one number looks like a whole day, but it is only three hours. A ready-made average hides this. We want to decide ourselves when a day is complete. So we need every reading, not just the average. | The 431 cell cracks to show the tiny 3-hour bar inside; tag "looks like a full day". |
| 7 | original | NAR | **M5** | And we keep those readings exactly as they came. Think of Maven. Version one point zero of a library never changes, but a snapshot can change any day. OpenAQ keeps one original file per station per day, like that release, free for anyone. We never edit it, not even to fix a mistake. | "1.0.0 🔒" box vs a flickering "SNAPSHOT" box; a stack of daily files gets a lock; "kept as it came" column fills 🔒. |
| 8 | why | NAR | — | So weeks later, if a number looks strange, we can always go back and see what the sensor really sent. | An arrow from a "strange number?" tag back down to the locked file. |
| 9 | recall | NAR | — | So, remember. A list is not data. A daily average hides the hours behind it. And we keep the original files, untouched. Next, whose files do we download first? | Three takeaway cards; NEXT chip "whose files first?". |

**Voice characters (A): 1,565** (narrator 1,497 + Rishi 68) · 290 words ≈ 1:56.

---

## B · `day_354` · "Why start with just one station?"

Ideas: ① most listed sensors had gone quiet ② build one thin slice end to end first ③ R K Puram, and its honest cost.
Pinned table (top, all video), real rows from the four-year list + `stations.csv`:

| Station | our listed sensor: last reading | still recording? | new sensor since |
|---|---|---|---|
| New Delhi · AirNow | 16 Sep 2026 | ✓ | — |
| Mandir Marg · DPCC | 31 Oct 2022 | ✗ | 19 Feb 2025 |
| Anand Vihar · DPCC | 31 Oct 2022 | ✗ | 19 Feb 2025 |
| R K Puram · DPCC | 31 Oct 2022 | ✗ | 19 Feb 2025 ⭐ |

**Moments: M1, M4, M2, M5** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | We want every reading, in the original daily files. So, should we download all forty-four sensors from our list? First, let's check what those sensors were really doing. | Pinned table appears with station names; other columns empty; "download all 44?" button hovers. |
| 2 | talk | NAR | **M1** | Let's ask them. When did you last send a reading? New Delhi says, I am still recording. Mandir Marg says, thirty-first October, twenty twenty-two. Anand Vihar says, the same day. And R K Puram says, the same day too. | Each row lights up and answers in a speech bubble; "last reading" column fills; ✓ / ✗ appear. |
| 3 | wow | NAR | **M4** | Wait. Forty-two of our forty-four sensors went quiet in October twenty twenty-two. Only two are still recording. Mandir Marg passed our four-year rule last time. But inside those four years, it gave only about six weeks of readings. | 44 dots on a timeline; 42 go grey at Oct 2022, 2 stay lit; Mandir Marg's four-year bar shrinks to a sliver at the start. |
| 4 | compute | NAR | **M2** | So how full is our table? Forty-four sensors, four years each. That is about sixty-four thousand sensor-days. We had only three thousand three hundred forty-two. Just think… about five percent. And two sensors fill almost two-thirds of that. | A big grid of 64,000 cells; only 5% light up, mostly in two rows; "5%" stamp. |
| 5 | doubt1 | RISHI | — | Sir, then fix the list first, and download every station properly. | Yellow doubt card (low). |
| 6 | slice | NAR | **M5** | We could. But that is weeks of data work before we see a single model. Think of a new Spring Boot service. You do not write all fifty endpoints first. You build one request end to end, from controller to database, and see it work. Then you add the rest. So we take one station, all the way. Data, model, and a running app. | Fifty grey endpoint boxes; one thin vertical line lights from controller → service → database; then "station → model → app" lights the same way. |
| 7 | rkpuram | NAR | — | And which station? R K Puram. Same place, new sensor. The old one stopped in twenty twenty-two. A new one started on nineteenth February, twenty twenty-five, and it is still recording, every fifteen minutes. | R K Puram row: "new sensor since" fills 19 Feb 2025; ⭐ and a pulsing "recording" dot. |
| 8 | catch | NAR | — | Here's the catch. That is only about a year and a half of data. Only one winter. And our answer will describe R K Puram, not all of Delhi. We take that deal on purpose, and we widen to more stations later. | A 570-day strip with one winter band shaded; Delhi map with one pin; "more stations later" chip on the project map at DAF-24. |
| 9 | recall | NAR | — | So, remember. Check what the sensors are really doing, not just what the list says. Build one thin slice end to end first. And for us, that is R K Puram, one station, one winter. Next, we download it. | Three takeaway cards; NEXT chip "download R K Puram". |

**Voice characters (B): 1,858** (narrator 1,792 + Rishi 66) · 333 words ≈ 2:13.

---

## C · `day_404` · "What did we really download?"

Ideas: ① test small first, and make it safe to run again ② what arrived (files, gaps, what's inside) ③ never edit raw data.
Pinned table (top, all video), R K Puram, real days from the raw files:

| Day | file on our disk? | readings in the file | highest PM2.5 |
|---|---|---|---|
| 19 Feb 2025 | ✓ | 749 | 123 |
| 21 Oct 2025 | ✓ | 1,032 | **1,753** |
| 11–19 Jan 2026 | ✗ no file (9 days) | — | — |
| 11 Sep 2026 | ✓ | 1,112 | 97 |

**Moments: M2, M5, M4, M1** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | R K Puram, one station. From nineteenth February twenty twenty-five, to eleventh September twenty twenty-six. Five hundred seventy days. Now we download. But not all at once. | Pinned table with only "Day"; a 570-day strip draws under it. |
| 2 | doubt1 | RISHI | — | Sir, it is only one station. Why not download everything in one go? | Yellow doubt card (low). |
| 3 | small | NAR | **M2** | Because a mistake is cheaper to find small. So first, just one month, February twenty twenty-five. February has twenty-eight days, but our sensor started on the nineteenth. So how many files can we get? Think once… ten. And ten came, in five seconds. | February calendar; days 1–18 grey out; 19–28 glow; counter stops at 10; "5 s" stopwatch. |
| 4 | twice | NAR | **M5** | Then we ran the same thing again. Downloaded, zero. Skipped, ten. Just like Maven. On the second build, it does not download the jars again. They are already in your local repository. So we can run it again any time, safely. | Two run cards side by side: "10 downloaded" vs "0 downloaded · 10 skipped"; a jar icon already sitting on a shelf. |
| 5 | full | NAR | — | Then the full run. Eighty seconds. Five hundred fifty-four files, about two and a half megabytes. Five hundred seventy days, so sixteen days have no file at all. And nine of them in a row, eleventh to nineteenth January. Right in the middle of winter. | 570-day strip fills with 554 ticks; 16 holes turn red; the 9-day hole in January zooms; "file on our disk?" column fills. |
| 6 | inside | NAR | — | Now open one file. It is not only PM2.5. Twelve things are measured. PM10, gases, temperature, humidity, wind. Out of almost four lakh seventy thousand rows, only forty-four thousand are PM2.5. About one in ten. | One file opens into rows of 12 colours; "readings in the file" column fills; a filter leaves 1 in 10 rows lit. |
| 7 | diwali | NAR | **M4 · M1** | Now look at twenty-first October, three in the morning. PM2.5, one thousand seven hundred fifty-three. Our Poor line is ninety-one. This is nineteen times that. Looks like a broken sensor, isn't it? Let's ask it. And it says, no sir. That was Diwali night. | "highest PM2.5" column fills; the 1,753 cell turns red and grows; bar 19× taller than the red dashed 91 line; diya icon; speech bubble from the row. |
| 8 | catch | NAR | — | Here's the catch. If we had cleaned while downloading, this row would be gone, forever. So raw files stay exactly as they came, even a number that looks wrong. Fixing happens later, in its own step, where we can always go back. | A "clean while downloading" broom sweeps toward the row and is blocked by a lock; arrow to a later "cleaning" box on the project map. |
| 9 | recall | NAR | — | So, remember. Test small first, and make it safe to run again. Five hundred fifty-four files, sixteen missing days. And never edit raw data. Next, we turn these files into one table, one row per day. | Three takeaway cards; NEXT chip "one row per day". |

**Voice characters (C): 1,859** (narrator 1,792 + Rishi 67) · 326 words ≈ 2:10.

**Total DAF-04: 5,282 characters.**
