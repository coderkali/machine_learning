/* ══════════════════════════════════════════════════════════════════════
   When to Use What — draws one decision at a time as a flowchart.

   FLOWS[jobId] is a tree of questions; the leaves are technique names that
   must exist in that job's options. This file lays the tree out, draws the
   wires, and lets you click down it. Landing on a leaf opens its card and
   records it as your pick for that decision.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  var NODE_W = 186,        /* must match .node width in chooser.css */
      COL_W  = 216,        /* one leaf column */
      ROW_H  = 152;        /* the tightest a level ever gets */
  var rowH = ROW_H;        /* widened per tree, so the drawing fills the stage */

  /* ── folder -> lesson node, the same resolution the Journey page uses ── */
  var BY_FOLDER = {};
  (function walk(n) {
    var p = n.lesson || n.path || "";
    var m = p.replace(/^\.\.\/\.\.\//, "").match(/^(\d\d_[^/]+\/\d\d_[^/]+)/);
    if (m && !BY_FOLDER[m[1]]) BY_FOLDER[m[1]] = n;
    (n.children || []).forEach(walk);
  })(TREE);

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  /* a name like SimpleImputer(strategy='median') has no space to wrap at, so
     mark the sensible break points rather than letting it split mid-word */
  function breakable(s) { return esc(s).replace(/([([,])/g, "$1<wbr>"); }

  function lessonLink(folder) {
    var n = BY_FOLDER[folder];
    var text = n ? n.title : folder.split("/").pop().replace(/^\d+_/, "").replace(/_/g, " ");
    return n && n.lesson
      ? '<a class="lz" href="' + esc(n.lesson) + '">' + esc(text) + "</a>"
      : '<span class="lz off">' + esc(text) + "</span>";
  }

  /* ── flatten the spaces into one ordered list of decisions ── */
  var JOBS = [];
  SPACES.forEach(function (sp) {
    sp.jobs.forEach(function (job) { JOBS.push({ sp: sp, job: job }); });
  });
  var OPT = {};                                  /* jobId -> name -> option */
  JOBS.forEach(function (j) {
    OPT[j.job.id] = {};
    j.job.options.forEach(function (o) { OPT[j.job.id][o.name] = o; });
  });

  var state = { i: 0, path: [], picks: {} };     /* picks: jobId -> option name */

  /* ══ 1. lay the tree out ═══════════════════════════════════════════════
     Leaves take the next free column; a question sits centred over the
     children it leads to. Depth becomes the row. ═══════════════════════ */
  function buildGraph(flow) {
    var nodes = [], edges = [], col = { v: 0 };

    function place(n, depth, parent, label) {
      var id = "n" + nodes.length;

      if (n.seq) {                               /* a checklist, drawn as a chain */
        var c = col.v++, prev = parent, lbl = label;
        n.seq.forEach(function (name, k) {
          var sid = "n" + nodes.length;
          nodes.push({ id: sid, kind: "step", text: name, idx: k + 1,
                       depth: depth + k, col: c, parent: prev });
          if (prev) edges.push({ from: prev, to: sid, label: k === 0 ? lbl : "then" });
          prev = sid;
        });
        return prev;
      }

      if (n.pick) {
        nodes.push({ id: id, kind: "pick", text: n.pick, depth: depth, col: col.v++,
                     parent: parent });
        if (parent) edges.push({ from: parent, to: id, label: label });
        return id;
      }

      var me = { id: id, kind: "q", text: n.q, depth: depth, col: 0, parent: parent };
      nodes.push(me);
      if (parent) edges.push({ from: parent, to: id, label: label });
      var kids = n.a.map(function (a) { return place(a.to, depth + 1, id, a.label); });
      var cs = kids.map(function (k) { return byId(nodes, k).col; });
      me.col = (Math.min.apply(null, cs) + Math.max.apply(null, cs)) / 2;
      return id;
    }

    place(flow, 0, null, null);
    return { nodes: nodes, edges: edges, cols: col.v };
  }
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* ══ 2. draw it ════════════════════════════════════════════════════════ */
  var G = null, drawnTimer = null;

  function draw() {
    var entry = JOBS[state.i], job = entry.job, sp = entry.sp;
    G = buildGraph(FLOWS[job.id]);

    $("spname").textContent = sp.n + " · " + sp.name;
    $("jname").textContent = job.name;
    $("jq").textContent = job.q;
    $("pos").textContent = (state.i + 1) + " / " + JOBS.length;

    var maxDepth = 0;
    G.nodes.forEach(function (n) { maxDepth = Math.max(maxDepth, n.depth); });

    /* A wide, shallow tree gets squeezed by its width and then floats in a band
       of empty space. Spread its rows out until it uses the height as well. */
    var av = space();
    var sw = Math.min(1, av.w / (G.cols * COL_W));
    rowH = maxDepth
      ? Math.max(ROW_H, Math.min(250, (av.h / sw - 130) / maxDepth))
      : ROW_H;

    var W = G.cols * COL_W, H = maxDepth * rowH + 120;

    var canvas = $("canvas"), nodesEl = $("nodes"), labelsEl = $("elabels");
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    /* the root question is the decision's own question, shown in full */
    nodesEl.innerHTML = G.nodes.map(function (n) {
      var cls = "node " + n.kind;
      var body = n.kind === "step"
        ? '<span class="sidx">step ' + n.idx + "</span>" + breakable(n.text)
        : (n.kind === "pick" ? breakable(n.text) : esc(n.text));
      return '<div class="' + cls + '" id="' + n.id + '" data-id="' + n.id + '" ' +
             'style="left:' + (n.col * COL_W + (COL_W - NODE_W) / 2) + "px;top:" +
             (n.depth * rowH) + "px;--dly:" + (n.depth * 70 + 40) + 'ms">' + body + "</div>";
    }).join("");

    /* measure, then wire up: a node's height depends on how its text wrapped */
    var box = {};
    G.nodes.forEach(function (n) {
      var el = $(n.id);
      box[n.id] = { x: n.col * COL_W + COL_W / 2, y: n.depth * rowH, h: el.offsetHeight };
    });

    var paths = [], labels = [];
    G.edges.forEach(function (e, i) {
      var a = box[e.from], b = box[e.to];
      var y1 = a.y + a.h, y2 = b.y, my = y1 + (y2 - y1) / 2, r = 11;
      var d;
      if (Math.abs(b.x - a.x) < 2) {
        d = "M" + a.x + "," + y1 + " L" + b.x + "," + y2;
      } else {
        var s = b.x > a.x ? 1 : -1;
        d = "M" + a.x + "," + y1 +
            " L" + a.x + "," + (my - r) +
            " Q" + a.x + "," + my + " " + (a.x + s * r) + "," + my +
            " L" + (b.x - s * r) + "," + my +
            " Q" + b.x + "," + my + " " + b.x + "," + (my + r) +
            " L" + b.x + "," + y2;
      }
      var len = Math.abs(y2 - y1) + Math.abs(b.x - a.x) + 30;
      paths.push('<path class="wire" id="w-' + e.to + '" d="' + d +
                 '" style="--len:' + len + ";--dly:" + (byId(G.nodes, e.to).depth * 70) + 'ms"/>');
      if (e.label) {
        labels.push('<div class="elabel" id="l-' + e.to + '" style="left:' +
          (b.x - NODE_W / 2) + "px;top:" + my + "px;--dly:" +
          (byId(G.nodes, e.to).depth * 70 + 120) + 'ms"><span>' + esc(e.label) + "</span></div>");
      }
    });
    $("wires").innerHTML = paths.join("");
    labelsEl.innerHTML = labels.join("");

    fit();

    /* hand the drawing its finished state once the entrance is over */
    var canvas2 = $("canvas");
    canvas2.classList.remove("drawn");
    if (drawnTimer) clearTimeout(drawnTimer);
    var reduced = window.matchMedia &&
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) canvas2.classList.add("drawn");
    else drawnTimer = setTimeout(function () { canvas2.classList.add("drawn"); },
                                 maxDepth * 70 + 700);

    state.path = [];
    var mine = state.picks[job.id];
    if (mine) {                                   /* re-light what you chose before */
      var leaf = G.nodes.filter(function (n) {
        return n.kind !== "q" && n.text === mine; })[0];
      if (leaf) select(leaf.id, true);
    } else {
      paint();
    }
    paintRail();
  }

  /* shrink a wide tree until the whole picture fits the stage */
  /* clientWidth counts the padding, and the padding is exactly what the open
     card panel takes away — so measure the content box, not the padding box */
  function space() {
    var wrap = $("wrap"), cs = getComputedStyle(wrap);
    return {
      w: wrap.clientWidth  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
      h: wrap.clientHeight - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom)
    };
  }
  function fit() {
    var canvas = $("canvas"), box = $("fit");
    var w = canvas.offsetWidth, h = canvas.offsetHeight, av = space();
    var aw = av.w, ah = av.h;
    /* With the card closed you are surveying the tree, so shrink it until the
       whole picture fits. With the card open you are reading one box, so keep
       the drawing readable and let it scroll to whatever you picked. */
    var floor = document.querySelector(".fx").classList.contains("paneled") ? 0.72 : 0.5;
    var s = Math.max(Math.min(1, aw / w, ah / h), floor);
    canvas.style.transform = s < 1 ? "scale(" + s.toFixed(3) + ")" : "";
    box.style.width  = Math.round(w * s) + "px";     /* the box the tree really occupies */
    box.style.height = Math.round(h * s) + "px";
  }
  window.addEventListener("resize", function () { if (G) fit(); });

  /* ══ 3. clicking down the tree ═════════════════════════════════════════ */
  function ancestors(id) {
    var out = [], n = byId(G.nodes, id);
    while (n) { out.unshift(n.id); n = n.parent ? byId(G.nodes, n.parent) : null; }
    return out;
  }
  function paint() {
    var lit = state.path, any = lit.length > 0;
    var job = JOBS[state.i].job, mine = state.picks[job.id];
    G.nodes.forEach(function (n) {
      var el = $(n.id), on = lit.indexOf(n.id) >= 0;
      el.classList.toggle("lit", on);
      el.classList.toggle("dim", any && !on);
      el.classList.toggle("mine", n.kind !== "q" && n.text === mine && !on);
      var w = $("w-" + n.id), l = $("l-" + n.id);
      if (w) { w.classList.toggle("lit", on); w.classList.toggle("dim", any && !on); }
      if (l) { l.classList.toggle("lit", on); l.classList.toggle("dim", any && !on); }
    });
  }
  function select(id, quiet) {
    var n = byId(G.nodes, id);
    state.path = ancestors(id);
    paint();
    if (n.kind === "q") { closePanel(); return; }
    state.picks[JOBS[state.i].job.id] = n.text;   /* landing on a leaf is a choice */
    paintRail();
    openCard(n.text);
    var el = $(id);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    if (!quiet) $("hint").textContent =
      "Recorded. Use ▶ for the next decision, or click another branch to change your mind.";
  }
  $("nodes").addEventListener("click", function (e) {
    var el = e.target.closest(".node"); if (el) select(el.dataset.id);
  });

  /* ══ 4. the card ═══════════════════════════════════════════════════════ */
  function openCard(name) {
    var job = JOBS[state.i].job, o = OPT[job.id][name];
    if (!o) return;
    var links = [o.topic].concat(o.also || []).map(lessonLink).join("");
    $("panel").innerHTML =
      '<div class="phead"><h2>' + esc(o.name) + "</h2>" +
        '<button class="pclose" id="pclose" title="close">✕</button></div>' +
      '<div class="pbody">' +
        '<p class="pwhere">' + esc(JOBS[state.i].sp.name) + " · " + esc(job.name) + "</p>" +
        '<p class="plab good">Use it when</p><ul class="use">' +
          o.use.map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("") + "</ul>" +
        '<p class="plab bad">Do not use it when</p><ul class="avoid">' +
          o.avoid.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
        "<pre>" + esc(o.code) + "</pre>" +
        '<div class="plinks">' + links + "</div>" +
      "</div>";
    showPanel();
  }
  function showPanel() {
    $("panel").classList.add("open");
    document.querySelector(".fx").classList.add("paneled");
    $("pclose").addEventListener("click", closePanel);
    if (G) fit();                      /* the tree re-fits into what is left */
  }
  function closePanel() {
    $("panel").classList.remove("open");
    document.querySelector(".fx").classList.remove("paneled");
    if (G) fit();
  }

  /* ══ 5. your stack ═════════════════════════════════════════════════════ */
  function openStack() {
    var rows = JOBS.filter(function (j) { return state.picks[j.job.id]; });
    $("panel").innerHTML =
      '<div class="phead"><h2>Your stack</h2>' +
        '<button class="pclose" id="pclose" title="close">✕</button></div>' +
      '<div class="pbody">' + (rows.length
        ? '<ol class="stacklist">' + rows.map(function (j, i) {
            return '<li><span class="sn">' + (i + 1) + "</span>" +
              '<button data-job="' + esc(j.job.id) + '">' +
                '<span class="sj">' + esc(j.job.name) + "</span>" +
                "<code>" + esc(state.picks[j.job.id]) + "</code></button></li>";
          }).join("") + "</ol>"
        : '<p class="pempty">Nothing chosen yet. Click down a flowchart and the box ' +
          "you land on is recorded here, in pipeline order.</p>") +
      "</div>";
    showPanel();
    $("panel").querySelectorAll(".stacklist button").forEach(function (b) {
      b.addEventListener("click", function () { go(indexOfJob(b.dataset.job)); });
    });
  }
  $("stackbtn").addEventListener("click", openStack);

  /* ══ 6. the rail ═══════════════════════════════════════════════════════ */
  function indexOfJob(id) {
    for (var i = 0; i < JOBS.length; i++) if (JOBS[i].job.id === id) return i;
    return 0;
  }
  function buildRail() {
    var html = "", last = null;
    JOBS.forEach(function (j, i) {
      if (j.sp !== last) {
        last = j.sp;
        html += '<div class="rgroup g-' + esc(j.sp.id) + '"><i>' + esc(j.sp.n) +
                "</i><span>" + esc(j.sp.name) + "</span></div>";
      }
      html += '<button class="rjob" data-i="' + i + '" data-job="' + esc(j.job.id) + '">' +
              "<b>" + esc(j.job.name) + "</b></button>";
    });
    $("rail").innerHTML = html;
    $("rail").addEventListener("click", function (e) {
      var b = e.target.closest(".rjob"); if (b) go(+b.dataset.i);
    });
  }
  function paintRail() {
    $("rail").querySelectorAll(".rjob").forEach(function (b) {
      var id = b.dataset.job, pick = state.picks[id];
      b.classList.toggle("on", +b.dataset.i === state.i);
      var sub = b.querySelector("small"), tick = b.querySelector(".rtick");
      if (pick) {
        if (!sub) { sub = document.createElement("small"); b.appendChild(sub); }
        sub.textContent = pick;
        if (!tick) { tick = document.createElement("span");
                     tick.className = "rtick"; tick.textContent = "✓"; b.appendChild(tick); }
      } else {
        if (sub) sub.remove();
        if (tick) tick.remove();
      }
    });
    var n = Object.keys(state.picks).length;
    $("stackn").textContent = n;
  }

  /* ══ 7. moving around ══════════════════════════════════════════════════ */
  function go(i) {
    state.i = (i + JOBS.length) % JOBS.length;
    closePanel();
    $("hint").textContent = FLOWS[JOBS[state.i].job.id].seq
      ? "These are not rivals — you do all of them, in this order."
      : JOBS[state.i].job.note;
    draw();
    $("wrap").scrollTop = 0;
  }
  $("prev").addEventListener("click", function () { go(state.i - 1); });
  $("next").addEventListener("click", function () { go(state.i + 1); });
  $("reset").addEventListener("click", function () {
    delete state.picks[JOBS[state.i].job.id];
    state.path = []; closePanel(); paint(); paintRail();
    $("hint").textContent = JOBS[state.i].job.note;
  });

  /* ══ 8. find a technique by name ═══════════════════════════════════════ */
  var q = $("q");

  /* Name and code first: searching "roc" should find ROC-AUC, not every card
     whose prose happens to contain "prep-roc-essing". Only if nothing matches
     that way do we fall back to the full text of the cards. */
  function matches(job, s, loose) {
    return job.options.filter(function (o) {
      var hay = o.name + " " + o.code;
      if (loose) {                       /* the card's prose, and the lessons it links to */
        hay += " " + o.use.join(" ") + " " + o.avoid.join(" ") + " " + job.q + " " + job.note +
               " " + [o.topic].concat(o.also || []).map(function (f) {
                 var n = BY_FOLDER[f];
                 return f + " " + (n ? n.title : "");
               }).join(" ");
      }
      return hay.toLowerCase().indexOf(s) >= 0;
    }).map(function (o) { return o.name; });
  }

  q.addEventListener("input", function () {
    var s = this.value.trim().toLowerCase();
    if (!s) {
      $("rail").querySelectorAll(".rjob").forEach(function (b) {
        b.hidden = false; b.classList.remove("hit");
        var f = b.querySelector(".rfound"); if (f) f.remove();
      });
      $("rail").querySelectorAll(".rgroup").forEach(function (g) { g.hidden = false; });
      paintRail();
      return;
    }
    var found = JOBS.map(function (j) {
      var byName = matches(j.job, s, false);
      return { hits: byName, named: byName.length > 0 };
    });
    var anyNamed = found.some(function (f) { return f.named; });
    if (!anyNamed) {
      found = JOBS.map(function (j) {
        var h = matches(j.job, s, true);
        var t = j.job.name.toLowerCase().indexOf(s) >= 0;
        return { hits: h, named: h.length > 0 || t };
      });
    }
    $("rail").querySelectorAll(".rjob").forEach(function (b) {
      var i = +b.dataset.i, f = found[i];
      var nameHit = JOBS[i].job.name.toLowerCase().indexOf(s) >= 0;
      var show = f.named || nameHit;
      b.hidden = !show;
      b.classList.toggle("hit", show);
      var sub = b.querySelector("small"); if (sub) sub.remove();
      var el = b.querySelector(".rfound");
      if (show && f.hits.length) {
        if (!el) { el = document.createElement("small");
                   el.className = "rfound"; b.appendChild(el); }
        el.textContent = f.hits.join(" · ");
      } else if (el) { el.remove(); }
    });
    $("rail").querySelectorAll(".rgroup").forEach(function (g) {
      var any = false, n = g.nextElementSibling;
      while (n && n.classList.contains("rjob")) {
        if (!n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); return; }
    if (document.activeElement === q) {
      if (e.key === "Escape") { q.value = ""; q.dispatchEvent(new Event("input")); q.blur(); }
      return;
    }
    if (e.key === "ArrowLeft")  go(state.i - 1);
    if (e.key === "ArrowRight") go(state.i + 1);
    if (e.key === "Escape")     closePanel();
  });

  /* ══ go ════════════════════════════════════════════════════════════════ */
  buildRail();
  go(0);
})();
