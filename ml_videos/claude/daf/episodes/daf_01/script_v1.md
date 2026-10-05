# DAF-01 · Project skeleton — script v1 (≈5 min)

Source: `18_Projects/01_Delhi_Air_Forecast/docs/backlog/DAF-01_project_skeleton.md` + the real
files (`requirements.txt` = 10 pinned libs, `pyproject.toml` requires-python ≥ 3.12, `.venv` = Python 3.12.14,
`.gitignore`, `.env.example`). Kali (2026-10-04): explain every piece, stay on the ticket, calm pace,
longer is fine. Spoken form for code ("dot venv"); the screen will show the real code.
Shape: last time → why this ticket → each step (with Rishi's doubts) → recall → next.

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap | NAR | Last time, in the trailer, we met Asha madam, Rishi, and the rival. We learned one number, PM2.5, and one line, ninety-one. Today is episode one, DAF-01. And here is the surprising part. Today, we will not write a single line of ML. Today, we build the house. |
| 2 | why | NAR | See, why start with the house? Let's say you join a new Spring Boot project. Before you write one controller, what do you do? You run spring init. You get the folders, the pom.xml, the packages. Only then do you write code. |
| 3 | catch | NAR | Python lets you skip all of that. You can open a notebook and start typing on day one. And here's the catch. That is exactly why so many ML projects cannot be run a second time. Sometimes not even by the person who wrote them. |
| 4 | goal | NAR | So the goal of DAF-01 is simple. Anybody, on any machine, should be able to rebuild this project from scratch. And my secret API key should never reach GitHub. Six steps. Let's go one by one. |
| 5 | folders | NAR | Step one: the folders. A data folder, with three rooms inside. Raw, for the data exactly as it arrives. Interim, for the in-between work. And processed, for data that is ready for the model. Then notebooks, for exploring. Src, for the real code. Tests. Models, for the saved models. And app, for the service at the end. |
| 6 | folders2 | NAR | Every project in my projects folder follows this same shape. So in any project, I always know where each thing lives. |
| 7 | venv | NAR | Step two, and this one is new for a Java developer. A virtual environment. Just think once. On one laptop, I have many Python projects. One needs a new version of pandas, another one still needs an old version. If they all share one Python installation, upgrading for one project can silently break the other. |
| 8 | venv2 | NAR | So every project gets its own Python, in a folder called dot venv. We create it with python minus m venv dot venv, and then we activate it. And one small habit, every time you open a terminal: type which python. If the path points inside dot venv, you are safe. If not, you are installing into the wrong place. |
| 9 | doubt1 | RISHI | Sir, in Java I never needed this. Why does Python need it? |
| 10 | answer1 | NAR | Good question. In Java, Maven keeps every version of a library separately, and each project's pom.xml picks exactly the one it needs. Python, by default, has one shared place for libraries. The virtual environment gives each project its own place. Same idea, different tool. |
| 11 | reqs | NAR | Step three: requirements dot txt. This is our pom.xml. Ten libraries, written by hand. Pandas and numpy for tables and numbers. Requests to call the data API. Python dotenv to read the secret key. Matplotlib and seaborn for charts. Scikit-learn for the models. Jupyter for notebooks. Pytest for tests. And pyarrow to save tables fast. |
| 12 | pinned | NAR | And every line is pinned with two equal signs. For example, pandas equals equals two point two point three. Pinned means one thing: on any machine, the exact same version gets installed. |
| 13 | freeze | NAR | Now, why write it by hand? There is a shortcut called pip freeze. It dumps every library on your machine, including the ones that only came along for the ride. Then you can no longer tell what you asked for from what just came with it. So, ten lines, and for each one I can tell you why it is there. |
| 14 | python | NAR | One more thing about versions. My laptop has Python three point fourteen. But a brand-new Python sometimes does not have ready packages for every library yet. So this project runs on Python three point twelve. |
| 15 | editable | NAR | Step four. My own code lives in src, in a package called delhi air. I want to import it from everywhere. From a notebook, from a test, and later from the API. So we write a small pyproject dot toml, and we run pip install minus e dot. |
| 16 | doubt2 | RISHI | Sir, what does the minus e do? |
| 17 | answer2 | NAR | E means editable. It is like installing your JAR into the local Maven repository, so other code can import it. But with one difference. Here, it is a live link. You change the code, and the next import already sees the change. No rebuild, no reinstall. |
| 18 | check | NAR | And how do we know it worked? We ask Python itself. Import delhi air, and print where it lives. If the path points inside src, the link is working. |
| 19 | gitignore | NAR | Step five: dot gitignore. And here's the catch again. Write it before you create anything heavy. Otherwise, one careless commit can push thousands of files from dot venv to GitHub. So we ignore dot venv, dot env, data, models, pycache, notebook checkpoints, and egg info. |
| 20 | secret | NAR | Step six: the secret. Later, our data comes with an API key from OpenAQ. The real key lives in a file called dot env, and git ignores it. Next to it, we commit dot env dot example. Same name, empty value. So a new person knows exactly which key they need, without ever seeing mine. |
| 21 | doubt3 | RISHI | Sir, we ignore the data folder. Then how will someone else get the data? |
| 22 | answer3 | NAR | That is the right question. We do not commit the data. We commit the code that downloads the data. Data is big, and it can always be downloaded again. The script is small, and it is the real recipe. So keep the recipe in git, and anyone can cook the dish again. |
| 23 | finish | NAR | Last, we write in the README how to set up the project, and we make one commit, with a message that says what changed and why. And that is DAF-01. No model, no data. Just a house where everything has its place. |
| 24 | recall | NAR | So, let's remember. Folders: raw, interim, processed. One project, one virtual environment, and always check which python. Requirements pinned by hand. Pip install minus e, for a live link to your own code. And the secret stays in dot env, while dot env example goes to git. |
| 25 | next | NAR | Next time, DAF-02. Before we touch any data, we write down exactly what Asha madam needs. |
