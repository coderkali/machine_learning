// DAF series: short audio previews of candidate voices for the Java-developer character.
//
//   node scripts/daf-voice-preview.mjs
//
// Output: out/voices/daf_student/preview/<n>_<name>.mp3 (uses ElevenLabs credits, ~100 chars per voice)
import fs from "node:fs/promises";
import path from "node:path";
import "dotenv/config";
import { ROOT } from "./lib/episode.mjs";

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY is not set (expected in remotion/.env).");

const TEXT = "Hi! I write Java. I will ask the doubts you are shy to ask. ... One doubt. In Java tests, I shuffle my data. Why not here?";
const VOICES = [
  // round 2 (2026-10-04): trending young Indian voices; round 1 (Bunty, Raju x2) rejected
  { n: 4, name: "Raunak_GenZ_reel", id: "VXaLcMNoz4m5hut9MmOd" },
  { n: 5, name: "Rahul_S_natural_warm", id: "txk8uOzZ0iCh0B9mFSRG" },
  { n: 6, name: "Raj_ads_social", id: "FwuKjlVpi0N3exead7ji" },
  { n: 7, name: "Sid_young_cool", id: "Yr66fXOWqCCUlvWHiVjt" },
  { n: 8, name: "Utkarsh_viral_UGC", id: "0S6xG2aDSxyTDcYrV1oo" },
  { n: 9, name: "Anuj_friendly_tutor", id: "jP6rT0U10vfyLbGW2Wm8" },
];

const outDir = path.join(ROOT, "out/voices/daf_student/preview");
await fs.mkdir(outDir, { recursive: true });
for (const v of VOICES) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text: TEXT, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3 } }),
  });
  if (!res.ok) { console.log(`${v.name}: failed (${res.status}) ${(await res.text()).slice(0, 200)}`); continue; }
  const file = path.join(outDir, `${v.n}_${v.name}.mp3`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log(`${v.name}: ${file}`);
}
