/* ══════════════════════════════════════════════════════════════════════
   When to Use What — three screens over the same data.

     the arena    every decision as a card, colour-coded by stage
     the ask      one question at a time, one screen each
     the verdict  the technique you landed on, its code, and the rivals
                  it beat — that last part is what you say out loud when
                  someone asks you why not the other one

   The data is chooser-data.js and is never touched here. FLOWS[jobId] is a
   tree of questions whose leaves name techniques in that job's options; a
   `seq` node is a checklist instead of a fork — those are not rivals, you
   do all of them, in order.

   The URL carries the whole position, so any question or any verdict can be
   linked to and shared:  #/d/<jobId>            the decision, from the top
                          #/d/<jobId>/1-0-2      after those three answers
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var PICK_KEY = "lu-wtuw-picks";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
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

  /* ── flatten the spaces into one ordered list of decisions ─────────── */
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
      "<b>" + SPACES.length + "</b> stages of one pipeline";

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
            '<div class="band-c">' + sp.jobs.length + " decisions</div>" +
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
    cur = { jobId: jobId, trail: trail || [] };
    setHash();
    render();
  }

  function render() {
    var e = BY_ID[cur.jobId];
    if (!e) { showArena(); return; }
    var job = e.job, flow = FLOWS[job.id];

    $("arena").hidden = true;
    $("play").hidden = false;
    $("play").className = "screen play s-" + e.sp.id;

    $("pbName").textContent = e.sp.n + " · " + job.name;

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
          return '<button class="ans step" data-pick="' + esc(name) + '">' +
              "<b>" + (i + 1) + "</b>" +
              '<span class="ans-t">' + esc(name) + "</span>" +
              '<span class="ans-arrow">→</span>' +
            "</button>";
        }).join("") + "</div>" +
      "</div>";
  }

  /* ── the verdict ───────────────────────────────────────────────────── */
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

    var rivalRows = rivals.map(function (r) {
      var why = isSeq ? (r.use[0] || "") : (r.avoid[0] || r.use[0] || "");
      return '<button class="rival" data-pick="' + esc(r.name) + '">' +
          '<span class="rival-n">' + esc(r.name) + "</span>" +
          '<span class="rival-w">' + (isSeq ? "" : "<em>✗</em>") +
            "<span>" + esc(why) + "</span></span>" +
        "</button>";
    }).join("");

    var links = [o.topic].concat(o.also || []).filter(Boolean).map(lessonLink).join("");
    var next = BY_ID[job.id].i + 1 < JOBS.length ? JOBS[BY_ID[job.id].i + 1] : null;

    $("playbody").innerHTML =
      '<div class="verdict">' +
        '<p class="v-eye">' + (isSeq ? "Step of the checklist" : "Your answer") +
          '<span class="v-where">' + esc(e.sp.name) + " · " + esc(job.name) + "</span></p>" +
        '<h2 class="v-name">' + esc(o.name) + "</h2>" +

        (o.how ? '<section class="v-how"><h3>What it actually does</h3><p>' +
                 esc(o.how) + "</p></section>" : "") +

        '<div class="v-code"><pre>' + esc(o.code) + "</pre>" +
          '<button class="v-copy" id="vcopy">copy</button></div>' +

        '<div class="v-cols">' +
          '<section class="v-col good"><h3><em>✓</em>Use it when</h3><ul>' +
            o.use.map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("") +
          "</ul></section>" +
          '<section class="v-col bad"><h3><em>✗</em>Do not use it when</h3><ul>' +
            o.avoid.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") +
          "</ul></section>" +
        "</div>" +

        (rivals.length ? '<section class="v-rivals"><h3>' +
            (isSeq ? "The other steps" : 'If they ask “why not…”') +
            "<small>" + (isSeq ? "click one to read its card"
                               : "each rival's headline weakness — click to read its card") +
            "</small></h3>" + rivalRows + "</section>" : "") +

        (links ? '<div class="v-links"><span class="lbl">Where you learned it</span>' +
                 links + "</div>" : "") +

        '<div class="v-acts">' +
          (isSeq
            ? '<button class="act" data-act="restart">← back to the checklist</button>'
            : '<button class="act" data-act="restart">Ask me again</button>') +
          '<button class="act" data-act="arena">All decisions</button>' +
          (next ? '<button class="act wgo" data-act="next">Next · ' +
                  esc(next.job.name) + " →</button>" : "") +
        "</div>" +
      "</div>";
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
      if (act.dataset.act === "arena")   { showArena(); }
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
    $("play").scrollTop = 0;
  }
  $("prev").addEventListener("click", function () { step(-1); });
  $("next").addEventListener("click", function () { step(1); });
  $("back").addEventListener("click", function () { showArena(); });

  function showArena() {
    cur = null;
    $("play").hidden = true;
    $("arena").hidden = false;
    setHash();
    paintArena();
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
        hay += " " + o.use.join(" ") + " " + o.avoid.join(" ") + " " +
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
    if (ev.key === "/" && $("arena").hidden === false) { ev.preventDefault(); q.focus(); return; }
    if (!cur) return;

    if (ev.key === "Escape")    { showArena(); return; }
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
                : "#/all";
    if (location.hash === h) return;   /* no event would fire, so raise no flag */
    writing = true;
    location.hash = h;
  }
  function readHash() {
    var m = /^#\/d\/(\w+)(?:\/([\d-]*))?$/.exec(location.hash || "");
    if (m && BY_ID[m[1]]) {
      var trail = m[2] ? m[2].split("-").filter(function (x) { return x !== ""; }).map(Number) : [];
      cur = { jobId: m[1], trail: trail };
      $("arena").hidden = true;
      render();
    } else {
      cur = null;
      $("play").hidden = true;
      $("arena").hidden = false;
      paintArena();
    }
  }
  window.addEventListener("hashchange", function () {
    if (writing) { writing = false; return; }   /* our own write, already drawn */
    readHash();
  });

  /* ══ go ═══════════════════════════════════════════════════════════ */
  buildArena();
  readHash();
})();
