---
id: DAF-22
title: Docker image, and a container that answers
phase: 8 — Service and delivery
sprint: 6
estimate: 3 h
status: todo
depends_on: [DAF-21]
---

# DAF-22 · Docker image, and a container that answers

## Story

As the developer, I want the service in a container that anyone can run with one
command, so that "it works on my machine" is no longer the only proof.

## Why this ticket exists

A container fixes the Python version, the dependencies and the model file
together. It is the unit that gets deployed anywhere — the same reason you ship
Spring Boot services as images.

## Background

- Base image: an official slim Python image matching the project's Python version.
- The model file goes into the image; the OpenAQ key does **not** — pass it at run
  time with `-e OPENAQ_API_KEY=...` or `--env-file .env`.
- A `.dockerignore` keeps `.venv`, `data/` and notebooks out of the image.
- Run as a non-root user.

## Steps

1. Write `Dockerfile` and `.dockerignore`.
2. Build it. Note the image size.
3. Run it with the key passed in, and `curl /health` and `/forecast` from outside.
4. Run the tests inside the container once.

## Acceptance criteria

- [ ] `docker build` succeeds from a clean checkout
- [ ] `docker run -p 8000:8000 --env-file .env <image>` answers `/health` and `/forecast`
- [ ] `docker history` or a search of the image shows no API key
- [ ] The image runs as a non-root user
- [ ] Image size is recorded in My notes

## Explain back

1. Why must the key not be baked into the image?
2. What does `.dockerignore` save you from?

## My notes

_Image size, and the command that runs it._
