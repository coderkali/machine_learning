/* Shared rendering for the Delhi Air Forecast project site.
   No libraries. Every chart below is SVG built here by hand. */

const $ = (sel, root) => (root || document).querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const svgNS = "http://www.w3.org/2000/svg";

/* ---------- derived progress ---------- */
function progress() {
  const t = DAF_TICKETS;
  const done = t.filter(x => x.status === "done").length;
  const review = t.filter(x => x.status === "review").length;
  const doing = t.filter(x => x.status === "doing").length;
  return { done, review, doing, total: t.length, left: t.length - done - review - doing };
}
function phaseState(p) {
  const rows = p.tickets.map(id => DAF_TICKETS.find(t => t.id === id)).filter(Boolean);
  const done = rows.filter(r => r.status === "done").length;
  const started = rows.filter(r => r.status !== "todo").length;
  let state = "todo";
  if (done === rows.length) state = "done";
  else if (started > 0) state = "part";
  if (p.n === DAF_HERE.phase) state = "here";
  return { done, total: rows.length, state, rows };
}

/* ---------- the 8-phase pipeline ---------- */
function drawPipeline(el) {
  const W = 1000, H = 132, padL = 44, padR = 44;
  const n = DAF_PHASES.length;
  const step = (W - padL - padR) / (n - 1);
  const y = 52;
  const states = DAF_PHASES.map(phaseState);
  const hereIdx = DAF_PHASES.findIndex(p => p.n === DAF_HERE.phase);

  let s = `<svg class="pipe" viewBox="0 0 ${W} ${H}" role="img" aria-label="Eight project phases; phase ${DAF_HERE.phase} is current">`;
  s += `<line class="rail" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
  s += `<line class="fill" x1="${padL}" y1="${y}" x2="${padL + step * hereIdx}" y2="${y}"/>`;

  DAF_PHASES.forEach((p, i) => {
    const x = padL + step * i, st = states[i];
    const cls = st.state === "here" ? "node is-here" : (st.state === "done" || (st.state === "part" && i < hereIdx)) ? "node is-done" : "node";
    s += `<circle class="${cls}" cx="${x}" cy="${y}" r="${st.state === "here" ? 12 : 9}"/>`;
    if (st.state === "done") s += `<path d="M${x - 4} ${y} l3 3 l5.5 -6" fill="none" stroke="var(--bg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<text class="lbl${st.state === "here" ? " is-here" : ""}" x="${x}" y="${y + 32}" text-anchor="middle">${esc(p.short)}</text>`;
    s += `<text class="cnt" x="${x}" y="${y + 49}" text-anchor="middle">P${p.n} · ${st.done}/${st.total}</text>`;
  });

  const hx = padL + step * hereIdx;
  s += `<path d="M${hx} ${y - 21} l-5 -9 h10 z" fill="var(--amber)"/>`;
  s += `<text class="youare" x="${hx}" y="${y - 38}" text-anchor="middle">YOU ARE HERE</text>`;
  s += `</svg>`;

  // Narrow screens get the same information stacked, because 8 labels do not fit on a phone.
  s += `<ol class="pipe-list">` + DAF_PHASES.map((p, i) => {
    const st = states[i];
    const k = st.state === "here" ? "is-here" : (st.state === "done" || (st.state === "part" && i < hereIdx)) ? "is-done" : "";
    return `<li class="${k}"><span class="pl-n">P${p.n}</span><span class="pl-t">${esc(p.name)}</span>
            <span class="pl-c">${st.done}/${st.total}</span></li>`;
  }).join("") + `</ol>`;
  el.innerHTML = s;
}

/* ---------- the ticket board ---------- */
function drawBoard(el) {
  let s = "";
  DAF_PHASES.forEach(p => {
    const st = phaseState(p);
    s += `<div class="phase-h"><span class="n">Phase ${p.n}</span><strong>${esc(p.name)}</strong>
          <span class="c">${st.done}/${st.total} done</span></div>`;
    st.rows.forEach(t => {
      s += `<div class="tk is-${t.status}"><span class="id">${t.id}</span>
            <span class="t">${esc(t.title)}${t.flag ? `<span class="flag">⚑ ${esc(t.flag)}</span>` : ""}</span>
            <span class="tag ${t.status}">${t.status}</span></div>`;
    });
  });
  el.innerHTML = s;
}

/* ---------- funnel: 102 locations down to 50 usable stations ---------- */
function drawFunnel(el) {
  const rows = DAF_DATA.funnel, max = Math.max(...rows.map(r => r.value));
  const tone = ["var(--violet)", "var(--accent)", "var(--amber)", "var(--good)"];
  el.innerHTML = `<div class="fn">` + rows.map((r, i) => {
    const w = 18 + (r.value / max) * 52;
    return `<div class="fn-row">
      <div class="fn-bar" style="width:${w}%;background:${tone[i % tone.length]}">${r.value}</div>
      <div class="fn-txt">${esc(r.label)}<span>${esc(r.note)}</span></div>
    </div>`;
  }).join("") + `</div>`;
}

/* ---------- coverage histogram ---------- */
function drawHist(el) {
  const rows = DAF_DATA.hist;
  const W = 760, H = 300, L = 48, R = 16, T = 18, B = 62;
  const max = Math.max(...rows.map(r => r.count));
  const bw = (W - L - R) / rows.length;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="How many sensors have how much history">`;
  for (let g = 0; g <= 4; g++) {
    const v = Math.round(max * g / 4), yy = H - B - (v / max) * (H - T - B);
    s += `<line class="grid-l" x1="${L}" y1="${yy}" x2="${W - R}" y2="${yy}"/>
          <text x="${L - 10}" y="${yy + 4}" text-anchor="end">${v}</text>`;
  }
  rows.forEach((r, i) => {
    const h = (r.count / max) * (H - T - B), x = L + i * bw + bw * 0.16, w = bw * 0.68;
    const c = r.pass ? "var(--accent)" : "var(--ink3)";
    s += `<rect x="${x}" y="${H - B - h}" width="${w}" height="${h}" rx="4" fill="${c}" ${r.pass ? "" : 'fill-opacity=".45"'}/>
          <text class="vlbl" x="${x + w / 2}" y="${H - B - h - 7}" text-anchor="middle">${r.count}</text>
          <text x="${x + w / 2}" y="${H - B + 19}" text-anchor="middle">${esc(r.label)}</text>`;
  });
  const cutX = L + 3 * bw;
  s += `<line x1="${cutX}" y1="${T - 6}" x2="${cutX}" y2="${H - B}" stroke="var(--rose)" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="${cutX + 7}" y="${T + 6}" fill="var(--rose)" font-weight="700">730-day cut-off</text>
        <line class="axis" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"/>
        <text x="${L}" y="${H - 12}" font-weight="600">Real elapsed coverage: last reading − first reading</text></svg>`;
  el.innerHTML = s;
}

/* ---------- station map ---------- */
function drawMap(el) {
  const pts = DAF_DATA.stations.filter(s => s.lat != null && s.lon != null);
  const W = 640, H = 460, pad = 34;
  const lats = pts.map(p => p.lat), lons = pts.map(p => p.lon);
  const la0 = Math.min(...lats), la1 = Math.max(...lats), lo0 = Math.min(...lons), lo1 = Math.max(...lons);
  const X = lon => pad + (lon - lo0) / (lo1 - lo0) * (W - 2 * pad);
  const Y = lat => H - pad - (lat - la0) / (la1 - la0) * (H - 2 * pad);

  let s = `<svg class="chart map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Where the Delhi PM2.5 stations are">`;
  s += `<rect class="frame" x="${pad - 12}" y="${pad - 12}" width="${W - 2 * pad + 24}" height="${H - 2 * pad + 24}" rx="10"/>`;
  pts.filter(p => !p.pass).forEach(p => { s += `<circle class="dot-fail" cx="${X(p.lon).toFixed(1)}" cy="${Y(p.lat).toFixed(1)}" r="5"/>`; });
  pts.filter(p => p.pass).forEach(p => { s += `<circle class="dot-pass" cx="${X(p.lon).toFixed(1)}" cy="${Y(p.lat).toFixed(1)}" r="6"><title>${esc(p.name)} — ${p.days} days (${p.first} → ${p.last})</title></circle>`; });
  s += `<text x="${pad - 12}" y="${H - 8}" >${lo0.toFixed(2)}°E</text>
        <text x="${W - pad + 12}" y="${H - 8}" text-anchor="end">${lo1.toFixed(2)}°E</text>
        <text x="${pad - 12}" y="${pad - 20}">${la1.toFixed(2)}°N</text>
        <text x="${pad - 12}" y="${H - pad + 28}">${la0.toFixed(2)}°N</text></svg>`;
  el.innerHTML = s;
}

/* ---------- who runs the monitors ---------- */
function drawProviders(el) {
  const rows = DAF_DATA.providers;
  const W = 470, rowH = 36, H = rows.length * rowH + 20, L = 142, R = 76;
  const max = Math.max(...rows.map(r => r.total));
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sensors per data provider, and how many passed">`;
  rows.forEach((r, i) => {
    const y = i * rowH + 8, wTot = (r.total / max) * (W - L - R), wPass = (r.passed / max) * (W - L - R);
    s += `<text x="${L - 12}" y="${y + 18}" text-anchor="end" fill="var(--ink2)" font-weight="600">${esc(r.name)}</text>
          <rect x="${L}" y="${y + 4}" width="${wTot}" height="20" rx="5" fill="var(--ink3)" fill-opacity=".28"/>
          <rect x="${L}" y="${y + 4}" width="${wPass}" height="20" rx="5" fill="var(--accent)"/>
          <text class="vlbl" x="${L + wTot + 10}" y="${y + 19}">${r.passed} / ${r.total}</text>`;
  });
  s += `</svg>`;
  el.innerHTML = s;
}

/* ---------- the CPCB bands and Asha's line ---------- */
function drawBands(el) {
  const tone = ["#5ec26a", "#b7d34a", "#f0b429", "#f08a3c", "#e2583f", "#a3364d"];
  const max = 320;
  let s = `<div class="aqi">`;
  DAF_BANDS.forEach((b, i) => {
    const w = ((b.hi - b.lo) / max) * 100;
    s += `<div style="width:${w}%;background:${tone[i]};color:${i >= 4 ? "#fff" : "#10161d"}">${esc(b.name)}<small>${b.hi === 320 ? "250+" : b.lo + "–" + b.hi}</small></div>`;
  });
  s += `</div><div class="aqi-line"><span class="mk" style="left:${(90 / max) * 100}%">90 µg/m³ — outside becomes indoors</span></div>`;
  el.innerHTML = s;
}

/* ---------- page boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const map = {
    "#pipeline": drawPipeline, "#board": drawBoard, "#funnel": drawFunnel,
    "#hist": drawHist, "#map": drawMap, "#providers": drawProviders, "#bands": drawBands
  };
  Object.entries(map).forEach(([sel, fn]) => { const el = $(sel); if (el) fn(el); });

  const p = progress();
  document.querySelectorAll("[data-stat]").forEach(el => {
    const v = { done: p.done, review: p.review, total: p.total, left: p.left, pct: Math.round((p.done / p.total) * 100) }[el.dataset.stat];
    if (v !== undefined) el.textContent = v;
  });
  const fill = $("[data-progress-fill]");
  if (fill) fill.style.width = ((p.done + p.review * 0.5) / p.total * 100).toFixed(1) + "%";
});
