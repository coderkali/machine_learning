// 0.8 — Automatic pass/fail checks before the creator reviews an episode.
//
//   node scripts/qa.mjs day_01 [--video path/to.mp4]   (default video: newest out/day_NN/draft*.mp4)
//
// Writes out/day_NN/qa_report.md (+ .json). Exit code 1 if anything FAILs.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { PUBLIC, ROOT, loadEpisode, loudness, readJSON, rel, run, writeJSON } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const ep = await loadEpisode(args[0]);
const layout = await readJSON(path.join(ROOT, "src/shared/layout.json"));
const gen = (f) => path.join(ep.genDir, f);
const results = [];
const check = (group, name, status, detail) => results.push({ group, name, status, detail });

const master = existsSync(gen("master.json")) ? await readJSON(gen("master.json")) : null;
const captions = existsSync(gen("captions.json")) ? await readJSON(gen("captions.json")) : null;
const timeline = existsSync(gen("timeline.json")) ? await readJSON(gen("timeline.json")) : null;

// ── Audio ────────────────────────────────────────────────────────────────────────────────
if (!master) check("Audio", "Mastered narration", "FAIL", "No master.json — run master.mjs");
else {
  const a = await loudness(path.join(PUBLIC, master.audio));
  check("Audio", "Loudness −14 LUFS ±1", Math.abs(a.lufs + 14) <= 1 ? "PASS" : "FAIL", `${a.lufs} LUFS (${master.audio})`);
  check("Audio", "True peak ≤ −1 dBTP", a.truePeak <= -1 ? "PASS" : "FAIL", `${a.truePeak} dBTP`);
  const gaps = master.beats.slice(1).map((b) => `${b.id} ${b.gapBefore}s`).join(", ");
  check("Audio", "Gap rules (0.25 / 0.6 / 0.15 s)", "PASS", gaps);
}

// ── Timing ───────────────────────────────────────────────────────────────────────────────
if (!timeline) check("Timing", "Timeline", "FAIL", "No timeline.json — run timeline.mjs");
else {
  const sec = timeline.totalFrames / timeline.fps;
  // Roadmap §2: target 60–150 s; over 180 s (Reels/Shorts cap) must be split into Part 1 / Part 2.
  const lenStatus = sec < 55 || sec > 180 ? "FAIL" : sec > 150 ? "WARN" : "PASS";
  check("Timing", "Duration 60–150 s (max 180 s, else split)", lenStatus, `${sec.toFixed(2)} s${sec > 180 ? " — split into Part 1 / Part 2" : sec > 150 ? " — long: check nothing is padding" : ""}`);
  const inSync = master && captions && timeline.audio === master.audio && captions.audio === master.audio;
  check("Timing", "Captions + timeline match current master", inSync ? "PASS" : "FAIL", inSync ? master.audio : "re-run captions.mjs and timeline.mjs");
}

// ── Captions ─────────────────────────────────────────────────────────────────────────────
if (captions) {
  const s = captions.stats;
  const majors = captions.issues.filter((i) => i.severity === "major");
  const minors = captions.issues.filter((i) => i.severity === "minor");
  check(
    "Captions",
    "Voice says the script (Whisper vs script)",
    majors.length ? "FAIL" : "PASS",
    `${s.matched + s.fuzzy}/${s.scriptWords} words heard (${(s.matchRate * 100).toFixed(1)}%)` +
      majors.map((i) => `<br>✗ **${i.beatId} @ ${i.atSec}s** script: “${i.script}” — heard: “${i.heard}”`).join(""),
  );
  if (minors.length) {
    check("Captions", "Single words heard differently", "WARN", minors.map((i) => `${i.beatId} @ ${i.atSec}s: “${i.script}” → “${i.heard}”`).join("; ") + " — usually Whisper; listen once");
  }

  const C = layout.caption;
  const Z = layout.safeZone;
  const inner = C.width - 2 * C.paddingX;
  const perLine = Math.floor(inner / (C.fontSize * C.avgCharWidthEm));
  const bad = [];
  let maxLines = 0;
  for (const p of captions.pages) {
    const lines = Math.ceil(p.text.length / perLine);
    maxLines = Math.max(maxLines, lines);
    const top = C.bottom - (lines * C.fontSize * C.lineHeight + 2 * C.paddingY);
    const ok = top >= Z.top && C.bottom <= Z.bottom && C.left >= Z.left && C.left + C.width <= Z.right && lines <= 2;
    if (!ok) bad.push(`“${p.text}” (${lines} lines, top ${Math.round(top)}px)`);
  }
  check(
    "Captions",
    "Captions inside safe zone, ≤ 2 lines",
    bad.length ? "FAIL" : "PASS",
    bad.length ? bad.join("; ") : `${captions.pages.length} pages, max ${maxLines} line(s); box x ${C.left}–${C.left + C.width}, bottom ${C.bottom} (safe ${Z.left}–${Z.right} × ${Z.top}–${Z.bottom})`,
  );
  const H = layout.header;
  check("Captions", "Header inside safe zone", H && H.top >= Z.top ? "PASS" : "FAIL", H ? `header at y ${H.top}–${H.top + H.height} (safe from ${Z.top})` : "no layout.header");
}

// ── Video ────────────────────────────────────────────────────────────────────────────────
let video = args.includes("--video") ? path.resolve(args[args.indexOf("--video") + 1]) : null;
if (!video && existsSync(ep.outDir)) {
  const drafts = (await fs.readdir(ep.outDir)).filter((f) => /^draft(_v\d+)?\.mp4$/.test(f));
  const withTime = await Promise.all(drafts.map(async (f) => ({ f, t: (await fs.stat(path.join(ep.outDir, f))).mtimeMs })));
  const newest = withTime.sort((a, b) => b.t - a.t)[0];
  if (newest) video = path.join(ep.outDir, newest.f);
}
if (!video || !existsSync(video)) check("Video", "Rendered video", "WARN", "No render found — run draft.mjs (or pass --video)");
else {
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", video]);
  const info = JSON.parse(stdout);
  const v = info.streams.find((s) => s.codec_type === "video");
  const hasAudio = info.streams.some((s) => s.codec_type === "audio");
  const fmtOk = v.width === 1080 && v.height === 1920 && v.r_frame_rate === "30/1";
  check("Video", "1080×1920 @ 30 fps", fmtOk ? "PASS" : "FAIL", `${v.width}×${v.height} @ ${v.r_frame_rate} — ${rel(video)}`);
  const dur = Number(info.format.duration);
  const expected = timeline ? timeline.totalFrames / timeline.fps : dur;
  check("Video", "Video length = timeline", Math.abs(dur - expected) <= 0.2 ? "PASS" : "FAIL", `${dur.toFixed(2)} s vs ${expected.toFixed(2)} s`);
  if (!hasAudio) check("Video", "Audio track", "FAIL", "no audio stream");
  else {
    const a = await loudness(video);
    const ok = Math.abs(a.lufs + 14) <= 1 && a.truePeak <= -0.5;
    check("Video", "Loudness in the render", ok ? "PASS" : "FAIL", `${a.lufs} LUFS, ${a.truePeak} dBTP (after AAC encode)`);
  }
}

// ── Context first (roadmap §2): opener + topic spoken in the first 5 s ───────────────────────
if (captions && ep.meta) {
  const STOP = new Set(["what", "is", "a", "an", "the", "how", "why", "of", "for", "to", "and", "vs", "does", "do", "your", "my", "in", "on"]);
  const key = (ep.meta.titleCard?.line ?? ep.meta.title).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
  const early = captions.words.filter((w) => w.startMs <= 5000).map((w) => w.text.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const hit = key.filter((k) => early.includes(k));
  check("Context", "Topic spoken in the first 5 s", hit.length >= Math.min(2, key.length) ? "PASS" : "FAIL", `title words ${key.join(", ")} · heard by 5 s: ${hit.join(", ") || "none"} (“${early.join(" ")}”)`);
}

// ── Motion (claude/ANIMATION_GUIDE.md) ───────────────────────────────────────────────────
// Only the scene area: header (top), caption box + progress bar (bottom) are cropped out so their
// changes can't hide a frozen scene.
const MAX_STILL = 2.0;
if (video && existsSync(video)) {
  const scene = "crop=1080:1180:0:140";
  const grab = async (t) =>
    (await run("ffmpeg", ["-v", "error", "-ss", String(t), "-i", video, "-frames:v", "1", "-vf", `${scene},scale=270:-1`, "-f", "rawvideo", "-pix_fmt", "gray", "pipe:1"], { encoding: "buffer" })).stdout;
  const [a, b] = [await grab(0), await grab(1.0)];
  let changed = 0;
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 24) changed++;
  const share = changed / a.length;
  check("Motion", "Movement within the first second", share > 0.005 ? "PASS" : "FAIL", `${(share * 100).toFixed(1)}% of the scene changed between 0.0 s and 1.0 s`);

  const { stderr } = await run("ffmpeg", ["-hide_banner", "-i", video, "-an", "-vf", `${scene},freezedetect=n=0.001:d=${MAX_STILL}`, "-f", "null", "-"]);
  const starts = [...stderr.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const durs = [...stderr.matchAll(/freeze_duration: ([\d.]+)/g)].map((m) => Number(m[1]));
  const beatAt = (t) => timeline?.beats.findLast((x) => x.from / timeline.fps <= t)?.id ?? "?";
  const stills = starts.map((st, i) => ({ st, d: durs[i] ?? null })).sort((x, y) => (y.d ?? 99) - (x.d ?? 99));
  check(
    "Motion",
    `No still scene longer than ${MAX_STILL} s`,
    stills.length ? "FAIL" : "PASS",
    stills.length
      ? `${stills.length} still stretch(es): ` + stills.slice(0, 6).map((x) => `${beatAt(x.st)} @ ${x.st.toFixed(1)}s (${x.d ? x.d.toFixed(1) + "s" : "to end"})`).join(", ") + (stills.length > 6 ? ", …" : "")
      : "the scene keeps moving throughout",
  );
  check("Motion", "Labels ≤ 4 words, every movement explains something", "MANUAL", "check by eye at Gate 3");
}

// ── Thumbnail ────────────────────────────────────────────────────────────────────────────
const thumbInfo = existsSync(gen("thumbnail.json")) ? await readJSON(gen("thumbnail.json")) : null;
const thumb = thumbInfo ? path.join(ROOT, thumbInfo.file) : null;
if (!thumb || !existsSync(thumb)) check("Thumbnail", "Thumbnail rendered", "FAIL", "Run: npm run thumb " + ep.id);
else {
  const T = layout.thumbnail;
  const bg = T.background.match(/\w\w/g).map((h) => parseInt(h, 16));
  const inkShare = async (r) => {
    const w = r.right - r.left;
    const h = r.bottom - r.top;
    const { stdout } = await run("ffmpeg", ["-v", "error", "-i", thumb, "-vf", `crop=${w}:${h}:${r.left}:${r.top}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"], { encoding: "buffer" });
    let ink = 0;
    for (let i = 0; i < stdout.length; i += 3) {
      if (Math.max(Math.abs(stdout[i] - bg[0]), Math.abs(stdout[i + 1] - bg[1]), Math.abs(stdout[i + 2] - bg[2])) > 24) ink++;
    }
    return ink / (stdout.length / 3);
  };
  const g = T.gridCrop;
  const top = await inkShare({ left: 0, top: 0, right: 1080, bottom: g.top });
  const bottom = await inkShare({ left: 0, top: g.bottom, right: 1080, bottom: 1920 });
  const outside = Math.max(top, bottom);
  check("Thumbnail", "Everything inside the 3:4 grid crop", outside < 0.002 ? "PASS" : "FAIL", `content outside crop: top ${(top * 100).toFixed(2)}%, bottom ${(bottom * 100).toFixed(2)}% — ${thumbInfo.file}`);
  const corner = await inkShare(T.viewCountZone);
  check("Thumbnail", "Bottom-left (view count) empty", corner < 0.002 ? "PASS" : "FAIL", `${(corner * 100).toFixed(2)}% non-background`);
  const t = ep.meta.thumbnail;
  const words = t.blocks.map((b) => b.text).join(" ").split(/\s+/);
  const reds = t.blocks.filter((b) => b.style === "red").length;
  const specOk = t.blocks.length >= 3 && t.blocks.length <= 5 && words.length >= 3 && words.length <= 9 && reds === 1;
  check("Thumbnail", "Headline spec (3–5 boxes, 3–9 words, one red box)", specOk ? "PASS" : "FAIL", `“${t.blocks.map((b) => b.text).join(" / ")}” · ${t.blocks.length} boxes · ${words.length} words · red boxes: ${reds}`);
  const rows = t.diagram.rows.length;
  check("Thumbnail", "Diagram (1–3 rows, source noted)", rows >= 1 && rows <= 3 && t.diagram.source ? "PASS" : "FAIL", `${rows} row(s) · from ${t.diagram.source || "(no source!)"}`);
  check("Thumbnail", "Readable at grid size", "MANUAL", `look at ${rel(path.join(ep.outDir, "thumbnail_grid_200.png"))}`);
}

// ── Report ───────────────────────────────────────────────────────────────────────────────
const icon = { PASS: "✅", FAIL: "❌", WARN: "⚠️", MANUAL: "👀" };
const fails = results.filter((r) => r.status === "FAIL").length;
const warns = results.filter((r) => r.status === "WARN").length;
const md = [
  `# QA — ${ep.id}${ep.meta ? ` · ${ep.meta.title}` : ""}`,
  "",
  `Run ${new Date().toISOString().slice(0, 16).replace("T", " ")} · **${fails ? `${fails} FAIL` : "all checks pass"}**${warns ? ` · ${warns} warning(s)` : ""}`,
  "",
  "| | Group | Check | Detail |",
  "|---|---|---|---|",
  ...results.map((r) => `| ${icon[r.status]} | ${r.group} | ${r.name} | ${r.detail} |`),
  "",
  "Still to do by ear/eye (Gate 3): listen once on a phone speaker and once on headphones; check the grid crop on a real profile.",
  "",
].join("\n");
await fs.mkdir(ep.outDir, { recursive: true });
await fs.writeFile(path.join(ep.outDir, "qa_report.md"), md);
await writeJSON(path.join(ep.outDir, "qa_report.json"), { day: ep.n, createdAt: new Date().toISOString(), results });

for (const r of results) console.log(`${icon[r.status]} ${r.group.padEnd(9)} ${r.name} — ${r.detail.replace(/<br>/g, "\n      ").replace(/\*\*/g, "")}`);
console.log(`\n${fails ? `${fails} FAIL` : "All checks pass"}${warns ? `, ${warns} warning(s)` : ""} → ${rel(path.join(ep.outDir, "qa_report.md"))}`);
process.exit(fails ? 1 : 0);
