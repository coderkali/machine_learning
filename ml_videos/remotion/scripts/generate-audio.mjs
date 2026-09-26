// Generates ElevenLabs narration audio + word-level transcript for a scene.
// Usage: node scripts/generate-audio.mjs <output-name> "<narration text>"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "nPczCjzI2devNBz1zQrb"; // Brian - Deep, Resonant and Comforting

const [, , outName, text] = process.argv;
if (!outName || !text) {
  console.error('Usage: node generate-audio.mjs <output-name> "<narration text>"');
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "public", "audio");
fs.mkdirSync(outDir, { recursive: true });
const mp3Path = path.join(outDir, `${outName}.mp3`);

// Note: this account's ElevenLabs key lacks the speech_to_text scope, so
// word-level captions are generated separately via scripts/caption-audio.mjs
// (local Whisper.cpp) instead of ElevenLabs' own STT endpoint.
async function main() {
  const ttsResp = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
      }),
    },
  );
  if (!ttsResp.ok) {
    throw new Error(`TTS failed: ${ttsResp.status} ${await ttsResp.text()}`);
  }
  const audioBuffer = Buffer.from(await ttsResp.arrayBuffer());
  fs.writeFileSync(mp3Path, audioBuffer);
  console.log(`Saved audio -> ${mp3Path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
