# Phase 1 brief · What are we actually building?

Read this before DAF-02. It gives you the two decisions to make, the options for
each, and my recommendation. You choose. If you choose against a
recommendation, that is fine — write down why, and I will tell you honestly
what it makes harder later.

## How an ML requirement is written

An ordinary requirement says what the system does. An ML requirement has to say
something extra: **how wrong it is allowed to be, and compared to what**. A
model is never right or wrong, only better or worse than the alternative.

So the document answers five questions:

| Question | If you skip it |
|---|---|
| What decision does this support? | You cannot say which mistakes are expensive |
| What exactly is predicted? | Two people build two different target columns |
| When is the prediction made? | You use data that will not exist at 6 pm, and the model dies in production |
| What score counts as success? | Every model looks fine |
| What must it beat? | You ship something worse than doing nothing |

The last one is the one beginners skip, and it is the most important. In this
project Asha already has a method: *tomorrow will be like today*. That is the
**persistence baseline**. It is free, it needs no model, and on most days it is
right. Your model has to beat it, and it is harder to beat than it sounds.

## Background you need: what the numbers mean

PM2.5 is dust finer than 2.5 micrometres — small enough to pass into the blood
from the lungs. It is measured in micrograms per cubic metre (µg/m³).

India's National Air Quality Index (CPCB) turns that concentration into six
named categories. The category names below come from CPCB's own *About National
Air Quality Index* document; the PM2.5 bands are the standard 24-hour
breakpoints, and CPCB's document confirms the first two directly (the sub-index
is 51 at 31 µg/m³ and 100 at 60 µg/m³).

| Category | AQI | PM2.5, 24-hour mean (µg/m³) | What Asha does |
|---|---|---|---|
| Good | 0–50 | 0–30 | Assembly outside |
| Satisfactory | 51–100 | 31–60 | Assembly outside |
| Moderately polluted | 101–200 | 61–90 | Outside, but no running |
| Poor | 201–300 | 91–120 | Indoors |
| Very Poor | 301–400 | 121–250 | Indoors |
| Severe | 401–500 | 250+ | Indoors, and parents told |

Two things to notice. First, Delhi in winter lives in the bottom three rows, so
"unhealthy" is not a rare event — which changes what a good score looks like.
Second, **the line Asha cares about sits at 90**, between "outside" and
"indoors". An error of 10 µg/m³ at a true value of 40 costs nothing. The same
error at a true value of 85 changes her decision. Keep that in mind when you
pick the metric.

## Decision D-001 — what does the model output?

**Option A — a number (regression).** Predict tomorrow's PM2.5 in µg/m³.
Asha reads the number and applies the table herself.
*For:* keeps all the information; one model answers every threshold anyone
might care about; MAE is easy to explain.
*Against:* does not directly optimise the decision she actually makes.

**Option B — a category (classification).** Predict "safe" or "unsafe"
directly.
*For:* matches her decision exactly; you get precision, recall and a confusion
matrix, which are the natural way to talk about the cost of being wrong.
*Against:* throws away information — 91 and 400 become the same answer; and if
you later want a different threshold, you retrain.

**Option C — predict the number, then apply the table.** One regression model,
and the category is derived by a fixed rule.
*For:* you get both answers from one model, you can measure MAE *and* the
decision quality, and changing the threshold later costs nothing.
*Against:* the model spends effort on being accurate at 350 µg/m³, where the
decision is not in doubt.

**My recommendation: Option C.** It is what most forecasting teams ship, it
gives you both families of metric — which closes a real gap in your
learning — and it keeps the threshold a business decision rather than something
baked into the weights.

## Decision D-002 — when, and for what window?

Asha decides in the evening, so the prediction has to exist in the evening.
Say **18:00 IST today, for tomorrow**.

That timing has a consequence people miss: at 18:00, *today is not over*. You
have today's readings up to 17:00 and no further. So "today's daily average"
is not something you can use as an input. This single fact will govern the
feature contract in DAF-15, and it is the most common way a forecasting model
looks brilliant in a notebook and useless in production.

Now, tomorrow's *what*?

**Option A — tomorrow's 24-hour mean (00:00–23:59 IST).**
*For:* this is exactly what the NAQI bands are defined on, so the category is
meaningful and the language matches what parents already hear on the news. Less
noisy, so easier to learn.
*Against:* it includes the small hours, when Asha's children are asleep.

**Option B — tomorrow's morning window (07:00–10:00 IST).**
*For:* this is literally her decision — assembly time.
*Against:* a three-hour window is noisier and harder to predict, and the NAQI
bands do not strictly apply to it, so the category names become approximate.

**My recommendation: Option A for version one**, with Option B written down as
the obvious version two. Start on the target the whole country already reports,
get the pipeline working end to end, then sharpen the window once you know what
your error looks like.

## The metric

Pick one headline metric and one safety metric.

| Metric | Reads as | Watch out |
|---|---|---|
| **MAE** | "on average we are 18 µg/m³ out" | Treats an error at 40 like an error at 90 |
| RMSE | punishes large misses harder | Harder to explain to Asha; dominated by smog spikes |
| MAPE | percentage error | Explodes on clean days when the true value is near zero — bad fit here |
| **Recall on "Poor or worse" days** | "we caught 8 of the 10 bad days" | Can be gamed by always saying "bad" — read it next to precision |

**Recommendation:** MAE as the headline, plus recall on days at 91+ as the
safety metric, because the expensive mistake is not a wrong number — it is
telling Asha the air is fine when it is not.

Write the success criterion as a comparison, for example: *"beat the
persistence baseline's MAE by at least 10% on the held-out test period, without
recall on Poor-or-worse days falling below the baseline's."* You do not know
the baseline's numbers yet — that is DAF-17. Set the target as a percentage
now, fill in the absolute number then, and record it as a decision if it has to
move.

## Constraints and risks to write down

- **Freshness.** The S3 archive lags 72 hours. Live serving must use the API.
- **Sensors fail.** Some hours and some whole days will be missing. Your target
  definition needs a rule for that (a common one: a day needs at least 18 valid
  hours, or it is not a day).
- **Rate limits.** 60 requests a minute, 2,000 an hour.
- **The train/serve gap.** In training you will use tomorrow's *actual*
  weather. In production you only have tomorrow's *forecast*, which is wrong in
  its own way. Note it now; handle it in DAF-15.
- **Festivals and stubble burning** are real, sharp, and not in the weather
  data. Decide whether a calendar flag is in scope.

## Non-goals — write at least three

Suggestions, if you agree with them: no hourly forecast, only daily; no other
pollutants; no other city; no mobile app; no user accounts; no forecast beyond
one day ahead. Non-goals are not laziness. They are the sentence that stops the
project from growing sideways for six months.
