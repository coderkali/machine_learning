import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const beats = JSON.parse(
  await fs.readFile(path.join(root, process.env.DAY01_NARRATION_FILE ?? "src/day01/narration.json"), "utf8"),
);
const requestedIds = process.env.DAY01_BEATS?.split(",").map((id) => id.trim()).filter(Boolean);
const beatsToGenerate = requestedIds ? beats.filter((beat) => requestedIds.includes(beat.id)) : beats;
if (requestedIds && beatsToGenerate.length !== requestedIds.length) {
  throw new Error("DAY01_BEATS contains an unknown narration beat id.");
}
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured.");
const modelId = process.env.DAY01_TTS_MODEL ?? "eleven_multilingual_v2";

// Keep each narration beat close to its planned scene duration instead of
// letting short hooks race while longer explanatory beats drag.
const beatSpeeds = {
  hook: 0.72,
  rules: 1.05,
  shift: 0.82,
  training: 0.88,
  prediction: 0.73,
  java: 0.8,
  takeaway: 0.93,
};

const outDir = path.join(root, process.env.DAY01_AUDIO_DIR ?? "public/day01/audio");
await fs.mkdir(outDir, { recursive: true });
for (const beat of beatsToGenerate) {
  const response = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb?output_format=mp3_44100_128",
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: beat.text,
        model_id: modelId,
        voice_settings: {
          stability: modelId === "eleven_v3" ? 0.35 : 0.45,
          similarity_boost: 0.8,
          style: 0.3,
          speed: modelId === "eleven_v3" ? 1 : beatSpeeds[beat.id] ?? 1,
          use_speaker_boost: true,
        },
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`TTS request for ${beat.id} failed (${response.status}): ${await response.text()}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(path.join(outDir, `${beat.id}.mp3`), bytes);
  process.stdout.write(`Generated ${beat.id}.mp3\n`);
}
