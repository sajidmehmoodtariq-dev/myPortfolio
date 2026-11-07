# Phase 01.5 QA results

Chrome captured 0%, 15%, 30%, 50%, 70%, 85%, and 100% in four viewport sizes before and after refinement. Each run sampled 240 frame intervals through a continuous forward and reverse sweep. The final run also tested projected part bounds every 5% and compared the exact forward and reverse milestone transforms.

| CSS viewport | Drawing buffer before → after | Frame p95 before → after | Mean scroll-to-observed-frame delay before → after |
| --- | --- | --- | --- |
| 390 × 844 | 526 × 1139 → 682 × 1477 | 16.9 → 16.8 ms | 22.5 → 25.1 ms |
| 768 × 1024 | 681 × 909 → 1024 × 1366 | 17.0 → 16.8 ms | 23.7 → 24.7 ms |
| 1440 × 900 | 1296 × 810 → 1440 × 900 | 16.9 → 16.8 ms | 21.3 → 21.2 ms |
| 1920 × 1080 | 1366 × 768 → 1920 × 1080 | 17.0 → 16.8 ms | 26.2 → 21.4 ms |

No sweep produced a frame interval over 25 ms or a long task. Progress lag remained under .009 of the sequence. Latency includes waiting until the test observes the painted progress on a browser frame. The refined exploded scene submitted 31 draws and 12,774 triangles. The measured CPU time inside the Three.js render call was 0.3–0.4 ms at that pose. GPU execution time was not isolated.

The largest projected extent was .971, where 1 is the viewport edge. Visual review covered the closed shell, staggered separation, cover route, frame docking, and project surface. The tested poses remained in frame, with no obvious clipping or component intersections in the reviewed captures. The browser regression suite also passed reload, resize, keyboard navigation, touch scrolling, reduced-motion opt-in, WebGL fallback and retry, and context loss. Type checking, lint, and the regular production build passed.

The device-side stutter reported in the brief did not reproduce on this Chrome setup. The comparable frame distribution supports the resolution increase on this setup. Physical phones, other browser engines, and the sustained-slow-frame downshift remain unverified. Secondary text on the phone-sized project display is still smaller than the adjacent HTML description.

## Files and artifacts

- `scene/core.ts` and `scene/display.ts` contain the geometry, material, and texture refinements.
- `motion/choreography.ts` and `motion/storyboard-runtime.ts` contain the camera, mechanical cues, resolution policy, and paint changes.
- `app/styles.css` adjusts the headline measure on wide displays.
- `scripts/profile-storyboard.mjs` captures and profiles the motion using an opt-in diagnostic build. Run it against the local preview with `node scripts/profile-storyboard.mjs after`.
- `qa-artifacts/refinement/` contains the before and after stills, comparison crops, contact sheets, raw timing reports, and a forward and reverse Chrome recording of the production build.
