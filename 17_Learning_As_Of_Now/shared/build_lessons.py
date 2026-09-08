#!/usr/bin/env python3
"""Build a Content/index.html lesson page for every topic folder.

Reads the topic's Concept/ notebooks and notes, renders them with the shared
lesson design, extracts the real plot images, and prepends a hand-written story
from stories.json when one exists.

    python3 17_Learning_As_Of_Now/shared/build_lessons.py [--only 04_ML] [--force]
"""
import os, re, sys, json, base64, html as H
import mistune

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
SHARED = "17_Learning_As_Of_Now/shared"
STORIES = json.load(open(f"{SHARED}/stories.json", encoding="utf-8"))
ONLY  = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
FORCE = "--force" in sys.argv

SUBJECT_TITLE = {
 "01_Python": "Python and the data toolkit", "02_DataScience": "Data science and statistics",
 "03_Math": "Mathematics for ML", "04_ML": "Machine learning",
}

# ── markdown → our design system ────────────────────────────────────────────
class R(mistune.HTMLRenderer):
    def heading(self, text, level, **a):
        if level <= 2:
            slug = re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", text).lower()).strip("-")[:48]
            if not slug or slug[0].isdigit():
                slug = "s-" + slug          # an id must not start with a digit
            return f'<h2 id="{slug}">{text}</h2>\n'
        return f"<h3>{text}</h3>\n"
    def block_code(self, code, info=None):
        lang = (info or "").strip().lower()
        if lang in ("python", "py"):
            return f'<div class="code"><pre class="py">{H.escape(code)}</pre></div>\n'
        if lang == "mermaid":
            return ('<div class="code"><div class="code-head"><span>flow diagram '
                    '(rendered in the notebook)</span></div>'
                    f'<pre class="flow">{H.escape(code)}</pre></div>\n')
        return f'<div class="code"><pre>{H.escape(code)}</pre></div>\n'
    def block_quote(self, text):
        return f'<div class="note"><div class="h">Note</div>{text}</div>\n'
    def table(self, text):   return f'<table class="tbl">{text}</table>\n'
    def image(self, text, url, title=None):
        return f'<figure class="shot"><img src="{url}" alt="{H.escape(text or "")}">' \
               + (f"<figcaption>{H.escape(text)}</figcaption>" if text else "") + "</figure>"

MD = mistune.create_markdown(renderer=R(escape=False),
                             plugins=["table", "strikethrough", "footnotes"])

MATH = re.compile(r"\$\$(.+?)\$\$", re.S)
def render_md(src):
    src = MATH.sub(lambda m: f"\n\n<div class='formula'>{H.escape(m.group(1).strip())}</div>\n\n", src)
    return MD(src)

# ── notebook → sections ─────────────────────────────────────────────────────
def render_notebook(path, assets_dir, prefix):
    nb = json.load(open(path, encoding="utf-8"))
    out, n_img = [], 0
    for i, c in enumerate(nb.get("cells", [])):
        src = "".join(c.get("source", ""))
        if c["cell_type"] == "markdown":
            if src.strip(): out.append(render_md(src))
            continue
        if not src.strip(): continue
        out.append('<div class="code"><div class="code-head">'
                   f'<span>code</span><span class="cell">cell {i}</span></div>'
                   f'<pre class="py">{H.escape(src.rstrip())}</pre></div>')
        texts, imgs = [], []
        for o in c.get("outputs", []):
            if o.get("output_type") == "stream":
                texts.append("".join(o.get("text", "")))
            d = o.get("data", {})
            if "image/png" in d:
                n_img += 1
                fn = f"{prefix}-c{i:02d}-{n_img}.png"
                os.makedirs(assets_dir, exist_ok=True)
                with open(os.path.join(assets_dir, fn), "wb") as fh:
                    fh.write(base64.b64decode(d["image/png"]))
                imgs.append(fn)
            elif "text/plain" in d and "image/png" not in d:
                texts.append("".join(d["text/plain"]))
            if o.get("output_type") == "error":
                texts.append("\n".join(o.get("traceback", []))[:1200])
        blob = "\n".join(t.rstrip() for t in texts if t.strip())[:2600]
        if blob:
            out.append('<div class="out"><div class="h">Output</div>'
                       f'<pre>{H.escape(re.sub(chr(27)+r"\[[0-9;]*m", "", blob))}</pre></div>')
        for fn in imgs:
            out.append(f'<figure class="shot"><img src="assets/{fn}" alt="plot from this notebook">'
                       '<figcaption>Output from this notebook.</figcaption></figure>')
    return "\n".join(out)

# ── repair relative links that the notes inherited from their old folders ──
_INDEX = {}
def _build_index():
    for dp, dn, fn in os.walk("."):
        if any(x in dp for x in (".git", "venv", "pizza_env", ".ipynb_checkpoints")): continue
        for f in fn: _INDEX.setdefault(f, []).append(os.path.normpath(os.path.join(dp, f)))

REF = re.compile(r'(<(?:img|a)\b[^>]*?\b(?:src|href)=")([^"#][^"]*?)(")', re.I)
def fix_refs(page, tdir, odir):
    """Point every relative link at wherever that file actually lives now."""
    if not _INDEX: _build_index()
    def one(m):
        pre, ref, post = m.groups()
        if ref.startswith(("http", "mailto:", "data:", "assets/", "../")): return m.group(0)
        if os.path.exists(os.path.join(odir, ref)): return m.group(0)
        base = os.path.basename(ref.rstrip("/"))
        cands = _INDEX.get(base)
        if not cands:                                  # maybe it names a folder
            for root, dirs, _ in os.walk("."):
                if any(x in root for x in (".git", "venv", "pizza_env")): continue
                if base in dirs:
                    return pre + os.path.relpath(os.path.join(root, base), odir) + post
            return m.group(0)
        def rank(c):
            if c.startswith(os.path.join(tdir, "Data")):    return 0
            if c.startswith(os.path.join(tdir, "Concept")): return 1
            if c.startswith(tdir):                          return 2
            return 3
        best = sorted(cands, key=rank)[0]
        return pre + os.path.relpath(best, odir) + post
    return REF.sub(one, page)

HN_DIR = "Handwritten_Notes"
IMG = (".png", ".jpg", ".jpeg", ".webp")

def handwritten(tdir):
    d = os.path.join(tdir, HN_DIR)
    if not os.path.isdir(d): return []
    return sorted(f for f in os.listdir(d) if f.lower().endswith(IMG))

def gallery_html(scans):
    """The block injected into every lesson page, between markers."""
    if not scans:
        return "<!-- HANDWRITTEN:START --><!-- HANDWRITTEN:END -->"
    thumbs = "".join(
        f'<button class="hn-thumb" data-src="../{HN_DIR}/{H.escape(f)}" '
        f'data-name="{H.escape(f)}">'
        f'<img src="../{HN_DIR}/{H.escape(f)}" alt="{H.escape(f)}" loading="lazy">'
        f'<span>{H.escape(os.path.splitext(f)[0].replace("_", " "))}</span></button>'
        for f in scans)
    return ("<!-- HANDWRITTEN:START -->\n"
            '<h2 id="handwritten">\u270D\uFE0F Handwritten notes</h2>\n'
            "<p>The pages written by hand while working through this topic \u2014 "
            "the version that came before the tidy write-up. Click any page to enlarge.</p>\n"
            f'<div class="hn-grid">{thumbs}</div>\n'
            "<!-- HANDWRITTEN:END -->")

def build_code_page(subject, topic, tdir, odir, title):
    """A plain, syntax-highlighted view of every code cell in the topic."""
    cdir = os.path.join(tdir, "Concept")
    nbs = sorted(f for f in os.listdir(cdir) if f.endswith(".ipynb"))
    pys = sorted(f for f in os.listdir(cdir) if f.endswith(".py"))
    if not nbs and not pys: return False
    out, n = [], 0
    for f in nbs:
        nb = json.load(open(os.path.join(cdir, f), encoding="utf-8"))
        out.append(f'<div class="src-head">\U0001F4D3 <a href="../Concept/{H.escape(f)}">'
                   f'{H.escape(f)}</a></div>')
        for i, c in enumerate(nb.get("cells", [])):
            if c["cell_type"] != "code": continue
            src = "".join(c.get("source", "")).rstrip()
            if not src.strip(): continue
            n += 1
            texts = []
            for o in c.get("outputs", []):
                if o.get("output_type") == "stream": texts.append("".join(o.get("text", "")))
                d = o.get("data", {})
                if "text/plain" in d and "image/png" not in d: texts.append("".join(d["text/plain"]))
                if o.get("output_type") == "error":
                    texts.append("\n".join(o.get("traceback", []))[:600])
            blob = "\n".join(t.rstrip() for t in texts if t.strip())[:1400]
            out.append('<div class="code"><div class="code-head"><span>In [' + str(n) +
                       ']</span><span class="cell">cell ' + str(i) + "</span></div>"
                       f'<pre class="py">{H.escape(src)}</pre></div>')
            if blob:
                out.append('<div class="out"><div class="h">Output</div>'
                           f'<pre>{H.escape(re.sub(chr(27) + r"[[0-9;]*m", "", blob))}</pre></div>')
    for f in pys:
        src = open(os.path.join(cdir, f), encoding="utf-8", errors="ignore").read()
        out.append(f'<div class="src-head">\U0001F40D <a href="../Concept/{H.escape(f)}">'
                   f'{H.escape(f)}</a></div>')
        out.append(f'<div class="code"><pre class="py">{H.escape(src)}</pre></div>')

    doc = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(title)} — code</title>
<link rel="stylesheet" href="../../../{SHARED}/lesson.css">
<style>body{{background:#0a0f1a}} .wrap{{padding:16px 18px 60px;max-width:none}}
.doc{{max-width:none}} .code{{margin:12px 0}}</style>
</head><body><div class="wrap"><main class="doc">
{''.join(out)}
</main></div><script src="../../../{SHARED}/lesson.js"></script></body></html>
"""
    open(os.path.join(odir, "code.html"), "w", encoding="utf-8").write(doc)
    return True

def pretty(name):
    n = re.sub(r"^\d+[_-]", "", name).replace("_", " ")
    fix = {"Ml":"ML","Eda":"EDA","Knn":"KNN","Roc":"ROC","Auc":"AUC","Iqr":"IQR",
           "Sql":"SQL","Kmeans":"K-Means","Dtypes":"Data Types","Svc":"SVC"}
    return " ".join(fix.get(w.capitalize(), w) for w in n.split())

def build(subject, topic):
    tdir = os.path.join(subject, topic)
    cdir, odir = os.path.join(tdir, "Concept"), os.path.join(tdir, "Content")
    if not os.path.isdir(cdir): return None
    files = sorted(f for f in os.listdir(cdir) if not f.startswith("."))
    nbs   = [f for f in files if f.endswith(".ipynb")]
    notes = [f for f in files if f.lower().endswith((".md", ".mdx"))]
    if not nbs and not notes: return None

    dest = os.path.join(odir, "index.html")
    if os.path.exists(dest) and not FORCE:
        cur = open(dest, encoding="utf-8", errors="ignore").read()
        if "hand-authored" in cur[:400]:
            build_code_page(subject, topic, tdir, odir, pretty(topic))
            # do not regenerate the prose, but do refresh the handwritten gallery
            blk = gallery_html(handwritten(tdir))
            new = re.sub(r"<!-- HANDWRITTEN:START -->.*?<!-- HANDWRITTEN:END -->",
                         lambda m: blk, cur, flags=re.S)
            if new == cur and "HANDWRITTEN:START" not in cur:
                new = cur.replace('<div class="foot">', blk + '\n<div class="foot">', 1)
            if new != cur:
                open(dest, "w", encoding="utf-8").write(new)
                return "skipped (hand-authored, gallery refreshed)"
            return "skipped (hand-authored)"

    title = pretty(topic)
    story = STORIES.get(f"{subject}/{topic}")
    body, toc = [], []

    if story:
        body.append(
          '<section class="story" id="story"><p class="who">The problem behind this topic</p>'
          + "".join(f"<p>{p}</p>" for p in story["story"]) + "</section>")
        toc.append(("story", "The problem"))
    if story and story.get("idea"):
        body.append(f'<div class="note key"><div class="h">🔑 The one idea</div><p>{story["idea"]}</p></div>')

    for f in notes:
        src = open(os.path.join(cdir, f), encoding="utf-8", errors="ignore").read()
        body.append(f'<div class="src-head">📝 <a href="../Concept/{f}">{f}</a></div>')
        body.append(render_md(src))
    for f in nbs:
        pre = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(f)[0].lower()).strip("-")[:28]
        body.append(f'<div class="src-head">📓 <a href="../Concept/{f}">{f}</a></div>')
        body.append(render_notebook(os.path.join(cdir, f), os.path.join(odir, "assets"), pre))

    scans = handwritten(tdir)
    page = fix_refs("\n".join(body), tdir, odir) + "\n" + gallery_html(scans)
    for m in re.finditer(r'<h2 id="([^"]+)">(.*?)</h2>', page, re.S):
        t = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        if t and len(toc) < 40: toc.append((m.group(1), t[:52]))

    if scans: toc.append(("handwritten", "\u270D\uFE0F Handwritten notes"))
    nav = "".join(f'<a href="#{i}">{H.escape(t)}</a>' for i, t in toc)
    links = "".join(f'<a class="btn" href="../Concept/{f}">{f} ↗</a>' for f in (nbs + notes)[:4])
    counts = " · ".join(x for x in [
        f"{len(nbs)} notebook" + ("s" if len(nbs) != 1 else "") if nbs else "",
        f"{len(notes)} note" + ("s" if len(notes) != 1 else "") if notes else ""] if x)

    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{H.escape(title)} — Lesson</title>
<link rel="stylesheet" href="../../../{SHARED}/lesson.css">
</head>
<body>
<div class="progress"></div>
<header class="bar">
  <div class="crumb">{subject.replace('_',' ',1)} › <b>{H.escape(title)}</b></div>
  <a class="btn" href="../../../17_Learning_As_Of_Now/Claude/index.html">← Map</a>
  <a class="btn primary" href="../Concept/">Open the source files ↗</a>
</header>
<div class="wrap">
<nav class="toc"><p class="toc-h">On this page</p>{nav}</nav>
<main class="doc">
<div class="hero">
  <p class="eyebrow">{H.escape(SUBJECT_TITLE.get(subject, subject))}</p>
  <h1>{H.escape(title)}</h1>
  <p class="lede">{H.escape(story["lede"]) if story else "Everything studied in this topic, rendered from the notebooks and notes themselves."}</p>
  <div class="tags"><span class="tag">{counts}</span>{
    '<a class="tag hn-jump" href="#handwritten">\u270D\uFE0F ' + str(len(scans)) +
    (' handwritten page' if len(scans) == 1 else ' handwritten pages') + '</a>' if scans else ''
  }</div>
</div>
{page}
<div class="foot">{links}
  <a class="btn" href="../../../17_Learning_As_Of_Now/Claude/index.html">← Back to the map</a>
</div>
</main></div>
<script src="../../../{SHARED}/lesson.js"></script>
</body>
</html>
"""
    os.makedirs(odir, exist_ok=True)
    open(dest, "w", encoding="utf-8").write(doc)
    build_code_page(subject, topic, tdir, odir, title)
    return f"{len(nbs)}nb {len(notes)}md {'story' if story else '-'}"

if __name__ == "__main__":
    made = skipped = 0
    for subject in sorted(d for d in os.listdir(".") if re.match(r"^\d\d_", d)):
        if ONLY and subject != ONLY: continue
        for topic in sorted(os.listdir(subject)):
            if not os.path.isdir(os.path.join(subject, topic)) or topic.startswith("_"): continue
            r = build(subject, topic)
            if r is None: continue
            if "skipped" in r: skipped += 1; continue
            made += 1
            print(f"  {subject}/{topic:<38} {r}")
    print(f"\nbuilt {made} lesson pages, skipped {skipped} hand-authored")
