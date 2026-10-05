# DAF-01 · "Before ML, we build the house" — script v2 (≈4 min)

v1 was a setup walkthrough (folders, commands, file lines) — rejected: videos teach CONCEPTS,
the code is shared on GitHub. v2 = the idea behind DAF-01: **reproducibility**, built on four concepts.
Sources: DAF-01 ticket (Why this ticket exists · Background · Explain back), project README.

Concepts: **reproducibility** → ① own environment ② exact versions ③ one package for the real code
④ share the recipe, never the secret.

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap | NAR | Last time, in the trailer, we met Asha madam, and we learned that one number, ninety-one, decides if six hundred children go outside. But before we can predict that number, every real project must answer one question first. |
| 2 | question | NAR | If my laptop breaks tomorrow, can someone else run this project, and get exactly the same result? In ML, this idea has a name. Reproducibility. And today's ticket is all about it. |
| 3 | matters | NAR | See, why does it matter so much in ML? Let's say our model says, tomorrow will be Poor, keep the children inside. And someone asks, how did you get this answer? If I cannot run the same code, on the same data, with the same libraries, and get the same number again, then I cannot explain it. And I cannot trust it. |
| 4 | java | NAR | As Java developers, we already know this very well. Nobody writes a controller before the project has its structure and its pom.xml. But Python lets you skip all of that, and start typing in a notebook on day one. And here's the catch. That freedom is exactly why so many ML projects cannot be run a second time. |
| 5 | four | NAR | So reproducibility stands on four simple ideas. Let's take them one by one. |
| 6 | isolation | NAR | Idea one. Every project lives in its own room. Just think once. On one laptop, I have many Python projects. One needs a new version of a library, another one needs an old version. If they all share one Python, upgrading for one project silently breaks the other. So each project gets its own isolated environment. In Python, we call it a virtual environment. |
| 7 | doubt1 | RISHI | Sir, in Java I never needed this. Why does Python need it? |
| 8 | answer1 | NAR | Because in Java, Maven already does it for you. It keeps every library version separately, and each project picks exactly what it needs. Python, by default, has one shared shelf for everyone. The virtual environment gives every project its own shelf. Same idea, different tool. |
| 9 | versions | NAR | Idea two. Write down exactly what you need. A recipe that says, some flour, gives a different cake every time. A recipe that says, two hundred grams, gives the same cake in any kitchen. So we list every library the project needs, with its exact version. And we write that list ourselves, so we know why each library is there, instead of copying everything that happens to be installed. |
| 10 | package | NAR | Idea three. Code that lives in a notebook is stuck in that notebook. If the cleaning logic sits in cell number forty, the tests cannot use it, and later the API cannot use it. So the real code lives in one package, and every notebook, every test, and the API import the same code. One source of truth. |
| 11 | doubt2 | RISHI | Sir, so notebooks are bad? |
| 12 | answer2 | NAR | No, no. Notebooks are great for exploring. For trying ideas, for drawing charts. But once an idea works, it moves into the package. Explore in the notebook. Keep the final code in the package. |
| 13 | share | NAR | Idea four. Be careful about what you share. Our data source needs a secret key. That key must never go online. So the secret stays only on my machine, and what we share is an empty template that simply says, you need a key here. |
| 14 | doubt3 | RISHI | Sir, and the data? Do we share that? |
| 15 | answer3 | NAR | No. We share the code that downloads the data, not the data itself. Data is big, and it can always be downloaded again. The code is small, and it is the real recipe. Share the recipe, and anyone can cook the same dish. |
| 16 | asha | NAR | So what did DAF-01 give Asha madam? Nothing she can see. No forecast yet. But from now on, every number we show her can be produced again, by anyone, on any machine. And that is what makes a forecast trustworthy. |
| 17 | recall | NAR | So, remember. Reproducibility means same code, same data, same libraries, same answer. And it stands on four ideas. Its own environment. Exact versions. One package for the real code. And share the recipe, never the secret. The full code is on GitHub. |
| 18 | next | NAR | Next time, DAF-02. Before we touch any data, we write down exactly what Asha madam needs. |
