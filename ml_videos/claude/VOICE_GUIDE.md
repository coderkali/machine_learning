# Voice Guide — ML for Java Developers

**Status:** LOCKED 2026-09-27. Applies to every episode. Each episode gets its own
voiceover sheet (`claude/episodes/day_NN/voiceover_sheet.md`) built from these rules.

The goal: it should sound like **one developer telling a friend something they just
figured out** — not a narrator, not an ad, not a lecture.

---

## 1. The five rules

1. **Pause *before* the punchline, not after.** The half-second of silence before the key
   phrase ("How did it know?", "a model", "Day 1 done") is what gives it weight.
2. **The ear notices change, not level.** No big acting needed — just never let two
   sentences in a row share the same pace *and* volume. Fast → slow, loud → quiet, list → landing.
3. **One direction per beat.** Record each beat as its own take with its own direction
   (7 directed takes, then stitch). One generic read of the whole script always sounds flat.
4. **Energy never dies at the end.** Reels lose viewers in the last seconds. The teaser
   line is the *lift*, not the fade-out.
5. **Statements go down, questions go up.** Only the hook question and the teaser rise.
   Every explanation sentence lands flat and sure.

## 2. The tone palette — every beat type has a fixed tone

The AI script writer tags each beat with one of these. Same beat type = same tone, every
episode. That consistency is what makes it feel like one series.

| Beat type | Tone | Pace | Volume | Eleven v3 tag(s) |
|---|---|---|---|---|
| **Hook** | Curious, "wait, this is odd" | Medium, slows into the question | Normal → drop on the question | `[curious]` |
| **Problem** | Brisk → wry → exasperated | Fast, words pile up | Normal | `[matter-of-fact]` → `[sarcastic]` → `[sighs]` |
| **Shift / insight** | Thoughtful, intimate | Slow | Quieter | `[thoughtful]` `[softly]` |
| **Explain** | Teacher: crisp, then flowing | Medium, builds | Normal | `[confident]` |
| **Term reveal** ("That is a model.") | Weighty | Slowest line in the video | Slight lift | pause before, no tag |
| **Caveat / honesty** | Candid, levelling with them | Slow | Quieter | `[honestly]` `[softly]` |
| **Java lens** | Warm, smiling, direct address | Medium | Normal | `[warmly]` `[smiling]` |
| **Takeaway** | Confident, declarative | Steady | Full | `[confident]` |
| **Day N done** | Small celebration | Punchy | Up | `[excited]` |
| **Teaser** | Lean-in, inviting | Slows, rising end | Slightly quieter, then lift | `[curious]` `[mischievously]` |

Emotional shape of every episode:

```
energy
  ▲   hook                                        done!  teaser
  │   ●                                             ●   ↗
  │     ╲   problem                    java    ●  ╱
  │      ●──●         explain  ●      ●  ╲  ╱
  │           ╲ insight   ●  ╱  ╲ caveat
  │             ●───────●         ●
  └──────────────────────────────────────────────▶ time
     curious  frustrated  quiet  clear  honest  warm  confident  lift
```

## 3. Script marks (used in every voiceover sheet)

| Mark | Meaning |
|---|---|
| **bold** | Stress this word |
| `(beat)` | Pause ~0.5 s |
| `(long beat)` | Pause ~1 s |
| `[bracket]` | How to deliver the line |
| `↗` | Rising end (only questions and the teaser) |
| `…` | Trailing, suspended — the thought continues |

## 4. How to make the AI voice actually do it

The project currently uses ElevenLabs **`eleven_multilingual_v2`**, Brian voice. That model
**cannot read emotion directions**: text in `[brackets]` is ignored or spoken aloud.
There are two paths.

### Path A (recommended) — Eleven v3 with audio tags

- `model_id: "eleven_v3"` — it understands inline tags like `[curious]`, `[sighs]`,
  `[whispers]`, `[excited]`, `[sarcastic]`, `[laughs softly]`.
- Put the tag **right before** the words it should colour; change tags mid-beat when the
  emotion changes (see the Day 1 sheet).
- Pauses: v3 does not use `<break>` tags. Use `…` for a short suspension and `—` or a new
  sentence for a beat. Longer silences are added in the edit (see §5).
- Stability: **Natural** (0.5). Creative (0.0) is more emotional but can go off the rails;
  Robust (1.0) ignores tags.
- v3 varies take to take: **generate 3 takes per beat, keep the best.** When you find a take
  you like, note its `seed` in the sheet so it can be regenerated.
- Check Brian still sounds like Brian on v3 before switching the series. If not, pick a voice
  once and **lock it for all 84 days** — the voice is part of the brand.

### Path B (fallback) — stay on multilingual v2

Emotion comes from settings + text shaping instead of tags:

| Beat tone | stability | style | speed |
|---|---|---|---|
| Curious / hook | 0.40 | 0.35 | 0.95 |
| Brisk / problem | 0.45 | 0.30 | 1.05 |
| Thoughtful / quiet | 0.55 | 0.20 | 0.90 |
| Teacher / explain | 0.50 | 0.25 | 1.00 |
| Candid / caveat | 0.55 | 0.20 | 0.90 |
| Warm / Java | 0.40 | 0.40 | 0.97 |
| Confident + teaser | 0.40 | 0.40 | 1.00 |

- Pauses: `<break time="0.5s" />` and `<break time="1.0s" />` work on v2.
- Keep speed ≥ 0.85. The current Day 1 script uses 0.72–0.73 for two beats; that is near
  ElevenLabs' floor (0.7) and makes a voice sound drugged, not thoughtful. Get slowness from
  pauses, not from stretching every syllable.

## 5. Stitching (where timing is really controlled)

- One MP3 per beat. Trim the silence the model adds at the start and end.
- Gap between beats: **0.25 s** normally, **0.6 s** before an insight/term-reveal beat,
  **0.15 s** into the Day N done line (keep momentum).
- Music bed (if any) at −24 to −28 LUFS under the voice, ducked further on quiet beats.
- Voice target −14 LUFS integrated (Instagram/YouTube Shorts normalise around here).
- Final check: listen **once on phone speaker, once on headphones**. If any line sounds
  like a "read", re-generate that beat only.

## 6. TTS-safe writing

- No symbols the voice must interpret: write "arrow" ideas as words (`contains prize → spam`
  becomes "if it says prize, it's spam").
- Code on screen, **plain English in the voice** (`model.predict(email)` → "call predict").
- Spell out anything ambiguous: "Z-test" → "Zee test", "RMSE" → "R-M-S-E", "k-NN" → "K nearest neighbors".
- Numbers as they should be said: "0.05" → "zero point zero five".
