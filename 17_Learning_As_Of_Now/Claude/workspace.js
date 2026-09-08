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

  /* ── collapse a pane by clicking its title ── */
  document.querySelectorAll(".pane-head").forEach(function (h) {
    h.addEventListener("click", function (e) {
      if (e.target.closest(".pane-link")) return;
      h.parentElement.classList.toggle("collapsed");
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
  /* freeze the current widths as pixels so a drag only moves two neighbours */
  function pinPanes() {
    panes().forEach(function (p) {
      if (!p.classList.contains("collapsed")) {
        p.style.flex = "0 0 " + p.getBoundingClientRect().width + "px";
      }
    });
  }
  function equalise() {
    panes().forEach(function (p) { p.style.flex = p.classList.contains("collapsed") ? "" : "1 1 0"; });
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
        a.style.flex = "0 0 " + na + "px";
        b.style.flex = "0 0 " + (total - na) + "px";
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

  /* ── remember the layout ── */
  function save() {
    try {
      localStorage.setItem("lu-layout", JSON.stringify({
        exp: exp.style.width || "",
        panes: panes().map(function (p) { return p.style.flex || ""; })
      }));
    } catch (e) {}
  }
  (function restore() {
    try {
      var L = JSON.parse(localStorage.getItem("lu-layout") || "{}");
      if (L.exp) exp.style.width = L.exp;
      if (L.panes) panes().forEach(function (p, i) { if (L.panes[i]) p.style.flex = L.panes[i]; });
      setExplorer(localStorage.getItem("lu-exp") !== "0");
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
