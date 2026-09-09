/* Builds the journey as a vertical tree and ticks each leaf from the real map. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  var BY_FOLDER = {};
  (function walk(n) {
    var p = n.lesson || n.path || "";
    var m = p.replace(/^\.\.\/\.\.\//, "").match(/^(\d\d_[^/]+\/\d\d_[^/]+)/);
    if (m) BY_FOLDER[m[1]] = n;
    (n.children || []).forEach(walk);
  })(TREE);

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function pretty(folder) {
    return folder.split("/").pop().replace(/^\d+_/, "").replace(/_/g, " ");
  }
  /* a topic counts as learned when its lesson exists and it is not "todo" */
  function stateOf(folder) {
    var t = BY_FOLDER[folder];
    if (!t) return { k: "todo", t: null };
    if (t.status === "done" || t.status === "archive") return { k: "done", t: t };
    if (t.status === "learning") return { k: "learning", t: t };
    return { k: "todo", t: t };
  }
  var MARK = { done: "✓", learning: "◐", todo: "○" };

  /* ── walk the whole plan once, gathering numbers ── */
  var totalLeaves = 0, doneLeaves = 0, frontier = null;

  var html = PHASES.map(function (ph, pi) {
    var pDone = 0, pTotal = 0;

    var stages = ph.stages.map(function (st) {
      var leaves = st.topics.map(function (f) {
        var s = stateOf(f);
        return { folder: f, k: s.k, node: s.t };
      });
      var d = leaves.filter(function (l) { return l.k !== "todo"; }).length;   // studied
      pDone += d; pTotal += leaves.length;
      totalLeaves += leaves.length; doneLeaves += d;

      var cls = d === leaves.length ? "ok" : (d > 0 ? "part" : "");
      if (!frontier && d < leaves.length) frontier = st.id;

      var items = leaves.map(function (l) {
        var name = l.node ? l.node.title : pretty(l.folder);
        var sub = l.node && l.node.meta ? l.node.meta.split("·")[0].trim() : "not studied yet";
        var tick = '<i class="tk ' + l.k + '">' + MARK[l.k] + "</i>";
        if (l.node && (l.node.lesson || l.node.path)) {
          return '<a class="leaf ' + l.k + '" href="' + esc(l.node.lesson || l.node.path) + '">' +
                 tick + "<span>" + esc(name) + '</span><span class="leaf-sub">' + esc(sub) + "</span></a>";
        }
        return '<div class="leaf todo">' + tick + "<span>" + esc(name) +
               '</span><span class="leaf-sub">not studied yet</span></div>';
      }).join("");

      return '<div class="stage ' + cls + '" id="st-' + st.id + '">' +
        '<div class="st-head"><span class="st-tw">▶</span>' +
        '<span class="st-ic">' + st.icon + "</span>" +
        "<h3>" + esc(st.name) + "</h3>" +
        '<span class="st-count"><b>' + d + "</b> / " + leaves.length + " studied</span></div>" +
        '<div class="st-body">' +
          '<p class="st-what">' + esc(st.what) + "</p>" +
          '<div class="st-ask"><b>Ask yourself</b>' + esc(st.ask) + "</div>" +
          items +
        "</div></div>";
    }).join("");

    return '<section class="phase p' + (pi + 1) + '" id="ph-' + ph.id + '">' +
      '<div class="phase-bar"><span class="pnum">' + ph.n + "</span>" +
      "<div><h2>" + esc(ph.name) + "</h2>" +
      '<span class="sdlc">' + esc(ph.sdlc || "") + "</span></div>" +
      '<span class="pstat"><b>' + pDone + "</b> / " + pTotal + " studied</span></div>" +
      '<div class="stages">' + stages + "</div></section>";
  }).join("");

  $("tree").innerHTML = html;

  /* header jump links */
  $("jnav").innerHTML = PHASES.map(function (ph) {
    return '<a href="#ph-' + ph.id + '">' + ph.n + " · " + esc(ph.name) + "</a>";
  }).join("");

  /* progress ring */
  var pct = totalLeaves ? Math.round(doneLeaves / totalLeaves * 100) : 0;
  var C = 2 * Math.PI * 52;
  var ring = $("ring");
  ring.setAttribute("stroke-dasharray", "0 " + C);
  setTimeout(function () {
    ring.setAttribute("stroke-dasharray", (C * pct / 100).toFixed(1) + " " + C);
  }, 120);
  $("pct").textContent = pct + "%";

  /* mark where the learning frontier is */
  if (frontier) {
    var h = document.querySelector("#st-" + frontier + " h3");
    if (h) h.insertAdjacentHTML("afterend", '<span class="here">YOU ARE HERE</span>');
  }

  /* open / close a stage; the frontier starts open */
  document.querySelectorAll(".st-head").forEach(function (h) {
    h.addEventListener("click", function () { h.parentElement.classList.toggle("open"); });
  });
  var first = frontier ? $("st-" + frontier) : document.querySelector(".stage");
  if (first) first.classList.add("open");
})();
