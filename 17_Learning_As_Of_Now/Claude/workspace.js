/* Workspace: explorer on the left, three panes on the right.
   Panes are iframes onto the generated pages, so nothing is duplicated. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  /* ── flatten the tree into subjects → topics ── */
  function leaves(n, out) {
    out = out || [];
    if (!n.children || !n.children.length) { out.push(n); return out; }
    n.children.forEach(function (c) { leaves(c, out); });
    return out;
  }
  var SUBJECTS = (TREE.children || []).map(function (s) {
    return { name: s.title, topics: leaves(s) };
  }).filter(function (s) { return s.topics.length; });

  /* a topic's lesson path tells us where its folder is */
  function folderOf(t) {
    var p = t.lesson || t.path || "";
    var i = p.indexOf("/Content/");
    if (i > 0) return p.slice(0, i);
    i = p.indexOf("/Concept/");
    if (i > 0) return p.slice(0, i);
    return p.replace(/\/[^/]*$/, "");
  }

  /* ── build the explorer ── */
  var tree = $("exp-tree"), rows = [];
  SUBJECTS.forEach(function (s, si) {
    var head = document.createElement("div");
    head.className = "subj-row";
    head.innerHTML = '<span class="tw">▶</span><span>' + s.name.replace(/^\d+\s*/, "") +
                     '</span><span class="n">' + s.topics.length + "</span>";
    var list = document.createElement("div");
    list.className = "topic-list";

    s.topics.forEach(function (t) {
      var row = document.createElement("div");
      row.className = "topic-row";
      var b = "";
      if (t.notes) b += '<span title="' + t.notes + ' handwritten pages">✍️</span>';
      if (t.hasStory) b += '<span title="has a story">📖</span>';
      row.innerHTML = '<span class="ic">▪</span><span>' + t.title +
                      '</span><span class="badges">' + b + "</span>";
      row.addEventListener("click", function () { open(t, row); });
      list.appendChild(row);
      rows.push({ el: row, topic: t, subj: head });
    });

    head.addEventListener("click", function () { head.classList.toggle("open"); });
    if (si === 0) head.classList.add("open");
    tree.appendChild(head); tree.appendChild(list);
  });

  $("exp-collapse").addEventListener("click", function () {
    tree.querySelectorAll(".subj-row").forEach(function (h) { h.classList.remove("open"); });
  });

  /* ── open a topic into the three panes ── */
  var notes = [], zi = 0;
  function open(t, row) {
    tree.querySelectorAll(".topic-row.on").forEach(function (r) { r.classList.remove("on"); });
    if (row) { row.classList.add("on"); row.closest(".topic-list")
      .previousElementSibling.classList.add("open"); }
    $("empty-state").classList.add("hidden");
    $("pane-row").classList.remove("hidden");

    var dir = folderOf(t);
    var lesson = t.lesson || (dir + "/Content/index.html");
    $("if-content").src = lesson;
    $("link-content").href = lesson;

    var ifc = $("if-code"), code = dir + "/Content/code.html";
    if (t.hasCode) {
      ifc.style.display = ""; $("no-code").style.display = "none";
      ifc.src = code; $("link-code").href = code; $("link-code").style.display = "";
    } else {                       // notes-only topic
      ifc.style.display = "none"; ifc.removeAttribute("src");
      $("no-code").style.display = ""; $("link-code").style.display = "none";
    }

    /* handwritten notes: plain <img>, which file:// allows */
    var body = $("notes-body");
    body.querySelectorAll(".ws-shot,.ws-note-name").forEach(function (e) { e.remove(); });
    notes = [];
    var n = t.notes || 0;
    $("notes-count").textContent = n ? n + " page" + (n > 1 ? "s" : "") : "";
    $("no-notes").style.display = n ? "none" : "";
    if (n && t.noteFiles) {
      t.noteFiles.forEach(function (f) {
        var src = dir + "/Handwritten_Notes/" + f;
        notes.push({ src: src, name: f });
        var img = document.createElement("img");
        img.className = "ws-shot"; img.src = src; img.loading = "lazy"; img.alt = f;
        img.addEventListener("click", function () { zoom(notes.length && notes.findIndex(
          function (x) { return x.src === src; })); });
        var cap = document.createElement("div");
        cap.className = "ws-note-name"; cap.textContent = f.replace(/\.(png|jpe?g)$/i, "");
        body.appendChild(img); body.appendChild(cap);
      });
    }
    document.title = t.title + " · Workspace";
    try { localStorage.setItem("lu-topic", t.title); } catch (e) {}
  }

  /* ── collapse a pane by clicking its title ──
     An inline flex would beat the .collapsed rule, so park it while collapsed
     and hand it back on the way out. */
  document.querySelectorAll(".pane-head").forEach(function (h) {
    h.addEventListener("click", function (e) {
      if (e.target.closest(".pane-link")) return;
      var p = h.parentElement;
      if (p.classList.toggle("collapsed")) {
        p.dataset.flex = p.style.flex || "";
        p.style.flex = "";
      } else {
        p.style.flex = p.dataset.flex || "";
        delete p.dataset.flex;
      }
      save();
    });
  });

  /* ── resizing ──────────────────────────────────────────────
     Two things make a splitter feel broken, and both are fixed here:
       1. an iframe under the cursor eats pointermove, killing the drag
          -> body.dragging sets pointer-events:none on every iframe
       2. the pointer escaping the gutter element
          -> setPointerCapture keeps every move event coming to us      */
  var paneRow = $("pane-row");

  function panes() {
    return Array.prototype.filter.call(paneRow.children, function (el) {
      return el.classList.contains("pane");
    });
  }
  /* Panes are sized by SHARE, never by pixels.

     A pixel width is a promise about a window that has since changed: hide the
     explorer, drag the window wider, collapse a pane, and three panes pinned at
     "0 0 753px" keep their old total and leave dead space on the right. So each
     pane carries a flex-grow share over a zero basis — the row then fills
     whatever width it is given, at the proportions you dragged. */
  function setShare(p, g) { p.style.flex = g + " 1 0px"; }   // "753 1 0px"

  /* take the widths on screen as the starting shares, so a drag begins from
     exactly what the reader is looking at */
  function pinPanes() {
    panes().forEach(function (p) {
      if (!p.classList.contains("collapsed")) setShare(p, p.getBoundingClientRect().width);
    });
  }
  function equalise() {
    panes().forEach(function (p) { p.style.flex = ""; delete p.dataset.flex; });
    save();
  }

  function startDrag(e, onMove) {
    e.preventDefault();
    var g = e.currentTarget;
    g.classList.add("drag");
    document.body.classList.add("dragging");
    try { g.setPointerCapture(e.pointerId); } catch (err) {}

    function move(ev) { onMove(ev.clientX); }
    function up(ev) {
      g.classList.remove("drag");
      document.body.classList.remove("dragging");
      try { g.releasePointerCapture(ev.pointerId); } catch (err) {}
      g.removeEventListener("pointermove", move);
      g.removeEventListener("pointerup", up);
      g.removeEventListener("pointercancel", up);
      save();
    }
    g.addEventListener("pointermove", move);
    g.addEventListener("pointerup", up);
    g.addEventListener("pointercancel", up);
  }

  /* explorer edge */
  var exp = $("explorer"), MIN_EXP = 180, MAX_EXP = 620;
  $("gutter-left").addEventListener("pointerdown", function (e) {
    var x0 = e.clientX, w0 = exp.getBoundingClientRect().width;
    startDrag(e, function (x) {
      exp.style.width = Math.max(MIN_EXP, Math.min(MAX_EXP, w0 + (x - x0))) + "px";
    });
  });

  /* between two panes: one grows by exactly what the other loses */
  var MIN_PANE = 150;
  document.querySelectorAll(".gutter.v").forEach(function (g) {
    g.addEventListener("pointerdown", function (e) {
      var a = g.previousElementSibling, b = g.nextElementSibling;
      if (a.classList.contains("collapsed") || b.classList.contains("collapsed")) return;
      pinPanes();
      var x0 = e.clientX;
      var aw = a.getBoundingClientRect().width, bw = b.getBoundingClientRect().width;
      var total = aw + bw;
      startDrag(e, function (x) {
        var na = Math.max(MIN_PANE, Math.min(total - MIN_PANE, aw + (x - x0)));
        setShare(a, na);                 // the pair keeps its combined share,
        setShare(b, total - na);         // so the other pane never moves
      });
    });
    g.addEventListener("dblclick", equalise);   // double-click a divider to reset
  });

  /* ── collapse the explorer, VS Code style ── */
  function setExplorer(open) {
    document.body.classList.toggle("exp-closed", !open);
    $("exp-toggle").textContent = open ? "⟨" : "⟩";
    $("exp-toggle").title = (open ? "Hide" : "Show") + " explorer  (⌘B)";
    try { localStorage.setItem("lu-exp", open ? "1" : "0"); } catch (err) {}
  }
  $("exp-toggle").addEventListener("click", function () {
    setExplorer(document.body.classList.contains("exp-closed"));
  });
  $("exp-show").addEventListener("click", function () { setExplorer(true); });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      setExplorer(document.body.classList.contains("exp-closed"));
    }
  });

  /* ── remember the layout ──
     Shares only. Anything with a pixel in it is a layout saved by an older
     build; it is read as a share and written back clean. */
  function save() {
    try {
      localStorage.setItem("lu-layout", JSON.stringify({
        exp: exp.style.width || "",
        shares: panes().map(function (p) {
          return p.classList.contains("collapsed")
            ? (parseFloat(p.dataset.flex) || 0) : (parseFloat(p.style.flex) || 0);
        }),
        collapsed: panes().map(function (p) { return p.classList.contains("collapsed"); })
      }));
    } catch (e) {}
  }
  (function restore() {
    try {
      var L = JSON.parse(localStorage.getItem("lu-layout") || "{}");
      if (L.exp) {
        exp.style.width = Math.max(MIN_EXP,
          Math.min(MAX_EXP, parseFloat(L.exp) || MIN_EXP)) + "px";
      }
      /* The old key "panes" held the whole shorthand, "0 0 753px" — there the
         proportion is the BASIS, not the leading grow of 0. Read the pixel
         number when there is one, the grow otherwise. */
      var raw = L.shares || L.panes || [];
      panes().forEach(function (p, i) {
        var v = String(raw[i] == null ? "" : raw[i]);
        var px = v.match(/([\d.]+)px/);
        var g = parseFloat(px ? px[1] : v);
        if (isFinite(g) && g > 0) setShare(p, g);
        if (L.collapsed && L.collapsed[i]) {
          p.dataset.flex = p.style.flex || "";
          p.style.flex = "";
          p.classList.add("collapsed");
        }
      });
      setExplorer(localStorage.getItem("lu-exp") !== "0");
      save();
    } catch (e) { setExplorer(true); }
  })();

  /* ── zoom overlay ── */
  var box = $("zoom");
  function zoom(i) {
    if (i < 0 || !notes.length) return;
    zi = (i + notes.length) % notes.length;
    $("zoom-img").src = notes[zi].src;
    $("zoom-name").textContent = notes[zi].name;
    $("zoom-count").textContent = (zi + 1) + " of " + notes.length;
    box.classList.add("on");
  }
  box.addEventListener("click", function (e) {
    var b = e.target.closest("[data-z]");
    if (!b) { if (e.target === box || e.target.classList.contains("hn-stage")) box.classList.remove("on"); return; }
    if (b.dataset.z === "prev") zoom(zi - 1);
    else if (b.dataset.z === "next") zoom(zi + 1);
    else box.classList.remove("on");
  });
  document.addEventListener("keydown", function (e) {
    if (box.classList.contains("on")) {
      if (e.key === "Escape") box.classList.remove("on");
      if (e.key === "ArrowRight") zoom(zi + 1);
      if (e.key === "ArrowLeft") zoom(zi - 1);
      return;
    }
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault(); $("ws-search").focus();
    }
  });

  /* ── filter ── */
  $("ws-search").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    var shown = {};
    rows.forEach(function (r) {
      var on = !q || r.topic.title.toLowerCase().indexOf(q) >= 0;
      r.el.classList.toggle("hide", !on);
      if (on) shown[r.subj.textContent] = r.subj;
    });
    tree.querySelectorAll(".subj-row").forEach(function (h) {
      var any = !q || !!shown[h.textContent];
      h.classList.toggle("hide", !any);
      if (q && any) h.classList.add("open");
    });
  });

  /* ── reopen whatever was last open ── */
  var last = null;
  try { last = localStorage.getItem("lu-topic"); } catch (e) {}
  var start = rows.find(function (r) { return r.topic.title === last; });
  if (start) open(start.topic, start.el);
})();
