# 18_Projects

End-to-end projects. A project is different from a topic folder: a topic proves
one idea, a project proves that the ideas hold together from raw data to a
running service.

Every project here follows the same shape:

```text
<NN>_Project_Name/
├── README.md          the story and the problem
├── docs/
│   ├── requirements.md    what it must do, and how we know it works
│   ├── backlog/           the tickets, one file each, with acceptance criteria
│   ├── phases/            the research brief for each phase
│   └── decisions/         why we chose X over Y (one file per decision)
├── data/                  raw · interim · processed (never committed)
├── notebooks/             exploration, numbered by ticket
├── src/                   code that graduated out of the notebooks
├── tests/                 pytest
├── models/                the saved pipeline and its model card
├── app/                   the service that serves it
└── Content/               the generated website page
```

| Project | What it answers | Status |
|---|---|---|
| [01_Delhi_Air_Forecast](01_Delhi_Air_Forecast/) | Will Delhi's air be safe for children tomorrow? | 🟡 In progress — Sprint 1 |

Work in `16_Experiments/` instead when the question is small and throwaway. A
project moves here only when it runs end to end and someone other than the
author could start it from its README.
