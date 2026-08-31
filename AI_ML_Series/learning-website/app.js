"use strict";

const state = { data: null, selectedId: null, status: "all" };
const statusMeta = {
  learned: { label: "Learned", icon: "✓" },
  current: { label: "Currently learning", icon: "◐" },
  referenced: { label: "Referenced / available", icon: "○" },
};

const byId = (id) => document.getElementById(id);
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const categoryFor = (concept) => state.data.categories.find((category) => category.id === concept.categoryId);
const conceptById = (id) => state.data.concepts.find((concept) => concept.id === id);
const topicFor = (concept) => categoryFor(concept)?.topics?.find((topic) => topic.conceptIds.includes(concept.id));
const fileName = (path) => path.split("/").pop();
const iconFor = (type) => ({ notebook: "◫", markdown: "▤", python: "⌘", dataset: "▦", web: "◇", image: "▧", config: "⚙" }[type] || "·");

function init() {
  if (!window.LEARNING_MAP) throw new Error("learning-map.js did not load");
  state.data = window.LEARNING_MAP;
  renderStats();
  renderRecent();
  renderTree();
  renderFileIndex();
  renderCoverage();
  bindControls();
  const initial = location.hash.startsWith("#concept=") ? location.hash.slice(9) : state.data.meta.defaultConcept;
  selectConcept(conceptById(initial) ? initial : state.data.concepts[0].id, false);
  byId("last-updated").textContent = `Last updated ${state.data.meta.lastUpdated} · ${state.data.meta.analyzedFiles} learning files analyzed`;
}

function renderStats() {
  const counts = Object.fromEntries(["learned", "current", "referenced"].map((status) => [status, state.data.concepts.filter((concept) => concept.status === status).length]));
  const cards = [
    [counts.learned, "Concepts with learned evidence"],
    [counts.current, "Concepts actively in progress"],
    [counts.referenced, "Curriculum references, not learned"],
    [state.data.meta.analyzedFiles, "Learning files analyzed"],
    [state.data.meta.inventory.notebooks, "Notebooks inspected"],
    [state.data.meta.inventory.datasets, "Datasets inspected"],
    [state.data.meta.inventory.pythonFiles, "Python apps inspected"],
    [state.data.concepts.reduce((total, concept) => total + concept.sources.length, 0), "Concept ↔ file mappings"],
  ];
  byId("stats").innerHTML = cards.map(([value, label]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span></article>`).join("");
}

function renderRecent() {
  const recent = [...state.data.concepts].filter((concept) => concept.status === "learned").sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 5);
  byId("recent-concepts").innerHTML = recent.map((concept) => `<button class="recent-card" data-concept-id="${concept.id}"><strong>${escapeHtml(concept.title)}</strong><small>${concept.lastUpdated} · ${concept.sources.length} source${concept.sources.length === 1 ? "" : "s"}</small></button>`).join("");
}

function renderTree() {
  const categories = state.data.categories.map((category) => {
    const concepts = state.data.concepts.filter((concept) => concept.categoryId === category.id && (state.status === "all" || concept.status === state.status));
    if (!concepts.length) return "";
    const topics = (category.topics || [{ title: "Concepts", conceptIds: concepts.map((concept) => concept.id) }]).map((topic) => {
      const topicConcepts = topic.conceptIds.map(conceptById).filter((concept) => concept && concepts.includes(concept));
      if (!topicConcepts.length) return "";
      return `<details class="tree-topic" open>
        <summary><span>${escapeHtml(topic.title)}</span><small>${topicConcepts.length}</small><span class="topic-chevron">›</span></summary>
        <div class="tree-concepts">${topicConcepts.map((concept) => `<button class="concept-node${concept.id === state.selectedId ? " active" : ""}" data-concept-id="${concept.id}"><span class="node-status">${statusMeta[concept.status].icon}</span><span class="node-title">${escapeHtml(concept.title)}</span><span class="node-count">${concept.sources.length}</span></button>`).join("")}</div>
      </details>`;
    }).join("");
    return `<details class="tree-category" style="--category-color:${category.color}" open>
      <summary><span class="category-dot"></span><span class="category-copy"><strong>${escapeHtml(category.title)}</strong><small>${concepts.length} concept${concepts.length === 1 ? "" : "s"}</small></span><span class="category-chevron">›</span></summary>
      <div class="tree-topics">${topics}</div>
    </details>`;
  }).join("");
  byId("knowledge-tree").innerHTML = categories || `<p class="empty-state">No concepts match this status.</p>`;
}

function selectConcept(id, focus = true) {
  const concept = conceptById(id);
  if (!concept) return;
  state.selectedId = id;
  renderTree();
  renderConcept(concept);
  history.replaceState(null, "", `#concept=${id}`);
  if (focus) byId("concept-detail").focus({ preventScroll: true });
}

function renderConcept(concept) {
  const category = categoryFor(concept);
  const topic = topicFor(concept);
  const formula = concept.formula ? `<section class="detail-card"><h3>Formula, decoded</h3><div class="formula"><div class="formula-expression">${escapeHtml(concept.formula.expression)}</div><ul class="formula-parts">${concept.formula.parts.map((part) => `<li><code>${escapeHtml(part.term)}</code> → ${escapeHtml(part.meaning)}</li>`).join("")}</ul>${concept.formula.example ? `<p><strong>Tiny example:</strong> ${escapeHtml(concept.formula.example)}</p>` : ""}</div></section>` : "";
  const code = concept.code ? `<section class="detail-card"><h3>Important code</h3><pre class="code-block"><code>${escapeHtml(concept.code)}</code></pre></section>` : "";
  const visual = concept.visual ? `<section class="detail-card wide"><h3>${escapeHtml(concept.visual.title || "Visual explanation")}</h3>${renderVisual(concept.visual)}</section>` : "";
  const prerequisites = (concept.prerequisites || []).map(conceptById).filter(Boolean);
  const related = (concept.related || []).map(conceptById).filter(Boolean);
  const leadsTo = state.data.concepts.filter((candidate) => (candidate.prerequisites || []).includes(concept.id));
  byId("concept-detail").innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">My learning</a><span>${escapeHtml(category.title)}</span>${topic ? `<span>${escapeHtml(topic.title)}</span>` : ""}<span>${escapeHtml(concept.title)}</span></nav>
    <header class="concept-header"><div><span class="status-pill ${concept.status}">${statusMeta[concept.status].icon} ${statusMeta[concept.status].label}</span><h2>${escapeHtml(concept.title)}</h2><p class="concept-summary">${escapeHtml(concept.summary)}</p></div><div class="evidence-badge"><strong>${concept.sources.length}</strong><span>evidence source${concept.sources.length === 1 ? "" : "s"}</span></div></header>
    <div class="detail-grid">
      <section class="detail-card"><h3>What it is</h3><p>${escapeHtml(concept.what)}</p></section>
      <section class="detail-card"><h3>Why it matters</h3><p>${escapeHtml(concept.why)}</p></section>
      <section class="detail-card"><h3>Simple intuition</h3><p>${escapeHtml(concept.intuition)}</p></section>
      <section class="detail-card"><h3>How it works</h3><ol class="steps">${(concept.how || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section>
      ${visual}${formula}${code}
      <section class="detail-card"><h3>Small example</h3><p>${escapeHtml(concept.example || "See the linked source evidence for the worked example.")}</p></section>
      <section class="detail-card"><h3>Common confusion</h3><ul>${(concept.confusions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section class="detail-card wide"><h3>Concept relationships</h3><div class="relationship-map">
        ${renderRelationGroup("Prerequisites", prerequisites, "Feeds this concept")}
        <div class="relationship-focus"><small>Current concept</small><strong>${escapeHtml(concept.title)}</strong></div>
        ${renderRelationGroup("Leads to", leadsTo, "Uses this concept")}
        ${renderRelationGroup("Related", related, "Useful connection")}
      </div></section>
      <section class="detail-card wide"><h3>30-second revision</h3>${renderRevision(concept.revision)}</section>
      <section class="detail-card wide"><h3>Source files & purpose</h3><div class="source-list">${concept.sources.map(renderSource).join("")}</div></section>
    </div>`;
}

function renderRelationGroup(label, concepts, emptyText) {
  return `<div class="relation-group"><span>${escapeHtml(label)}</span><div class="relation-row">${concepts.length ? concepts.map((item) => `<button class="relation-chip" data-concept-id="${item.id}">${escapeHtml(item.title)}</button>`).join("") : `<small>${escapeHtml(emptyText)}</small>`}</div></div>`;
}

function renderVisual(visual) {
  if (visual.type === "comparison") return `<div class="viz-compare">${visual.items.map((item) => `<div class="compare-card"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span></div>`).join("")}</div>`;
  return `<div class="viz-flow">${visual.items.map((item, index) => `${index ? `<span class="viz-arrow" aria-hidden="true">→</span>` : ""}<div class="viz-step"><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}</div>`).join("")}</div>`;
}

function renderRevision(revision = {}) {
  return `<div class="revision-grid">${Object.entries(revision).map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>`;
}

function renderSource(source) {
  return `<details class="source-item"><summary><span class="file-icon" aria-hidden="true">${iconFor(source.type)}</span><span class="source-path">${escapeHtml(source.path)}</span><span class="source-role">${escapeHtml(source.role)}</span></summary><div class="source-body"><p>${escapeHtml(source.purpose)}</p>${source.highlights?.length ? `<p><strong>Important evidence:</strong> ${escapeHtml(source.highlights.join(" · "))}</p>` : ""}<a href="${sourceHref(source.path)}" target="_blank" rel="noopener">Open source file →</a></div></details>`;
}

function sourceHref(path) {
  return `../${encodeURI(path)}`;
}

function flattenedFiles() {
  const files = new Map();
  state.data.concepts.forEach((concept) => concept.sources.forEach((source) => {
    if (!files.has(source.path)) files.set(source.path, { ...source, concepts: [] });
    files.get(source.path).concepts.push(concept.id);
  }));
  return [...files.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function renderFileIndex(query = "") {
  const normalized = query.trim().toLowerCase();
  const files = flattenedFiles().filter((file) => file.path.toLowerCase().includes(normalized));
  byId("file-index").innerHTML = files.map((file) => `<details class="file-card" data-file-path="${escapeHtml(file.path)}">
    <summary><span class="file-icon" aria-hidden="true">${iconFor(file.type)}</span><span class="file-card-path"><strong>${escapeHtml(file.path)}</strong><small>${escapeHtml(file.role)}</small></span><span>${file.concepts.length} concept${file.concepts.length === 1 ? "" : "s"}</span></summary>
    <div class="file-card-body"><p>${escapeHtml(file.purpose)}</p><div class="file-concepts">${file.concepts.map(conceptById).filter(Boolean).map((concept) => `<button class="relation-chip" data-concept-id="${concept.id}">${statusMeta[concept.status].icon} ${escapeHtml(concept.title)}</button>`).join("")}</div><a href="${sourceHref(file.path)}" target="_blank" rel="noopener">Open source file →</a></div>
  </details>`).join("") || `<p>No source files match “${escapeHtml(query)}”.</p>`;
}

function renderCoverage() {
  byId("coverage-bars").innerHTML = state.data.categories.map((category) => {
    const concepts = state.data.concepts.filter((concept) => concept.categoryId === category.id);
    const learned = concepts.filter((concept) => concept.status === "learned").length;
    const current = concepts.filter((concept) => concept.status === "current").length;
    const percent = concepts.length ? Math.round(((learned + current * .5) / concepts.length) * 100) : 0;
    return `<div class="coverage-row" style="--category-color:${category.color}"><div class="coverage-label"><strong>${escapeHtml(category.title)}</strong><small>${learned} learned · ${current} learning</small></div><div class="coverage-track" aria-label="${escapeHtml(category.title)} repository evidence coverage ${percent}%"><div class="coverage-fill" style="width:${percent}%"></div></div><div class="coverage-value">${percent}%</div></div>`;
  }).join("");
}

function renderSearch(query) {
  const panel = byId("search-results");
  const normalized = query.trim().toLowerCase();
  if (!normalized) { panel.hidden = true; return; }
  const concepts = state.data.concepts.filter((concept) => [concept.title, concept.summary, ...(concept.keywords || [])].join(" ").toLowerCase().includes(normalized)).slice(0, 8);
  const files = flattenedFiles().filter((file) => file.path.toLowerCase().includes(normalized)).slice(0, 8);
  panel.innerHTML = `${concepts.length ? `<p class="search-group-label">Concepts</p>${concepts.map((concept) => `<button class="search-result" data-concept-id="${concept.id}"><span>${statusMeta[concept.status].icon}</span><span><strong>${escapeHtml(concept.title)}</strong><small>${escapeHtml(categoryFor(concept).title)}</small></span></button>`).join("")}` : ""}${files.length ? `<p class="search-group-label">Source files</p>${files.map((file) => `<button class="search-result" data-concept-id="${file.concepts[0]}"><span>${iconFor(file.type)}</span><span><strong>${escapeHtml(fileName(file.path))}</strong><small>${escapeHtml(file.path)}</small></span></button>`).join("")}` : ""}${!concepts.length && !files.length ? `<p class="search-group-label">No match found</p>` : ""}`;
  panel.hidden = false;
}

function bindControls() {
  document.addEventListener("click", (event) => {
    const conceptButton = event.target.closest("[data-concept-id]");
    if (conceptButton) { selectConcept(conceptButton.dataset.conceptId); byId("search-results").hidden = true; }
    const filter = event.target.closest("[data-status]");
    if (filter) {
      state.status = filter.dataset.status;
      document.querySelectorAll("[data-status]").forEach((button) => { const active = button === filter; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
      renderTree();
    }
  });
  byId("global-search").addEventListener("input", (event) => renderSearch(event.target.value));
  byId("file-search").addEventListener("input", (event) => renderFileIndex(event.target.value));
  byId("expand-all").addEventListener("click", () => document.querySelectorAll(".tree-category, .tree-topic").forEach((item) => { item.open = true; }));
  byId("collapse-all").addEventListener("click", () => document.querySelectorAll(".tree-category, .tree-topic").forEach((item) => { item.open = false; }));
  byId("theme-toggle").addEventListener("click", () => { const dark = document.documentElement.dataset.theme === "dark"; document.documentElement.dataset.theme = dark ? "" : "dark"; localStorage.setItem("learning-atlas-theme", dark ? "light" : "dark"); });
  document.addEventListener("keydown", (event) => { if (event.key === "/" && document.activeElement.tagName !== "INPUT") { event.preventDefault(); byId("global-search").focus(); } if (event.key === "Escape") byId("search-results").hidden = true; });
  document.addEventListener("click", (event) => { if (!event.target.closest(".search-wrap")) byId("search-results").hidden = true; });
  const savedTheme = localStorage.getItem("learning-atlas-theme");
  if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";
}

try {
  init();
} catch (error) {
  byId("concept-detail").innerHTML = `<div class="loading-state"><p><strong>The learning map could not load.</strong><br>${escapeHtml(error.message)}</p></div>`;
  console.error(error);
}
