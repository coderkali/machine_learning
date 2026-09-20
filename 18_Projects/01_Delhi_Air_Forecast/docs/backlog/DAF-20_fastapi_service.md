---
id: DAF-20
title: The FastAPI service
phase: 8 — Service and delivery
sprint: 5
estimate: 3 h
status: todo
depends_on: [DAF-19]
---

# DAF-20 · The FastAPI service

## Story

As Asha, I want to open one URL in the evening and read tomorrow's PM2.5, its
category, and what to do about assembly.

## Why this ticket exists

This turns the project from a notebook into a system: a REST endpoint with a
typed contract, the model loaded once at startup, and a health check. This is
familiar ground from Spring Boot — the same ideas, in Python.

## Background

A response shape that works:

```json
{
  "station": "R K Puram",
  "forecast_date": "2026-11-03",
  "pm25": 214.6,
  "category": "Very Poor",
  "action": "Indoors",
  "model_version": "station17-v1",
  "made_at": "2026-11-02T18:00:05+05:30"
}
```

| Spring Boot | FastAPI |
|---|---|
| `@RestController` + `@GetMapping` | `@app.get` |
| DTO class + validation | Pydantic model |
| `@PostConstruct` loading a resource | lifespan startup |
| Actuator `/health` | your own `/health` |

## Steps

1. Add `fastapi` and `uvicorn` to `requirements.txt`, pinned.
2. Create `app/main.py`: load the model once at startup; `GET /health`;
   `GET /forecast` that calls `build_features` for today, predicts, and applies the
   CPCB table and the D-007 threshold if there is one.
3. Pydantic models for the response and for errors.
4. Errors: live data unavailable → 503 with a readable message.
5. Run it with `uvicorn`, call it with `curl`, and look at the auto-generated docs
   at `/docs`.

## Acceptance criteria

- [ ] `uvicorn app.main:app` starts, and `/health` returns 200
- [ ] `/forecast` returns the response shape above for a real evening
- [ ] The category and action come from one shared function, also used in DAF-16
- [ ] Upstream failure gives a 503 with a message, not a stack trace
- [ ] The model file is loaded once, not on every request

## Explain back

1. Why load the model at startup rather than per request?
2. Which Spring Boot concept maps to Pydantic, and what does it protect you from?

## Traps

- Putting feature logic in the endpoint. The endpoint calls `build_features`,
  nothing more.

## My notes

_A real `/forecast` response you got._
