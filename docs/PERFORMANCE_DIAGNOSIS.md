# Performance diagnosis

The original implementation was captured and profiled in Chrome before changes. It uses Three.js directly, with one viewport-sized canvas, one ScrollTrigger, one paused GSAP timeline, and one on-demand paint queue. There is no R3F or Lenis. React mounts the scene and handles view preferences. It does not participate in per-frame motion.

| CSS viewport | Device DPR | Original drawing buffer | Frame interval p95 |
| --- | ---: | --- | ---: |
| 390 × 844 | 2 | 526 × 1139 | 16.9 ms |
| 768 × 1024 | 1.5 | 681 × 909 | 17.0 ms |
| 1440 × 900 | 1 | 1296 × 810 | 16.9 ms |
| 1920 × 1080 | 1 | 1366 × 768 | 17.0 ms |

The 1.05 million-pixel cap rendered the 1080p viewport at about 71% of its CSS width and height before the browser stretched it. The tablet buffer was also smaller than its CSS dimensions. The cover label used default anisotropic sampling and occupied a small fraction of a large transparent texture. Faceted bevel normals and near-white lighting further reduced edge and material definition.

The test swept forward and backward over 240 frame intervals per viewport. Chrome recorded no intervals above 25 ms and no long tasks during those sweeps. The desktop exploded pose used 32 draw calls. The reported device-side stutter was not reproduced under this configuration. Inspection did find redundant work that could amplify slower rendering. ScrollTrigger evaluated the timeline before the queued paint, every paint rewrote nine panel style properties, and camera fitting selected between hard distance limits. The renderer already used inexpensive baked shadows, shared materials, and a one-time reflection bake.

The before captures and raw timing traces are under `qa-artifacts/refinement/before/`. Browser timings measure the local test environment and do not isolate GPU execution or physical phone performance.
