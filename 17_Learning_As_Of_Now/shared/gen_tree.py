#!/usr/bin/env python3
"""Rebuild the learning map's data from the new folder structure.
Carries the curated details across by matching on file name."""
import os, json, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
OUT  = "17_Learning_As_Of_Now/Claude/tree-data.js"
HUB  = "17_Learning_As_Of_Now/Claude"          # the map lives here
UP   = "../../"                                 # from HUB back to repo root

def load_previous():
    """Curated wording lives in the tree we generated last time. Read it back
    out of tree-data.js so this script needs no external cache file."""
    if not os.path.exists(OUT):
        return []
    src = open(OUT, encoding="utf-8").read()
    body = src[src.index("{"): src.rindex("}") + 1]
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return []                      # hand-edited file: start clean, lose nothing
    flat = []
    def walk(n):
        flat.append({"title": n.get("title", ""), "meta": n.get("meta", ""),
                     "status": n.get("status", ""), "note": n.get("note", ""),
                     "path": n.get("path", ""), "details": n.get("details", [])})
        for c in n.get("children", []): walk(c)
    walk(data)
    return flat

old = load_previous()
STORIES = json.load(open("17_Learning_As_Of_Now/shared/stories.json", encoding="utf-8"))
# index the curated blurbs by the file they described, and by title
by_file, by_title = {}, {}
for n in old:
    if n["path"]:
        by_file[os.path.basename(n["path"].rstrip("/"))] = n
    by_title[n["title"].lower()] = n

SUBJECT_META = {
 "01_Python": ("Python and the data toolkit", "learning"),
 "02_DataScience": ("Statistics, probability and hypothesis testing", "archive"),
 "03_Math": ("Hand-worked mathematics for ML", "archive"),
 "04_ML": ("Classical machine learning — the current course", "learning"),
 "05_Deep_Learning": ("Neural networks, NLP, computer vision, RL", "todo"),
 "06_Transformers_And_Prompting": ("Transformers and prompt engineering", "todo"),
 "07_Retrieval_And_LLM_Apps": ("LangChain, vector databases, RAG", "todo"),
 "08_Agentic_AI": ("Agents, fine-tuning and no-code AI", "todo"),
 "09_MLOps_And_Containers": ("Docker and ML operations", "todo"),
 "10_Data_Platforms": ("Kafka, Spark, Snowflake, Airflow, dbt", "todo"),
 "11_Cloud_And_LLMOps": ("Azure, AWS, GCP and LLMOps", "todo"),
 "12_Analytics_And_BI": ("Excel, Power BI, Tableau, Looker", "todo"),
 "13_SQL_And_Databases": ("MySQL, PostgreSQL and relational data", "todo"),
 "14_System_Design_And_Career": ("AI system design and job readiness", "todo"),
 "15_Docs": ("Roadmap, skills matrix and the knowledge base", "learning"),
 "16_Experiments": ("Scratch work and multi-topic projects", "learning"),
 "17_Learning_As_Of_Now": ("This map, and the earlier attempts at one", "learning"),
}
BRANCH_OF = {s: i % 3 for i, s in enumerate(SUBJECT_META)}

def pretty(name):
    n = re.sub(r"^\d+[_-]", "", name).replace("_", " ")
    fix = {"Ml":"ML","Eda":"EDA","Knn":"KNN","Roc":"ROC","Auc":"AUC","Sql":"SQL",
           "Kmeans":"K-Means","Llm":"LLM","Mlops":"MLOps","Bi":"BI","Ai":"AI"}
    return " ".join(fix.get(w.capitalize(), w) for w in n.split())

def files_in(d):
    if not os.path.isdir(d): return []
    return sorted(f for f in os.listdir(d) if not f.startswith("."))

def topic_node(subject, topic):
    tdir = os.path.join(subject, topic)
    concept = files_in(os.path.join(tdir, "Concept"))
    content = files_in(os.path.join(tdir, "Content"))
    data    = files_in(os.path.join(tdir, "Data"))

    # carry the curated blurb across from whichever file it described
    cur = None
    for f in concept:
        if f in by_file: cur = by_file[f]; break
    if cur is None:
        cur = by_title.get(pretty(topic).lower())

    nb  = [f for f in concept if f.endswith(".ipynb")]
    mds = [f for f in concept if f.lower().endswith((".md", ".mdx"))]
    # index.html is the lesson; code.html is the code view, never the lesson
    html= [f for f in content if f == "index.html"] or \
          [f for f in content if f.endswith(".html") and f != "code.html"]

    bits = []
    if nb:   bits.append(f"{len(nb)} notebook" + ("s" if len(nb) > 1 else ""))
    if mds:  bits.append(f"{len(mds)} note" + ("s" if len(mds) > 1 else ""))
    if data: bits.append(f"{len(data)} data file" + ("s" if len(data) > 1 else ""))
    meta = " · ".join(bits) or "folder"

    node = {"title": pretty(topic), "meta": meta,
            "status": cur["status"] if cur else SUBJECT_META[subject][1]}
    if cur and cur.get("note"):    node["note"] = cur["note"]
    if cur and cur.get("details"): node["details"] = cur["details"]
    else:
        node["details"] = [f"Concept: {f}" for f in concept[:6]] or ["(no notes yet)"]
    hn = [f for f in files_in(os.path.join(tdir, "Handwritten_Notes"))
          if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))]
    if hn:
        node["notes"] = len(hn)
        node["noteFiles"] = hn
    if os.path.exists(os.path.join(tdir, "Content", "code.html")):
        node["hasCode"] = True
    st = STORIES.get(f"{subject}/{topic}")
    if st:
        node["lede"] = st["lede"]
        node["hasStory"] = True
    if html:
        node["lesson"] = UP + os.path.join(tdir, "Content", html[0])
    main = (nb + mds + concept)[0] if concept else None
    node["path"] = UP + (os.path.join(tdir, "Concept", main) if main else tdir)
    return node

tree = {"title": "MACHINE_LEARNING", "meta": "My complete AI/ML learning repository",
        "status": "learning", "kind": "root", "children": []}

for subject, (blurb, st) in SUBJECT_META.items():
    if not os.path.isdir(subject): continue
    topics = [t for t in sorted(os.listdir(subject))
              if os.path.isdir(os.path.join(subject, t)) and not t.startswith(".")]
    kids = []
    for t in topics:
        sub = os.path.join(subject, t)
        # a topic folder has Concept/Content/Data; anything else is listed plainly
        if any(os.path.isdir(os.path.join(sub, x)) for x in ("Concept", "Content", "Data")):
            kids.append(topic_node(subject, t))
        else:
            fl = []
            for dp, dn, fn in os.walk(sub):
                fl += [f for f in fn if not f.startswith(".")]
            kids.append({"title": pretty(t), "meta": f"{len(fl)} files",
                         "status": st, "details": sorted(fl)[:8],
                         "path": UP + sub})
    loose = [f for f in os.listdir(subject)
             if os.path.isfile(os.path.join(subject, f)) and not f.startswith(".")]
    if loose and not kids:
        kids.append({"title": "Documents", "meta": f"{len(loose)} files",
                     "status": st, "details": sorted(loose)[:10], "path": UP + subject})
    node = {"title": subject.replace("_", " ", 1).replace("_", " "),
            "meta": blurb, "status": st, "kind": "branch",
            "path": UP + subject, "children": kids}
    if loose and kids:
        node["children"].append({"title": "Documents in this folder",
                                 "meta": f"{len(loose)} files", "status": st,
                                 "details": sorted(loose)[:12], "path": UP + subject})
    tree["children"].append(node)

body = "/* Learning tree — generated from the folder structure on disk.\n" \
       "   Regenerate after moving files; curated details are carried across by file name. */\n\n" \
       "const TREE = " + json.dumps(tree, indent=2, ensure_ascii=False) + ";\n"
open(OUT, "w").write(body)

def leaves(n):
    return 1 if not n.get("children") else sum(leaves(c) for c in n["children"])
print(f"subjects : {len(tree['children'])}")
print(f"topics   : {leaves(tree)}")
carried = sum(1 for s in tree["children"] for t in s["children"]
              if t.get("details") and not str(t["details"][0]).startswith("Concept:"))
print(f"topics with curated detail carried over : {carried}")
print(f"lessons wired : {sum(1 for s in tree['children'] for t in s['children'] if t.get('lesson'))}")
