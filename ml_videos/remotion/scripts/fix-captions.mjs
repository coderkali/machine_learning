// One-off corrections for known Whisper ASR mistakes in the LDA episode
// captions: a made-up character name it doesn't know, a domain term it
// mangled, and a hallucinated repeat at the end of a clip with trailing
// silence. These are all real bugs in the auto-generated captions, not
// stylistic choices.
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public", "audio");

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
}
function save(name, data) {
  fs.writeFileSync(path.join(dir, name), JSON.stringify(data, null, 2));
  console.log(`Fixed -> ${name}`);
}

// 1. "Mira" -> "Meera" (the character's actual name)
{
  const name = "lda_01_hook.json";
  const data = load(name);
  for (const c of data) {
    if (c.text.trim() === "Mira") c.text = c.text.replace("Mira", "Meera");
  }
  save(name, data);
}

// 2. Drop hallucinated trailing repeat tokens (" 8.5," " 8.5.") after the
// real final word, caused by trailing silence in the clip.
{
  const name = "lda_03_step1.json";
  const data = load(name);
  const fixed = data.slice(0, data.length - 2);
  save(name, fixed);
}

// 3. "SiteKit. Learn" -> "scikit-learn" (merge the two tokens into one)
{
  const name = "lda_07_verify.json";
  const data = load(name);
  const idx = data.findIndex((c) => c.text.trim() === "SiteKit.");
  if (idx !== -1 && data[idx + 1] && data[idx + 1].text.trim() === "Learn") {
    const merged = {
      text: " scikit-learn",
      startMs: data[idx].startMs,
      endMs: data[idx + 1].endMs,
      timestampMs: data[idx].timestampMs,
      confidence: Math.min(data[idx].confidence, data[idx + 1].confidence),
    };
    data.splice(idx, 2, merged);
  }
  save(name, data);
}
