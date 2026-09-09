/* ══════════════════════════════════════════════════════════
   My Learning Universe
   A spatial mindmap + a full reading view, over TREE.
   No dependencies. Works offline from the file:// protocol.
   ══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var NODE_W = 248, NODE_H = 64, X_GAP = 92, Y_GAP = 14;
  var MIN_S = 0.15, MAX_S = 1.8, DUR = 380;

  var $ = function (id) { return document.getElementById(id); };
  var edgesEl = $("edges"), nodesEl = $("nodes"), canvasEl = $("canvas"),
      viewport = $("viewport"), drawer = $("drawer"), drawerBody = $("drawerBody");

  /* ─────────── 1. prepare the data ─────────── */
  var uid = 0, ALL = [], BY_ID = {};

  (function prep(n, parent, depth, branch) {
    n.id = "n" + uid++;
    n.parent = parent;
    n.depth = depth;
    n.branch = branch;
    n._open = depth < 1;                 // only the root starts open
    ALL.push(n); BY_ID[n.id] = n;
    (n.children || []).forEach(function (c, i) {
      prep(c, n, depth + 1, depth === 0 ? i % 3 : branch);
    });
  })(TREE, null, 0, 0);

  function leafCount(n) {
    if (!n.children || !n.children.length) return 1;
    return n.children.reduce(function (a, c) { return a + leafCount(c); }, 0);
  }
  function tally(n, acc) {
    if (!n.children || !n.children.length) {
      acc.total++; acc[n.status] = (acc[n.status] || 0) + 1;
    } else n.children.forEach(function (c) { tally(c, acc); });
    return acc;
  }
  var COUNT = tally(TREE, { total: 0 });

  /* ─────────── 2. header ─────────── */
  /* The landing page owns the headline numbers now (see home.js); the map only
     needs the search placeholder. Guarded so a missing element cannot kill boot. */
  (function header() {
    var s = $("search");
    if (s) s.placeholder = "Search " + COUNT.total + " topics…";
  })();

  /* ─────────── 3. helpers ─────────── */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function isGap(t) {
    return /^open gap|^still|^not started|^no evidence|not yet|never been run|never executed|barely begun|^remain/i.test(t);
  }
  function hue(n) { return ["--h0", "--h1", "--h2"][n.branch % 3]; }
  function hueVal(n) {
    return getComputedStyle(document.documentElement).getPropertyValue(hue(n)).trim();
  }

  /* ─────────── 4. layout (tidy tree) ─────────── */
  function layout() {
    var y = 0;
    (function walk(n) {
      n.tx = n.depth * (NODE_W + X_GAP);
      var kids = n._open ? (n.children || []) : [];
      if (!kids.length) { n.ty = y; y += NODE_H + Y_GAP; }
      else {
        kids.forEach(walk);
        var first = kids[0].ty, last = kids[kids.length - 1].ty;
        // centre the parent over a short subtree; top-align it over a tall one,
        // otherwise a big branch leaves whole columns empty
        n.ty = (last - first) <= (NODE_H + Y_GAP) * 5
             ? (first + last) / 2
             : first;
      }
    })(TREE);
  }
  function visible() {
    var out = [];
    (function walk(n) {
      out.push(n);
      if (n._open) (n.children || []).forEach(walk);
    })(TREE);
    return out;
  }

  /* ─────────── 5. node elements ─────────── */
  var els = {};

  function makeEl(n) {
    var kids = n.children || [];
    var el = document.createElement("div");
    el.className = "card s-" + n.status + (n.kind ? " k-" + n.kind : "") +
                   (kids.length ? "" : " leaf") + (n.lesson ? " has-lesson" : "");
    el.style.borderTopColor = "";
    el.innerHTML =
      '<div class="knob">' + (kids.length ? "+" : "") + "</div>" +
      '<div class="card-txt">' +
        '<div class="card-title">' + esc(n.title) + "</div>" +
        '<div class="card-meta">' +
          (kids.length ? leafCount(n) + " topics · " : "") + esc(n.meta || "") +
        "</div>" +
      "</div>";

    // pointerup, not click: a click never reaches the card while the
    // viewport is panning, and this is the exact path a real mouse takes.
    // Do not stopPropagation — the window listener below must still end the drag.
    el.addEventListener("pointerup", function (e) {
      if (dragMoved) return;                 // that was a pan, not a tap
      if (e.pointerType === "mouse" && e.button !== 0) return;
      select(n);
      if (kids.length) { n._open = !n._open; render(n); }
    });
    el.addEventListener("mouseenter", function () { lightPath(n, true); });
    el.addEventListener("mouseleave", function () { lightPath(n, false); });
    return el;
  }

  function lightPath(n, on) {
    var p = n;
    while (p) {
      if (els[p.id]) els[p.id].classList.toggle("lit", on);
      if (p.parent) {
        var edge = edgesEl.querySelector('[data-to="' + p.id + '"]');
        if (edge) edge.classList.toggle("lit", on);
      }
      p = p.parent;
    }
  }

  /* ─────────── 6. render + animate ─────────── */
  var visList = [], raf = null, finTimer = null;

  function render(anchor) {
    var a = (anchor && anchor.ty != null) ? anchor : null;
    var beforeY = a ? a.ty : 0;
    layout();
    if (a) { py -= (a.ty - beforeY) * scale; apply(); }   // anchor stays put
    var next = visible();
    var alive = {};
    next.forEach(function (n) { alive[n.id] = 1; });

    next.forEach(function (n) {
      if (!els[n.id]) {
        var el = makeEl(n);
        els[n.id] = el;
        nodesEl.appendChild(el);
        // grow out of the parent's current spot
        var p = n.parent;
        n.cx = p && p.cx != null ? p.cx : n.tx;
        n.cy = p && p.cy != null ? p.cy : n.ty;
        el.style.transform = "translate(" + n.cx + "px," + n.cy + "px)";
        el.classList.add("gone");
        setTimeout(function () { el.classList.remove("gone"); }, 16);
      }
      var e = els[n.id];
      e.classList.toggle("open-node", !!(n._open && n.children && n.children.length));
      var k = e.querySelector(".knob");
      if (n.children && n.children.length) k.textContent = n._open ? "–" : "+";
      n.sx = n.cx; n.sy = n.cy;
    });

    // retire the nodes that are no longer on the map
    Object.keys(els).forEach(function (id) {
      if (alive[id]) return;
      var el = els[id];
      el.classList.add("gone");
      delete els[id];
      setTimeout(function () { if (el.parentNode) el.remove(); }, 260);
    });

    visList = next;
    sizeSvg();
    if (raf) cancelAnimationFrame(raf);
    clearTimeout(finTimer);
    finTimer = setTimeout(settle, DUR + 60);   // safety net: never leave a node mid-flight
    var t0 = performance.now();
    (function tick(t) {
      var p = Math.min(1, (t - t0) / DUR);
      var e = 1 - Math.pow(1 - p, 3);            // ease-out cubic
      visList.forEach(function (n) {
        n.cx = n.sx + (n.tx - n.sx) * e;
        n.cy = n.sy + (n.ty - n.sy) * e;
        var el = els[n.id];
        if (el) el.style.transform = "translate(" + n.cx + "px," + n.cy + "px)";
      });
      drawEdges();
      if (p < 1) raf = requestAnimationFrame(tick);
      else { raf = null; settle(); }
    })(t0);
  }

  /* snap every visible node onto its computed position and redraw */
  function settle() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    visList.forEach(function (n) {
      n.cx = n.tx; n.cy = n.ty;
      var el = els[n.id];
      if (el) {
        el.style.transform = "translate(" + n.tx + "px," + n.ty + "px)";
        el.classList.remove("gone");
      }
    });
    drawEdges();
  }

  function sizeSvg() {
    var maxX = 0, maxY = 0;
    visList.forEach(function (n) {
      maxX = Math.max(maxX, n.tx + NODE_W); maxY = Math.max(maxY, n.ty + NODE_H);
    });
    edgesEl.setAttribute("width", maxX + 200);
    edgesEl.setAttribute("height", maxY + 200);
  }

  function drawEdges() {
    var d = "";
    visList.forEach(function (n) {
      if (!n._open || !n.children) return;
      n.children.forEach(function (c) {
        if (c.cx == null) return;
        var x1 = n.cx + NODE_W, y1 = n.cy + NODE_H / 2,
            x2 = c.cx,          y2 = c.cy + NODE_H / 2,
            dx = Math.max(28, (x2 - x1) * 0.5);
        d += '<path data-to="' + c.id + '" stroke="' + hueVal(c) + '" d="M' +
             x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + "," +
             (x2 - dx) + " " + y2 + "," + x2 + " " + y2 + '"/>';
      });
    });
    edgesEl.innerHTML = d;
  }

  /* ─────────── 7. drawer ─────────── */
  var selected = null;

  function select(n) {
    if (selected && els[selected.id]) els[selected.id].classList.remove("sel");
    selected = n;
    if (els[n.id]) els[n.id].classList.add("sel");

    var crumb = [], p = n.parent;
    while (p) { crumb.unshift("<span>" + esc(p.title) + "</span>"); p = p.parent; }

    var h = "";
    if (crumb.length) h += '<div class="crumb">' + crumb.join("") + "</div>";
    h += "<h2>" + esc(n.title) + "</h2>";
    if (n.meta) h += '<p class="d-meta">' + esc(n.meta) + "</p>";
    h += '<span class="pill s-' + n.status + '">' + label(n.status) + "</span>";
    if (n.children && n.children.length)
      h += '<span class="pill">' + leafCount(n) + " topics inside</span>";
    if (n.note) h += '<div class="d-note">' + esc(n.note) + "</div>";

    if (n.details && n.details.length) {
      h += '<div class="d-h">What is in it</div><ul class="d-list">';
      n.details.forEach(function (t) {
        h += '<li class="' + (isGap(t) ? "gap" : "") + '">' + esc(t) + "</li>";
      });
      h += "</ul>";
    }
    if (n.children && n.children.length) {
      h += '<div class="d-h">Branches</div>';
      n.children.forEach(function (c) {
        h += '<div class="kid s-' + c.status + '" data-go="' + c.id + '"><div>' +
             esc(c.title) + "<small>" + esc(c.meta || label(c.status)) +
             "</small></div></div>";
      });
    }
    if (n.notes && n.lesson)
      h += '<a class="d-notes" href="' + esc(n.lesson) + '#handwritten">' +
           '\u270D\uFE0F <b>' + n.notes + ' handwritten page' + (n.notes > 1 ? 's' : '') +
           '</b><span>see the topic in your own handwriting</span></a>';
    if (n.lesson)
      h += '<a class="d-lesson" href="' + esc(n.lesson) + '">' +
           '<b>Read the illustrated lesson</b>' +
           '<span>story, diagrams and the code explained</span></a>';
    if (n.path)
      h += '<a class="d-open" href="' + esc(n.path) + '">' +
           (n.lesson ? "Or open the raw notebook: " : "Open ") +
           esc(n.path.split("/").filter(Boolean).pop()) + " ↗</a>";

    drawerBody.innerHTML = h;
    var wasOpen = drawer.classList.contains("open");
    drawer.classList.add("open");
    if (!wasOpen) setTimeout(function () { keepInView(n); }, 300);

    drawerBody.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = BY_ID[b.dataset.go];
        var a = c.parent; while (a) { a._open = true; a = a.parent; }
        render(); select(c); centerOn(c);
      });
    });
  }
  function label(s) {
    return { done: "Done", learning: "Learning", archive: "Archive — prior work", todo: "Not started" }[s] || s;
  }
  $("drawerClose").addEventListener("click", function () {
    drawer.classList.remove("open");
    if (selected && els[selected.id]) els[selected.id].classList.remove("sel");
    selected = null;
  });

  /* ─────────── 8. pan + zoom ─────────── */
  var px = 60, py = 40, scale = 1, dragging = false, dragMoved = false, sx0, sy0;

  function apply() {
    canvasEl.style.transform = "translate(" + px + "px," + py + "px) scale(" + scale + ")";
    // strip the second line of text once cards get too small to read it
    canvasEl.classList.toggle("far", scale < 0.55);
    canvasEl.classList.toggle("tiny", scale < 0.3);
  }
  /* usable width — the drawer covers the right edge when it is open */
  function stage() {
    var r = viewport.getBoundingClientRect();
    var d = drawer.classList.contains("open") ? drawer.offsetWidth : 0;
    return { w: Math.max(240, r.width - d), h: r.height };
  }
  /* No setPointerCapture here: capturing the pointer on the viewport retargets
     pointerup away from the card, so the card never sees the interaction.
     Tracking the drag on window keeps panning working past the window edge. */
  viewport.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true; dragMoved = false;
    sx0 = e.clientX - px; sy0 = e.clientY - py;
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var nx = e.clientX - sx0, ny = e.clientY - sy0;
    if (!dragMoved && (Math.abs(nx - px) > 3 || Math.abs(ny - py) > 3)) {
      dragMoved = true;                       // only now is it really a pan
      viewport.classList.add("grabbing");
    }
    if (!dragMoved) return;                   // don't nudge the map on a tap
    px = nx; py = ny; apply();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; viewport.classList.remove("grabbing");
    setTimeout(function () { dragMoved = false; }, 0);
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  viewport.addEventListener("wheel", function (e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {                 // pinch / cmd-scroll = zoom
      var r = viewport.getBoundingClientRect();
      var mx = e.clientX - r.left, my = e.clientY - r.top;
      var f = Math.exp(-e.deltaY * 0.0026);
      var ns = Math.min(MAX_S, Math.max(MIN_S, scale * f));
      px = mx - (mx - px) * (ns / scale);
      py = my - (my - py) * (ns / scale);
      scale = ns;
    } else {                                      // plain scroll = move around
      px -= e.deltaX; py -= e.deltaY;
    }
    apply();
  }, { passive: false });

  function zoomBy(f) {
    var st = stage(), mx = st.w / 2, my = st.h / 2;
    var ns = Math.min(MAX_S, Math.max(MIN_S, scale * f));
    px = mx - (mx - px) * (ns / scale);
    py = my - (my - py) * (ns / scale);
    scale = ns; apply();
  }
  $("zoomIn").addEventListener("click", function () { zoomBy(1.25); });
  $("zoomOut").addEventListener("click", function () { zoomBy(0.8); });

  function fit() {
    if (!visList.length) return;
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    visList.forEach(function (n) {
      minX = Math.min(minX, n.tx); minY = Math.min(minY, n.ty);
      maxX = Math.max(maxX, n.tx + NODE_W); maxY = Math.max(maxY, n.ty + NODE_H);
    });
    var s = stage(), pad = 60;
    scale = Math.min((s.w - pad * 2) / (maxX - minX),
                     (s.h - pad * 2) / (maxY - minY), 1.15);
    scale = Math.min(MAX_S, Math.max(MIN_S, scale));
    px = (s.w - (maxX - minX) * scale) / 2 - minX * scale;
    py = (s.h - (maxY - minY) * scale) / 2 - minY * scale;
    apply();
  }
  $("fit").addEventListener("click", fit);

  /* nudge the view just enough that a node is not hidden behind the drawer */
  function keepInView(n) {
    var s = stage();
    var left = n.tx * scale + px, right = left + NODE_W * scale;
    var top = n.ty * scale + py, bottom = top + NODE_H * scale;
    if (right > s.w - 24) px -= right - (s.w - 24);
    if (left < 24) px += 24 - left;
    if (bottom > s.h - 24) py -= bottom - (s.h - 24);
    if (top < 24) py += 24 - top;
    apply();
  }

  function centerOn(n) {
    var s = stage();
    px = s.w / 2 - (n.tx + NODE_W / 2) * scale;
    py = s.h / 2 - (n.ty + NODE_H / 2) * scale;
    apply();
  }

  /* ─────────── 9. expand / collapse ─────────── */
  $("expandAll").addEventListener("click", function () {
    ALL.forEach(function (n) { n._open = true; });
    scale = Math.min(1.1, Math.max(0.5, scale));
    render(TREE);
    px = 80; py = 60; apply();        // jump to the top and read downwards

  });
  $("collapseAll").addEventListener("click", function () {
    ALL.forEach(function (n) { n._open = n.depth < 1; });
    render(TREE); setTimeout(fit, DUR);
  });

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT") { if (e.key === "Escape") e.target.blur(); return; }
    if (e.key === "+" || e.key === "=") zoomBy(1.25);
    if (e.key === "-") zoomBy(0.8);
    if (e.key === "0") fit();
    if (e.key === "Escape") $("drawerClose").click();
  });

  /* ─────────── 10. search ─────────── */
  var searchEl = $("search"), hitsEl = $("hits");

  function nodeText(n) {
    return (n.title + " " + (n.meta || "") + " " + (n.note || "") + " " +
            (n.lesson ? "lesson illustrated guide " : "") +
            (n.details || []).join(" ")).toLowerCase();
  }

  var beforeSearch = null;      // the map as it was before the search started

  searchEl.addEventListener("input", function () {
    var q = searchEl.value.trim().toLowerCase();
    ALL.forEach(function (n) { n._hit = false; });

    if (!q) {
      hitsEl.textContent = "";
      Object.keys(els).forEach(function (id) {
        els[id].classList.remove("dim", "match");
      });
      if (beforeSearch) {                       // put the map back where it was
        ALL.forEach(function (n) { n._open = beforeSearch.open[n.id]; });
        px = beforeSearch.px; py = beforeSearch.py; scale = beforeSearch.scale;
        beforeSearch = null;
        render(); apply();
      }
      if (readBuilt) paintReader("");
      return;
    }

    if (!beforeSearch) {                        // remember it on the first keystroke
      var open = {};
      ALL.forEach(function (n) { open[n.id] = n._open; });
      beforeSearch = { open: open, px: px, py: py, scale: scale };
    }

    var hits = [];
    ALL.forEach(function (n) {
      if (nodeText(n).indexOf(q) >= 0) { n._hit = true; hits.push(n); }
    });
    hits.forEach(function (n) { var p = n.parent; while (p) { p._open = true; p = p.parent; } });
    render();

    Object.keys(els).forEach(function (id) {
      var n = BY_ID[id];
      els[id].classList.toggle("match", !!n._hit);
      els[id].classList.toggle("dim", !n._hit);
    });

    hitsEl.textContent = hits.length + (hits.length === 1 ? " match" : " matches");
    if (hits.length) setTimeout(function () { centerOn(hits[0]); }, DUR);
    if (readBuilt) paintReader(q);
  });

  /* ─────────── 11. reading view ─────────── */
  var readBuilt = false;

  function buildReader() {
    var reader = $("reader"), toc = $("toc"), html = "", nav = "";

    TREE.children.forEach(function (branch, bi) {
      var acc = tally(branch, { total: 0 });
      var sid = "sec" + bi;
      nav += '<a class="lvl1" href="#' + sid + '">' + esc(branch.title) + "</a>";

      html += '<section class="sec" id="' + sid + '"><div class="sec-head">' +
              "<h2>" + esc(branch.title) + "</h2>" +
              "<p>" + esc(branch.meta || "") + "</p>" +
              '<div class="bar">' +
                seg(acc, "done") + seg(acc, "learning") + seg(acc, "archive") + seg(acc, "todo") +
              "</div>" +
              '<div class="bar-lab">' + acc.total + " topics — " +
                (acc.done || 0) + " done, " + (acc.learning || 0) + " learning, " +
                (acc.archive || 0) + " archive, " + (acc.todo || 0) + " not started</div>" +
              "</div>";

      (branch.children || []).forEach(function (grp, gi) {
        var gid = sid + "g" + gi;
        nav += '<a class="lvl2" href="#' + gid + '">' + esc(grp.title) + "</a>";
        html += '<div class="grp" id="' + gid + '">' +
                "<h3><i class=\"dot s-" + grp.status + '"></i>' + esc(grp.title) + "</h3>" +
                '<p class="g-meta">' + esc(grp.meta || "") + "</p>";

        var kids = grp.children && grp.children.length ? grp.children : [grp];
        var run = [];                       // consecutive leaves share one grid
        function flush() {
          if (!run.length) return;
          html += '<div class="rcards">' + run.map(rcard).join("") + "</div>";
          run = [];
        }
        kids.forEach(function (k, ki) {
          if (!(k.children && k.children.length)) { run.push(k); return; }
          flush();
          var kid = gid + "s" + ki;
          nav += '<a class="lvl3" href="#' + kid + '">' + esc(k.title) + "</a>";
          html += '<div class="sub" id="' + kid + '">' +
                  '<h4 class="sub-h"><i class="dot s-' + k.status + '"></i>' +
                    esc(k.title) +
                    '<span class="sub-meta">' + esc(k.meta || "") + "</span></h4>" +
                  (k.note ? '<div class="d-note">' + esc(k.note) + "</div>" : "") +
                  '<div class="rcards">' + k.children.map(rcard).join("") + "</div>" +
                  (k.path ? '<a class="d-open" href="' + esc(k.path) + '">Open ' +
                            esc(k.path.split("/").filter(Boolean).pop()) + " \u2197</a>" : "") +
                  "</div>";
        });
        flush();
        html += "</div>";
      });
      html += "</section>";
    });

    reader.innerHTML = html;
    toc.innerHTML = nav;
    readBuilt = true;
  }

  function seg(acc, k) {
    var pct = (acc[k] || 0) / acc.total * 100;
    return pct ? '<i class="' + k + '" style="width:' + pct.toFixed(1) + '%"></i>' : "";
  }

  /* a card, plus any grandchildren folded in underneath it */
  function rcard(n) {
    var h = '<div class="rcard s-' + n.status + '">' +
            "<h4>" + esc(n.title) + "</h4>" +
            '<p class="r-meta">' + esc(n.meta || label(n.status)) + "</p>";
    if (n.note) h += '<div class="d-note">' + esc(n.note) + "</div>";
    if (n.details && n.details.length) {
      h += '<ul class="d-list">';
      n.details.forEach(function (t) {
        h += '<li class="' + (isGap(t) ? "gap" : "") + '">' + esc(t) + "</li>";
      });
      h += "</ul>";
    }
    if (n.children && n.children.length) {
      h += '<ul class="d-list">';
      n.children.forEach(function (c) {
        h += "<li><b>" + esc(c.title) + "</b>" +
             (c.meta ? " — " + esc(c.meta) : "") + "</li>";
      });
      h += "</ul>";
    }
    if (n.lesson)
      h += '<a class="d-open lesson" href="' + esc(n.lesson) + '">\u{1F4D6} Read the lesson</a>';
    if (n.path)
      h += '<a class="d-open" href="' + esc(n.path) + '">Open ' +
           esc(n.path.split("/").filter(Boolean).pop()) + " ↗</a>";
    return h + "</div>";
  }

  /* dim + highlight inside the reader while searching */
  function paintReader(q) {
    var cards = $("reader").querySelectorAll(".rcard");
    cards.forEach(function (c) {
      c.querySelectorAll("mark").forEach(function (m) {
        m.replaceWith(document.createTextNode(m.textContent));
      });
      c.normalize();
      if (!q) { c.style.display = ""; return; }
      var on = c.textContent.toLowerCase().indexOf(q) >= 0;
      c.style.display = on ? "" : "none";
      if (on) mark(c, q);
    });
    // hide any group, sub-group or section left with nothing in it
    ["\u002Esub", "\u002Egrp", "\u002Esec"].forEach(function (sel) {
      $("reader").querySelectorAll(sel).forEach(function (box) {
        var any = Array.prototype.some.call(
          box.querySelectorAll(".rcard"),
          function (c) { return c.style.display !== "none"; });
        box.style.display = (!q || any) ? "" : "none";
      });
    });
  }
  function mark(root, term) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      if (t.parentElement.closest(".d-open")) return;
      var i = t.data.toLowerCase().indexOf(term);
      if (i < 0) return;
      var after = t.splitText(i); after.splitText(term.length);
      var m = document.createElement("mark");
      m.textContent = after.data;
      after.replaceWith(m);
    });
  }

  /* ─────────── 12. view switch (home · map · library) ─────────── */
  var mapReady = false;
  function show(name) {
    document.querySelectorAll(".nav-btn").forEach(function (x) {
      x.classList.toggle("active", x.dataset.view === name);
    });
    ["home", "map", "read"].forEach(function (v) {
      var el = $("view-" + v);
      if (el) el.classList.toggle("hidden", v !== name);
    });
    document.body.classList.toggle("mapview", name === "map");
    if (name === "read" && !readBuilt) {
      buildReader(); paintReader(searchEl.value.trim().toLowerCase());
    }
    if (name === "map" && !mapReady) {      // the canvas had no size while hidden
      mapReady = true;
      setTimeout(function () { render(); fit(); }, 0);
    }
    if (name !== "map") window.scrollTo(0, 0);
    try { localStorage.setItem("lu-view", name); } catch (e) {}
  }
  document.querySelectorAll(".nav-btn").forEach(function (b) {
    /* the Workspace / Journey / When-to-Use-What buttons are plain links:
       they carry no data-view, so let them navigate instead of switching view */
    b.addEventListener("click", function () { if (b.dataset.view) show(b.dataset.view); });
  });
  /* Open the map on a particular node: expand its ancestors, select it, centre it. */
  function focus(title) {
    var n = null;
    for (var i = 0; i < ALL.length; i++) {
      if (ALL[i].title === title) { n = ALL[i]; break; }
    }
    if (!n) return false;
    var p = n.parent; while (p) { p._open = true; p = p.parent; }
    n._open = true;
    show("map");
    setTimeout(function () {
      render(n);
      scale = 0.9;              // land at a readable zoom, not wherever we were
      select(n);
      centerOn(n);
      // nudge left so the subject sits beside its children, not under the drawer
      px -= NODE_W * scale * 0.55;
      apply();
    }, 30);
    return true;
  }
  window.LU = { show: show, focus: focus };

  /* home search: filter the lesson cards in place */
  searchEl.addEventListener("input", function () {
    if (!$("view-home") || $("view-home").classList.contains("hidden")) return;
    var q = searchEl.value.trim().toLowerCase();
    var shown = 0;
    document.querySelectorAll("#lesson-grid .les, #current-grid .mini").forEach(function (c) {
      var on = !q || c.textContent.toLowerCase().indexOf(q) >= 0;
      c.style.display = on ? "" : "none";
      if (on && c.classList.contains("les")) shown++;
    });
    document.querySelectorAll("#subject-grid .subj").forEach(function (c) {
      c.style.display = !q || c.textContent.toLowerCase().indexOf(q) >= 0 ? "" : "none";
    });
    hitsEl.textContent = q ? shown + " lessons" : "";
  });

  /* ─────────── go ─────────── */
  render();
  show("home");
})();
