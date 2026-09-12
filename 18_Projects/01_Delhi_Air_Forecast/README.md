# Delhi Air Forecast

> 🧪 **My Experiment** — my own project, not part of the instructor curriculum.
> It counts as evidence of skill, not as bootcamp completion.

**Asha runs a primary school in Delhi.** Every evening she has to decide one
thing: does tomorrow's morning assembly happen outdoors, or do the children stay
inside?

She tried the obvious thing. She checks today's air quality reading, and assumes
tomorrow will be about the same. That works on most days, and fails on exactly
the days that matter — the evening the wind drops, the week the crop-burning
smoke arrives, the morning after Diwali. On those days she keeps 600 children
outside in air she would never have chosen for them.

So she needs tomorrow's number tonight, not today's number again.

## What this project builds

A service that answers, every evening: **what will tomorrow's PM2.5 be in
Delhi, and is that safe for children?**

- It learns from years of real government sensor readings and real weather.
- It is judged against Asha's own method — "tomorrow will be like today". If it
  cannot beat that, it is not worth running.
- It ends as a REST endpoint in a container, so it is a system, not a notebook.

## Status

| | |
|---|---|
| Phase | 1 of 8 — Requirements and setup |
| Sprint | 1 |
| Board | [docs/backlog/README.md](docs/backlog/README.md) |
| Started | 2026-09-12 |

## How to run

_Filled in during DAF-01 and completed in DAF-27. Until then there is nothing
to run._

## How we work

- The work is cut into day-sized tickets in [docs/backlog/](docs/backlog/), each
  with acceptance criteria. One ticket is roughly one 2–3 hour sitting.
- I write the code. Claude writes the ticket, the research brief behind it, and
  verifies the result against the acceptance criteria before the next ticket
  opens.
- Every real choice becomes a file in [docs/decisions/](docs/decisions/), so that
  in three months the reason is still on disk.

## Data sources

| Source | Used for | Key needed |
|---|---|---|
| [OpenAQ S3 archive](https://docs.openaq.org/aws/about) | Real sensor history — the data we train on | No |
| [OpenAQ API v3](https://docs.openaq.org) | Station list, and live readings at prediction time | Yes, free |
| [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) | Weather history | No |
| [Open-Meteo forecast](https://open-meteo.com/en/docs) | Tomorrow's weather, at prediction time | No |
