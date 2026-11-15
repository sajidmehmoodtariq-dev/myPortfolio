# Reload and site motion

## Native Windows preference correction

The latest user recording exposed a missed execution path: Windows had `MinAnimate=0`, and Chrome inherited `prefers-reduced-motion: reduce`. The homepage still skipped scene interpolation and text animation in that mode. Mounting the canvas automatically was insufficient. Earlier reduced-motion tests expected static text and checked only final object poses, so their passing result did not prove the experience requested by this user.

The owner explicitly requested animation without a toggle. The cinematic homepage now always animates; `?view=reading` remains its explicit no-motion alternative. The OS setting itself is untouched. The camera and layers settle over 650 ms for wheel/touch input and 1100 ms for selectors. The canvas enters over 1200 ms. Text uses a 500 ms departure and a 1000 ms masked heading entrance, with a 420 ms lead-in that prevents two readable headlines overlapping. Supporting content enters over 850 ms with 55 ms staggering. The easing is softer than the previous fast-start reveal.

`scripts/check-floating-motion.mjs` tests a native inherited Chrome context (`reducedMotion: null`), explicit reduced motion, and explicit no-preference. It captures actual wheel-driven intermediate camera, cover and optic positions, startup opacity, text poses, reverse navigation and browser video. The full text suite now explicitly reports reduced motion while requiring intermediate animated poses. Reading-mode tests still require no canvas. Evidence is under `qa-artifacts/float-motion/` and `qa-artifacts/text-motion/`. Older measurements below document the preceding revision rather than the new timing policy.

The final production run passed in all three preference contexts. The inherited native context reported reduced motion and recorded 41 distinct camera positions, 27 cover positions and 35 optic positions during a single wheel-driven disassembly. The new heading was sampled at approximately .52 opacity during its entrance. All 60 narrative handoffs then passed across five viewport sizes with the browser reporting reduced motion, including clean heading separation, reverse transitions, interruptions, resize and the explicit reading route. Type checking, lint and the production build passed. The native-setting recording is `qa-artifacts/float-motion/native-preference-floating.webm`.

## Confirmed causes

The loading background was an SVG illustration with different geometry and framing from the live Core. Switching the stage to live removed that background immediately. Project and credential entries also used vertical layout during loading and overlaid layout afterward, shifting the hero’s position.

Loading and live modes now share the same layout. A small preparation label holds the visual area until the live scene resolves over 1200 ms. Arrival text begins its entrance in the initial document and continues through hydration. The static illustration remains available in the unavailable-WebGL and reading layouts.

## Motion behavior

The paused GSAP timeline remains the scene authority. The existing RAF advances toward the native scroll target using elapsed-frame damping with a 650 ms settling window after the latest input. Direct selectors use 1100 ms. A sustained input test caught and corrected a version that reset its interpolation start on every frame. The resulting display continues advancing while input arrives.

Active narrative copy and dossiers have interruptible exits and staggered entrances, described below. Case studies, the work index, Notes, and certificate viewers share editorial reveals. Initial entrances run in CSS, while sections below the viewport use an IntersectionObserver as they enter. Visible content retains its painted state during hydration. Interaction transitions cover control color, borders, and small directional movement. The cinematic homepage keeps animation enabled per the owner’s explicit request; reading mode is the no-motion alternative. Editorial routes still respect the OS preference.

## Chapter text handoff correction

The supplied 14 November recordings show copy becoming fully visible while the assembly keeps moving. The previous root clip mask used short authored timeline intervals, so a fast scroll could consume the reveal within very few frames. Changing `data-visible`/`data-active` also applied `visibility: hidden` to the outgoing chapter or dossier immediately. A CSS entrance alone could not animate this exit, and the scroll mask competed with it.

`motion/text-transitions.ts` now owns chapter and dossier text transforms. The scene's existing scroll controller selects content; one Web Animations group completes the selected text handoff without adding a JavaScript RAF or ScrollTrigger. The object's paused GSAP timeline and camera choreography are unchanged. Text intentionally resolves over a bounded interval after crossing a boundary, even if scrolling stops there.

- Outgoing children move upward 30 px and fade over 500 ms. They remain painted until the exit completes and become inert immediately.
- Incoming headings move upward from 42 px through a mask over 1000 ms. Supporting copy and controls resolve over 850 ms, with an initial 420 ms delay and 55 ms sibling staggering.
- Interrupted or reversed transitions begin at their current computed pose. Completed/cancelled animation handles are released, and disposal removes the visibility attributes and listeners.
- The controller covers every chapter, both certificates, all project entries, request steps, Lab selections, and About panels. The finale retains its existing reassembly hold before text enters.
- On short screens, inactive About dossiers are positioned out of flow while the selected dossier determines the container height. That height transitions over 850 ms, so contact controls move smoothly with the shorter content. Exiting dossiers remain painted in the same slot. This fixes the short-landscape contact clipping exposed by regression testing.
- The homepage animates under either OS preference. Read without motion opens the separate HTML reading layout without a canvas.

The previous root scroll mask and project-entry wipe no longer write competing DOM transforms. `data-active`/`data-visible` retain semantic state; `data-text-visible` explicitly includes the exiting panel during its handoff.

The focused browser script is `scripts/check-text-motion.mjs`. It samples opacity, transforms, mask and visibility on animation frames, captures intermediate/settled screenshots, records the desktop sequence, and checks interruption, reverse motion, nested selectors, resize and reduced motion. Its development-only evidence is saved under ignored `qa-artifacts/text-motion/`. The broader storyboard suite waits for text to settle before final-state captures and link hit tests.

The final focused run passed 60 handoffs across 1440 × 900, 768 × 900, 390 × 844, 320 × 568 and 844 × 390. Every sampled transition includes multiple distinct mask values, positions and opacity levels. This verifies progression through frames rather than comparing only the final screenshots. It does not establish physical-device frame pacing.

The broader regression passed the scene, credential, gallery and engineering checks before exposing the compact About height issue. After that correction, the affected About/finale checks passed at all five regression sizes, followed by reduced-motion, reading-mode, direct-anchor, no-JavaScript and WebGL fallback/retry checks. Their focused rerun is saved in `qa-artifacts/text-motion/closing-regression.json`. Type checking, lint and the production build passed. The 12-second `text-handoffs-preview.webm` is an excerpt of the actual desktop browser recording.

## Browser evidence

The focused Chrome test covers delayed startup, heading position, intermediate scene opacity, multiple camera poses during a scroll, reload restoration, reverse navigation, editorial reveals, and reduced motion at desktop and portrait-mobile sizes. Screenshots and diagnostics are under the ignored `qa-artifacts/motion-polish/` directory.

The recorded reload uses a 300 ms delay on script requests so the preparation stage can be seen. The subsequent wheel inputs and reverse motion use the actual browser and live scene.

A 240-interval forward and reverse sweep measured the following frame timing in headless Chrome. The maximum normalized progress lag stayed below .023 while input changed every frame.

| CSS viewport | Median | p95 | Longest interval | Intervals above 25 ms |
| --- | ---: | ---: | ---: | ---: |
| 390 × 844 | 16.7 ms | 17.1 ms | 50.1 ms | 7 |
| 768 × 1024 | 16.7 ms | 17.3 ms | 49.0 ms | 8 |
| 1440 × 900 | 16.7 ms | 17.3 ms | 66.8 ms | 8 |
| 1920 × 1080 | 16.7 ms | 16.9 ms | 50.3 ms | 8 |

The sweep recorded no long tasks. The occasional missed frames and the artificial sweep’s input pattern limit conclusions about perceived smoothness. Physical devices remain untested. The raw profile lives in `qa-artifacts/refinement/motion-polish/report.json`.

The full eight-chapter suite passed on 15 November 2026 with the new interpolation. It covered reload and resize, exact forward/reverse poses after settling, mobile touch distance, direct selectors, contact actions, case-study routes, reading views, reduced motion, and WebGL failure recovery. Type checking, lint, and production build also passed.
