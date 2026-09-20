---
id: DAF-21
title: Tests for the service, with the APIs mocked
phase: 8 — Service and delivery
sprint: 6
estimate: 2-3 h
status: todo
depends_on: [DAF-20]
---

# DAF-21 · Tests for the service, with the APIs mocked

## Story

As the developer, I want tests that prove the service behaves correctly when the
upstream APIs are healthy, slow, broken or empty, without calling the real APIs.

## Why this ticket exists

Tests that call live APIs fail when the internet does, and cannot create the bad
cases on demand. Mocking the two APIs lets every failure mode be tested in
milliseconds — the same reason you mock downstream services at work.

## Background

- FastAPI's `TestClient` calls the app in-process.
- Mock the HTTP calls with `monkeypatch`, `unittest.mock`, or the `responses` library.
- Put saved example responses in `tests/fixtures/` — small, real-shaped JSON.

## Steps

1. Tests for `/health` and a happy-path `/forecast` using fixture responses.
2. Failure tests: OpenAQ returns 401, 429, 500; Open-Meteo times out; today has
   too few hours.
3. A test that the category boundaries are right: 90 → Moderately polluted,
   91 → Poor.
4. Run the whole suite, including DAF-10's tests.

## Acceptance criteria

- [ ] `pytest` passes with no network access (prove it: turn Wi-Fi off, or block
      sockets in the test config)
- [ ] Each failure case has its own test and asserts the status code and message
- [ ] The boundary test covers 90 and 91
- [ ] The full suite runs in under ten seconds

## Explain back

1. Why must these tests pass without network access?
2. Which failure case did you not think of until writing the tests?

## My notes

_Test count, and the case you had not thought of._
