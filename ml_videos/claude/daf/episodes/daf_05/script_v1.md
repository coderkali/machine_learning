# DAF-05 · script v1 (2026-10-06) — "The daily table and the answer column"

Three short videos, one question each, max 3 ideas, following "How Kali wants a DAF episode" (UNIVERSE.md).
Concepts only: no code, commands, folders, column names in code form, or decision-record names.
Rishi = Raj, one doubt per video. Asha shown only. Script only — no audio until Kali approves.

## Sources (every number checked 2026-10-06 against the project data)

| Number in the voice | Where it was checked |
|---|---|
| 554 files, 467,816 rows, 44,139 PM2.5 readings | all raw R K Puram files read 2026-10-06 (same as DAF-04) |
| 571 rows, one per day; 488 count, 83 don't; 487 rows with an answer | `data/interim/daily_17.csv`; `docs/project_status_summary.md` §7 |
| 21 Oct 2025: 76 readings → plain average 549; 21 hours → hour-first 579 | raw files re-aggregated 2026-10-06 (549.3 vs 579.4) |
| 21 Oct, midnight hour: 1,476 from ONE reading; afternoon hours ~90–120, four readings each | raw file 2025-10-21, per-hour counts |
| 20 Oct 2025: Delhi-midnight day 320; London (UTC) day 654 | raw files re-aggregated with both day boundaries |
| Diwali = 20 Oct 2025 | `reference/festival_dates.csv` |
| Days by hours: all 24 → 303; at least 1 → 554; at least 18 → 488 | `daily_17.csv` hours column |
| 20 Jan 2026: 4 hours (20:45 → 23:45), number 415 · 10 Jan 2026: exactly 18 hours, 187 · 12 Sep 2026: 1 hour, 13 | `daily_17.csv` + raw file 2026-01-20 |
| Invalid days cluster: Apr 2025 = 12, Aug 2026 = 11, Jan 2026 = 10 | `docs/data_faults.md` Fault 3 |
| 11–19 Jan 2026 no data; "next row" after 10 Jan = 20 Jan (415); 9 such places | `daily_17.csv`, rows with data paired to the next row, computed 2026-10-06 |
| 20 Oct: until 5 pm 230, full day 320, tomorrow 579 · 21 Oct: 668 / 579 / 235 · 9 Jan: 240 / 258 / 187 | `daily_17.csv` |
| Forecast made at 6 pm; today's full mean not available then | `docs/requirements.md` |

Moments legend: M1 make it talk · M2 viewer computes first · M3 knob to both extremes · M4 "wait, really?" ·
M5 against what they know (Java) · M6 picture first ("Imagine…").

---

## A · `day_305` · "How do 44,000 readings become one row per day?"

Ideas: ① a model needs one row per day ② hours first, then the day (every hour gets one vote) ③ the day starts at
Delhi's midnight.
Pinned table (top, all video), R K Puram, real days:

| Day | readings | hours with data | one number for the day |
|---|---|---|---|
| 19 Feb 2025 | 88 | 23 | 79 |
| 20 Oct 2025 | 67 | 20 | 320 |
| 21 Oct 2025 | 76 | 21 | ~~549~~ → **579** |
| 11 Sep 2026 | 86 | 22 | 43 |

Columns 2 → 3 → 4 appear with ideas ① and ②; idea ③ adds a small "🕛 Delhi midnight" tag on the Day column.
**Moments: M6, M2, M4, M5** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | Last time, five hundred fifty-four files landed on our disk. Inside, almost four lakh seventy thousand rows, with twelve different things mixed together. But a model cannot learn from a pile. Asha asks one question per day. So we need one row per day. | A tall pile of mixed-colour rows drops in; counter 467,816; a "1 day = 1 row?" question mark. |
| 2 | register | NAR | **M6** | Imagine the attendance register in Asha's school. One line per day. The date, and one number. That is the table we want. | A school register opens; its lines morph into the pinned table with only "Day". |
| 3 | build | NAR | — | So first, we keep only PM2.5. Forty-four thousand one hundred thirty-nine readings. Then we fold them into days. Five hundred seventy-one rows, one per day. | The pile filters: 1 in 10 rows stays lit (44,139); the lit rows fold day-by-day into rows; counter → 571; "readings" column fills. |
| 4 | doubt1 | RISHI | — | Sir, simple only. Take all the readings of a day and average them. Why make it complicated? | Yellow doubt card (low, never over the table). |
| 5 | votes | NAR | **M2** | Let me show you. Twenty-first October, the night after Diwali. The midnight hour was terrible, one thousand four hundred seventy-six. But the sensor sent only one reading in that hour. The clean afternoon hours sent four readings each. So if we average all the readings, who gets more say? Think once… the clean afternoon. Four votes against one. | 21 Oct row spotlit; below, 24 hour-boxes; the midnight box (red, 1,476) holds 1 dot, afternoon boxes (green, ~100) hold 4 dots each; dots become ballot ticks, 4 vs 1. |
| 6 | hourfirst | NAR | **M4** | So the plain average says five hundred forty-nine. Now give every hour one vote. First average inside each hour, then average the hours. Five hundred seventy-nine. Same day, same sensor, thirty points apart. That's why we go hours first, then the day. | Each hour box shrinks to one dot; "hours with data" column fills (21); 549 struck, 579 slides in; a "+30" badge pulses. |
| 7 | midnight | NAR | **M5 · M4** | Here's the catch. Which midnight? Computers often count days in London time, UTC. You know this from Java. A server in UTC gives a 2 am Delhi order yesterday's date. For us, that same mistake turns twentieth October from three hundred twenty into six hundred fifty-four. Double. Because the London day swallows Diwali night. So our day runs from midnight to midnight, Delhi time. | Two clocks (Delhi / London) and a 20 Oct timeline; the London window slides 5½ h right and swallows the red Diwali night; 320 → 654 in red, then snaps back to 320 with a "🕛 Delhi midnight" tag. |
| 8 | recall | NAR | — | So, remember. One row per day. Hours first, then the day. And the day starts at Delhi's midnight. But see, some days have only a few hours. Next, when does a day count? | Three takeaway cards; NEXT chip "when does a day count?". |

**Voice characters (A): 1,762** (narrator 1,671 + Rishi 91) · 305 words ≈ 2:06.

---

## B · `day_355` · "When does a day count?"

Ideas: ① every number needs to say how many hours are behind it ② the 18-hour rule, between two extremes
③ mark the bad days, don't delete them.
Pinned table (top, all video), R K Puram, real days:

| Day | one number for the day | hours behind it (of 24) | counts? |
|---|---|---|---|
| 19 Feb 2025 | 79 | 23 | ✓ |
| 10 Jan 2026 | 187 | **18** | ✓ just |
| 20 Jan 2026 | 415 | **4** | ✗ |
| 12 Sep 2026 | 13 | **1** | ✗ |

Columns 3 → 4 appear with ideas ① and ②. **Moments: M1, M3, M5** (3).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | Now every day has one number. But not every number is equally honest. Look at twentieth January. Four hundred fifteen. Looks like a terrible day, isn't it? | Pinned table with "Day" and "one number"; 20 Jan cell glows red. |
| 2 | talk | NAR | **M1** | Let's ask it. Twentieth January, how many hours are behind your number? And it says, only four, sir. From a quarter to nine at night, to midnight. And winter nights are Delhi's worst hours. So this number describes one night, not one day. | 20 Jan row answers in a speech bubble; a 24-hour strip with only the last 4 boxes lit (night-blue). |
| 3 | hours | NAR | — | So every row now carries one more number. How many hours had a reading, out of twenty-four. | "hours behind it" column fills: 23, 18, 4, 1. |
| 4 | doubt1 | RISHI | — | Sir, then keep only the complete days. All twenty-four hours. Problem solved, no? | Yellow doubt card (low). |
| 5 | extremes | NAR | **M3** | Let's try it. All twenty-four hours, and only three hundred three days pass. Almost half the table, gone. Now the other end. Say one hour is enough. Then five hundred fifty-four days pass. Even twelfth September, with one hour and the number thirteen. Asha cannot decide anything from one hour. | A slider "hours needed" 1 ↔ 24; at 24, rows flip red and a counter drops to 303 of 571; at 1, everything flips green (554), the 12 Sep row glows with a "1 hour?!" tag. |
| 6 | rule | NAR | — | In between is the rule we set on day one. At least eighteen hours. Three-quarters of the day. With that, four hundred eighty-eight days count, and eighty-three don't. Tenth January had exactly eighteen. It just passes. | Slider settles on 18; "counts?" column fills ✓/✗; counters 488 ✓ · 83 ✗; 10 Jan gets a "just" tick. |
| 7 | flag | NAR | **M5** | Here's the catch. We do not delete the eighty-three. We only mark them. Like a soft delete in your database. The row stays, the flag says don't use it. And because they stay, we can see where they bunch up. Twelve in April, ten in January, eleven in August. | The 83 rows grey out but stay; an "active = false" style flag (plain words: "don't use") stamps them; a month strip shows three red clusters: Apr 2025 12 · Jan 2026 10 · Aug 2026 11. |
| 8 | recall | NAR | — | So, remember. Every number says how many hours are behind it. A day counts with at least eighteen. And bad days are marked, never deleted. Next, we write the answer on each row. | Three takeaway cards; NEXT chip "the answer column". |

**Voice characters (B): 1,511** (narrator 1,430 + Rishi 81) · 268 words ≈ 1:51.

---

## C · `day_405` · "Where is the answer?"

Ideas: ① the answer is tomorrow's number, written on today's row ② match by date, never by "next row"
③ the question side holds only what exists at 6 pm.
Pinned table (top, all video), R K Puram, real days:

| Day | full day | until 5 pm (known at 6 pm) | answer: tomorrow |
|---|---|---|---|
| 20 Oct 2025 | 320 | 230 | 579 |
| 21 Oct 2025 | 579 | 668 | 235 |
| 9 Jan 2026 | 258 | 240 | 187 |
| 10 Jan 2026 | 187 | 192 | — (no data on 11 Jan) |

Column 4 appears with idea ①, column 3 with idea ③. **Moments: M6, M4, M5, M2** (4).

| # | id | Who | Moment | Line | 🎬 Animation |
|---|---|---|---|---|---|
| 1 | recap | NAR | — | Now we have five hundred seventy-one days, and four hundred eighty-eight that count. But a model learns from questions with answers. And our table has no answer yet. | Pinned table with "Day" and "full day"; an empty dashed column with a "?" header. |
| 2 | flashcard | NAR | **M6** | Imagine every row as a flashcard. On the front, what we know today. On the back, the answer, tomorrow's number. So on twentieth October's row, we write twenty-first October's number. Five hundred seventy-nine. Diwali night arrives as the answer. | A row flips like a card; 21 Oct's 579 lifts up and lands one row higher in "answer: tomorrow"; the other rows follow (235, 187). |
| 3 | onlyvalid | NAR | — | And the answer is written only when tomorrow counts, with at least eighteen hours. Four hundred eighty-seven rows get an answer. | Answer cells fill; invalid tomorrows leave a dash; counter 487. |
| 4 | doubt1 | RISHI | — | Sir, easy. For the answer, just take the next row's number. | Yellow doubt card (low). |
| 5 | nextrow | NAR | **M4** | Careful. Next row is not next day. Look at tenth January. From the eleventh to the nineteenth, the sensor sent nothing. So in the readings, the next row after tenth January is twentieth January. Four hundred fifteen, from ten days later, from a four-hour night. That would be a wrong answer, and nobody would notice. In our table, this trap sits in nine places. | 10 Jan row; a "next row" arrow jumps over 9 empty grey days and grabs 415 (red ✗); then a "next day" arrow lands on 11 Jan, finds nothing, answer stays "—"; counter "9 places". |
| 6 | join | NAR | **M5** | It's like matching payments to orders. You match by order id, never by position in the list. Here, the id is the date. | Two lists, orders and payments; a position-based match draws crossed wrong lines; an id-based match draws straight lines; "id = date". |
| 7 | sixpm | NAR | **M2** | Now the front of the card. Asha decides at six in the evening. At six, does she know today's full number? Think once… no. The evening and the night are still to come. So the front holds only midnight to five pm. On Diwali, at five pm, the day looked like two hundred thirty. By midnight, it was three hundred twenty. | A 6 pm clock; the 24-hour strip greys out after 17:00; "until 5 pm" column fills; on the 20 Oct row, 230 → the night fills in → 320, with the 6 pm line marking what Asha could see. |
| 8 | catch | NAR | — | Here's the catch. If the model peeks at the full day, it looks brilliant on paper, and fails at six pm in real life. So the front of the card holds only what exists at six pm. | A "peek" eye crosses the 6 pm line and gets blocked; scoreboard "on paper ✓ / real life ✗". |
| 9 | recall | NAR | — | So, remember. The answer is tomorrow's number, written on today's row. Match by date, never by next row. And the front of the card holds only what exists at six pm. Next, we score Asha's old method on this table. | Three takeaway cards; NEXT chip "score persistence". |

**Voice characters (C): 1,779** (narrator 1,720 + Rishi 59) · 324 words ≈ 2:14.

**Total DAF-05: 5,052 characters.**
