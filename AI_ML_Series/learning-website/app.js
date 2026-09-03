"use strict";

const state = {
  data: null,
  status: "all",
  rootOpen: true,
  selectedId: null,
  activeCategoryId: null,
  activeTopicKey: null,
  openCategories: new Set(),
  openTopics: new Set(),
};

const statusMeta = {
  learned: { label: "Learned", icon: "✓" },
  current: { label: "Currently learning", icon: "◐" },
  referenced: { label: "Referenced / not learned", icon: "○" },
};

const byId = (id) => document.getElementById(id);
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const conceptById = (id) => state.data.concepts.find((concept) => concept.id === id);
const categoryById = (id) => state.data.categories.find((category) => category.id === id);
const categoryFor = (concept) => categoryById(concept.categoryId);
const topicKey = (categoryId, index) => `${categoryId}::${index}`;
const topicInfoFor = (concept) => {
  const category = categoryFor(concept);
  const index = (category.topics || []).findIndex((topic) => topic.conceptIds.includes(concept.id));
  return { category, topic: category.topics[index], key: topicKey(category.id, index) };
};
const fileName = (path) => path.split("/").pop();
const sourceHref = (path) => `../${encodeURI(path)}`;
const iconFor = (type) => ({ notebook: "◫", markdown: "▤", python: "⌘", dataset: "▦", web: "◇", image: "▧", diagram: "⌁", config: "⚙" }[type] || "·");

function init() {
  if (!window.LEARNING_MAP) throw new Error("learning-map.js did not load");
  state.data = window.LEARNING_MAP;

  const defaultConcept = conceptById(state.data.meta.defaultConcept);
  if (defaultConcept) {
    const info = topicInfoFor(defaultConcept);
    state.openCategories.add(info.category.id);
    state.openTopics.add(info.key);
    state.activeCategoryId = info.category.id;
    state.activeTopicKey = info.key;
  }

  renderHeaderStats();
  renderTree();
  renderRecent();
  renderFileIndex();
  bindControls();
  byId("last-updated").textContent = `Last updated ${state.data.meta.lastUpdated} · ${state.data.meta.analyzedFiles} learning files analyzed`;

  const hashId = location.hash.startsWith("#concept=") ? location.hash.slice(9) : null;
  if (hashId && conceptById(hashId)) selectConcept(hashId, false);
}

function renderHeaderStats() {
  const learned = state.data.concepts.filter((concept) => concept.status === "learned").length;
  const current = state.data.concepts.filter((concept) => concept.status === "current").length;
  byId("header-stats").innerHTML = `
    <span><strong>${learned}</strong> learned</span>
    <span><strong>${current}</strong> growing</span>
    <span><strong>${state.data.meta.analyzedFiles}</strong> sources</span>`;
}

function conceptsForTopic(topic) {
  return topic.conceptIds
    .map(conceptById)
    .filter(Boolean)
    .filter((concept) => state.status === "all" || concept.status === state.status);
}

function renderTree() {
  const learned = state.data.concepts.filter((concept) => concept.status === "learned").length;
  const current = state.data.concepts.filter((concept) => concept.status === "current").length;
  const rootExpanded = state.rootOpen;

  const branches = state.data.categories.map((category) => {
    const allConcepts = state.data.concepts.filter((concept) => concept.categoryId === category.id);
    const visibleConcepts = allConcepts.filter((concept) => state.status === "all" || concept.status === state.status);
    if (!visibleConcepts.length) return "";

    const open = state.openCategories.has(category.id);
    const learnedCount = allConcepts.filter((concept) => concept.status === "learned").length;
    const currentCount = allConcepts.filter((concept) => concept.status === "current").length;
    const evidencePercent = Math.round(((learnedCount + currentCount * 0.5) / allConcepts.length) * 100);

    const topics = (category.topics || []).map((topic, index) => {
      const concepts = conceptsForTopic(topic);
      if (!concepts.length) return "";
      const key = topicKey(category.id, index);
      const topicOpen = state.openTopics.has(key);
      const leaves = concepts.map((concept) => `
        <button class="concept-leaf ${concept.status}${window.LearningLabs?.has(concept.id) ? " lab-ready" : ""}${concept.id === state.selectedId ? " selected" : ""}" type="button"
          data-concept-id="${concept.id}" role="treeitem" aria-current="${concept.id === state.selectedId ? "true" : "false"}">
          <span class="leaf-status" aria-hidden="true">${statusMeta[concept.status].icon}</span>
          <span><strong>${escapeHtml(concept.title)}</strong><small>${concept.sources.length} evidence file${concept.sources.length === 1 ? "" : "s"}${window.LearningLabs?.has(concept.id) ? " · parameter lab" : ""}</small></span>
        </button>`).join("");

      return `<div class="topic-branch${topicOpen ? " open" : ""}" role="group">
        <button class="topic-node" type="button" data-topic-key="${key}" data-category-id="${category.id}" role="treeitem" aria-expanded="${topicOpen}">
          <span><strong>${escapeHtml(topic.title)}</strong><small>${concepts.length} concept leaf${concepts.length === 1 ? "" : "s"}</small></span>
          <span class="node-toggle" aria-hidden="true">${topicOpen ? "−" : "+"}</span>
        </button>
        ${topicOpen ? `<div class="concept-leaves" role="group">${leaves}</div>` : ""}
      </div>`;
    }).join("");

    return `<section class="category-branch${open ? " open" : ""}${state.activeCategoryId === category.id ? " active" : ""}"
      style="--branch-color:${category.color}" role="group">
      <button class="category-node" type="button" data-category-id="${category.id}" role="treeitem" aria-expanded="${open}">
        <span class="branch-number">${String(state.data.categories.indexOf(category) + 1).padStart(2, "0")}</span>
        <span class="branch-copy"><strong>${escapeHtml(category.title)}</strong><small>${(category.topics || []).length} topics · ${allConcepts.length} concepts</small></span>
        <span class="branch-growth"><i style="width:${evidencePercent}%"></i><small>${learnedCount} learned${currentCount ? ` · ${currentCount} growing` : ""}</small></span>
        <span class="node-toggle" aria-hidden="true">${open ? "−" : "+"}</span>
      </button>
      ${open ? `<div class="topic-forest" role="group">${topics}</div>` : ""}
    </section>`;
  }).join("");

  byId("tree-viewport").innerHTML = `
    <div class="root-zone">
      <button class="root-node" type="button" data-root-toggle aria-expanded="${rootExpanded}" role="treeitem">
        <span class="root-ring"><span>ML</span></span>
        <span><strong>Machine Learning</strong><small>${learned} learned leaves · ${current} still growing</small></span>
        <span class="root-action">${rootExpanded ? "Fold tree" : "Grow tree"}</span>
      </button>
      <div class="root-trunk" aria-hidden="true"><span></span></div>
    </div>
    ${state.rootOpen ? `<div class="category-canopy" role="group">${branches}</div>` : `<div class="folded-tree"><span>${state.data.categories.length} category branches folded into the ML root</span></div>`}`;

  renderBreadcrumb();
}

function renderBreadcrumb() {
  const pieces = ["Machine Learning"];
  const category = state.activeCategoryId ? categoryById(state.activeCategoryId) : null;
  if (category) pieces.push(category.title);
  if (category && state.activeTopicKey) {
    const index = Number(state.activeTopicKey.split("::")[1]);
    const topic = category.topics[index];
    if (topic) pieces.push(topic.title);
  }
  if (state.selectedId) pieces.push(conceptById(state.selectedId).title);
  byId("tree-breadcrumb").innerHTML = pieces.map((piece) => `<span>${escapeHtml(piece)}</span>`).join("");
}

function toggleCategory(id) {
  state.rootOpen = true;
  if (state.openCategories.has(id)) {
    state.openCategories.delete(id);
    [...state.openTopics].filter((key) => key.startsWith(`${id}::`)).forEach((key) => state.openTopics.delete(key));
    if (state.activeCategoryId === id) {
      state.activeCategoryId = null;
      state.activeTopicKey = null;
    }
  } else {
    state.openCategories.add(id);
    state.activeCategoryId = id;
    state.activeTopicKey = null;
  }
  renderTree();
}

function toggleTopic(key, categoryId) {
  state.rootOpen = true;
  state.openCategories.add(categoryId);
  if (state.openTopics.has(key)) {
    state.openTopics.delete(key);
    if (state.activeTopicKey === key) state.activeTopicKey = null;
  } else {
    state.openTopics.add(key);
    state.activeCategoryId = categoryId;
    state.activeTopicKey = key;
  }
  renderTree();
}

function expandAll() {
  state.rootOpen = true;
  state.data.categories.forEach((category) => {
    state.openCategories.add(category.id);
    (category.topics || []).forEach((topic, index) => {
      if (conceptsForTopic(topic).length) state.openTopics.add(topicKey(category.id, index));
    });
  });
  renderTree();
}

function collapseAll() {
  state.openCategories.clear();
  state.openTopics.clear();
  state.activeCategoryId = null;
  state.activeTopicKey = null;
  renderTree();
}

function selectConcept(id, updateHash = true) {
  const concept = conceptById(id);
  if (!concept) return;
  window.LearningLabs?.unmount();
  const info = topicInfoFor(concept);
  state.rootOpen = true;
  state.selectedId = id;
  state.activeCategoryId = info.category.id;
  state.activeTopicKey = info.key;
  state.openCategories.add(info.category.id);
  state.openTopics.add(info.key);
  renderTree();
  renderConceptDrawer(concept);
  openDrawer();
  if (window.LearningLabs?.has(id)) window.LearningLabs.mount(id);
  if (updateHash) history.replaceState(null, "", `#concept=${id}`);
}

function renderConceptDrawer(concept) {
  const info = topicInfoFor(concept);
  const prerequisites = (concept.prerequisites || []).map(conceptById).filter(Boolean);
  const related = (concept.related || []).map(conceptById).filter(Boolean);
  const leadsTo = state.data.concepts.filter((candidate) => (candidate.prerequisites || []).includes(concept.id));

  byId("concept-content").innerHTML = `
    <nav class="drawer-breadcrumb" aria-label="Concept path">
      <span>ML</span><span>${escapeHtml(info.category.title)}</span><span>${escapeHtml(info.topic.title)}</span>
    </nav>
    <header class="drawer-header">
      <span class="status-label ${concept.status}">${statusMeta[concept.status].icon} ${statusMeta[concept.status].label}</span>
      <h2 id="drawer-title">${escapeHtml(concept.title)}</h2>
      <p>${escapeHtml(concept.summary)}</p>
      <div class="evidence-count"><strong>${concept.sources.length}</strong><span>source file${concept.sources.length === 1 ? "" : "s"}</span></div>
    </header>

    ${window.LearningLabs?.has(concept.id) ? window.LearningLabs.markup(concept) : `<section class="concept-visual" aria-label="${escapeHtml(concept.visual?.title || "Concept visualization")}">
      <div class="section-kicker">Visual explanation</div>
      <h3>${escapeHtml(concept.visual?.title || concept.title)}</h3>
      ${renderVisual(concept.visual)}
    </section>`}

    <div class="detail-accordions">
      <details open>
        <summary><span>01</span><strong>Meaning, need & intuition</strong><i>+</i></summary>
        <div class="accordion-body three-up">
          <div><h4>What it is</h4><p>${escapeHtml(concept.what)}</p></div>
          <div><h4>Why it matters</h4><p>${escapeHtml(concept.why)}</p></div>
          <div><h4>Simple intuition</h4><p>${escapeHtml(concept.intuition)}</p></div>
        </div>
      </details>

      <details>
        <summary><span>02</span><strong>How it works</strong><i>+</i></summary>
        <div class="accordion-body">
          <ol class="steps">${(concept.how || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
          ${renderFormula(concept.formula)}
        </div>
      </details>

      <details>
        <summary><span>03</span><strong>Example & important code</strong><i>+</i></summary>
        <div class="accordion-body example-grid">
          <div><h4>Small example</h4><p>${escapeHtml(concept.example || "Open the source evidence for the worked example.")}</p></div>
          ${concept.code ? `<pre><code>${escapeHtml(concept.code)}</code></pre>` : `<div class="no-code">This branch is referenced, so no learned implementation is claimed.</div>`}
        </div>
      </details>

      <details>
        <summary><span>04</span><strong>Branch relationships</strong><i>+</i></summary>
        <div class="accordion-body relation-tree">
          ${renderRelationBranch("Prerequisites", prerequisites)}
          <div class="relation-current"><small>Current leaf</small><strong>${escapeHtml(concept.title)}</strong></div>
          ${renderRelationBranch("Leads to", leadsTo)}
          ${renderRelationBranch("Related", related)}
        </div>
      </details>

      <details>
        <summary><span>05</span><strong>Common confusion & quick revision</strong><i>+</i></summary>
        <div class="accordion-body revision-area">
          <ul class="confusion-list">${(concept.confusions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <div class="revision-grid">${Object.entries(concept.revision || {}).map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
        </div>
      </details>

      <details>
        <summary><span>06</span><strong>Source files & their purpose</strong><i>+</i></summary>
        <div class="accordion-body source-list">${concept.sources.map(renderSource).join("")}</div>
      </details>
    </div>`;
}

function renderVisual(visual) {
  if (!visual) return "";
  if (visual.type === "comparison") {
    return `<div class="visual-comparison">${visual.items.map((item) => `<div><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail || "")}</span></div>`).join("")}</div>`;
  }
  return `<div class="visual-flow">${visual.items.map((item, index) => `${index ? `<span class="flow-connector" aria-hidden="true">→</span>` : ""}<div><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.label)}</strong>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}</div>`).join("")}</div>`;
}

function renderFormula(formula) {
  if (!formula) return "";
  return `<div class="formula-visual">
    <strong>${escapeHtml(formula.expression)}</strong>
    <div>${formula.parts.map((part) => `<span><code>${escapeHtml(part.term)}</code><small>${escapeHtml(part.meaning)}</small></span>`).join("")}</div>
    ${formula.example ? `<p><b>Tiny example</b> ${escapeHtml(formula.example)}</p>` : ""}
  </div>`;
}

function renderRelationBranch(label, concepts) {
  return `<div class="relation-branch"><span>${escapeHtml(label)}</span><div>${concepts.length ? concepts.map((item) => `<button type="button" data-concept-id="${item.id}">${escapeHtml(item.title)}</button>`).join("") : "<small>No mapped leaves</small>"}</div></div>`;
}

function renderSource(source) {
  return `<details class="source-item"><summary><span class="file-icon" aria-hidden="true">${iconFor(source.type)}</span><span><strong>${escapeHtml(source.path)}</strong><small>${escapeHtml(source.role)}</small></span><i>+</i></summary><div><p>${escapeHtml(source.purpose)}</p>${source.highlights?.length ? `<p><b>Important evidence:</b> ${escapeHtml(source.highlights.join(" · "))}</p>` : ""}<a href="${sourceHref(source.path)}" target="_blank" rel="noopener">Open source file →</a></div></details>`;
}

function openDrawer() {
  byId("concept-drawer").classList.add("open");
  byId("concept-drawer").setAttribute("aria-hidden", "false");
  byId("drawer-backdrop").hidden = false;
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  window.LearningLabs?.unmount();
  byId("concept-drawer").classList.remove("open");
  byId("concept-drawer").setAttribute("aria-hidden", "true");
  byId("drawer-backdrop").hidden = true;
  document.body.classList.remove("drawer-open");
}

function renderRecent() {
  const recent = [...state.data.concepts]
    .filter((concept) => concept.status === "learned")
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 5);
  byId("recent-concepts").innerHTML = recent.map((concept, index) => {
    const info = topicInfoFor(concept);
    return `<button class="recent-leaf" type="button" data-concept-id="${concept.id}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHtml(concept.title)}</strong>
      <small>${escapeHtml(info.category.title)} → ${escapeHtml(info.topic.title)}</small>
    </button>`;
  }).join("");
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
  byId("file-count").textContent = `${flattenedFiles().length} repository files`;
  byId("file-index").innerHTML = files.map((file) => `<details class="file-card">
    <summary><span class="file-icon">${iconFor(file.type)}</span><span><strong>${escapeHtml(file.path)}</strong><small>${escapeHtml(file.role)}</small></span><b>${file.concepts.length}</b></summary>
    <div><p>${escapeHtml(file.purpose)}</p><div class="file-concepts">${file.concepts.map(conceptById).filter(Boolean).map((concept) => `<button type="button" data-concept-id="${concept.id}">${statusMeta[concept.status].icon} ${escapeHtml(concept.title)}</button>`).join("")}</div><a href="${sourceHref(file.path)}" target="_blank" rel="noopener">Open file →</a></div>
  </details>`).join("") || `<p>No source files match “${escapeHtml(query)}”.</p>`;
}

function renderSearch(query) {
  const panel = byId("search-results");
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    panel.hidden = true;
    return;
  }
  const concepts = state.data.concepts.filter((concept) => [concept.title, concept.summary, ...(concept.keywords || [])].join(" ").toLowerCase().includes(normalized)).slice(0, 7);
  const files = flattenedFiles().filter((file) => file.path.toLowerCase().includes(normalized)).slice(0, 6);
  panel.innerHTML = `
    ${concepts.length ? `<p>Concept leaves</p>${concepts.map((concept) => `<button type="button" data-concept-id="${concept.id}"><span class="search-status ${concept.status}">${statusMeta[concept.status].icon}</span><span><strong>${escapeHtml(concept.title)}</strong><small>${escapeHtml(topicInfoFor(concept).category.title)}</small></span></button>`).join("")}` : ""}
    ${files.length ? `<p>Source files</p>${files.map((file) => `<button type="button" data-concept-id="${file.concepts[0]}"><span>${iconFor(file.type)}</span><span><strong>${escapeHtml(fileName(file.path))}</strong><small>${escapeHtml(file.path)}</small></span></button>`).join("")}` : ""}
    ${!concepts.length && !files.length ? "<p>No matching branch or file</p>" : ""}`;
  panel.hidden = false;
}

function bindControls() {
  document.addEventListener("click", (event) => {
    const conceptButton = event.target.closest("[data-concept-id]");
    if (conceptButton) {
      selectConcept(conceptButton.dataset.conceptId);
      byId("search-results").hidden = true;
      return;
    }

    const topicButton = event.target.closest("[data-topic-key]");
    if (topicButton) {
      toggleTopic(topicButton.dataset.topicKey, topicButton.dataset.categoryId);
      return;
    }

    const categoryButton = event.target.closest(".category-node[data-category-id]");
    if (categoryButton) {
      toggleCategory(categoryButton.dataset.categoryId);
      return;
    }

    const filter = event.target.closest("[data-status]");
    if (filter) {
      state.status = filter.dataset.status;
      document.querySelectorAll("[data-status]").forEach((button) => {
        const active = button === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      renderTree();
      return;
    }

    if (event.target.closest("[data-root-toggle]")) {
      state.rootOpen = !state.rootOpen;
      renderTree();
    }
  });

  byId("expand-all").addEventListener("click", expandAll);
  byId("collapse-all").addEventListener("click", collapseAll);
  byId("drawer-close").addEventListener("click", closeDrawer);
  byId("drawer-backdrop").addEventListener("click", closeDrawer);
  byId("global-search").addEventListener("input", (event) => renderSearch(event.target.value));
  byId("file-search").addEventListener("input", (event) => renderFileIndex(event.target.value));
  byId("theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "" : "dark";
    localStorage.setItem("learning-tree-theme", dark ? "light" : "dark");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement.tagName !== "INPUT") {
      event.preventDefault();
      byId("global-search").focus();
    }
    if (event.key === "Escape") {
      closeDrawer();
      byId("search-results").hidden = true;
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".global-search")) byId("search-results").hidden = true;
  });

  if (localStorage.getItem("learning-tree-theme") === "dark") document.documentElement.dataset.theme = "dark";
}

try {
  init();
} catch (error) {
  byId("tree-viewport").innerHTML = `<div class="load-error"><strong>The learning tree could not grow.</strong><span>${escapeHtml(error.message)}</span></div>`;
  console.error(error);
}
