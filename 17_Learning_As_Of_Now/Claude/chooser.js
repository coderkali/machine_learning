/* ══════════════════════════════════════════════════════════════════════
   When to Use What — four screens over the same data.

     start here   a real, messy table, and the eight stages that fix it in
                  order; every problem in the table links to its decision
     the arena    every decision on one page, for someone who knows what
                  they are looking for
     the ask      one question at a time, one screen each
     the verdict  the technique you landed on: one plain sentence, the code,
                  when to use it — and, behind "More detail", the mechanism
                  and the rivals it beat

   The data is chooser-data.js (SPACES in pipeline order, FLOWS) and
   chooser-tour.js (the table and its problems); neither is touched here.
   FLOWS[jobId] is a tree of questions whose leaves name techniques in that
   job's options; a `seq` node is a checklist instead of a fork — those are
   not rivals, you do all of them, in order.

   The URL carries the whole position, so any screen can be linked to:
       #/start                the table and the process (the default)
       #/all                  every decision
       #/d/<jobId>            the decision, from the top
       #/d/<jobId>/1-0-2      after those three answers
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var PICK_KEY = "lu-wtuw-picks";
  var MORE_KEY = "lu-wtuw-more";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function smooth() {
    return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto" : "smooth";
  }
  function flash(el) {
    el.classList.remove("flash");
    void el.offsetWidth;                      /* restart the animation */
    el.classList.add("flash");
    setTimeout(function () { el.classList.remove("flash"); }, 1400);
  }

  /* ── folder → lesson node, the same resolution the Journey page uses ── */
  var BY_FOLDER = {};
  (function walk(n) {
    var p = n.lesson || n.path || "";
    var m = p.replace(/^\.\.\/\.\.\//, "").match(/^(\d\d_[^/]+\/\d\d_[^/]+)/);
    if (m && !BY_FOLDER[m[1]]) BY_FOLDER[m[1]] = n;
    (n.children || []).forEach(walk);
  })(TREE);

  function lessonLink(folder) {
    var n = BY_FOLDER[folder];
    var text = n ? n.title : folder.split("/").pop().replace(/^\d+_/, "").replace(/_/g, " ");
    return n && n.lesson
      ? '<a class="lz" href="' + esc(n.lesson) + '">' + esc(text) + " →</a>"
      : '<span class="lz off">' + esc(text) + "</span>";
  }

  /* ── flatten the stages into one ordered list of decisions ─────────── */
  var JOBS = [];                                  /* [{sp, job, i}] */
  SPACES.forEach(function (sp) {
    sp.jobs.forEach(function (job) { JOBS.push({ sp: sp, job: job, i: JOBS.length }); });
  });
  var BY_ID = {};
  JOBS.forEach(function (e) { BY_ID[e.job.id] = e; });

  var OPT = {};                                   /* jobId → name → option */
  JOBS.forEach(function (e) {
    OPT[e.job.id] = {};
    e.job.options.forEach(function (o) { OPT[e.job.id][o.name] = o; });
  });

  var TOTAL_TECHNIQUES = JOBS.reduce(function (n, e) { return n + e.job.options.length; }, 0);

  /* ── what you have chosen, kept between visits ─────────────────────── */
  var picks = (function () {
    try { return JSON.parse(localStorage.getItem(PICK_KEY)) || {}; }
    catch (e) { return {}; }
  })();
  function savePicks() {
    try { localStorage.setItem(PICK_KEY, JSON.stringify(picks)); } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════════════
     the shape of a flow
     ══════════════════════════════════════════════════════════════════ */

  /* how many questions can still be asked below here, at most */
  function depthOf(n) {
    if (!n || n.pick || n.seq) return 0;
    return 1 + n.a.reduce(function (m, a) { return Math.max(m, depthOf(a.to)); }, 0);
  }

  /* walk a trail of answer indexes down from the root */
  function nodeAt(jobId, trail) {
    var n = FLOWS[jobId];
    for (var k = 0; k < trail.length; k++) {
      if (!n || !n.a || !n.a[trail[k]]) return null;
      n = n.a[trail[k]].to;
    }
    return n;
  }
  function labelsAlong(jobId, trail) {
    var out = [], n = FLOWS[jobId];
    for (var k = 0; k < trail.length; k++) {
      if (!n || !n.a || !n.a[trail[k]]) break;
      out.push({ q: n.q, a: n.a[trail[k]].label });
      n = n.a[trail[k]].to;
    }
    return out;
  }

  /* the shortest trail that reaches a named technique, so a pick made
     earlier can be re-opened straight from the arena */
  function trailTo(jobId, name) {
    var found = null;
    (function dig(n, trail) {
      if (found || !n) return;
      if (n.pick === name || (n.seq && n.seq.indexOf(name) >= 0)) { found = trail; return; }
      if (!n.a) return;
      n.a.forEach(function (a, i) { dig(a.to, trail.concat(i)); });
    })(FLOWS[jobId], []);
    return found;
  }

  /* ══════════════════════════════════════════════════════════════════
     which screen is showing
     ══════════════════════════════════════════════════════════════════ */
  var SCREENS = ["start", "arena", "play"];
  var screen = "start";     /* what is on screen now                       */
  var from = "start";       /* where a decision was opened from, for ←     */
  var scrollMem = {};       /* a hidden screen forgets its scroll position */

  function showScreen(name) {
    if (screen !== name && screen !== "play") scrollMem[screen] = $(screen).scrollTop;
    SCREENS.forEach(function (s) { $(s).hidden = s !== name; });
    if (screen !== name && name !== "play") $(name).scrollTop = scrollMem[name] || 0;
    screen = name;
    if (name === "start") measure();
  }
  function goScreen(name) {
    cur = null;
    showScreen(name);
    setHash();
    paintArena();
  }
  function backLabel() { return from === "arena" ? "all decisions" : "start here"; }

  /* ══════════════════════════════════════════════════════════════════
     SCREEN 0 · start here
     ══════════════════════════════════════════════════════════════════ */
  var stageOf = {};
  SPACES.forEach(function (sp) { stageOf[sp.id] = sp; });

  function buildStart() {
    $("where").innerHTML = TOUR.where.map(function (w) {
      return '<button class="wbtn" data-go="' + esc(w.go) + '">' +
          "<i>" + esc(w.icon) + "</i><span>" + esc(w.label) + "</span>" +
          '<b class="warr">→</b></button>';
    }).join("");
    $("where").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-go]");
      if (b) go(b.dataset.go);
    });

    $("tourh").textContent = "Meet " + TOUR.who + "’s table";
    /* hand-written HTML from chooser-tour.js, like the stories on lesson pages */
    $("story").innerHTML = TOUR.story.map(function (p) { return "<p>" + p + "</p>"; }).join("");

    buildTable();
    buildFlow();
    wireTour();
  }

  function go(where) {
    if (where === "all") { goScreen("arena"); q.focus(); return; }
    var m = /^(job|step):(\w+)$/.exec(where);
    if (m && m[1] === "job") { openJob(m[2]); return; }
    var el = m ? $("step-" + m[2]) : $(where);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth(), block: "start" });
    if (m) flash(el);
  }

  /* ── the table, with every problem cell tinted in its stage's colour ── */
  function buildTable() {
    var cellP = {}, colP = {}, rowP = {};
    function add(map, k, p) { (map[k] = map[k] || []).push(p); }
    TOUR.problems.forEach(function (p) {
      (p.cells || []).forEach(function (c) { add(cellP, c[0] + "|" + c[1], p); });
      (p.cols || []).forEach(function (c) { add(colP, c, p); });
      (p.rows || []).forEach(function (r) { add(rowP, r, p); });
    });
    function ids(list) { return list.map(function (p) { return p.id; }).join(" "); }

    var head = '<tr><th class="rn">row</th>' + TOUR.cols.map(function (c) {
      var cp = colP[c] || [];
      /* let long camelCase headers break into words, so the whole table —
         the answer column above all — fits without scrolling on a desktop */
      return "<th" + (cp.length ? ' data-p="' + ids(cp) + '"' : "") + ">" +
        esc(c).replace(/([a-z])([A-Z])/g, "$1<wbr>$2") +
        (c === TOUR.target ? '<span class="tg">the answer</span>' : "") + "</th>";
    }).join("") + "</tr>";

    var tinted = {};
    var body = TOUR.rows.map(function (r) {
      var rp = rowP[r.n] || [];
      return "<tr>" +
        '<td class="rn"' + (rp.length ? ' data-p="' + ids(rp) + '"' : "") + ">" + r.n + "</td>" +
        r.v.map(function (v, k) {
          var col = TOUR.cols[k];
          var own = (cellP[r.n + "|" + col] || []).concat(rp);   /* this cell's own problems */
          var all = own.concat(colP[col] || []);                  /* …plus its column's       */
          var cls = [];
          if (v === null) cls.push("nan");
          if (own.length) { cls.push("pc", "s-" + own[0].stage); tinted[own[0].stage] = 1; }
          return "<td" + (cls.length ? ' class="' + cls.join(" ") + '"' : "") +
              (all.length ? ' data-p="' + ids(all) + '"' : "") +
              (own.length ? ' data-own="' + ids(own) + '"' : "") + ">" + cellText(v) + "</td>";
        }).join("") +
      "</tr>";
    }).join("");

    $("rawtbl").innerHTML = "<thead>" + head + "</thead><tbody>" + body + "</tbody>";

    $("tblkey").innerHTML =
      "<span>" + TOUR.rows.length + " of the file’s rows · <i>row</i> = where it sits in the file</span>" +
      SPACES.filter(function (sp) { return tinted[sp.id]; }).map(function (sp) {
        return '<span class="s-' + sp.id + '"><b></b>fixed in step ' + esc(sp.n) + " · " +
               esc(sp.name) + "</span>";
      }).join("") +
      "<span><code>NaN</code> = a blank cell · <code>␣</code> = a hidden space</span>" +
      '<span class="kh">Hover a step below to light up its cells</span>';
  }
  function cellText(v) {
    if (v === null) return "NaN";
    var s = String(v), t = s.replace(/\s+$/, "");
    return esc(t) + (t !== s ? '<i class="sp" title="a hidden space">␣</i>' : "");
  }

  /* ── the eight stages, each with what it fixes in this table ───────── */
  function buildFlow() {
    var fitAt = SPACES.map(function (sp) { return sp.id; }).indexOf(TOUR.fitAfter) + 1;
    function pills(list) {
      return list.map(function (sp) {
        return '<button class="s-' + sp.id + '" data-stage="' + sp.id + '"><b>' + esc(sp.n) +
               "</b>" + esc(sp.name) + "</button>";
      }).join('<span class="arr">→</span>');
    }
    $("strip").innerHTML =
      '<div class="sgrp"><span class="gl">Before the model is trained</span>' +
        '<div class="pills">' + pills(SPACES.slice(0, fitAt)) + "</div></div>" +
      '<div class="sfit"><span class="fitpill">model.fit()</span><span class="arr">→</span>' +
        '<div class="sgrp"><span class="gl">After it is trained</span>' +
          '<div class="pills">' + pills(SPACES.slice(fitAt)) + "</div></div></div>";

    $("fsteps").innerHTML = SPACES.map(function (sp, i) {
      var probs = TOUR.problems.filter(function (p) { return p.stage === sp.id; });
      var used = {};
      probs.forEach(function (p) { if (p.job) used[p.job] = 1; });
      var others = sp.jobs.filter(function (j) { return !used[j.id]; });
      var note = TOUR.notes[sp.id];

      return (i === 0 ? '<li class="fphase">Before the model is trained</li>' : "") +
        '<li class="fstep s-' + sp.id + '" id="step-' + sp.id + '" data-stage="' + sp.id + '">' +
          '<div class="fs-n">' + esc(sp.n) + "</div>" +
          '<div class="fs-b">' +
            "<h3>" + esc(sp.name) + "</h3>" +
            '<p class="fs-blurb">' + esc(sp.blurb) + "</p>" +
            (note ? '<p class="fs-note">' + note + "</p>" : "") +
            (probs.length ? '<p class="fs-lbl">In ' + esc(TOUR.who) + "’s table</p>" +
               '<ul class="probs">' + probs.map(probItem).join("") + "</ul>" : "") +
            (others.length ? '<p class="fs-lbl">' +
               (probs.length ? "Also in this step" : "Decisions in this step") + "</p>" +
               '<div class="fs-jobs">' + others.map(jobChip).join("") + "</div>" : "") +
          "</div>" +
        "</li>" +
        (i === fitAt - 1
          ? '<li class="ffit"><code>model.fit(X_train, y_train)</code>' +
            "<span>The model is trained here. Everything above prepares for this one line.</span></li>" +
            '<li class="fphase">After it is trained</li>'
          : "");
    }).join("");
  }
  function probItem(p) {
    var e = p.job && BY_ID[p.job];
    return '<li class="prob" data-prob="' + esc(p.id) + '">' +
        '<span class="pdot"></span>' +
        '<span class="ptxt">' + p.text + "</span>" +      /* hand-written HTML */
        (e ? '<button class="pgo" data-job="' + esc(e.job.id) + '">' + esc(e.job.icon) + " " +
             esc(e.job.name) + " →</button>" : "") +
      "</li>";
  }
  function jobChip(job) {
    return '<button class="fjob" data-job="' + esc(job.id) + '">' +
        "<b>" + esc(job.icon) + " " + esc(job.name) + "</b><small>" + esc(job.q) + "</small>" +
      "</button>";
  }

  /* ── pointing at a stage or a problem lights its cells in the table ── */
  function wireTour() {
    var tbl = $("rawtbl");
    function light(ids) {
      tbl.querySelectorAll(".lit").forEach(function (c) { c.classList.remove("lit"); });
      var any = false;
      (ids || []).forEach(function (id) {
        tbl.querySelectorAll('[data-p~="' + id + '"]').forEach(function (c) {
          c.classList.add("lit"); any = true;
        });
      });
      tbl.classList.toggle("focus", any);
    }
    function idsFor(el) {
      var p = el.closest(".prob");
      if (p) return [p.dataset.prob];
      var s = el.closest("[data-stage]");
      if (s) return TOUR.problems.filter(function (x) { return x.stage === s.dataset.stage; })
                                 .map(function (x) { return x.id; });
      return null;
    }
    $("flow").addEventListener("mouseover", function (ev) { light(idsFor(ev.target)); });
    $("flow").addEventListener("focusin",   function (ev) { light(idsFor(ev.target)); });
    $("flow").addEventListener("mouseleave", function () { light(null); });

    tbl.addEventListener("mouseover", function (ev) {
      var td = ev.target.closest("[data-own]");
      light(td ? td.dataset.own.split(" ") : null);
    });
    tbl.addEventListener("mouseleave", function () { light(null); });

    /* a tinted cell answers "what is wrong here?" by showing its problem */
    tbl.addEventListener("click", function (ev) {
      var td = ev.target.closest("[data-own]");
      if (!td) return;
      var item = $("flow").querySelector('[data-prob="' + td.dataset.own.split(" ")[0] + '"]');
      if (!item) return;
      item.scrollIntoView({ behavior: smooth(), block: "center" });
      flash(item);
    });

    $("flow").addEventListener("click", function (ev) {
      var j = ev.target.closest("[data-job]");
      if (j) { openJob(j.dataset.job); return; }
      var s = ev.target.closest(".strip [data-stage]");
      if (s) go("step:" + s.dataset.stage);
    });
  }

  /* the table sticks to the top while the stages scroll under it, so a
     stage's scroll target has to clear the table's height */
  function measure() {
    var b = $("tblbox");
    if (b && b.offsetHeight) $("bench").style.setProperty("--tblh", (b.offsetHeight + 18) + "px");
  }
  window.addEventListener("resize", measure);

  /* ══════════════════════════════════════════════════════════════════
     SCREEN 1 · the arena
     ══════════════════════════════════════════════════════════════════ */

  function chipsFor(job, hits) {
    var names = job.options.map(function (o) { return o.name; });
    var show = hits && hits.length ? hits.slice(0, 4) : names.slice(0, 3);
    var rest = names.length - show.length;
    return show.map(function (n) {
      return '<span class="wchip' + (hits && hits.indexOf(n) >= 0 ? " hit" : "") + '">' +
             esc(n) + "</span>";
    }).join("") + (rest > 0 ? '<span class="wchip more">+' + rest + "</span>" : "");
  }

  function buildArena() {
    $("heroEye").innerHTML =
      "<b>" + JOBS.length + "</b> decisions &nbsp;·&nbsp; " +
      "<b>" + TOTAL_TECHNIQUES + "</b> techniques &nbsp;·&nbsp; " +
      "<b>" + SPACES.length + "</b> steps of one pipeline";

    $("bands").innerHTML = SPACES.map(function (sp) {
      var cards = sp.jobs.map(function (job) {
        var e = BY_ID[job.id];
        return '<button class="dcard" data-job="' + esc(job.id) + '">' +
            '<span class="dtop">' +
              '<span class="dico">' + esc(job.icon) + "</span>" +
              '<span class="dn">' + String(e.i + 1).padStart(2, "0") + "</span>" +
              '<span class="dcount">' + job.options.length + " ways</span>" +
            "</span>" +
            "<h3>" + esc(job.name) + "</h3>" +
            '<p class="dq">' + esc(job.q) + "</p>" +
            '<div class="wchips">' + chipsFor(job, null) + "</div>" +
            '<span class="dgo">' + (FLOWS[job.id].seq ? "walk it" : "answer it") +
              " <span>→</span></span>" +
            '<span class="dmineslot"></span>' +
          "</button>";
      }).join("");

      return '<section class="band s-' + esc(sp.id) + '" data-sp="' + esc(sp.id) + '">' +
          '<div class="band-head">' +
            '<div class="band-n">' + esc(sp.n) + "</div>" +
            '<div class="band-t"><h2>' + esc(sp.name) + "</h2><p>" + esc(sp.blurb) + "</p></div>" +
            '<div class="band-c">' + sp.jobs.length + " decision" +
              (sp.jobs.length === 1 ? "" : "s") + "</div>" +
          "</div>" +
          '<div class="grid">' + cards + "</div>" +
        "</section>";
    }).join("");

    $("bands").addEventListener("click", function (ev) {
      var b = ev.target.closest(".dcard");
      if (b) openJob(b.dataset.job);
    });
    paintArena();
  }

  /* the answer you already gave, worn along the bottom of its card */
  function paintArena() {
    $("bands").querySelectorAll(".dcard").forEach(function (card) {
      var mine = picks[card.dataset.job];
      var slot = card.querySelector(".dmineslot");
      slot.innerHTML = mine
        ? '<span class="dmine"><b>you chose</b><code>' + esc(mine) + "</code></span>"
        : "";
    });
    var n = Object.keys(picks).length;
    $("stackn").textContent = n;
    $("stackbtn").classList.toggle("wlive", n > 0);
  }

  /* ══════════════════════════════════════════════════════════════════
     SCREEN 2/3 · one decision
     ══════════════════════════════════════════════════════════════════ */

  var cur = null;          /* {jobId, trail:[..]} while a decision is open */

  function openJob(jobId, trail) {
    if (screen !== "play") from = screen;
    /* Safari does not move focus to a clicked button, so a search box left
       focused would keep swallowing Esc and the number keys on the next screen */
    if (document.activeElement === q) q.blur();
    cur = { jobId: jobId, trail: trail || [] };
    setHash();
    render();
    $("play").scrollTop = 0;
  }

  function render() {
    var e = BY_ID[cur.jobId];
    if (!e) { goScreen("start"); return; }
    var job = e.job, flow = FLOWS[job.id];

    showScreen("play");
    $("play").className = "screen play s-" + e.sp.id;
    $("back").innerHTML = "<span>←</span> " + backLabel();

    $("pbName").textContent = "Step " + e.sp.n + " · " + job.name;

    var node = nodeAt(job.id, cur.trail);
    var asked = cur.trail.length;

    /* progress: what is behind you against the deepest thing still ahead */
    var ahead = depthOf(node);
    var total = asked + ahead;
    var done = total ? (asked + 1) / total : 1;   /* matches the label beside it */
    if (!node || node.pick) { done = 1; total = asked; }
    $("pbFill").style.width = Math.round(done * 100) + "%";
    $("pbStep").textContent = ahead
      ? "question " + (asked + 1) + " of " + total
      : (flow.seq ? "all of them, in order" : "answered");

    drawCrumbs();

    if (!node)              { $("playbody").innerHTML = ""; return; }
    if (node.seq)           { drawSeq(e, node); return; }
    if (node.pick)          { drawVerdict(e, node.pick); return; }
    drawAsk(e, node, asked);
  }

  function drawCrumbs() {
    var steps = labelsAlong(cur.jobId, cur.trail);
    $("crumbs").innerHTML = steps.map(function (s, i) {
      return (i ? '<span class="wcrumb-sep">›</span>' : "") +
        '<button class="wcrumb" data-k="' + i + '" title="' + esc(s.q) + '">' +
          "<i>" + esc(shorten(s.q)) + "</i>" + esc(s.a) + "</button>";
    }).join("");
  }
  function shorten(q) {
    var t = String(q).replace(/\?$/, "");
    return t.length > 30 ? t.slice(0, 29).trim() + "…" : t;
  }
  $("crumbs").addEventListener("click", function (ev) {
    var b = ev.target.closest(".wcrumb");
    if (!b) return;
    cur.trail = cur.trail.slice(0, +b.dataset.k);   /* re-ask from there */
    setHash(); render();
  });

  /* ── the question ──────────────────────────────────────────────────── */
  function drawAsk(e, node, asked) {
    var job = e.job;
    var intro = asked === 0 && job.note
      ? '<p class="ask-note">' + esc(job.note) + "</p>" : "";

    $("playbody").innerHTML =
      '<div class="ask">' +
        '<p class="ask-eye"><span>' + esc(job.icon) + "</span>" + esc(job.name) + "</p>" +
        "<h2>" + esc(node.q) + "</h2>" + intro +
        '<div class="answers">' + node.a.map(function (a, i) {
          var leads = a.to && a.to.pick;
          return '<button class="ans" data-i="' + i + '">' +
              "<b>" + (i + 1) + "</b>" +
              '<span class="ans-t">' + esc(a.label) +
                (leads ? '<span class="ans-lead">that settles it</span>' : "") +
              "</span>" +
              '<span class="ans-arrow">→</span>' +
            "</button>";
        }).join("") + "</div>" +
      "</div>";
  }

  /* ── a checklist: not rivals, you do all of them ───────────────────── */
  function drawSeq(e, node) {
    var job = e.job;
    $("playbody").innerHTML =
      '<div class="ask">' +
        '<p class="ask-eye"><span>' + esc(job.icon) + "</span>" + esc(job.name) + "</p>" +
        "<h2>" + esc(job.q) + "</h2>" +
        '<p class="ask-note">' + esc(job.note) + "</p>" +
        '<p class="seqnote">These are not rivals — you do all of them, in this order</p>' +
        '<div class="answers">' + node.seq.map(function (name, i) {
          var o = OPT[job.id][name];
          return '<button class="ans step" data-pick="' + esc(name) + '">' +
              "<b>" + (i + 1) + "</b>" +
              '<span class="ans-t">' + esc(name) +
                (o && o.plain ? '<small class="ans-sub">' + esc(o.plain) + "</small>" : "") +
              "</span>" +
              '<span class="ans-arrow">→</span>' +
            "</button>";
        }).join("") + "</div>" +
      "</div>";
  }

  /* ── the verdict: simple first, depth on request ───────────────────── */
  function col(kind, title, items) {
    return '<section class="v-col ' + kind + '"><h3><em>' + (kind === "good" ? "✓" : "✗") +
      "</em>" + esc(title) + "</h3><ul>" +
      items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></section>";
  }

  function drawVerdict(e, name) {
    var job = e.job, o = OPT[job.id][name];
    if (!o) { $("playbody").innerHTML = ""; return; }

    var isSeq = !!FLOWS[job.id].seq;
    if (!isSeq) {                 /* a checklist step is not a choice you made */
      picks[job.id] = name;
      savePicks();
      paintArena();
    }
    var rivals = job.options.filter(function (x) { return x.name !== name; });

    /* the other options, each in one plain sentence */
    var otherRows = rivals.map(function (r) {
      return '<button class="rival" data-pick="' + esc(r.name) + '">' +
          '<span class="rival-n">' + esc(r.name) + "</span>" +
          '<span class="rival-w"><span>' + esc(r.plain || r.use[0] || "") + "</span></span>" +
        "</button>";
    }).join("");
    /* …and, for the interview, each one's headline weakness */
    var whyNot = isSeq ? "" : rivals.map(function (r) {
      return '<button class="rival" data-pick="' + esc(r.name) + '">' +
          '<span class="rival-n">' + esc(r.name) + "</span>" +
          '<span class="rival-w"><em>✗</em><span>' + esc(r.avoid[0] || "") + "</span></span>" +
        "</button>";
    }).join("");

    var moreUse = o.use.slice(1), moreAvoid = o.avoid.slice(1);
    var hasMore = o.how || moreUse.length || moreAvoid.length || whyNot;
    var openMore = false;
    try { openMore = localStorage.getItem(MORE_KEY) === "1"; } catch (x) {}

    var links = [o.topic].concat(o.also || []).filter(Boolean).map(lessonLink).join("");
    var next = BY_ID[job.id].i + 1 < JOBS.length ? JOBS[BY_ID[job.id].i + 1] : null;

    $("playbody").innerHTML =
      '<div class="verdict">' +
        '<p class="v-eye">' + (isSeq ? "Step of the checklist" : "Your answer") +
          '<span class="v-where">Step ' + esc(e.sp.n) + " · " + esc(e.sp.name) + " · " +
          esc(job.name) + "</span></p>" +
        '<h2 class="v-name">' + esc(o.name) + "</h2>" +
        (o.plain ? '<p class="v-plain">' + esc(o.plain) + "</p>" : "") +

        '<div class="v-code"><pre>' + esc(o.code) + "</pre>" +
          '<button class="v-copy" id="vcopy">copy</button></div>' +

        '<div class="v-cols">' +
          col("good", "Use it when", o.use.slice(0, 1)) +
          col("bad", "Do not use it when", o.avoid.slice(0, 1)) +
        "</div>" +

        (rivals.length ? '<section class="v-rivals"><h3>' +
            (isSeq ? "The other steps" : "The other options") +
            "<small>click one to read its card</small></h3>" + otherRows + "</section>" : "") +

        (links ? '<div class="v-links"><span class="lbl">Where you learned it</span>' +
                 links + "</div>" : "") +

        (hasMore
          ? '<details class="v-more" id="vmore"' + (openMore ? " open" : "") + ">" +
              "<summary>More detail<small>how it works, every reason, and “why not the others”</small></summary>" +
              '<div class="v-more-b">' +
                (o.how ? '<section class="v-how"><h3>What it actually does</h3><p>' +
                         esc(o.how) + "</p></section>" : "") +
                (moreUse.length || moreAvoid.length
                  ? '<div class="v-cols">' +
                      (moreUse.length ? col("good", "More reasons to use it", moreUse) : "") +
                      (moreAvoid.length ? col("bad", "More reasons not to", moreAvoid) : "") +
                    "</div>" : "") +
                (whyNot ? '<section class="v-rivals"><h3>If they ask “why not…”' +
                          "<small>each rival's biggest weakness</small></h3>" + whyNot +
                          "</section>" : "") +
              "</div>" +
            "</details>"
          : "") +

        '<div class="v-acts">' +
          (isSeq
            ? '<button class="act" data-act="restart">← back to the checklist</button>'
            : '<button class="act" data-act="restart">Ask me again</button>') +
          '<button class="act" data-act="back">Back to ' + backLabel() + "</button>" +
          (next ? '<button class="act wgo" data-act="next">Next · ' +
                  esc(next.job.name) + " →</button>" : "") +
        "</div>" +
      "</div>";

    var more = $("vmore");
    if (more) more.addEventListener("toggle", function () {
      try { localStorage.setItem(MORE_KEY, more.open ? "1" : "0"); } catch (x) {}
    });
  }

  /* ── everything you can click inside the play screen ───────────────── */
  $("playbody").addEventListener("click", function (ev) {
    var a = ev.target.closest(".ans[data-i]");
    if (a) { answer(+a.dataset.i); return; }

    var s = ev.target.closest("[data-pick]");
    if (s) { jumpToPick(s.dataset.pick); return; }

    var act = ev.target.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "restart") { cur.trail = []; setHash(); render(); }
      if (act.dataset.act === "back")    { goScreen(from); }
      if (act.dataset.act === "next")    { openJob(JOBS[BY_ID[cur.jobId].i + 1].job.id); }
      return;
    }
    if (ev.target.closest("#vcopy")) copyCode(ev.target.closest("#vcopy"));
  });

  function answer(i) {
    var node = nodeAt(cur.jobId, cur.trail);
    if (!node || !node.a || !node.a[i]) return;
    cur.trail = cur.trail.concat(i);
    setHash();
    render();
  }

  /* opening a rival, or one step of a checklist, without losing the trail */
  function jumpToPick(name) {
    var t = trailTo(cur.jobId, name);
    if (t) { cur.trail = t; setHash(); }
    var e = BY_ID[cur.jobId];
    drawVerdict(e, name);
    drawCrumbs();
    $("pbFill").style.width = "100%";
    $("pbStep").textContent = "answered";
    $("play").scrollTop = 0;
  }

  function copyCode(btn) {
    var text = btn.parentNode.querySelector("pre").textContent;
    var ok = function () {
      btn.textContent = "copied";
      btn.classList.add("wdone");
      setTimeout(function () { btn.textContent = "copy"; btn.classList.remove("wdone"); }, 1400);
    };
    /* opened as a local file the clipboard API may be unavailable, so keep
       the old textarea trick as the fallback rather than failing silently */
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { legacyCopy(text, ok); });
    } else { legacyCopy(text, ok); }
  }
  function legacyCopy(text, ok) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ── moving between decisions ──────────────────────────────────────── */
  function step(d) {
    if (!cur) return;
    var i = (BY_ID[cur.jobId].i + d + JOBS.length) % JOBS.length;
    openJob(JOBS[i].job.id);
  }
  $("prev").addEventListener("click", function () { step(-1); });
  $("next").addEventListener("click", function () { step(1); });
  $("back").addEventListener("click", function () { goScreen(from); });

  /* ══════════════════════════════════════════════════════════════════
     your stack
     ══════════════════════════════════════════════════════════════════ */
  function openStack() {
    var rows = JOBS.filter(function (e) { return picks[e.job.id]; });
    $("sheetbody").innerHTML = (rows.length
      ? '<ul class="slist">' + rows.map(function (e, i) {
          return '<li class="s-' + esc(e.sp.id) + '"><span class="sn">' + (i + 1) + "</span>" +
            '<button data-job="' + esc(e.job.id) + '">' +
              '<span class="sj">' + esc(e.job.name) + "</span>" +
              "<code>" + esc(picks[e.job.id]) + "</code></button></li>";
        }).join("") + "</ul>" +
        '<div class="sfoot"><button class="act" id="clearstack">Clear all ' +
        rows.length + "</button></div>"
      : '<p class="sempty">Nothing chosen yet. Answer a decision and the box you ' +
        "land on is recorded here, in pipeline order — so by the end you are " +
        "looking at the preprocessing and modelling stack for one real project.</p>");

    $("modal").hidden = false;

    $("sheetbody").querySelectorAll(".slist button").forEach(function (b) {
      b.addEventListener("click", function () {
        closeStack();
        var jobId = b.dataset.job;
        openJob(jobId, trailTo(jobId, picks[jobId]) || []);
      });
    });
    var clear = $("clearstack");
    if (clear) clear.addEventListener("click", function () {
      picks = {}; savePicks(); paintArena(); openStack();
    });
  }
  function closeStack() { $("modal").hidden = true; }
  $("stackbtn").addEventListener("click", openStack);
  $("modalx").addEventListener("click", closeStack);
  $("modal").addEventListener("click", function (ev) {
    if (ev.target === $("modal")) closeStack();
  });

  /* ══════════════════════════════════════════════════════════════════
     find a technique
     ══════════════════════════════════════════════════════════════════ */
  var q = $("q");

  /* Name and code first: searching "roc" should find ROC-AUC, not every card
     whose prose happens to contain "prep-roc-essing". Only if nothing matches
     that way do we fall back to the full text of the cards. */
  function matches(job, s, loose) {
    return job.options.filter(function (o) {
      var hay = o.name + " " + o.code;
      if (loose) {
        hay += " " + (o.plain || "") + " " + o.use.join(" ") + " " + o.avoid.join(" ") + " " +
               job.q + " " + job.note + " " +
               [o.topic].concat(o.also || []).filter(Boolean).map(function (f) {
                 var n = BY_FOLDER[f];
                 return f + " " + (n ? n.title : "");
               }).join(" ");
      }
      return hay.toLowerCase().indexOf(s) >= 0;
    }).map(function (o) { return o.name; });
  }

  q.addEventListener("input", function () {
    var s = this.value.trim().toLowerCase();
    var cards = $("bands").querySelectorAll(".dcard");

    if (!s) {
      cards.forEach(function (c) {
        c.classList.remove("faded");
        c.querySelector(".wchips").innerHTML = chipsFor(BY_ID[c.dataset.job].job, null);
      });
      $("bands").querySelectorAll(".band").forEach(function (b) { b.classList.remove("faded"); });
      $("findmsg").hidden = true;
      return;
    }

    var hits = {}, anyNamed = false;
    JOBS.forEach(function (e) {
      hits[e.job.id] = matches(e.job, s, false);
      if (hits[e.job.id].length) anyNamed = true;
    });
    if (!anyNamed) {
      JOBS.forEach(function (e) { hits[e.job.id] = matches(e.job, s, true); });
    }

    var shown = 0, found = 0;
    cards.forEach(function (c) {
      var e = BY_ID[c.dataset.job];
      var h = hits[e.job.id];
      var nameHit = e.job.name.toLowerCase().indexOf(s) >= 0;
      var show = h.length > 0 || nameHit;
      c.classList.toggle("faded", !show);
      if (show) { shown++; found += h.length; }
      c.querySelector(".wchips").innerHTML = chipsFor(e.job, h);
    });
    $("bands").querySelectorAll(".band").forEach(function (b) {
      b.classList.toggle("faded", !b.querySelector(".dcard:not(.faded)"));
    });

    $("findmsg").hidden = false;
    $("findmsg").textContent = shown
      ? found + " technique" + (found === 1 ? "" : "s") + " in " +
        shown + " decision" + (shown === 1 ? "" : "s")
      : "Nothing here matches “" + this.value.trim() + "” — which means it has " +
        "not been studied yet.";
  });

  /* ══════════════════════════════════════════════════════════════════
     keyboard
     ══════════════════════════════════════════════════════════════════ */
  document.addEventListener("keydown", function (ev) {
    if (!$("modal").hidden) { if (ev.key === "Escape") closeStack(); return; }

    if (document.activeElement === q) {
      if (ev.key === "Escape") { q.value = ""; q.dispatchEvent(new Event("input")); q.blur(); }
      return;
    }
    if (ev.key === "/" && screen !== "play") {
      ev.preventDefault();
      if (screen === "start") goScreen("arena");
      q.focus();
      return;
    }
    if (!cur) return;

    if (ev.key === "Escape")    { goScreen(from); return; }
    if (ev.key === "ArrowLeft") { step(-1); return; }
    if (ev.key === "ArrowRight"){ step(1); return; }
    if (ev.key === "Backspace" && cur.trail.length) {
      ev.preventDefault();
      cur.trail = cur.trail.slice(0, -1); setHash(); render(); return;
    }
    if (/^[1-9]$/.test(ev.key)) {
      var btns = $("playbody").querySelectorAll(".ans");
      var b = btns[+ev.key - 1];
      if (b) b.click();
    }
  });

  /* ══════════════════════════════════════════════════════════════════
     the URL is the position
     ══════════════════════════════════════════════════════════════════ */
  var writing = false;
  function setHash() {
    var h = cur ? "#/d/" + cur.jobId + (cur.trail.length ? "/" + cur.trail.join("-") : "")
                : (screen === "arena" ? "#/all" : "#/start");
    if (location.hash === h) return;   /* no event would fire, so raise no flag */
    writing = true;
    location.hash = h;
  }
  function readHash() {
    var h = location.hash || "";
    var m = /^#\/d\/(\w+)(?:\/([\d-]*))?$/.exec(h);
    if (m && BY_ID[m[1]]) {
      var trail = m[2] ? m[2].split("-").filter(function (x) { return x !== ""; }).map(Number) : [];
      if (screen !== "play") from = screen;
      cur = { jobId: m[1], trail: trail };
      render();
      return;
    }
    cur = null;
    showScreen(h === "#/all" ? "arena" : "start");
    paintArena();
  }
  window.addEventListener("hashchange", function () {
    if (writing) { writing = false; return; }   /* our own write, already drawn */
    readHash();
  });

  /* ══ go ═══════════════════════════════════════════════════════════ */
  buildArena();
  buildStart();
  readHash();
  window.addEventListener("load", measure);
})();
