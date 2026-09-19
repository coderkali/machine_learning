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
  // Grouped by sprint — the order the work is actually done in. Milestones mark
  // the three moments the project exists for.
  const milestones = {
    "DAF-07": "First model scored — does it beat Asha's method at all?",
    "DAF-18": "The answer — scored once on the test period, model card written",
    "DAF-20": "Asha gets a number — /forecast answers"
  };
  let s = "";
  DAF_SPRINTS.forEach(sp => {
    const rows = DAF_TICKETS.filter(t => String(t.sprint) === sp.id);
    if (!rows.length) return;
    const done = rows.filter(t => t.status === "done").length;
    s += `<div class="phase-h"><span class="n">${sp.id === "later" ? "Later" : "Sprint " + sp.id}</span>
          <strong>${esc(sp.name)}</strong><span class="c">${done}/${rows.length} done</span></div>`;
    rows.forEach(t => {
      const here = t.id === DAF_HERE.ticket;
      s += `<div class="tk is-${t.status}${here ? " is-here" : ""}"><span class="id">${t.id}</span>
            <span class="t">${esc(t.title)}<span class="ph">phase ${t.phase}</span>${t.flag ? `<span class="flag">⚑ ${esc(t.flag)}</span>` : ""}</span>
            <span class="tag ${t.status}">${here ? "here · " : ""}${t.status}</span></div>`;
      if (milestones[t.id]) s += `<div class="ms">◆ ${esc(milestones[t.id])}</div>`;
    });
  });
  el.innerHTML = s;
}

/* ---------- funnel: 102 locations down to 50 usable stations ---------- */
function drawFunnel(el) {
  const rows = DAF_DATA.funnel, max = Math.max(...rows.map(r => r.value));
  const tone = ["var(--ink3)", "var(--violet)", "var(--amber)", "var(--accent)", "var(--good)"];
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
  pts.filter(p => p.pass && !p.sel).forEach(p => { s += `<circle class="dot-gate" cx="${X(p.lon).toFixed(1)}" cy="${Y(p.lat).toFixed(1)}" r="6"><title>${esc(p.name)} — passed D-003 (${p.days} days) but dropped by the window</title></circle>`; });
  pts.filter(p => p.sel).forEach(p => { s += `<circle class="dot-pass" cx="${X(p.lon).toFixed(1)}" cy="${Y(p.lat).toFixed(1)}" r="6.5"><title>${esc(p.name)} — selected · ${p.days} days (${p.first} → ${p.last})</title></circle>`; });
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


/* ---------- how full the 4-year window actually is ---------- */
function drawFill(el) {
  const w = DAF_DATA.window;
  const cols = 48, rows = 12, cell = 12, gap = 3;
  const total = cols * rows, lit = Math.round(total * w.rows / w.possible);
  const W = cols * (cell + gap), H = rows * (cell + gap) + 26;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${w.fill} per cent of the possible station-days are present">`;
  for (let i = 0; i < total; i++) {
    const x = (i % cols) * (cell + gap), y = Math.floor(i / cols) * (cell + gap);
    const on = i < lit;
    s += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${on ? "var(--accent)" : "var(--line)"}"/>`;
  }
  s += `<text x="0" y="${H - 6}" class="vlbl">${w.rows.toLocaleString()} of ${w.possible.toLocaleString()} possible station-days — ${w.fill}%. Each square is about ${Math.round(w.possible / total)} station-days.</text></svg>`;
  el.innerHTML = s;
}

/* ---------- which sensors actually carry the rows ---------- */
function drawContribution(el) {
  const rows = DAF_DATA.selected;
  const W = 780, T = 14, B = 46, L = 46, R = 10;
  const bw = (W - L - R) / rows.length, H = 250;
  const max = Math.max(...rows.map(r => r.rows));
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Rows contributed by each of the 44 selected sensors">`;
  for (let g = 0; g <= 2; g++) {
    const v = Math.round(max * g / 2), yy = H - B - (v / max) * (H - T - B);
    s += `<line class="grid-l" x1="${L}" y1="${yy}" x2="${W - R}" y2="${yy}"/><text x="${L - 9}" y="${yy + 4}" text-anchor="end">${v}</text>`;
  }
  rows.forEach((r, i) => {
    const h = Math.max((r.rows / max) * (H - T - B), 1.5), x = L + i * bw;
    const big = r.rows > 200;
    s += `<rect x="${x + 1}" y="${H - B - h}" width="${bw - 2}" height="${h}" rx="2"
           fill="${big ? "var(--accent)" : "var(--amber)"}"><title>${esc(r.name)} — ${r.rows} rows, ${r.overlap} days inside the window</title></rect>`;
  });
  s += `<line class="axis" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"/>`;
  s += `<text x="${L}" y="${H - B + 18}">← 2 sensors carry 64% of the table</text>`;
  s += `<text x="${W - R}" y="${H - B + 18}" text-anchor="end">the other 42 average 29 rows each →</text>`;
  s += `<text x="${L}" y="${H - B + 36}" font-weight="600">Each bar is one of the 44 selected sensors</text></svg>`;
  el.innerHTML = s;
}

/* ---------- what the cached readings look like, in Asha's bands ---------- */
function drawDist(el) {
  const rows = DAF_DATA.dist, total = rows.reduce((a, r) => a + r.count, 0);
  const tone = ["#5ec26a", "#b7d34a", "#f0b429", "#f08a3c", "#e2583f", "#a3364d"];
  const W = 700, H = 240, L = 40, R = 16, T = 16, B = 56;
  const max = Math.max(...rows.map(r => r.count)), bw = (W - L - R) / rows.length;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="The 3,342 cached daily readings by CPCB band">`;
  rows.forEach((r, i) => {
    const h = (r.count / max) * (H - T - B), x = L + i * bw + bw * 0.14, w = bw * 0.72;
    s += `<rect x="${x}" y="${H - B - h}" width="${w}" height="${h}" rx="4" fill="${tone[i]}"/>
          <text class="vlbl" x="${x + w / 2}" y="${H - B - h - 7}" text-anchor="middle">${r.count}</text>`;
    r.short.split("\n").forEach((line, k) => {
      s += `<text x="${x + w / 2}" y="${H - B + 17 + k * 13}" text-anchor="middle">${esc(line)}</text>`;
    });
    s += `<text x="${x + w / 2}" y="${H - B + (r.short.includes("\n") ? 43 : 30)}" text-anchor="middle" fill="var(--ink3)">${(r.count / total * 100).toFixed(0)}%</text>`;
  });
  const cut = L + 3 * bw;
  s += `<line x1="${cut}" y1="${T - 4}" x2="${cut}" y2="${H - B}" stroke="var(--rose)" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="${cut + 7}" y="${T + 8}" fill="var(--rose)" font-weight="700">indoors →</text>
        <line class="axis" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"/></svg>`;
  el.innerHTML = s;
}

/* ---------- the season that makes this problem hard ---------- */
function drawSeason(el) {
  const rows = DAF_DATA.season;
  const W = 780, H = 260, L = 46, R = 96, T = 20, B = 54;
  const max = Math.max(...rows.map(r => r.mean)) * 1.1;
  const bw = (W - L - R) / rows.length;
  const Y = v => H - B - (v / max) * (H - T - B);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Average cached PM2.5 by month of the year">`;
  [0, 90, 150, 250].forEach(v => {
    if (v > max) return;
    s += `<line class="grid-l" x1="${L}" y1="${Y(v)}" x2="${W - R}" y2="${Y(v)}"/><text x="${L - 9}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
  });
  s += `<line x1="${L}" y1="${Y(90)}" x2="${W - R + 6}" y2="${Y(90)}" stroke="var(--rose)" stroke-width="1.6" stroke-dasharray="5 4"/>
        <text x="${W - R + 12}" y="${Y(90) - 2}" fill="var(--rose)" font-weight="700">90</text>
        <text x="${W - R + 12}" y="${Y(90) + 13}" fill="var(--rose)">Asha's line</text>`;
  rows.forEach((r, i) => {
    const x = L + i * bw + bw * 0.2, w = bw * 0.6, h = H - B - Y(r.mean);
    const over = r.mean >= 90;
    s += `<rect x="${x}" y="${Y(r.mean)}" width="${w}" height="${h}" rx="4" fill="${over ? "var(--rose)" : "var(--accent)"}" fill-opacity="${over ? 1 : .8}">
            <title>${r.m}: mean ${r.mean} µg/m³ across ${r.n} cached readings</title></rect>
          <text class="vlbl" x="${x + w / 2}" y="${Y(r.mean) - 6}" text-anchor="middle">${Math.round(r.mean)}</text>
          <text x="${x + w / 2}" y="${H - B + 18}" text-anchor="middle">${r.m}</text>`;
  });
  s += `<line class="axis" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"/>
        <text x="${L}" y="${H - 10}" font-weight="600">Mean of the cached readings, µg/m³ — thin months are less certain</text></svg>`;
  el.innerHTML = s;
}

/* ---------- the validation checks ---------- */
function drawChecks(el) {
  el.innerHTML = `<ul class="ck">` + DAF_DATA.checks.map(c =>
    `<li><span class="m ${c.ok ? "y" : "n"}">${c.ok ? "✓" : "✗"}</span>
     <span><b style="color:var(--ink)">${esc(c.what)}</b><br><span style="font-size:13.5px;color:var(--ink3)">${esc(c.got)}</span></span></li>`
  ).join("") + `</ul>`;
}

/* ---------- the re-issued sensor trap ---------- */
function drawReissue(el) {
  const r = DAF_DATA.reissue;
  const W = 720, H = 230, L = 132, R = 16;
  const t0 = 2016, t1 = 2027.2;
  const X = y => L + (y - t0) / (t1 - t0) * (W - L - R);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="The picked sensor stops in 2022; its live replacement starts in 2025">`;
  s += `<rect x="${X(2022.71)}" y="34" width="${X(t1) - X(2022.71)}" height="${H - 96}" rx="4" fill="rgba(var(--accent-rgb),.09)"/>`;
  s += `<text x="${X(2022.79)}" y="30" fill="var(--accent)" font-weight="700">the D-004 window</text>`;
  for (let y = 2016; y <= 2026; y += 2) {
    s += `<line class="grid-l" x1="${X(y)}" y1="34" x2="${X(y)}" y2="${H - 62}"/>
          <text x="${X(y)}" y="${H - 48}" text-anchor="middle">${y}</text>`;
  }
  const lanes = [
    { y: 62,  label: "the sensor picked",    a: 2018.19, b: 2022.83, c: "var(--amber)",  note: "1,696-day span — clears the 730 gate" },
    { y: 116, label: "its live replacement", a: 2025.14, b: 2026.70, c: "var(--ink3)",   note: `${r.new_span}-day span — rejected, too young` }
  ];
  lanes.forEach(l => {
    s += `<text x="${L - 12}" y="${l.y + 5}" text-anchor="end" fill="var(--ink2)" font-weight="600">${l.label}</text>
          <rect x="${X(l.a)}" y="${l.y - 9}" width="${X(l.b) - X(l.a)}" height="18" rx="5" fill="${l.c}"/>
          <text x="${X(l.b)}" y="${l.y + 30}" text-anchor="end" fill="var(--ink3)">${l.note}</text>`;
  });
  s += `<text x="${L - 12}" y="${H - 12}" text-anchor="end" fill="var(--rose)" font-weight="700">result</text>
        <text x="${L}" y="${H - 12}" fill="var(--rose)">only ~45 days of the picked sensor land inside the window — at ${r.affected} of the ${r.of} stations</text>`;
  s += `</svg>`;
  el.innerHTML = s;
}

/* ---------- station 17: every daily mean, with Asha's line ---------- */
function drawS17Daily(el) {
  const rows = DAF_S17.daily;
  const W = 900, H = 294, L = 44, R = 16, T = 30, B = 40;
  const t0 = new Date(rows[0].d).getTime(), t1 = new Date(rows[rows.length - 1].d).getTime();
  const X = d => L + (new Date(d).getTime() - t0) / (t1 - t0) * (W - L - R);
  const cap = 400, Y = v => H - B - Math.min(v, cap) / cap * (H - T - B);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily mean PM2.5 at R K Puram">`;
  [0, 90, 200, 400].forEach(v => {
    s += `<line class="grid-l" x1="${L}" y1="${Y(v)}" x2="${W - R}" y2="${Y(v)}"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
  });
  const w0 = X("2025-10-01"), w1 = X("2026-03-01");
  s += `<rect x="${w0}" y="${T}" width="${w1 - w0}" height="${H - T - B}" fill="rgba(var(--rose-rgb),.06)"/>
        <text x="${(w0 + w1) / 2}" y="${T - 10}" text-anchor="middle" fill="var(--rose)" font-weight="700">the only winter</text>`;
  s += `<line x1="${L}" y1="${Y(90)}" x2="${W - R}" y2="${Y(90)}" stroke="var(--rose)" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  rows.forEach(r => {
    const over = r.v >= 91;
    s += `<circle cx="${X(r.d).toFixed(1)}" cy="${Y(r.v).toFixed(1)}" r="${r.ok ? 2.3 : 2}"
            fill="${!r.ok ? "var(--ink3)" : over ? "var(--rose)" : "var(--accent)"}" fill-opacity="${r.ok ? .85 : .35}">
            <title>${r.d}: ${r.v} µg/m³${r.ok ? "" : " (fewer than 18 hours — not a valid day)"}${r.v > cap ? " — clipped" : ""}</title></circle>`;
  });
  ["2025-03-01", "2025-06-01", "2025-09-01", "2025-12-01", "2026-03-01", "2026-06-01", "2026-09-01"].forEach(d => {
    const lab = new Date(d).toLocaleString("en-GB", { month: "short", year: "2-digit" });
    s += `<text x="${X(d)}" y="${H - B + 18}" text-anchor="middle">${lab}</text>`;
  });
  s += `<text x="${W - R}" y="${Y(90) - 6}" text-anchor="end" fill="var(--rose)" font-weight="700">90 — indoors above</text></svg>`;
  el.innerHTML = s;
}

/* ---------- station 17: what else the station measures ---------- */
function drawParams(el) {
  const rows = DAF_S17.params, max = Math.max(...rows.map(r => r.rows));
  const W = 470, rowH = 26, H = rows.length * rowH + 8, L = 128, R = 60;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Rows per parameter in the station 17 files">`;
  rows.forEach((r, i) => {
    const y = i * rowH + 4, w = r.rows / max * (W - L - R), pm = r.name === "pm25";
    s += `<text x="${L - 10}" y="${y + 14}" text-anchor="end" fill="${pm ? "var(--ink)" : "var(--ink2)"}" font-weight="${pm ? 700 : 500}">${esc(r.name)}</text>
          <rect x="${L}" y="${y + 3}" width="${w}" height="15" rx="4" fill="${pm ? "var(--accent)" : "var(--ink3)"}" fill-opacity="${pm ? 1 : .4}"/>
          <text class="vlbl" x="${L + w + 8}" y="${y + 15}">${(r.rows / 1000).toFixed(1)}k</text>`;
  });
  el.innerHTML = s + `</svg>`;
}

/* ---------- a checklist from any {what, got, ok} list ---------- */
function drawList(el, list) {
  el.innerHTML = `<ul class="ck">` + list.map(c =>
    `<li><span class="m ${c.ok ? "y" : "x"}">${c.ok ? "✓" : "✗"}</span>
     <span><b style="color:var(--ink)">${esc(c.what)}</b><br><span style="font-size:13.5px;color:var(--ink3)">${esc(c.got)}</span></span></li>`
  ).join("") + `</ul>`;
}

/* ---------- page boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const map = {
    "#pipeline": drawPipeline, "#board": drawBoard, "#funnel": drawFunnel,
    "#hist": drawHist, "#map": drawMap, "#providers": drawProviders, "#bands": drawBands,
    "#fill": drawFill, "#contribution-chart": drawContribution, "#dist": drawDist,
    "#season": drawSeason, "#checks": drawChecks, "#reissue-chart": drawReissue,
    "#s17-daily": drawS17Daily, "#s17-params": drawParams,
    "#s17-verify": el => drawList(el, DAF_S17.verify)
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
