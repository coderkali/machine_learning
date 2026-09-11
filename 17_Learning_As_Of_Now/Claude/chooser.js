/* ══════════════════════════════════════════════════════════════════════
   When to Use What — one page in three panels, plus a wall of decisions.

     start here   a short intro (Meera's story, "where are you?"), then three
                  panels side by side, each scrolling on its own:
                    left    Meera's real table, lighting up the columns the
                            current question is about
                    middle  the eight stages, top to bottom, with the problems
                            each one fixes and a button per problem
                    right   the questions of the decision you picked, one
                            below another; answering opens the next beneath
                            it, changing an earlier answer redraws everything
                            below; the path ends on the technique's card
     the arena    every decision on one page, for someone who already knows
                  what they want; choosing one opens it in the right panel

   The data is chooser-data.js (SPACES in pipeline order; FLOWS, whose
   questions carry a plain `hint` and the `see` columns to light up) and
   chooser-tour.js (the table and its problems). Neither is touched here.

   State classes are all `is-…`: styles.css already owns .card .open .on
   .done .lit .dim .strip .hidden for the mind map, and borrowing any of
   those names drags the map's styling onto this page.

   The URL carries the position, so any of it can be linked to:
       #/start                the page (the default)
       #/all                  every decision
       #/d/<jobId>/1-0        a decision open in the right panel, after those answers
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
      : '<span class="lz is-off">' + esc(text) + "</span>";
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

  var PROB = {};
  TOUR.problems.forEach(function (p) { PROB[p.id] = p; });

  /* ── what you have chosen, kept between visits ─────────────────────── */
  var picks = (function () {
    try { return JSON.parse(localStorage.getItem(PICK_KEY)) || {}; }
    catch (e) { return {}; }
  })();
  function savePicks() {
    try { localStorage.setItem(PICK_KEY, JSON.stringify(picks)); } catch (e) {}
  }

  /* the first trail through a flow that reaches a named technique, so a
     card can be opened straight from the arena, the stack or a rival */
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
     screens, and scrolling inside the panels
     ══════════════════════════════════════════════════════════════════ */
  var screen = "start";
  var scrollMem = {};       /* a hidden screen forgets its scroll position */

  function showScreen(name) {
    if (screen === name) return;
    scrollMem[screen] = $(screen).scrollTop;
    $("start").hidden = name !== "start";
    $("arena").hidden = name !== "arena";
    $(name).scrollTop = scrollMem[name] || 0;
    screen = name;
  }
  function goScreen(name) {
    if (name === "arena" && cur) closeDecision(true);
    showScreen(name);
    setHash();
    paintArena();
  }

  /* on a narrow screen the panels stack and stop scrolling on their own */
  function stacked() {
    return !!(window.matchMedia && matchMedia("(max-width: 1000px)").matches);
  }

  /* where el sits inside a panel, from layout offsets — a bounding box would
     include the rise animation's transform and land a few pixels short */
  function offsetIn(el, box) {
    var t = 0;
    while (el && el !== box) { t += el.offsetTop; el = el.offsetParent; }
    return el === box ? t : null;
  }

  /* bring el into view inside one panel, without moving the whole page */
  function scrollInPane(body, el, how) {
    if (!body || !el) return;
    if (stacked() || body.scrollHeight <= body.clientHeight + 1) {
      el.scrollIntoView({ behavior: smooth(), block: how === "center" ? "center" :
                                                   how === "start" ? "start" : "nearest" });
      return;
    }
    var top = offsetIn(el, body);
    if (top === null) top = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop;
    var h = el.offsetHeight, view = body.clientHeight, target;
    if (how === "start") target = top - 12;
    else if (how === "center") target = top - (view - h) / 2;
    else {                                   /* only move if it is out of sight */
      if (top >= body.scrollTop && top + h <= body.scrollTop + view) return;
      target = top + h > body.scrollTop + view ? Math.min(top - 12, top + h - view + 24) : top - 12;
    }
    body.scrollTo({ top: Math.max(0, target), behavior: smooth() });
  }

  /* scroll the page so the three panels fill the screen (or, stacked,
     so the questions are in sight) */
  function showShell() {
    if (screen !== "start") showScreen("start");
    var s = $("start"), el = stacked() ? $("pane-ask") : $("shell");
    var top = el.getBoundingClientRect().top - s.getBoundingClientRect().top + s.scrollTop;
    if (Math.abs(top - s.scrollTop) > 2) s.scrollTo({ top: top, behavior: smooth() });
  }

  /* ══════════════════════════════════════════════════════════════════
     the intro
     ══════════════════════════════════════════════════════════════════ */
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
    renderAsk();
    wire();
  }

  function go(where) {
    if (where === "all") { goScreen("arena"); q.focus(); return; }
    var m = /^(job|step):(\w+)$/.exec(where);
    if (m && m[1] === "job") { openDecision(m[2], [], null, true); return; }
    showShell();
    if (m) {
      var st = $("step-" + m[2]);
      if (st) { scrollInPane($("flow"), st, "start"); flash(st); }
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     left panel · the table
     ══════════════════════════════════════════════════════════════════ */
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
      /* long camelCase headers may break into words, to keep columns narrow */
      return '<th data-c="' + esc(c) + '"' + (cp.length ? ' data-p="' + ids(cp) + '"' : "") + ">" +
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
          return '<td data-c="' + esc(col) + '"' +
              (cls.length ? ' class="' + cls.join(" ") + '"' : "") +
              (all.length ? ' data-p="' + ids(all) + '"' : "") +
              (own.length ? ' data-own="' + ids(own) + '"' : "") + ">" + cellText(v) + "</td>";
        }).join("") +
      "</tr>";
    }).join("");

    $("rawtbl").innerHTML = "<thead>" + head + "</thead><tbody>" + body + "</tbody>";

    $("tblkey").innerHTML =
      "<span><i>row</i> = where it sits in the file</span>" +
      SPACES.filter(function (sp) { return tinted[sp.id]; }).map(function (sp) {
        return '<span class="s-' + sp.id + '"><b></b>fixed in step ' + esc(sp.n) + " · " +
               esc(sp.name) + "</span>";
      }).join("") +
      "<span><code>NaN</code> = a blank cell</span><span><code>␣</code> = a hidden space</span>";
  }
  function cellText(v) {
    if (v === null) return "NaN";
    var s = String(v), t = s.replace(/\s+$/, "");
    return esc(t) + (t !== s ? '<i class="sp" title="a hidden space">␣</i>' : "");
  }

  /* the table lights up whatever you are pointing at, and otherwise what
     the open decision is about */
  var base = { ids: [], cols: [] };

  function light(ids, cols) {
    var tbl = $("rawtbl");
    if (!ids && !cols) { ids = base.ids; cols = base.cols; }
    ids = ids || []; cols = cols || [];
    tbl.querySelectorAll(".is-lit").forEach(function (c) { c.classList.remove("is-lit"); });
    var any = false;
    function on(sel) {
      tbl.querySelectorAll(sel).forEach(function (c) { c.classList.add("is-lit"); any = true; });
    }
    ids.forEach(function (id) { on('[data-p~="' + id + '"]'); });
    cols.forEach(function (c) { on('[data-c="' + c + '"]'); });
    tbl.classList.toggle("is-focus", any);
  }

  /* the table is wider than its panel: slide it sideways so the lit
     columns are actually in sight (only when the open decision changes,
     never on hover, so the table does not jump about under the mouse) */
  function revealLit() {
    var tbl = $("rawtbl"), box = tbl.parentNode;
    var lit = tbl.querySelectorAll(".is-lit");
    if (!lit.length) return;
    var br = box.getBoundingClientRect(), lo = Infinity, hi = -Infinity;
    lit.forEach(function (c) {
      var r = c.getBoundingClientRect();
      lo = Math.min(lo, r.left - br.left + box.scrollLeft);
      hi = Math.max(hi, r.right - br.left + box.scrollLeft);
    });
    var view = box.clientWidth, rn = tbl.querySelector(".rn"), pin = rn ? rn.offsetWidth : 0;
    if (lo >= box.scrollLeft + pin && hi <= box.scrollLeft + view) return;   /* already in sight */
    var target = hi - lo <= view - pin ? lo - pin - (view - pin - (hi - lo)) / 2 : lo - pin - 8;
    box.scrollTo({ left: Math.max(0, target), behavior: smooth() });
  }

  function caption() {
    var c = $("tblnow");
    if (!cur) {
      c.innerHTML = "Point at a problem in the middle panel to see its cells here.";
    } else if (base.cols.length) {
      c.innerHTML = "Lit up: <b>" + base.cols.map(esc).join(" · ") +
                    "</b> — the columns the waiting question is about.";
    } else if (base.ids.length) {
      c.innerHTML = "Lit up: the cells of the problem you picked.";
    } else {
      c.innerHTML = "This decision is not about particular cells of the table.";
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     middle panel · the stages
     ══════════════════════════════════════════════════════════════════ */
  function buildFlow() {
    var fitAt = SPACES.map(function (sp) { return sp.id; }).indexOf(TOUR.fitAfter) + 1;

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
             esc(e.job.name) + '<b class="car">›</b></button>' : "") +
      "</li>";
  }
  function jobChip(job) {
    return '<button class="fjob" data-job="' + esc(job.id) + '">' +
        "<b>" + esc(job.icon) + " " + esc(job.name) + '<i class="car">›</i></b>' +
        "<small>" + esc(job.q) + "</small>" +
      "</button>";
  }

  function wire() {
    var tbl = $("rawtbl"), flow = $("flow");
    function idsFor(el) {
      var p = el.closest(".prob");
      if (p) return [p.dataset.prob];
      var s = el.closest(".fstep");
      if (s) return TOUR.problems.filter(function (x) { return x.stage === s.dataset.stage; })
                                 .map(function (x) { return x.id; });
      return null;
    }
    function point(ev) {
      var ids = idsFor(ev.target);
      if (ids) light(ids, []); else light();
    }
    flow.addEventListener("mouseover", point);
    flow.addEventListener("focusin", point);
    flow.addEventListener("mouseleave", function () { light(); });

    tbl.addEventListener("mouseover", function (ev) {
      var td = ev.target.closest("[data-own]");
      if (td) light(td.dataset.own.split(" "), []); else light();
    });
    tbl.addEventListener("mouseleave", function () { light(); });

    /* a tinted cell answers "what is wrong here?" by showing its problem */
    tbl.addEventListener("click", function (ev) {
      var td = ev.target.closest("[data-own]");
      if (!td) return;
      var item = flow.querySelector('[data-prob="' + td.dataset.own.split(" ")[0] + '"]');
      if (!item) return;
      scrollInPane(flow, item, "center");
      flash(item);
    });

    flow.addEventListener("click", function (ev) {
      var j = ev.target.closest("[data-job]");
      if (!j) return;
      if (j.classList.contains("is-open")) closeDecision();
      else openDecision(j.dataset.job, [], j, false);
    });

    $("ask").addEventListener("click", askClick);
  }

  /* ══════════════════════════════════════════════════════════════════
     right panel · the questions
     ══════════════════════════════════════════════════════════════════ */

  var cur = null;   /* {jobId, trail, btn, probId, seqPick} while one is open */

  /* where a decision belongs when it was not pressed in the middle panel */
  function defaultButton(jobId) {
    return $("flow").querySelector('.pgo[data-job="' + jobId + '"]') ||
           $("flow").querySelector('.fjob[data-job="' + jobId + '"]');
  }
  function markOpen(on) {
    if (!cur || !cur.btn) return;
    cur.btn.classList.toggle("is-open", on);
    var p = cur.btn.closest(".prob");
    if (p) p.classList.toggle("is-open", on);
  }

  function openDecision(jobId, trail, btn, reveal) {
    if (!BY_ID[jobId]) return;
    /* show the page before drawing: a hidden page measures as zero, and the
       table could not slide its lit columns into sight */
    if (screen !== "start") showScreen("start");
    btn = btn || defaultButton(jobId);
    markOpen(false);
    var prob = btn ? btn.closest(".prob") : null;
    cur = { jobId: jobId, trail: trail || [], btn: btn,
            probId: prob ? prob.dataset.prob : null, seqPick: null };
    markOpen(true);
    renderAsk();
    setHash();
    $("ask").scrollTop = 0;
    showShell();
    /* stacked, the stages sit below the questions: leave the page on the questions */
    if (reveal && btn && !stacked()) scrollInPane($("flow"), prob || btn, "center");
  }

  function closeDecision(quiet) {
    markOpen(false);
    cur = null;
    base = { ids: [], cols: [] };
    renderAsk();
    light();
    if (!quiet) setHash();
  }

  /* the questions answered so far, the one waiting, and — at the end of
     the path — the card; all of it redrawn from the trail every time */
  function renderAsk() {
    var box = $("ask");
    if (!cur) {
      $("asksub").textContent = "pick a problem in the middle";
      box.innerHTML =
        '<div class="ask-empty">' +
          '<p class="ae-h">Pick a problem in the middle panel</p>' +
          "<p>Its questions appear here, one below another. Answer one and the next " +
          "opens beneath it. Change an earlier answer and everything below it changes too.</p>" +
          '<p class="ae-try">Or start with one of these:</p>' +
          '<div class="ae-list">' + ["blank", "words", "overtime"].map(function (id) {
            var p = PROB[id], e = p && BY_ID[p.job];
            return e ? '<button class="fjob s-' + e.sp.id + '" data-try="' + id + '">' +
                "<b>" + esc(e.job.icon) + " " + esc(e.job.name) + "</b>" +
                "<small>" + esc(e.job.q) + "</small></button>" : "";
          }).join("") + "</div>" +
        "</div>";
      caption();
      return;
    }

    var e = BY_ID[cur.jobId], job = e.job;
    $("asksub").textContent = "step " + e.sp.n + " · " + e.sp.name;

    var node = FLOWS[job.id], k = 0, waiting = null, leaf = null, seq = null, blocks = [];
    while (node) {
      if (node.seq)  { seq = node; break; }
      if (node.pick) { leaf = node.pick; break; }
      var chosen = cur.trail[k];
      if (chosen === undefined || !node.a[chosen]) {
        cur.trail = cur.trail.slice(0, k);             /* drop an impossible trail */
        blocks.push(qBlock(node, k, undefined));
        waiting = node;
        break;
      }
      blocks.push(qBlock(node, k, chosen));
      node = node.a[chosen].to;
      k++;
    }

    var from = cur.probId && PROB[cur.probId];
    box.innerHTML =
      '<div class="dpanel s-' + e.sp.id + '">' +
        '<div class="dp-head">' +
          '<span class="dp-ico">' + esc(job.icon) + "</span>" +
          '<div class="dp-t"><b>' + esc(job.name) + "</b><small>" + esc(job.q) + "</small></div>" +
          '<button class="dp-x" data-act="close" title="close  (Esc)">✕</button>' +
        "</div>" +
        (from ? '<div class="dp-from"><b class="dp-lbl">In ' + esc(TOUR.who) + "’s table</b>" +
                from.text + "</div>" : "") +                 /* hand-written HTML */
        (job.note ? '<details class="dp-why"><summary>Why this decision matters</summary><p>' +
                    esc(job.note) + "</p></details>" : "") +
        '<div class="qstack">' + blocks.join("") +
          (seq ? seqBlock(e, seq) : "") +
          (leaf ? cardBlock(e, leaf, false) : "") +
        "</div>" +
      "</div>";

    var more = box.querySelector(".v-more");
    if (more) more.addEventListener("toggle", function () {
      try { localStorage.setItem(MORE_KEY, more.open ? "1" : "0"); } catch (x) {}
    });

    /* the table shows what the waiting question is about, or else the
       cells of the problem this decision was opened from */
    var see = waiting && waiting.see || [];
    base = see.length ? { ids: [], cols: see }
                      : { ids: cur.probId ? [cur.probId] : [], cols: [] };
    light();
    revealLit();
    caption();

    if (leaf) { picks[job.id] = leaf; savePicks(); paintArena(); }
  }

  function qBlock(node, k, chosen) {
    var done = chosen !== undefined;
    return '<section class="qb' + (done ? " is-done" : " is-waiting") + '" data-k="' + k + '">' +
        '<div class="qb-n">' + (k + 1) + "</div>" +
        '<div class="qb-b">' +
          "<h4>" + esc(node.q) + "</h4>" +
          (node.hint ? '<p class="qb-hint">' + esc(node.hint) + "</p>" : "") +
          '<div class="qb-ans">' + node.a.map(function (a, i) {
            var st = !done ? "" : (i === chosen ? " is-on" : " is-off");
            return '<button class="qa' + st + '" data-k="' + k + '" data-i="' + i + '">' +
                "<i>" + (i === chosen ? "✓" : i + 1) + "</i><span>" + esc(a.label) + "</span>" +
              "</button>";
          }).join("") + "</div>" +
        "</div>" +
      "</section>";
  }

  /* a checklist is not a fork: you do every step, in order */
  function seqBlock(e, node) {
    var job = e.job;
    return '<section class="qb is-waiting">' +
        '<div class="qb-n">✓</div>' +
        '<div class="qb-b">' +
          "<h4>Do all of these, in this order</h4>" +
          '<p class="qb-hint">They are not rivals — each one fixes a different problem. ' +
            "Press one to see what it does.</p>" +
          '<div class="qb-ans qb-seq">' + node.seq.map(function (name, i) {
            var o = OPT[job.id][name];
            return '<button class="qa' + (cur.seqPick === name ? " is-on" : "") +
                '" data-seq="' + esc(name) + '"><i>' + (i + 1) + "</i><span>" + esc(name) +
                (o && o.plain ? "<small>" + esc(o.plain) + "</small>" : "") + "</span></button>";
          }).join("") + "</div>" +
        "</div>" +
      "</section>" +
      (cur.seqPick ? cardBlock(e, cur.seqPick, true) : "");
  }

  /* the card: simple first, depth on request */
  function col(kind, title, items) {
    return '<section class="v-col v-' + kind + '"><h3><em>' + (kind === "good" ? "✓" : "✗") +
      "</em>" + esc(title) + "</h3><ul>" +
      items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></section>";
  }

  function cardBlock(e, name, isSeq) {
    var job = e.job, o = OPT[job.id][name];
    if (!o) return "";
    var rivals = job.options.filter(function (x) { return x.name !== name; });

    var otherRows = rivals.map(function (r) {
      return '<button class="rival" data-other="' + esc(r.name) + '">' +
          '<span class="rival-n">' + esc(r.name) + "</span>" +
          '<span class="rival-w"><span>' + esc(r.plain || r.use[0] || "") + "</span></span>" +
        "</button>";
    }).join("");
    var whyNot = isSeq ? "" : rivals.map(function (r) {
      return '<button class="rival" data-other="' + esc(r.name) + '">' +
          '<span class="rival-n">' + esc(r.name) + "</span>" +
          '<span class="rival-w"><em>✗</em><span>' + esc(r.avoid[0] || "") + "</span></span>" +
        "</button>";
    }).join("");

    var moreUse = o.use.slice(1), moreAvoid = o.avoid.slice(1);
    var hasMore = o.how || moreUse.length || moreAvoid.length || whyNot;
    var openMore = false;
    try { openMore = localStorage.getItem(MORE_KEY) === "1"; } catch (x) {}
    var links = [o.topic].concat(o.also || []).filter(Boolean).map(lessonLink).join("");

    return '<section class="qb qb-card">' +
        '<div class="qb-n">★</div>' +
        '<div class="qb-b">' +
          '<p class="v-eye">' + (isSeq ? "One step of the checklist" : "Your answer") + "</p>" +
          '<h3 class="v-name">' + esc(o.name) + "</h3>" +
          (o.plain ? '<p class="v-plain">' + esc(o.plain) + "</p>" : "") +
          '<div class="v-code"><pre>' + esc(o.code) + "</pre>" +
            '<button class="v-copy">copy</button></div>' +
          '<div class="v-cols">' +
            col("good", "Use it when", o.use.slice(0, 1)) +
            col("bad", "Do not use it when", o.avoid.slice(0, 1)) +
          "</div>" +
          (rivals.length ? '<section class="v-rivals"><h3>' +
              (isSeq ? "The other steps" : "The other options") +
              "<small>press one to see its card</small></h3>" + otherRows + "</section>" : "") +
          (links ? '<div class="v-links"><span class="lbl">Where you learned it</span>' +
                   links + "</div>" : "") +
          (hasMore
            ? '<details class="v-more"' + (openMore ? " open" : "") + ">" +
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
        "</div>" +
      "</section>";
  }

  /* ── everything you can press in the right panel ───────────────────── */
  function askClick(ev) {
    var t = ev.target.closest("[data-try]");
    if (t) {
      var b = $("flow").querySelector('.prob[data-prob="' + t.dataset.try + '"] .pgo');
      if (b) openDecision(b.dataset.job, [], b, true);
      return;
    }
    if (!cur) return;

    var a = ev.target.closest(".qa[data-i]");
    if (a) { answer(+a.dataset.k, +a.dataset.i); return; }

    var s = ev.target.closest(".qa[data-seq]");
    if (s) {
      cur.seqPick = cur.seqPick === s.dataset.seq ? null : s.dataset.seq;
      renderAsk();
      if (cur.seqPick) scrollToNewest();
      return;
    }
    var o = ev.target.closest("[data-other]");
    if (o) { showOther(o.dataset.other); return; }

    if (ev.target.closest('[data-act="close"]')) { closeDecision(); return; }
    var c = ev.target.closest(".v-copy");
    if (c) copyCode(c);
  }

  /* answering question k: everything below it is thrown away and redrawn */
  function answer(k, i) {
    if (cur.trail[k] === i) return;             /* same answer again: nothing changes */
    cur.trail = cur.trail.slice(0, k).concat(i);
    renderAsk();
    setHash();
    scrollToNewest();
  }

  /* a rival's card: the answers above switch to the path that leads to it */
  function showOther(name) {
    if (FLOWS[cur.jobId].seq) { cur.seqPick = name; }
    else {
      var t = trailTo(cur.jobId, name);
      if (!t) return;
      cur.trail = t;
      setHash();
    }
    renderAsk();
    scrollToNewest();
  }

  function scrollToNewest() {
    var box = $("ask"), bs = box.querySelectorAll(".qb");
    var last = bs[bs.length - 1];
    if (!last) return;
    /* a new question only needs to come into sight */
    if (!last.classList.contains("qb-card")) { scrollInPane(box, last, "nearest"); return; }

    /* a card: never scroll the answers that led to it out of sight — start
       from the top if it all fits, else from the first (or last) answer */
    var done = box.querySelectorAll(".qb.is-done");
    var lastDone = done.length ? done[done.length - 1] : bs[0];
    if (stacked()) { lastDone.scrollIntoView({ behavior: smooth(), block: "start" }); return; }
    var top = offsetIn(last, box), first = offsetIn(bs[0], box);
    if (top === null || first === null) { scrollInPane(box, lastDone, "start"); return; }
    if (top < box.clientHeight * 0.55) { box.scrollTo({ top: 0, behavior: smooth() }); return; }
    scrollInPane(box, top - first < box.clientHeight * 0.55 ? bs[0] : lastDone, "start");
  }

  function copyCode(btn) {
    var text = btn.parentNode.querySelector("pre").textContent;
    var ok = function () {
      btn.textContent = "copied";
      btn.classList.add("is-copied");
      setTimeout(function () { btn.textContent = "copy"; btn.classList.remove("is-copied"); }, 1400);
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

  /* ══════════════════════════════════════════════════════════════════
     the arena — every decision at once
     ══════════════════════════════════════════════════════════════════ */

  function chipsFor(job, hits) {
    var names = job.options.map(function (o) { return o.name; });
    var show = hits && hits.length ? hits.slice(0, 4) : names.slice(0, 3);
    var rest = names.length - show.length;
    return show.map(function (n) {
      return '<span class="wchip' + (hits && hits.indexOf(n) >= 0 ? " is-hit" : "") + '">' +
             esc(n) + "</span>";
    }).join("") + (rest > 0 ? '<span class="wchip is-more">+' + rest + "</span>" : "");
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
            '<span class="dgo">open its questions <span>→</span></span>' +
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
          '<div class="dgrid">' + cards + "</div>" +
        "</section>";
    }).join("");

    $("bands").addEventListener("click", function (ev) {
      var b = ev.target.closest(".dcard");
      if (!b) return;
      if (document.activeElement === q) q.blur();
      var id = b.dataset.job;
      openDecision(id, picks[id] ? trailTo(id, picks[id]) || [] : [], null, true);
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
    $("stackbtn").classList.toggle("is-live", n > 0);
  }

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
        openDecision(jobId, trailTo(jobId, picks[jobId]) || [], null, true);
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
        c.classList.remove("is-faded");
        c.querySelector(".wchips").innerHTML = chipsFor(BY_ID[c.dataset.job].job, null);
      });
      $("bands").querySelectorAll(".band").forEach(function (b) { b.classList.remove("is-faded"); });
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
      c.classList.toggle("is-faded", !show);
      if (show) { shown++; found += h.length; }
      c.querySelector(".wchips").innerHTML = chipsFor(e.job, h);
    });
    $("bands").querySelectorAll(".band").forEach(function (b) {
      b.classList.toggle("is-faded", !b.querySelector(".dcard:not(.is-faded)"));
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
    if (ev.key === "/") { ev.preventDefault(); goScreen("arena"); q.focus(); return; }
    if (!cur || screen !== "start") return;

    if (ev.key === "Escape") { closeDecision(); return; }
    if (ev.key === "Backspace" && cur.trail.length) {
      ev.preventDefault();
      cur.trail = cur.trail.slice(0, -1); renderAsk(); setHash(); return;
    }
    if (/^[1-9]$/.test(ev.key)) {              /* answer the question that is waiting */
      var b = $("ask").querySelectorAll(".qb.is-waiting .qa")[+ev.key - 1];
      if (b) b.click();
    }
  });

  /* ══════════════════════════════════════════════════════════════════
     the URL is the position
     ══════════════════════════════════════════════════════════════════ */
  var writing = false;
  function setHash() {
    var h = screen === "arena" ? "#/all"
          : cur ? "#/d/" + cur.jobId + (cur.trail.length ? "/" + cur.trail.join("-") : "")
          : "#/start";
    if (location.hash === h) return;   /* no event would fire, so raise no flag */
    writing = true;
    location.hash = h;
  }
  function readHash() {
    var h = location.hash || "";
    var m = /^#\/d\/(\w+)(?:\/([\d-]*))?$/.exec(h);
    if (m && BY_ID[m[1]]) {
      var trail = m[2] ? m[2].split("-").filter(function (x) { return x !== ""; }).map(Number) : [];
      if (cur && cur.jobId === m[1] && screen === "start") {    /* back/forward within one */
        cur.trail = trail; cur.seqPick = null; renderAsk();
      } else {
        openDecision(m[1], trail, null, true);
      }
      return;
    }
    if (cur) closeDecision(true);
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
})();
