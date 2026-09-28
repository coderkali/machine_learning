// Animation helpers for the "animated technical explainer" format — claude/ANIMATION_GUIDE.md.
// Medium-fast: short entrances, no slow fades. Timing in frames at 30 fps.
export const T = {
  enter: 9, // element pops / slides in (0.3 s)
  exit: 6, // element leaves (0.2 s)
  stagger: 4, // gap between items of a list
  draw: 12, // an arrow or line draws itself (0.4 s)
  cut: 6, // slide between beats (or a hard cut)
};

export const ease = (v: number) => {
  const x = Math.max(0, Math.min(1, v));
  return 1 - Math.pow(1 - x, 3);
};

/** 0 → 1 progress starting at frame `at`. */
export const enter = (f: number, at: number, span = T.enter) => ease((f - at) / span);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Slide up + fade in (quick). */
export const fade = (f: number, at: number, span = T.enter) => {
  const t = enter(f, at, span);
  return { opacity: t, transform: `translateY(${22 * (1 - t)}px)` };
};

/** Scale pop with a small overshoot — the default entrance for boxes, chips and icons. */
export const pop = (f: number, at: number, span = T.enter) => {
  const x = Math.max(0, Math.min(1, (f - at) / span));
  const s = x === 0 ? 0 : 1 + 0.12 * Math.sin(Math.PI * x) * (1 - x) * 2 - (1 - x) * (1 - x);
  return { opacity: x > 0 ? 1 : 0, transform: `scale(${Math.max(0, s)})` };
};

/** 0 → 1 for drawing an SVG path with strokeDasharray/strokeDashoffset. */
export const draw = (f: number, at: number, span = T.draw) => enter(f, at, span);
