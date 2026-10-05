// 0.3 — Generate voice takes with ElevenLabs.
//
//   node scripts/voice.mjs day_01 [beat] [--takes 3] [--model v3|v2]          dry run: prints the plan + character cost
//   node scripts/voice.mjs day_01 [beat] [--takes 3] [--model v3|v2] --confirm  actually calls ElevenLabs (costs credits)
//   node scripts/voice.mjs day_01 hook --pick hook_v3_t2.mp3                   marks a take as chosen in voice.json
//
// Takes go to public/day_NN/takes/<beat>_<model>_t<N>.mp3 — never overwritten (N keeps counting up).
// Every take is logged with its seed in public/day_NN/takes/takes.json so a good take can be regenerated.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { loadEpisode, publicRel, readJSON, rel, writeJSON } from "./lib/episode.mjs";

const MODELS = { v3: "eleven_v3", v2: "eleven_multilingual_v2" };

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const VALUE_FLAGS = ["--takes", "--model", "--pick"];
const positional = args.filter((a, i) => !a.startsWith("--") && !VALUE_FLAGS.includes(args[i - 1]));
const [dayArg, beatArg] = positional;
const confirm = args.includes("--confirm");

const ep = await loadEpisode(dayArg);
const takesDir = path.join(ep.publicDir, "takes");
const logFile = path.join(takesDir, "takes.json");

if (flag("pick")) {
  if (!beatArg) throw new Error("--pick needs a beat id, e.g. voice.mjs day_01 hook --pick hook_v3_t2.mp3");
  const file = path.join(takesDir, flag("pick"));
  if (!existsSync(file)) throw new Error(`No such take: ${rel(file)}`);
  const beat = ep.voice.beats.find((b) => b.id === beatArg);
  if (!beat) throw new Error(`Unknown beat "${beatArg}".`);
  const log = existsSync(logFile) ? await readJSON(logFile) : [];
  beat.chosen = publicRel(file);
  beat.pickedBy = "manual"; // autopick keeps this choice
  beat.seed = log.find((t) => t.file === beat.chosen)?.seed ?? beat.seed;
  await writeJSON(path.join(ep.srcDir, "voice.json"), ep.voice);
  console.log(`${beatArg}: chosen = ${beat.chosen} (seed ${beat.seed ?? "unknown"})`);
  process.exit(0);
}

if (!ep.voice.voice.voiceId && args.includes("--confirm")) {
  throw new Error("No voice chosen yet: set voice.voiceId (and voice.name) in voice.json — find candidates with: node scripts/find-voices.mjs");
}
const modelKey = flag("model") ?? ep.voice.voice.model ?? "v3";
if (!MODELS[modelKey]) throw new Error(`--model must be v3 or v2, got "${modelKey}".`);
const takes = Number(flag("takes") ?? 3);
const beats = beatArg ? ep.voice.beats.filter((b) => b.id === beatArg) : ep.voice.beats;
if (!beats.length) throw new Error(`Unknown beat "${beatArg}". Beats: ${ep.voice.beats.map((b) => b.id).join(", ")}`);

const settingsFor = (beat) => {
  const cfg = beat[modelKey];
  if (!cfg?.text) throw new Error(`Beat ${beat.id} has no ${modelKey} text in voice.json.`);
  // v3 reads emotion from inline tags; stability 0.5 = "Natural" (VOICE_GUIDE §4 Path A).
  if (modelKey === "v3") return { text: cfg.text, voice_settings: { stability: cfg.stability ?? 0.5 } };
  return {
    text: cfg.text,
    voice_settings: { stability: cfg.stability, similarity_boost: 0.8, style: cfg.style, speed: Math.max(0.85, cfg.speed ?? 1), use_speaker_boost: true },
  };
};

const chars = beats.reduce((n, b) => n + settingsFor(b).text.length * takes, 0);
console.log(`${ep.id} · ${MODELS[modelKey]} · voice ${ep.voice.voice.name} · ${beats.length} beat(s) × ${takes} take(s) ≈ ${chars} characters`);

if (!confirm) {
  for (const b of beats) console.log(`  ${b.id.padEnd(12)} ${settingsFor(b).text.length} chars  ${JSON.stringify(settingsFor(b).voice_settings)}`);
  console.log("\nDry run — nothing was sent. Add --confirm to generate (uses ElevenLabs credits).");
  process.exit(0);
}

await import("dotenv/config");
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set (expected in remotion/.env).");

// Library voices must be in "My Voices" before the API can use them: add it once (free, uses a voice slot).
{
  const { voiceId, publicOwnerId, name } = ep.voice.voice;
  const have = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, { headers: { "xi-api-key": apiKey } });
  if (!have.ok && publicOwnerId) {
    const add = await fetch(`https://api.elevenlabs.io/v1/voices/add/${publicOwnerId}/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "content-type": "application/json" },
      body: JSON.stringify({ new_name: name }),
    });
    if (add.ok) console.log(`Added "${name}" to My Voices.`);
    else console.log(`(Could not add "${name}" to My Voices: HTTP ${add.status}. Trying the voice ID directly; if TTS fails, add it once in the ElevenLabs Voice Library UI.)`);
  }
}

// Quota check first, so a run never stops half-way through an episode.
const sub = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": apiKey } });
if (sub.ok) {
  const q = await sub.json();
  const left = q.character_limit - q.character_count;
  const resets = q.next_character_count_reset_unix ? new Date(q.next_character_count_reset_unix * 1000).toISOString().slice(0, 10) : "unknown";
  console.log(`ElevenLabs quota: ${left} of ${q.character_limit} characters left (resets ${resets}); this run needs ≈ ${chars}.`);
  if (left < chars) {
    console.error(`Not enough ElevenLabs credits — nothing generated. Top up / upgrade, or wait for the reset on ${resets}.`);
    process.exit(2);
  }
} else {
  console.log(`(Could not read the ElevenLabs quota: HTTP ${sub.status}; continuing.)`);
}

await fs.mkdir(takesDir, { recursive: true });
const log = existsSync(logFile) ? await readJSON(logFile) : [];

for (const beat of beats) {
  const { text, voice_settings } = settingsFor(beat);
  for (let t = 0; t < takes; t++) {
    let n = 1;
    while (existsSync(path.join(takesDir, `${beat.id}_${modelKey}_t${n}.mp3`))) n++;
    const file = path.join(takesDir, `${beat.id}_${modelKey}_t${n}.mp3`);
    const seed = takes === 1 && beat.seed != null ? beat.seed : Math.floor(Math.random() * 4294967295);
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${beat.voiceId ?? ep.voice.voice.voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: MODELS[modelKey], voice_settings, seed }),
    });
    if (!response.ok) throw new Error(`TTS for ${beat.id} failed (${response.status}): ${await response.text()}`);
    await fs.writeFile(file, Buffer.from(await response.arrayBuffer()));
    log.push({ file: publicRel(file), beat: beat.id, model: MODELS[modelKey], seed, voice_settings, text, createdAt: new Date().toISOString() });
    await writeJSON(logFile, log);
    console.log(`  ${rel(file)}  seed ${seed}`);
  }
}
console.log(`\nListen, then pick one per beat:  node scripts/voice.mjs ${ep.id} <beat> --pick <file>`);
