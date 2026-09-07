"use strict";

const atlas = window.LEARNING_TREE;
const enrichment = window.KNOWLEDGE_ENRICHMENT || { aliases: {}, branchProfiles: {}, groups: {}, guides: {} };
const canonical = window.LEARNING_MAP || { concepts: [] };

const state = {
  query: "",
  status: "all",
  view: "tree",
  openBranches: new Set(["python", "preparation", "regression", "classification"]),
  activeBranch: "python",
  selectedId: null,
  drawerTab: "overview",
  sourceQuery: "",
  sourceType: "all",
  sourceLimit: 18,
};

const statusMeta = {
  learned: { label: "Learned in active work", short: "Active evidence", color: "var(--acid-2)" },
  growing: { label: "Currently learning", short: "Growing now", color: "var(--amber)" },
  prior: { label: "Prior learning evidence", short: "Prior foundation", color: "var(--violet)" },
};

const byId = (id) => document.getElementById(id);
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  "\"": "&quot;",
}[character]));

const allTopics = () => atlas.branches.flatMap((branch) => branch.topics);
const topicById = (id) => allTopics().find((topic) => topic.id === id);
const branchById = (id) => atlas.branches.find((branch) => branch.id === id);
const branchFor = (topic) => atlas.branches.find((branch) => branch.topics.includes(topic));
const canonicalById = (id) => canonical.concepts.find((concept) => concept.id === id);

function fileMeta(path) {
  const extension = path.split(".").pop().toLowerCase();
  const table = {
    ipynb: { icon: "NB", label: "Notebook", group: "ipynb" },
    md: { icon: "MD", label: "Markdown", group: "md" },
    py: { icon: "PY", label: "Python", group: "py" },
    csv: { icon: "CSV", label: "Dataset", group: "data" },
    html: { icon: "WEB", label: "HTML visual", group: "html" },
    js: { icon: "JS", label: "JavaScript", group: "html" },
    css: { icon: "CSS", label: "Stylesheet", group: "html" },
    png: { icon: "IMG", label: "Image", group: "image" },
    jpg: { icon: "IMG", label: "Image", group: "image" },
    jpeg: { icon: "IMG", label: "Image", group: "image" },
    svg: { icon: "SVG", label: "Diagram", group: "image" },
    tree: { icon: "TREE", label: "Tree export", group: "data" },
    txt: { icon: "TXT", label: "Text", group: "data" },
  };
  return table[extension] || { icon: "FILE", label: "Source", group: extension };
}

function sourceHref(path) {
  return `../${path.split("/").map(encodeURIComponent).join("/")}`;
}

function uniqueSources() {
  const sources = new Map();
  allTopics().forEach((topic) => {
    topic.files.forEach((file) => {
      const record = sources.get(file.path) || { path: file.path, purposes: new Set(), topics: [] };
      record.purposes.add(file.purpose);
      if (!record.topics.some((item) => item.id === topic.id)) record.topics.push(topic);
      sources.set(file.path, record);
    });
  });
  return [...sources.values()].map((record) => ({ ...record, purposes: [...record.purposes] }));
}

function canonicalFor(topic) {
  const id = enrichment.aliases[topic.id];
  return id ? canonicalById(id) : null;
}

function detailFor(topic) {
  const rich = canonicalFor(topic);
  const custom = enrichment.guides[topic.id] || {};
  const profile = enrichment.branchProfiles[branchFor(topic).id] || {};
  const richFormula = rich?.formula ? {
    expression: rich.formula.expression,
    parts: rich.formula.parts || [],
    example: rich.formula.example,
  } : null;
  const customFormula = custom.formula ? {
    expression: custom.formula,
    parts: custom.parts || [],
    example: custom.example,
  } : null;

  return {
    why: custom.why || rich?.why || `${topic.title} matters because it supports the ${profile.label?.toLowerCase() || "learning path"} represented by this repository branch.`,
    intuition: custom.intuition || rich?.intuition || `Think of this topic as one stage in the branch's ${profile.route?.join(" → ") || "learn → apply → verify"} flow.`,
    steps: custom.steps || rich?.how || topic.learned,
    formula: customFormula || richFormula,
    example: custom.example || rich?.example || null,
    code: custom.code || rich?.code || null,
    confusions: custom.confusions || rich?.confusions || [
      "A repository example demonstrates a learning idea; it is not automatically production-ready.",
      "The topic status describes evidence in this repository, not universal mastery.",
    ],
    remember: custom.remember || rich?.revision?.remember || topic.learned.at(-1),
    canonical: rich,
  };
}

function topicMatches(topic) {
  if (state.status !== "all" && topic.status !== state.status) return false;
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  const details = detailFor(topic);
  const searchable = [
    topic.title,
    topic.summary,
    ...topic.learned,
    details.why,
    details.intuition,
    details.formula?.expression,
    details.code,
    ...topic.files.flatMap((file) => [file.path, file.purpose]),
  ].filter(Boolean).join(" ").toLowerCase();
  return searchable.includes(query);
}

function visibleTopics(branch) {
  return branch.topics.filter(topicMatches);
}

function groupsFor(branch) {
  const visible = new Set(visibleTopics(branch).map((topic) => topic.id));
  const configured = enrichment.groups[branch.id] || [];
  const groups = configured.map((group) => ({
    title: group.title,
    topics: group.ids.map(topicById).filter((topic) => topic && visible.has(topic.id)),
  })).filter((group) => group.topics.length);
  const assigned = new Set(groups.flatMap((group) => group.topics.map((topic) => topic.id)));
  const remainder = visibleTopics(branch).filter((topic) => !assigned.has(topic.id));
  if (remainder.length) groups.push({ title: "More topics", topics: remainder });
  return groups;
}

function renderOrbit() {
  byId("hero-topic-count").textContent = allTopics().length;
  byId("hero-source-count").textContent = uniqueSources().length;
  byId("orbit-nodes").innerHTML = atlas.branches.map((branch, index) => {
    const profile = enrichment.branchProfiles[branch.id] || {};
    return `<button class="orbit-node" type="button" data-orbit-branch="${branch.id}" title="${escapeHtml(branch.title)}" style="--angle:${index * (360 / atlas.branches.length)}deg;--node-color:${branch.color}">${escapeHtml(profile.icon || String(index + 1).padStart(2, "0"))}</button>`;
  }).join("");
  document.querySelectorAll("[data-orbit-branch]").forEach((button) => {
    button.addEventListener("click", () => activateBranch(button.dataset.orbitBranch));
  });
}

function renderStats() {
  const topics = allTopics();
  const counts = {
    learned: topics.filter((topic) => topic.status === "learned").length,
    growing: topics.filter((topic) => topic.status === "growing").length,
    prior: topics.filter((topic) => topic.status === "prior").length,
  };
  const items = [
    { value: topics.length, label: "Mapped concepts", code: "MAP", color: "var(--acid)" },
    { value: counts.learned, label: "Active learned concepts", code: "NOW", color: "var(--acid-2)" },
    { value: counts.growing, label: "Open learning threads", code: "WIP", color: "var(--amber)" },
    { value: uniqueSources().length, label: "Unique evidence links", code: "SRC", color: "var(--violet)" },
  ];
  byId("stats").innerHTML = items.map((item) => `<article class="metric" style="--metric-color:${item.color}"><div class="metric-top"><span>${item.code}</span><i>↗</i></div><strong>${item.value}</strong><small>${item.label}</small></article>`).join("");
}

function renderComposition() {
  byId("composition").innerHTML = atlas.branches.map((branch) => {
    const total = branch.topics.length;
    const learned = branch.topics.filter((topic) => topic.status === "learned").length;
    const growing = branch.topics.filter((topic) => topic.status === "growing").length;
    const prior = branch.topics.filter((topic) => topic.status === "prior").length;
    return `<div class="composition-row"><span title="${escapeHtml(branch.title)}">${escapeHtml(branch.title)}</span><div class="composition-bar" aria-label="${learned} learned, ${growing} growing, ${prior} prior"><i class="learned" style="width:${learned / total * 100}%"></i><i class="growing" style="width:${growing / total * 100}%"></i><i class="prior" style="width:${prior / total * 100}%"></i></div><small>${total} topics</small></div>`;
  }).join("");
}

function renderCurrent() {
  const preferred = ["svc-kernels", "svc-linear", "feature-engineering", "class-imbalance", "imputation", "random-forest-regression", "polynomial-regression", "numpy-api-project", "streamlit-sales", "streamlit-model"];
  const growing = preferred.map(topicById).filter(Boolean).filter((topic) => topic.status === "growing");
  byId("current-track").innerHTML = growing.map((topic, index) => {
    const branch = branchFor(topic);
    const profile = enrichment.branchProfiles[branch.id] || {};
    return `<button class="current-card" type="button" data-current-id="${topic.id}" style="--card-color:${branch.color}"><div class="current-card-top"><span>${escapeHtml(profile.label || branch.title)}</span><span class="current-card-index">${String(index + 1).padStart(2, "0")}</span></div><h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.summary)}</p><footer><span>${topic.files.length} evidence file${topic.files.length === 1 ? "" : "s"}</span><b>Continue →</b></footer></button>`;
  }).join("");
  document.querySelectorAll("[data-current-id]").forEach((button) => button.addEventListener("click", () => selectTopic(button.dataset.currentId)));
}

function renderBranchNav() {
  byId("branch-nav").innerHTML = atlas.branches.map((branch) => {
    const profile = enrichment.branchProfiles[branch.id] || {};
    const growing = branch.topics.filter((topic) => topic.status === "growing").length;
    return `<button type="button" data-nav-branch="${branch.id}" class="${state.activeBranch === branch.id ? "active" : ""}" style="--domain-color:${branch.color}"><span class="branch-nav-icon">${escapeHtml(profile.icon || "•")}</span><span class="branch-nav-copy"><strong>${escapeHtml(branch.title)}</strong><small>${escapeHtml(profile.label || branch.summary)}</small></span><span class="branch-nav-count">${branch.topics.length}${growing ? ` · ${growing}↑` : ""}</span></button>`;
  }).join("");
  document.querySelectorAll("[data-nav-branch]").forEach((button) => button.addEventListener("click", () => activateBranch(button.dataset.navBranch)));
}

function conceptMarkup(topic, branch) {
  return `<button class="concept-button ${topic.status}${state.selectedId === topic.id ? " selected" : ""}" type="button" data-topic-id="${topic.id}" role="treeitem" aria-current="${state.selectedId === topic.id ? "true" : "false"}" style="--domain-color:${branch.color}"><i class="concept-state" aria-hidden="true"></i><span class="concept-copy"><strong>${escapeHtml(topic.title)}</strong><small>${escapeHtml(topic.summary)}</small></span><span class="concept-evidence">${topic.files.length} src</span></button>`;
}

function renderTree() {
  const shownBranches = atlas.branches.filter((branch) => visibleTopics(branch).length);
  const shownTopics = shownBranches.reduce((total, branch) => total + visibleTopics(branch).length, 0);
  const searching = Boolean(state.query.trim());
  const allOpen = shownBranches.length > 0 && shownBranches.every((branch) => state.openBranches.has(branch.id));
  const branches = shownBranches.map((branch, branchIndex) => {
    const open = searching || state.openBranches.has(branch.id);
    const topics = visibleTopics(branch);
    const activeCount = branch.topics.filter((topic) => topic.status !== "prior").length;
    const activePercent = Math.round(activeCount / branch.topics.length * 100);
    const groups = groupsFor(branch).map((group) => `<section class="cluster"><header class="cluster-header"><strong>${escapeHtml(group.title)}</strong><span>${group.topics.length} concept${group.topics.length === 1 ? "" : "s"}</span></header><div class="concept-list" role="group">${group.topics.map((topic) => conceptMarkup(topic, branch)).join("")}</div></section>`).join("");
    return `<section id="branch-${branch.id}" class="domain-branch${open ? " open" : ""}" style="--domain-color:${branch.color}" role="group"><button class="domain-button" type="button" data-branch-id="${branch.id}" role="treeitem" aria-expanded="${open}"><span class="domain-index">${String(atlas.branches.indexOf(branch) + 1).padStart(2, "0")}</span><span class="domain-copy"><strong>${escapeHtml(branch.title)}</strong><small>${escapeHtml(branch.summary)}</small></span><span class="domain-progress"><span class="domain-progress-bar"><i style="width:${activePercent}%"></i></span><small>${activeCount} active · ${branch.topics.length - activeCount} prior</small></span><span class="node-toggle">${open ? "−" : "+"}</span></button>${open ? `<div class="cluster-list">${groups}</div>` : ""}</section>`;
  }).join("");

  byId("result-summary").textContent = state.query || state.status !== "all"
    ? `${shownTopics} matches across ${shownBranches.length} domains`
    : `${allTopics().length} mapped concepts · select a leaf to study`;

  const tree = byId("tree");
  tree.className = `knowledge-tree ${state.view === "grid" ? "grid-view" : "tree-view"}`;
  tree.innerHTML = shownBranches.length ? `<button class="tree-root" type="button" data-root-toggle role="treeitem" aria-expanded="${allOpen}"><span class="tree-root-symbol">ROOT</span><span><strong>My AI/ML Learning System</strong><small>${shownTopics} evidence-backed concepts currently visible</small></span><span class="tree-root-action">${allOpen ? "Fold" : "Expand"}</span></button><div class="tree-trunk" aria-hidden="true"></div><div class="domain-tree" role="group">${branches}</div>` : `<div class="empty-state"><strong>No concept matches this view.</strong><p>Try “regression”, “SVC”, “missing values”, a formula, or a source filename.</p></div>`;
  bindTree();
  renderBranchNav();
}

function activateBranch(id) {
  const branch = branchById(id);
  if (!branch) return;
  state.activeBranch = id;
  state.openBranches.add(id);
  renderTree();
  requestAnimationFrame(() => byId(`branch-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function bindTree() {
  document.querySelectorAll("[data-branch-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.branchId;
      state.activeBranch = id;
      state.openBranches.has(id) ? state.openBranches.delete(id) : state.openBranches.add(id);
      renderTree();
    });
  });
  document.querySelectorAll("[data-topic-id]").forEach((button) => button.addEventListener("click", () => selectTopic(button.dataset.topicId)));
  document.querySelector("[data-root-toggle]")?.addEventListener("click", () => {
    const visible = atlas.branches.filter((branch) => visibleTopics(branch).length);
    const expanded = visible.every((branch) => state.openBranches.has(branch.id));
    if (expanded) visible.forEach((branch) => state.openBranches.delete(branch.id));
    else visible.forEach((branch) => state.openBranches.add(branch.id));
    renderTree();
  });
}

function findOurTopicForCanonical(canonicalId) {
  const direct = allTopics().find((topic) => enrichment.aliases[topic.id] === canonicalId);
  return direct || topicById(canonicalId);
}

function connectedTopics(topic) {
  const rich = canonicalFor(topic);
  const ids = new Set(topic.related || []);
  allTopics().forEach((candidate) => {
    if ((candidate.related || []).includes(topic.id)) ids.add(candidate.id);
  });
  [...(rich?.prerequisites || []), ...(rich?.related || [])].forEach((id) => {
    const mapped = findOurTopicForCanonical(id);
    if (mapped) ids.add(mapped.id);
  });
  ids.delete(topic.id);
  return [...ids].map(topicById).filter(Boolean).slice(0, 10);
}

function enrichedSourcePurpose(topic, file) {
  const rich = canonicalFor(topic);
  const match = rich?.sources?.find((source) => file.path.endsWith(source.path));
  if (!match) return file.purpose;
  const highlights = match.highlights?.length ? ` Highlights: ${match.highlights.join(" · ")}.` : "";
  return `${match.purpose || file.purpose}${highlights}`;
}

function evidenceSummary(topic) {
  const counts = { notebooks: 0, notes: 0, code: 0, other: 0 };
  topic.files.forEach((file) => {
    const group = fileMeta(file.path).group;
    if (group === "ipynb") counts.notebooks += 1;
    else if (group === "md") counts.notes += 1;
    else if (["py", "html"].includes(group)) counts.code += 1;
    else counts.other += 1;
  });
  return counts;
}

function formulaMarkup(formula, example) {
  if (!formula?.expression) return "";
  const parts = (formula.parts || []).map((part) => `<div class="formula-part"><b>${escapeHtml(part.term)}</b><span>${escapeHtml(part.meaning)}</span></div>`).join("");
  return `<div class="formula-box"><div class="formula-expression">${escapeHtml(formula.expression)}</div>${parts ? `<div class="formula-parts">${parts}</div>` : ""}${formula.example || example ? `<div class="example-box"><strong>Worked intuition:</strong> ${escapeHtml(formula.example || example)}</div>` : ""}</div>`;
}

function codeMarkup(code) {
  if (!code) return "";
  return `<div class="code-shell"><div class="code-top"><span>CORE LEARNING PATTERN</span><button type="button" data-copy-code>Copy code</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function evidenceMarkup(topic) {
  const counts = evidenceSummary(topic);
  const files = topic.files.map((file) => {
    const meta = fileMeta(file.path);
    return `<a class="evidence-file" href="${sourceHref(file.path)}" target="_blank" rel="noreferrer"><span class="evidence-file-icon">${meta.icon}</span><span><strong>${escapeHtml(file.path)}</strong><small>${escapeHtml(meta.label)} · ${escapeHtml(enrichedSourcePurpose(topic, file))}</small></span><span>Open ↗</span></a>`;
  }).join("");
  return `<div class="evidence-summary"><article><strong>${topic.files.length}</strong><span>Total sources</span></article><article><strong>${counts.notebooks}</strong><span>Notebooks</span></article><article><strong>${counts.notes}</strong><span>Notes</span></article><article><strong>${counts.code + counts.other}</strong><span>Code / other</span></article></div><div class="evidence-list">${files}</div>`;
}

function connectionsMarkup(topic) {
  const connected = connectedTopics(topic);
  const branch = branchFor(topic);
  const left = connected.slice(0, Math.ceil(connected.length / 2));
  const right = connected.slice(Math.ceil(connected.length / 2));
  const buttons = (items) => items.length ? items.map((item) => `<button type="button" data-related-id="${item.id}">${escapeHtml(item.title)} <span>→</span></button>`).join("") : `<div class="empty-connections">No explicit relationship recorded.</div>`;
  return `<div class="connection-map"><div class="connection-column">${buttons(left)}</div><div class="connection-center">${escapeHtml(topic.title)}</div><div class="connection-column">${buttons(right)}</div></div><div class="lesson-card wide" style="margin-top:12px"><div class="lesson-kicker">DOMAIN ROUTE</div><h3>${escapeHtml(branch.title)}</h3><p>${escapeHtml((enrichment.branchProfiles[branch.id]?.route || []).join(" → "))}</p></div>`;
}

function paginationMarkup(topic) {
  const branch = branchFor(topic);
  const index = branch.topics.indexOf(topic);
  const previous = branch.topics[index - 1];
  const next = branch.topics[index + 1];
  return `<div class="lesson-pagination">${previous ? `<button type="button" data-page-topic="${previous.id}">← ${escapeHtml(previous.title)}</button>` : "<span></span>"}${next ? `<button type="button" data-page-topic="${next.id}">${escapeHtml(next.title)} →</button>` : "<span></span>"}</div>`;
}

function renderDrawer(topic) {
  const branch = branchFor(topic);
  const profile = enrichment.branchProfiles[branch.id] || {};
  const detail = detailFor(topic);
  const connections = connectedTopics(topic);
  byId("drawer-location").innerHTML = `<span>Atlas</span><span>${escapeHtml(branch.title)}</span><span>${escapeHtml(topic.title)}</span>`;

  const steps = detail.steps.map((step, index) => `<div class="mechanic-step"><b>STEP ${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(step)}</span></div>`).join("");
  const learnings = topic.learned.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  const confusions = detail.confusions.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  const visual = detail.canonical?.visual;
  const visualTitle = visual?.title || `${profile.route?.join(" → ") || "Learn → apply → verify"}`;

  byId("drawer-content").innerHTML = `
    <section class="lesson-hero" style="--lesson-color:${branch.color}">
      <span class="lesson-status"><i class="status-dot ${topic.status}"></i>${statusMeta[topic.status].label}</span>
      <h2 id="drawer-title">${escapeHtml(topic.title)}</h2>
      <p>${escapeHtml(topic.summary)}</p>
      <div class="lesson-meta"><span>${escapeHtml(branch.title)}</span><span>${topic.files.length} evidence file${topic.files.length === 1 ? "" : "s"}</span><span>${connections.length} connected concept${connections.length === 1 ? "" : "s"}</span><span>Updated ${atlas.meta.lastUpdated}</span></div>
    </section>
    <nav class="lesson-tabs" aria-label="Topic detail sections" style="--lesson-color:${branch.color}">
      <button class="${state.drawerTab === "overview" ? "active" : ""}" type="button" data-drawer-tab="overview">Overview</button>
      <button class="${state.drawerTab === "mechanics" ? "active" : ""}" type="button" data-drawer-tab="mechanics">How it works</button>
      <button class="${state.drawerTab === "evidence" ? "active" : ""}" type="button" data-drawer-tab="evidence">Evidence (${topic.files.length})</button>
      <button class="${state.drawerTab === "connections" ? "active" : ""}" type="button" data-drawer-tab="connections">Connections</button>
    </nav>
    <div class="lesson-body" style="--lesson-color:${branch.color}">
      <section class="lesson-panel" data-panel="overview" ${state.drawerTab === "overview" ? "" : "hidden"}>
        <div class="lesson-grid">
          <article class="lesson-card"><div class="lesson-kicker">WHY IT MATTERS</div><h3>The problem it solves</h3><p>${escapeHtml(detail.why)}</p></article>
          <article class="lesson-card"><div class="lesson-kicker">MENTAL MODEL</div><h3>Simple intuition</h3><p>${escapeHtml(detail.intuition)}</p></article>
          <article class="lesson-card wide"><div class="lesson-kicker">REPOSITORY KNOWLEDGE</div><h3>What your files demonstrate</h3><ul class="check-list">${learnings}</ul></article>
          ${detail.example && !detail.formula ? `<article class="lesson-card wide"><div class="lesson-kicker">CONCRETE EXAMPLE</div><h3>Put it into a situation</h3><p>${escapeHtml(detail.example)}</p></article>` : ""}
          <article class="lesson-card wide"><div class="remember-card"><i>30s</i><span><strong>Quick revision:</strong> ${escapeHtml(detail.remember)}</span></div></article>
        </div>
        ${paginationMarkup(topic)}
      </section>

      <section class="lesson-panel" data-panel="mechanics" ${state.drawerTab === "mechanics" ? "" : "hidden"}>
        <div class="lesson-grid">
          <article class="lesson-card wide"><div class="lesson-kicker">VISUAL PROCESS</div><h3>${escapeHtml(visualTitle)}</h3><div class="mechanic-flow">${steps}</div></article>
          ${detail.formula ? `<article class="lesson-card wide"><div class="lesson-kicker">FORMULA, UNPACKED</div><h3>Read every symbol</h3>${formulaMarkup(detail.formula, detail.example)}</article>` : ""}
          ${detail.code ? `<article class="lesson-card wide"><div class="lesson-kicker">CODE PATTERN</div><h3>The important lines only</h3>${codeMarkup(detail.code)}</article>` : ""}
          <article class="lesson-card wide"><div class="lesson-kicker">COMMON CONFUSIONS</div><h3>What to avoid</h3><ul class="confusion-list">${confusions}</ul></article>
        </div>
      </section>

      <section class="lesson-panel" data-panel="evidence" ${state.drawerTab === "evidence" ? "" : "hidden"}>
        ${evidenceMarkup(topic)}
      </section>

      <section class="lesson-panel" data-panel="connections" ${state.drawerTab === "connections" ? "" : "hidden"}>
        ${connectionsMarkup(topic)}
      </section>
    </div>`;

  bindDrawerContent(topic);
}

function bindDrawerContent(topic) {
  document.querySelectorAll("[data-drawer-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.drawerTab = button.dataset.drawerTab;
      document.querySelectorAll("[data-drawer-tab]").forEach((candidate) => candidate.classList.toggle("active", candidate === button));
      document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== state.drawerTab; });
    });
  });
  document.querySelectorAll("[data-related-id], [data-page-topic]").forEach((button) => {
    button.addEventListener("click", () => selectTopic(button.dataset.relatedId || button.dataset.pageTopic));
  });
  document.querySelector("[data-copy-code]")?.addEventListener("click", (event) => {
    const code = event.currentTarget.closest(".code-shell")?.querySelector("code")?.textContent || "";
    copyText(code, "Code copied");
  });
}

function openDrawer() {
  byId("drawer-backdrop").hidden = false;
  byId("topic-drawer").classList.add("open");
  byId("topic-drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  byId("drawer-close").focus({ preventScroll: true });
}

function closeDrawer(clearHash = true) {
  byId("topic-drawer").classList.remove("open");
  byId("topic-drawer").setAttribute("aria-hidden", "true");
  byId("drawer-backdrop").hidden = true;
  document.body.classList.remove("drawer-open");
  const selected = state.selectedId;
  state.selectedId = null;
  if (clearHash && location.hash.startsWith("#topic=")) history.replaceState(null, "", location.pathname + location.search);
  renderTree();
  if (selected) document.querySelector(`[data-topic-id="${selected}"]`)?.focus({ preventScroll: true });
}

function selectTopic(id, updateHash = true) {
  const topic = topicById(id);
  if (!topic) return;
  const branch = branchFor(topic);
  state.selectedId = id;
  state.drawerTab = "overview";
  state.activeBranch = branch.id;
  state.openBranches.add(branch.id);
  renderTree();
  renderDrawer(topic);
  openDrawer();
  if (updateHash) history.replaceState(null, "", `#topic=${encodeURIComponent(id)}`);
}

function sourceRecordsMatching() {
  const query = state.sourceQuery.trim().toLowerCase();
  return uniqueSources().filter((record) => {
    const meta = fileMeta(record.path);
    const typeMatch = state.sourceType === "all" || meta.group === state.sourceType;
    const textMatch = !query || [record.path, ...record.purposes, ...record.topics.map((topic) => topic.title)].join(" ").toLowerCase().includes(query);
    return typeMatch && textMatch;
  });
}

function renderSources() {
  const matching = sourceRecordsMatching();
  const shown = matching.slice(0, state.sourceLimit);
  byId("source-result-count").textContent = `${matching.length} matching files`;
  byId("source-list").innerHTML = shown.length ? shown.map((record) => {
    const meta = fileMeta(record.path);
    const name = record.path.split("/").pop();
    const purpose = record.purposes.join(" · ");
    return `<article class="source-item"><div class="source-item-top"><span class="source-icon">${meta.icon}</span><span class="source-type">${meta.label}</span></div><h3 title="${escapeHtml(record.path)}">${escapeHtml(name)}</h3><p>${escapeHtml(purpose)}</p><footer><div class="source-tags">${record.topics.slice(0, 2).map((topic) => `<span title="${escapeHtml(topic.title)}">${escapeHtml(topic.title)}</span>`).join("")}</div><a href="${sourceHref(record.path)}" target="_blank" rel="noreferrer">Open ↗</a></footer></article>`;
  }).join("") : `<div class="empty-state"><strong>No evidence file matches.</strong><p>Change the file type or search text.</p></div>`;
  const showMore = byId("show-more-sources");
  showMore.hidden = matching.length <= state.sourceLimit;
  if (!showMore.hidden) showMore.textContent = `Show ${Math.min(18, matching.length - state.sourceLimit)} more of ${matching.length}`;
}

function copyText(value, message) {
  const fallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value).catch(fallback);
  else fallback();
  showToast(message);
}

let toastTimer;
function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function bindPage() {
  byId("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderTree();
    if (state.query) byId("atlas").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelectorAll("[data-status]").forEach((button) => button.addEventListener("click", () => {
    state.status = button.dataset.status;
    document.querySelectorAll("[data-status]").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    renderTree();
  }));
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    if (state.view === "grid") atlas.branches.forEach((branch) => state.openBranches.add(branch.id));
    document.querySelectorAll("[data-view]").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    renderTree();
  }));
  byId("expand-all").addEventListener("click", () => { atlas.branches.forEach((branch) => state.openBranches.add(branch.id)); renderTree(); });
  byId("collapse-all").addEventListener("click", () => { state.openBranches.clear(); renderTree(); });
  byId("random-topic").addEventListener("click", () => {
    const topics = allTopics().filter((topic) => topic.status !== "growing");
    selectTopic(topics[Math.floor(Math.random() * topics.length)].id);
  });
  byId("source-search").addEventListener("input", (event) => { state.sourceQuery = event.target.value; state.sourceLimit = 18; renderSources(); });
  byId("source-type").addEventListener("change", (event) => { state.sourceType = event.target.value; state.sourceLimit = 18; renderSources(); });
  byId("show-more-sources").addEventListener("click", () => { state.sourceLimit += 18; renderSources(); });
  byId("drawer-close").addEventListener("click", () => closeDrawer());
  byId("drawer-backdrop").addEventListener("click", () => closeDrawer());
  byId("copy-topic-link").addEventListener("click", () => copyText(location.href, "Topic link copied"));
  byId("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("learning-atlas-theme", next || "dark"); } catch (_) { /* local storage can be unavailable */ }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && byId("topic-drawer").classList.contains("open")) closeDrawer();
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      byId("search").focus();
    }
  });
}

function initialize() {
  if (!atlas?.branches?.length) throw new Error("learning-data.js did not load");
  try { document.documentElement.dataset.theme = localStorage.getItem("learning-atlas-theme") === "light" ? "light" : ""; } catch (_) { /* use dark default */ }
  byId("source-search").placeholder = `Filter ${uniqueSources().length} evidence files…`;
  renderOrbit();
  renderStats();
  renderComposition();
  renderCurrent();
  renderTree();
  renderSources();
  bindPage();
  const hashId = location.hash.startsWith("#topic=") ? decodeURIComponent(location.hash.slice(7)) : null;
  if (hashId && topicById(hashId)) selectTopic(hashId, false);
}

initialize();
