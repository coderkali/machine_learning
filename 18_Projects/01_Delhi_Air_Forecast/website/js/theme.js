/* Runs in <head>, before first paint, so the page never flashes the wrong theme. */
(function () {
  var saved = null;
  try { saved = localStorage.getItem("daf-theme"); } catch (e) {}
  var sysLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.setAttribute("data-theme", saved || (sysLight ? "light" : "dark"));

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".themebtn");
    if (!btn) return;
    var paint = function () {
      btn.textContent = document.documentElement.getAttribute("data-theme") === "light" ? "Dark" : "Light";
    };
    paint();
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("daf-theme", next); } catch (e) {}
      paint();
    });
  });
})();
