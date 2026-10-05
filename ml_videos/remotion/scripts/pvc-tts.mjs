// Text-to-speech in Kali's Professional Voice Clone (no recording needed): one file per beat, or a single line.
//   node scripts/pvc-tts.mjs day_01 --beats hook --out out/pvc/day1_tts [--model eleven_multilingual_v2] --confirm
//   node scripts/pvc-tts.mjs --text "capstone" --out out/pvc/patch --name capstone --confirm   (patch a single word)
// PVCs work best with eleven_multilingual_v2. Costs credits (≈ 1 per character).
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEpisode } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const flag = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : undefined);
const voiceId = flag("voice") ?? "99SWo5wjrbPpMKuP8Mik";
const model = flag("model") ?? "eleven_multilingual_v2";
const outDir = path.resolve(flag("out") ?? "out/pvc/tts");
let items;
if (flag("text")) items = [{ id: flag("name") ?? "line", text: flag("text") }];
else {
  const ep = await loadEpisode(args[0]);
  const want = flag("beats")?.split(",");
  items = ep.voice.beats.filter((b) => !want || want.includes(b.id)).map((b) => ({ id: b.id, text: b.text }));
}
const chars = items.reduce((n, x) => n + x.text.length, 0);
console.log(`PVC TTS → ${voiceId} · ${model} · ${items.length} item(s) · ${chars} characters`);
if (!args.includes("--confirm")) process.exit(0);

await import("dotenv/config");
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set (expected in remotion/.env).");
mkdirSync(outDir, { recursive: true });
for (const x of items) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_192`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text: x.text, model_id: model, voice_settings: { stability: 0.45, similarity_boost: 0.9, style: 0.3, use_speaker_boost: true } }),
  });
  if (!res.ok) throw new Error(`${x.id}: ElevenLabs ${res.status} ${await res.text()}`);
  const out = path.join(outDir, `${x.id}.mp3`);
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`  ${x.id.padEnd(11)} → ${path.relative(process.cwd(), out)}`);
}
