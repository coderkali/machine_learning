# Episode 01 visual LDA

This is a new Remotion composition, built from animated React and SVG elements.
It uses the series theme from `src/theme.ts`, the licensed display font in
`public/theboldfont.ttf`, and the notebook's four point example. Existing Brian
narration and Whisper word timings are reused; rendering does not call ElevenLabs.

Run the interactive preview with `npm run visual:preview`. Render the finished
composition with `npm run visual:render`. It produces a 1080 × 1920, 30 fps MP4
about 85 seconds long at `out/lda_visual_v3.mp4`.

The video includes the coordinates, class means, pooled within-class scatter,
both directions, the four projected values, and the Fisher score comparison.
The centre-to-centre direction does separate the four toy points; the animation
shows that it leaves more within-class spread and optimizes a lower score than
the LDA direction.
