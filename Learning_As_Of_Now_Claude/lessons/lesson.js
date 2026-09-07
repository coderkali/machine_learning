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
  var heads = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });

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
