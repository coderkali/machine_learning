/* Home view: the wheel, the stat strip, subject cards, and the lesson index.
   Reads the same TREE the map uses, so the numbers can never disagree. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var HUE = ["var(--cyan)", "var(--violet)", "var(--teal)", "var(--pink)", "var(--amber)", "var(--blue-soft)"];

  /* ── shape the data ── */
  function leaves(n, out) {
    out = out || [];
    if (!n.children || !n.children.length) { out.push(n); return out; }
    n.children.forEach(function (c) { leaves(c, out); });
    return out;
  }
  var SUBJECTS = (TREE.children || []).map(function (s, i) {
    var ls = leaves(s);
    var by = { done: 0, learning: 0, archive: 0, todo: 0 };
    ls.forEach(function (t) { by[t.status] = (by[t.status] || 0) + 1; });
    return { node: s, name: s.title, meta: s.meta || "", topics: ls, by: by,
             hue: HUE[i % HUE.length],
             lessons: ls.filter(function (t) { return t.lesson; }).length };
  });
  var ALL_TOPICS = SUBJECTS.reduce(function (a, s) { return a.concat(s.topics); }, []);
  var LESSONS = ALL_TOPICS.filter(function (t) { return t.lesson; });
  var TOTAL = ALL_TOPICS.length;

  function countNotebooks() {
    var n = 0;
    ALL_TOPICS.forEach(function (t) {
      var m = /(\d+)\s+notebook/.exec(t.meta || "");
      n += m ? +m[1] : 0;
    });
    return n;
  }

  /* ── the wheel: one arc per subject, sized by topic count ── */
  function polar(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function arc(cx, cy, r1, r2, a1, a2) {
    var p1 = polar(cx, cy, r2, a2), p2 = polar(cx, cy, r2, a1);
    var p3 = polar(cx, cy, r1, a1), p4 = polar(cx, cy, r1, a2);
    var big = a2 - a1 > 180 ? 1 : 0;
    return "M" + p1 + "A" + r2 + "," + r2 + " 0 " + big + " 0 " + p2 +
           "L" + p3 + "A" + r1 + "," + r1 + " 0 " + big + " 1 " + p4 + "Z";
  }
  function drawWheel() {
    var svg = $("wheel"), C = 210, GAP = 1.1, a = 0, html = "";
    SUBJECTS.forEach(function (s, i) {
      var span = (s.topics.length / TOTAL) * 360;
      if (span < 0.6) span = 0.6;
      var a1 = a + GAP / 2, a2 = a + span - GAP / 2;
      // outer ring = the subject, inner ring = its status split
      html += '<path d="' + arc(C, C, 132, 178, a1, a2) + '" fill="' + s.hue +
              '" opacity=".85" data-i="' + i + '"><title>' + s.name + " — " +
              s.topics.length + " topics</title></path>";
      var inner = a1, tot = s.topics.length;
      ["done", "learning", "archive", "todo"].forEach(function (k) {
        var c = s.by[k] || 0; if (!c) return;
        var w = (c / tot) * (a2 - a1);
        html += '<path d="' + arc(C, C, 104, 126, inner, inner + w) + '" fill="var(--' +
                k + ')" opacity=".62" data-i="' + i + '"/>';
        inner += w;
      });
      a += span;
    });
    html += '<circle cx="210" cy="210" r="97" fill="none" stroke="var(--line0)"/>' +
            '<circle cx="210" cy="210" r="188" fill="none" stroke="var(--card2)" stroke-dasharray="2 6"/>';
    svg.innerHTML = html;

    svg.querySelectorAll("path").forEach(function (p) {
      p.addEventListener("mouseenter", function () {
        var s = SUBJECTS[+p.dataset.i];
        svg.querySelectorAll("path").forEach(function (q) {
          q.classList.toggle("mute", q.dataset.i !== p.dataset.i);
        });
        $("wheel-total").textContent = s.topics.length;
        $("wheel-label").textContent = s.name;
      });
      p.addEventListener("mouseleave", reset);
      p.addEventListener("click", function () {
        var card = document.querySelector('[data-subject="' + p.dataset.i + '"]');
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    function reset() {
      svg.querySelectorAll("path").forEach(function (q) { q.classList.remove("mute"); });
      $("wheel-total").textContent = TOTAL;
      $("wheel-label").textContent = SUBJECTS.length + " subjects";
    }
    svg.addEventListener("mouseleave", reset);
    reset();
  }

  /* ── numbers that count up ── */
  function countUp(el, to) {
    var t0 = null, done = false;
    function finish() { if (!done) { done = true; el.textContent = to; } }
    function step(t) {
      if (done) return;
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 900);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else finish();
    }
    // animate if we can, but always land on the real number
    requestAnimationFrame(step);
    setTimeout(finish, 1000);
  }

  /* ── build the page ── */
  function build() {
    $("today").textContent = new Date().toLocaleDateString("en-GB",
      { day: "2-digit", month: "short", year: "numeric" });

    drawWheel();
    countUp($("chip-lessons"), LESSONS.length);
    countUp($("chip-nb"), countNotebooks());

    var by = { done: 0, learning: 0, archive: 0, todo: 0 };
    ALL_TOPICS.forEach(function (t) { by[t.status] = (by[t.status] || 0) + 1; });
    var stats = [
      ["◆", TOTAL, "topics mapped"],
      ["✓", by.done, "finished"],
      ["◐", by.learning, "in progress"],
      ["◇", by.archive, "prior evidence"],
      ["📖", LESSONS.length, "lesson pages"]
    ];
    $("stats").innerHTML = stats.map(function (s) {
      return '<div class="stat"><i>' + s[0] + '</i><b data-to="' + s[1] +
             '">0</b><span>' + s[2] + "</span></div>";
    }).join("");

    $("subject-grid").innerHTML = SUBJECTS.map(function (s, i) {
      var tot = s.topics.length;
      var bar = ["done", "learning", "archive", "todo"].map(function (k) {
        var c = s.by[k] || 0;
        return c ? '<i class="' + k + '" style="width:' + (c / tot * 100) + '%"></i>' : "";
      }).join("");
      var idx = /^(\d+)/.exec(s.name);
      return '<div class="subj reveal" role="button" tabindex="0" data-subject="' + i +
        '" data-node="' + s.name.replace(/"/g, "&quot;") + '">' +
        '<div class="subj-top"><span class="subj-idx">' + (idx ? idx[1] : "··") + "</span>" +
        "<h3>" + s.name.replace(/^\d+\s*/, "") + '</h3><span class="cnt">' + tot + "</span></div>" +
        "<p>" + s.meta + "</p>" +
        '<div class="meter">' + bar + "</div>" +
        '<div class="subj-foot"><span>' + (s.by.done || 0) + " done · " +
          (s.by.learning || 0) + " learning</span>" +
          (s.lessons ? '<b class="jump" data-filter="' + s.name.replace(/"/g, "&quot;") +
             '">' + s.lessons + " lessons →</b>" : "<span>—</span>") + "</div></div>";
    }).join("");

    var subjectOf = {};
    SUBJECTS.forEach(function (s) { s.topics.forEach(function (t) { subjectOf[t.title] = s; }); });

    function blurb(t) {
      return t.lede ||
             (t.details || []).find(function (x) { return !/^Concept:/.test(x); }) ||
             t.meta || "";
    }
    $("subject-grid").addEventListener("click", function (e) {
      var jump = e.target.closest(".jump");
      if (jump) {                                   // "N lessons →" filters the list below
        e.stopPropagation();
        var btn = $("lesson-filter").querySelector('[data-f="' + jump.dataset.filter + '"]');
        if (btn) btn.click();
        $("lessons").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      var card = e.target.closest(".subj");
      if (card) window.LU.focus(card.dataset.node);  // open the map on that subject
    });
    $("subject-grid").addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".subj");
      if (card) { e.preventDefault(); window.LU.focus(card.dataset.node); }
    });

    var current = ALL_TOPICS.filter(function (t) { return t.status === "learning" && t.lesson; })
                            .sort(function (a, b) { return (b.hasStory ? 1 : 0) - (a.hasStory ? 1 : 0); })
                            .slice(0, 10);
    $("current-grid").innerHTML = current.map(function (t) {
      var s = subjectOf[t.title];
      return '<a class="mini s-' + t.status + ' reveal" href="' + (t.lesson || t.path) + '">' +
        '<div class="tagline">' + (s ? s.name.replace(/^\d+\s*/, "") : "") + "</div>" +
        "<h4>" + t.title + "</h4><p>" + blurb(t) + "</p>" +
        '<div class="go"><span>' + (t.lesson ? "Read the lesson" : "Open the source") +
        "</span><span>→</span></div></a>";
    }).join("") || '<p style="color:var(--muted)">Nothing open right now.</p>';

    var subs = SUBJECTS.filter(function (s) { return s.lessons; });
    var withNotes = LESSONS.filter(function (t) { return t.notes; }).length;
    $("lesson-filter").innerHTML =
      '<button class="pill-btn on" data-f="all">All ' + LESSONS.length + "</button>" +
      (withNotes ? '<button class="pill-btn hn" data-f="__notes">\u270D\uFE0F Handwritten ' +
                   withNotes + "</button>" : "") +
      subs.map(function (s) {
        return '<button class="pill-btn" data-f="' + s.name + '">' +
               s.name.replace(/^\d+\s*/, "") + " " + s.lessons + "</button>";
      }).join("");

    function renderLessons(filter) {
      var rows = [];
      SUBJECTS.forEach(function (s) {
        if (filter !== "all" && filter !== "__notes" && s.name !== filter) return;
        s.topics.forEach(function (t) {
          if (!t.lesson) return;
          if (filter === "__notes" && !t.notes) return;
          rows.push('<a class="les reveal' + (t.hasStory ? " story-yes" : "") +
            (t.notes ? " has-notes" : "") +
            '" href="' + t.lesson + '">' +
            '<span class="sub">' + s.name.replace(/^\d+\s*/, "") + "</span>" +
            "<b>" + t.title +
            (t.notes ? ' <span class="hn-badge" title="' + t.notes +
                       ' handwritten pages">\u270D\uFE0F</span>' : "") +
            "</b><small>" + (t.lede || t.meta || "") + "</small></a>");
        });
      });
      $("lesson-grid").innerHTML = rows.join("");
      observe();
    }
    renderLessons("all");
    $("lesson-filter").addEventListener("click", function (e) {
      var b = e.target.closest(".pill-btn"); if (!b) return;
      $("lesson-filter").querySelectorAll(".pill-btn").forEach(function (x) {
        x.classList.toggle("on", x === b);
      });
      renderLessons(b.dataset.f);
    });

    $("foot-count").textContent =
      TOTAL + " topics · " + LESSONS.length + " lessons · " + SUBJECTS.length + " subjects";

    $("surprise").addEventListener("click", function () {
      var pick = LESSONS[Math.floor(Math.random() * LESSONS.length)];
      if (pick) window.location.href = pick.lesson;
    });
    document.querySelectorAll("[data-goto]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = document.querySelector('.nav-btn[data-view="' + b.dataset.goto + '"]');
        if (t) t.click();
      });
    });
    observe();
  }

  /* ── reveal on scroll, and count the stat numbers when they appear ── */
  var io = null;
  /* Opt into the reveal animation only if we can actually reverse it. */
  if (window.IntersectionObserver &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-anim");
    // last-resort safety net: nothing may stay hidden
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
        el.classList.add("in");
      });
    }, 2500);
  }
  function observe() {
    if (!io) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          var b = e.target.querySelector ? e.target.querySelector("b[data-to]") : null;
          if (b && !b.dataset.done) { b.dataset.done = "1"; countUp(b, +b.dataset.to); }
          io.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -40px 0px" });
    }
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
  }
  document.querySelectorAll(".stat").forEach(function () {});

  build();
  document.querySelectorAll(".stat").forEach(function (s) {
    s.classList.add("reveal"); io && io.observe(s);
  });
  observe();

  /* "/" focuses search */
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault(); $("search").focus();
    }
  });
})();
