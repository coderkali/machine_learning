/* Shared behaviour for lesson pages:
   Python syntax highlighting, reading progress, and TOC tracking. */
(function () {
  "use strict";

  /* ── Python highlighter ──────────────────────────────
     One pass with alternation, so nothing inside a string
     or a comment gets highlighted a second time. */
  var KW = /^(from|import|as|def|return|for|in|if|elif|else|while|try|except|raise|with|lambda|class|pass|break|continue|and|or|not|is|None|True|False|print|range|len|round|zip|enumerate)$/;

  function highlight(src) {
    var esc = src.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
    var re = /(#[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|(\b\d+\.?\d*(?:e[-+]?\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|(\b[A-Za-z_]\w*\b)/g;
    return esc.replace(re, function (mm, com, str, num, fn, word) {
      if (com) return '<span class="tok-com">' + com + "</span>";
      if (str) return '<span class="tok-str">' + str + "</span>";
      if (num) return '<span class="tok-num">' + num + "</span>";
      if (fn)  return KW.test(fn) ? '<span class="tok-kw">' + fn + "</span>"
                                  : '<span class="tok-fn">' + fn + "</span>";
      if (word && KW.test(word)) return '<span class="tok-kw">' + word + "</span>";
      return mm;
    });
  }

  document.querySelectorAll("pre.py").forEach(function (pre) {
    pre.innerHTML = highlight(pre.textContent.replace(/^\n|\s+$/g, ""));
  });

  /* ── reading progress ── */
  var bar = document.querySelector(".progress");
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  // getElementById, not querySelector: an id that starts with a digit
  // ("#1-proving-it-first") is not a valid CSS selector and would throw.
  var heads = links.map(function (a) {
    var h = a.getAttribute("href") || "";
    try { return document.getElementById(decodeURIComponent(h).slice(1)); }
    catch (e) { return null; }
  });

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";

    var best = 0;
    heads.forEach(function (el, i) {
      if (el && el.getBoundingClientRect().top < 140) best = i;
    });
    links.forEach(function (a, i) { a.classList.toggle("on", i === best); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();

/* ── handwritten-notes lightbox ─────────────────────────
   Click a page to enlarge; ← → to move, Z to zoom, Esc to close. */
(function () {
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".hn-thumb"));
  if (!thumbs.length) return;

  var box = document.createElement("div");
  box.className = "hn-box";
  box.innerHTML =
    '<div class="hn-bar"><b class="hn-name"></b><span class="hn-count"></span>' +
    '<span class="sp"></span>' +
    '<button data-a="prev">← Prev</button><button data-a="next">Next →</button>' +
    '<button data-a="zoom">Zoom</button><button data-a="close">Close ✕</button></div>' +
    '<div class="hn-stage"><img alt=""></div>' +
    '<div class="hn-foot">← → to move · Z to zoom · Esc to close</div>';
  document.body.appendChild(box);

  var img = box.querySelector("img"),
      name = box.querySelector(".hn-name"),
      count = box.querySelector(".hn-count"),
      i = 0;

  function open(n) {
    i = (n + thumbs.length) % thumbs.length;
    var t = thumbs[i];
    img.src = t.dataset.src;
    img.classList.remove("zoom");
    name.textContent = t.dataset.name;
    count.textContent = (i + 1) + " of " + thumbs.length;
    box.classList.add("on");
    document.body.style.overflow = "hidden";
  }
  function close() {
    box.classList.remove("on");
    document.body.style.overflow = "";
  }
  thumbs.forEach(function (t, n) {
    t.addEventListener("click", function () { open(n); });
  });
  box.addEventListener("click", function (e) {
    var a = e.target.closest("[data-a]");
    if (a) {
      var k = a.dataset.a;
      if (k === "prev") open(i - 1);
      else if (k === "next") open(i + 1);
      else if (k === "zoom") img.classList.toggle("zoom");
      else close();
      return;
    }
    if (e.target === box || e.target.classList.contains("hn-stage")) close();
  });
  img.addEventListener("click", function () { img.classList.toggle("zoom"); });
  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("on")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") open(i + 1);
    if (e.key === "ArrowLeft") open(i - 1);
    if (e.key.toLowerCase() === "z") img.classList.toggle("zoom");
  });
})();
