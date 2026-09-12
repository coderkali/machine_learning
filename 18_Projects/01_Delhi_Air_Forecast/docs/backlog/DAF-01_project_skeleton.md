---
id: DAF-01
title: Project skeleton and environment
phase: 1 — Requirements and setup
sprint: 1
estimate: 2-3 h
status: todo
depends_on: []
---

# DAF-01 · Project skeleton and environment

## Story

As the developer, I want the project to have its own folders, its own Python
environment and its own pinned dependency list, so that the project can be
rebuilt from scratch on another machine and my API key can never be committed.

## Why this ticket exists

This is the `spring init` step. In a Spring Boot service you would never start
writing a controller before the project, the `pom.xml` and the packages exist.
Python lets you skip all of that and start typing in a notebook, which is
exactly why so many ML projects end up impossible to run twice.

Two things here are new to you and worth slowing down for: a **virtual
environment** (this project's own Python, so its library versions cannot be
broken by another project) and **`pip install -e .`** (your own code becomes an
importable library, the way installing your JAR into the local Maven repository
makes it importable).

## Background

- Your machine has Python 3.14 and Docker 29.2.1. Both are fine.
- The repository root `.gitignore` covers only `__pycache__`, `.ipynb_checkpoints`
  and `.DS_Store`. It does **not** cover `.venv`, `.env` or data files, so this
  project needs its own `.gitignore`.
- `requirements.txt` is this project's `pom.xml`. Write it by hand with pinned
  versions. Do not generate it with `pip freeze` — freeze dumps every transitive
  dependency, and you lose the distinction between what you asked for and what
  came along for the ride.

## Steps

1. Branch: `git checkout -b project/daf-phase-1`.
2. From the project folder, create the tree:
   `data/raw`, `data/interim`, `data/processed`, `notebooks`, `src/delhi_air`,
   `tests`, `models`, `app`.
3. `python3 -m venv .venv`, then activate it. Check that `which python` now
   points inside `.venv`.
4. Write `requirements.txt` by hand, pinned with `==`. Start with only what
   Sprint 1 and 2 need: pandas, numpy, requests, python-dotenv, pyarrow,
   matplotlib, seaborn, scikit-learn, jupyter, pytest. Install it.
5. Write a minimal `pyproject.toml` that declares the package in `src/`, then
   `pip install -e .`.
6. Write `.gitignore`: `.venv/`, `.env`, `data/`, `models/`, `__pycache__/`,
   `.ipynb_checkpoints/`, `*.egg-info/`.
7. Write `.env.example` holding `OPENAQ_API_KEY=` with no value. The real
   `.env` arrives in DAF-03.
8. Fill in the *How to run* section of the project README: Python version, how
   to create the environment, how to install.
9. Commit.

## Acceptance criteria

- [ ] `git status` in a clean tree shows no `.venv`, no `.env`, no `data/`
- [ ] `git check-ignore -v .env` prints the rule that ignores it
- [ ] Every line in `requirements.txt` is pinned with `==`, and every library
      listed is one you can say the purpose of
- [ ] `pip install -r requirements.txt` completes with no error inside the venv
- [ ] `python -c "import delhi_air; print(delhi_air.__file__)"` prints a path
      inside `src/delhi_air/`
- [ ] The folder tree matches the layout in `18_Projects/README.md`
- [ ] The README says which Python version you used and how to set the project up
- [ ] One commit on the branch, with a message that says what changed and why

## Explain back

Answer in *My notes* below, in your own words:

1. What breaks if two projects on this laptop share one Python installation?
2. What does `pip install -e .` give you that plain `import` from a notebook
   does not?
3. `data/` is ignored by git, but the script that downloads the data is not.
   Why is that the right way round?

## Traps

- Creating `.venv` before writing `.gitignore`, then committing 4,000 files.
- Running `pip install` with the environment not activated. Check `which python`
  every time you open a new terminal.
- If a library has no wheel for Python 3.14 yet, stop and tell me the error
  rather than fighting it. We pick a version, or we pin the project to 3.12.

## My notes

_Your answers and anything that surprised you._
