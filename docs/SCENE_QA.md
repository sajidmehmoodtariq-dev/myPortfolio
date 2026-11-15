# Milestone 02 scene QA

The three-scene storyboard was profiled in Chrome 157 in development and production before and after refinement. The test captured 0%, 20%, 40%, 60%, 80%, and 100% at each size and sampled 240 frame intervals per forward and reverse sweep. The browser viewport and DPR settings were the same for the two runs at each size.

| CSS viewport | Production p95 before → after | Development p95 before → after | Mean observed scroll delay in production before → after |
| --- | --- | --- | --- |
| 390 × 844 | 17.0 → 17.0 ms | 17.0 → 17.0 ms | 26.4 → 24.5 ms |
| 768 × 1024 | 17.0 → 17.0 ms | 17.0 → 17.0 ms | 28.4 → 29.3 ms |
| 1440 × 900 | 17.0 → 17.0 ms | 17.0 → 17.0 ms | 25.9 → 25.6 ms |

No sampled interval exceeded 25 ms and no long tasks were recorded. Observed scroll delay includes the test's wait to read the painted progress on a browser frame. The normal test did not reproduce the reported stutter, and the timings show no material pacing change. There was no installed smooth-scroll library to benchmark. Native scrolling remained the input path.

The development server initially returned HTML at `127.0.0.1:3000` but blocked its hot-reload WebSocket, leaving the canvas in the loading state. The baseline was captured through `localhost:3000`. The final development capture used `127.0.0.1:3000` after adding the loopback origin and verified that the live canvas mounted. This reproduced a separate preview issue, with no evidence tying it to dropped frames.

## Desktop pose evidence

| Scroll | Actual camera position | Cover position in the Core | Visible cue |
| --- | --- | --- | --- |
| 0% | [6.84, 4.95, 8.46] | [0, .50, 0] | Closed silhouette |
| 20% | [5.46, 5.72, 8.28] | [0, .50, 0] | Latches move while the lid remains seated |
| 40% | [5.40, 5.51, 10.66] | [−.09, 1.64, −.11] | Cover, glass, bezel, and board separate |
| 60% | [3.59, 3.98, 13.67] | [−.01, 2.08, −3.22] | Raised cover slides behind the stack |
| 80% | [1.95, 1.76, 12.66] | [0, −.91, −.94] | Cover approaches its rear seat and the optic begins to light |
| 100% | [1.37, .91, 10.99] | [0, −.91, 0] | PGC-DHA display is seated and readable |

The captured forward and reverse positions, camera targets, rotations, lock offsets, and display opacity matched exactly. Additional checks confirmed the cover cleared the rear edge before lowering, the final pose at 96% matched 100%, and the renderer made no additional draw across that hold. Projected bounds were checked every 5%. Maximum extent was .952, with 1 representing a viewport edge. The 40% pose submitted 26 draws after refinement versus 31 before, with 13,094 versus 12,774 triangles.

The full Chrome regression suite passed the existing anchors, keyboard, touch, resize, scroll restoration, reverse travel, automatic animation, and WebGL fallback tests. Typecheck, lint, and the regular production build passed.

## Reproduce and review

- Open the desktop, tablet, and mobile contact sheets in `qa-artifacts/milestone-02/`. Individual PNGs and reports are grouped by build mode and revision.
- Set `STORYBOARD_PROFILE=milestone-02` and `STORYBOARD_URL` to your local origin. Run `node scripts/profile-storyboard.mjs after-development` against `npm run dev`. For the production profile, build with `NEXT_PUBLIC_STORYBOARD_DIAGNOSTICS=1`, start the build, and run the profiler with `after-production`.
- The results describe local Chrome and emulated viewports. Physical mobile hardware, other engines, and isolated GPU timings remain unverified.
