#!/usr/bin/env python3
"""Rebuild everything after a learning session.

    python3 17_Learning_As_Of_Now/shared/build_site.py

Runs, in the order that matters:
  1. build_lessons.py  -> Content/index.html + Content/code.html for every topic
  2. gen_tree.py       -> 17_Learning_As_Of_Now/Claude/tree-data.js
  3. a verification pass that fails loudly on a broken link

Safe to run as often as you like; it is idempotent.
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SHARED = os.path.join(ROOT, "17_Learning_As_Of_Now", "shared")
os.chdir(ROOT)

def run(script, label):
    print(f"\n\033[1m{label}\033[0m")
    r = subprocess.run([sys.executable, os.path.join(SHARED, script)],
                       capture_output=True, text=True)
    tail = [l for l in (r.stdout or "").strip().splitlines() if l.strip()][-3:]
    for l in tail: print("   " + l)
    if r.returncode:
        print("   " + (r.stderr or "").strip()[-500:])
        sys.exit(f"\n{script} failed")

run("build_lessons.py", "1/3  Building lesson + code pages")
run("gen_tree.py",      "2/3  Rebuilding the learning map data")

# ── 3. verify ───────────────────────────────────────────────────────────────
print("\n\033[1m3/3  Verifying\033[0m")
HUB  = "17_Learning_As_Of_Now/Claude"     # paths in tree-data.js are relative to here
tree = open(os.path.join(HUB, "tree-data.js"), encoding="utf-8").read()
problems = []

def real(p):
    """resolve a map-relative path to a repo path"""
    return os.path.normpath(os.path.join(HUB, p))

lessons = re.findall(r'"lesson":\s*"([^"]+)"', tree)
for p in lessons:
    if not os.path.exists(real(p)): problems.append(f"missing lesson page: {p}")
    if p.endswith("code.html"): problems.append(f"lesson points at the code view: {p}")

for p in re.findall(r'"path":\s*"([^"]+)"', tree):
    if not os.path.exists(real(p).rstrip("/")): problems.append(f"missing source: {p}")

# handwritten notes referenced by the map must exist on disk
for m in re.finditer(r'"lesson":\s*"([^"]+)/Content/index\.html"[^}]*?"noteFiles":\s*\[([^\]]*)\]',
                     tree, re.S):
    folder, files = m.group(1), re.findall(r'"([^"]+)"', m.group(2))
    for f in files:
        fp = real(os.path.join(folder, "Handwritten_Notes", f))
        if not os.path.exists(fp): problems.append(f"missing scan: {fp}")

topics = len(re.findall(r'"lesson":', tree))
notes  = sum(len(re.findall(r'"([^"]+)"', m.group(1)))
             for m in re.finditer(r'"noteFiles":\s*\[([^\]]*)\]', tree))
codes  = len(re.findall(r'"hasCode":\s*true', tree))

# every ML topic is a step of the pipeline, so it must appear on the Journey page
jd = open(os.path.join(HUB, "journey-data.js"), encoding="utf-8").read()
mapped = set(re.findall(r'"(\d\d_[A-Za-z_]+/\d\d_[A-Za-z0-9_]+)"', jd))
studied_topics = {re.match(r"(\d\d_[^/]+/\d\d_[^/]+)", p.replace("../../", "")).group(1)
                  for p in lessons}
ml_topics = {m for m in
             (re.match(r"(\d\d_[^/]+/\d\d_[^/]+)", p.replace("../../", "")).group(1)
              for p in lessons)
             if m.startswith("04_ML/")}
unmapped = sorted(ml_topics - mapped)

# every topic the "When to Use What" page links to must exist, and every
# topic that is really a choice should have a card there
cd = open(os.path.join(HUB, "chooser-data.js"), encoding="utf-8").read()
excluded  = set(re.findall(r'"(\d\d_[A-Za-z_]+/\d\d_[A-Za-z0-9_]+)":\s*"', cd))
referenced = set(re.findall(r'"(\d\d_[A-Za-z_]+/\d\d_[A-Za-z0-9_]+)"', cd)) - excluded
for f in sorted(referenced | excluded):
    if not os.path.isdir(f):
        problems.append(f"chooser-data.js points at a folder that does not exist: {f}")

# the drawn flowcharts: every leaf must name a real option, every decision
# must have a tree, or the page silently loses a branch
head, _, flows = cd.partition("const FLOWS = {")
opt_names = set(re.findall(r'^\s*\{ name: "((?:[^"\\]|\\.)*)"', head, re.M))
job_ids   = re.findall(r'^\s*\{ id: "(\w+)", name:', head, re.M)
tree_ids  = set(re.findall(r"^(\w+): \{", flows, re.M))
leaves    = re.findall(r'pick: "((?:[^"\\]|\\.)*)"', flows) + \
            [x for m in re.findall(r"seq: \[([^\]]*)\]", flows)
               for x in re.findall(r'"((?:[^"\\]|\\.)*)"', m)]
for leaf in sorted(set(leaves) - opt_names):
    problems.append(f'chooser-data.js: flowchart leaf "{leaf}" is not a technique on the page')
for j in [j for j in job_ids if j not in tree_ids]:
    problems.append(f'chooser-data.js: decision "{j}" has no flowchart in FLOWS')
for t in sorted(tree_ids - set(job_ids)):
    problems.append(f'chooser-data.js: FLOWS."{t}" has no matching decision')

# ML and statistics topics are decisions; Python and maths are prerequisites
DECIDING = ("04_ML/", "02_DataScience/")
uncarded = sorted({t for t in studied_topics if t.startswith(DECIDING)}
                  - referenced - excluded)

print(f"   {topics} lessons · {codes} code views · {notes} handwritten pages")
if unmapped:
    print("\n\033[33m   NOT ON THE JOURNEY PAGE\033[0m")
    for m in unmapped:
        print(f"     - {m}   → add it to a stage in 17_Learning_As_Of_Now/Claude/journey-data.js")
if uncarded:
    print("\n\033[33m   NOT ON THE WHEN-TO-USE-WHAT PAGE\033[0m")
    for m in uncarded:
        print(f"     - {m}   → add a card in 17_Learning_As_Of_Now/Claude/chooser-data.js,")
        print( "                  or name it in NOT_A_CHOICE there, with the reason")
if problems:
    print("\n\033[31m   PROBLEMS\033[0m")
    for p in problems[:15]: print("     - " + p)
    sys.exit(f"\n{len(problems)} problem(s) found")
print("   \033[32mall links resolve\033[0m")
print("\nOpen 17_Learning_As_Of_Now/Claude/index.html")
