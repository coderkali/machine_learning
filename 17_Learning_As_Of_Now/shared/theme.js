/* ══════════════════════════════════════════════════════════════════════
   Dark / light for the whole site.

   Load this in <head>, BEFORE any stylesheet renders, so the stored choice
   is on <html> before the first paint and the page never flashes the wrong
   theme. It then adds its own toggle button to the page's nav bar, so no
   page has to carry the markup.

   The choice is kept in localStorage under "lu-theme" and is shared by every
   page — including the generated lesson pages — even when opened as files.
   With no stored choice the site follows the operating system.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var KEY = "lu-theme", root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }   /* private mode */
  }
  function systemPrefers() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light" : "dark";
  }
  function apply(mode) {
    if (mode === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");          /* dark is the default */
    paintButtons(mode);
    try {
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: mode } }));
    } catch (e) {
      var ev = document.createEvent("Event");          /* very old engines */
      ev.initEvent("themechange", false, false); window.dispatchEvent(ev);
    }
  }
  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  /* ── before first paint ── */
  apply(stored() || systemPrefers());

  /* follow the OS while the reader has not chosen for themselves */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onSys = function () { if (!stored()) apply(systemPrefers()); };
    if (mq.addEventListener) mq.addEventListener("change", onSys);
    else if (mq.addListener) mq.addListener(onSys);
  }

  /* ── the button ── */
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.6"/>' +
    '<g stroke-linecap="round"><path d="M12 2.4v2.6M12 19v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9' +
    'M2.4 12h2.6M19 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9"/></g></svg>';
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z"/></svg>';

  function paintButtons(mode) {
    var light = mode === "light";
    var bs = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < bs.length; i++) {
      bs[i].innerHTML = light ? MOON : SUN;
      bs[i].setAttribute("aria-pressed", light ? "true" : "false");
      bs[i].title = light ? "Switch to dark" : "Switch to light";
      bs[i].setAttribute("aria-label", bs[i].title);
    }
  }

  function toggle() {
    var next = current() === "light" ? "dark" : "light";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }

  function mount() {
    if (document.querySelector("[data-theme-toggle]")) { paintButtons(current()); return; }
    /* the nav on the map pages, the bar on a generated lesson page */
    var host = document.querySelector(".nav-links") || document.querySelector("header.bar");
    if (!host) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "theme-toggle";
    b.setAttribute("data-theme-toggle", "");
    b.addEventListener("click", toggle);
    host.appendChild(b);
    paintButtons(current());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else { mount(); }

  window.LUTheme = { get: current, set: function (m) {
    try { localStorage.setItem(KEY, m); } catch (e) {} apply(m); } };
})();
