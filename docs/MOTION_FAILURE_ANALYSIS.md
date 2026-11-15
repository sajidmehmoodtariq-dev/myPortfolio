# Motion failure analysis

## Confirmed native preference bypass — 15 November correction

The latest recording still showed instant object and text changes. Inspection of the user's Windows setting returned `MinAnimate=0`. A local Chrome session explicitly inheriting its native setting (`reducedMotion: null`) returned `matchMedia('(prefers-reduced-motion: reduce)').matches === true`.

The runtime still contained `reducedMotion.matches ? targetProgress : interpolatedProgress`; the text controller also returned immediately when that preference matched. CSS placed the canvas and Arrival entrances inside the opposite media query. As a result, mounting the live canvas automatically did **not** actually enable the animated experience on this machine. Earlier tests verified moving geometry with animation enabled, while reduced-motion tests checked only final poses and intentionally expected no text animation. They missed this user's requested behavior.

The owner explicitly requested automatic cinematic motion without a toggle. The homepage now always interpolates its scene and animates its HTML, independently of the OS setting. `?view=reading` remains the explicit no-motion alternative. Editorial routes continue honoring the OS preference. No operating-system setting is modified.

Native scroll settles over 650 ms and chapter selection over 1100 ms. Text uses a softer 1000 ms masked heading entrance, 850 ms supporting entrances and a 500 ms outgoing drift. The canvas floats into view over 1200 ms. `scripts/check-floating-motion.mjs` now records real wheel input, camera and independent layer positions, heading poses and startup opacity using the inherited native setting, explicit reduced motion and explicit no-preference. The full text regression also runs with reduced motion reported by the browser, and requires actual intermediate animation in that mode.

## Text teleporting between chapters

The two supplied 14 November recordings show abrupt narrative text changes while the Core continues to move. The outgoing chapter was hidden immediately when its active state changed. Incoming root masks were scroll-linked over short timeline spans, so fast input could traverse the entire reveal in a few frames. The previous CSS entrance could not preserve the outgoing text and shared transform ownership with the scroll mask.

The runtime now selects text using the existing chapter boundaries and delegates its handoffs to `motion/text-transitions.ts`. Exiting text remains painted during its 220 ms exit and is inert. Incoming masked headings and staggered supporting content have a bounded reveal duration, including when a visitor stops scrolling at the boundary. Interruptions snapshot the painted pose before restarting; reduced motion finishes immediately. The former DOM mask and project wipe writes were removed. The same controller handles nested certificates, project entries, request steps, Lab and About panels.

Production Chrome frame samples passed 60 transitions across 1440 × 900, 768 × 900, 390 × 844, 320 × 568 and 844 × 390. Each test observed intermediate outgoing opacity and incoming position/opacity/masks, then the correct settled visibility. Reverse scrolling, interrupted entrances, resize and reduced motion also passed. The short-layout About container now animates to the selected dossier height, preserving exits while keeping contact actions reachable. Screenshots, a browser recording and raw samples are under ignored `qa-artifacts/text-motion/`; implementation details are in `docs/MOTION_POLISH.md`. Mobile evidence is browser emulation, not a physical-device measurement.

## Reload handoff correction

The November 2026 reload screenshots correspond to two different render paths. CSS paints `core-poster.svg` during loading, then removes the background as soon as the renderer switches the stage to live. The SVG uses a different silhouette and camera projection from the actual mesh. The live canvas previously had no entrance transition, so the replacement was visible in one frame. Native scroll also sought the paused timeline directly on each input update.

The loading stage now keeps the final viewport layout and shows a small preparation label. The first rendered canvas resolves over 850 ms. Text and active dossiers use staggered entrances. One existing RAF interpolates the scroll target over 180 ms and chapter selections over 500 ms, then lands exactly on the requested pose. Reduced motion skips those time-based transitions. The static poster remains the HTML fallback. The same canvas and master scene timeline continue through the whole storyboard.

The loading CSS also left project and certificate dossiers in vertical flow until the live-mode switch. Those hidden chapters contributed a larger grid size and pushed the initial headline down. Loading and live modes now share the same overlaid dossier layout. The reload regression checks the hero position as well as the scene opacity.

The baseline production build was tested before editing. Chrome used the native document scroller. Captures and console output are in `qa-artifacts/baseline/`.

| Baseline condition | Observed result |
| --- | --- |
| Standard 1440 × 900 Chrome and Chrome with explicit SwiftShader | ScrollY 0, 1035, and 2070 produced ScrollTrigger progress 0, .5, and 1. The canvas stayed at x 644.5, y 167, sized 722.5 × 582. |
| Reduced motion at 390 × 844 | Three static chapters and no canvas. The media query returned before importing the runtime. |
| Short landscape at 844 × 390 | The same static state, even with motion allowed. The combined media query disabled initialization at heights of 430 px or less. |
| WebGL context creation blocked | Three.js reported “Error creating WebGL context.” The initialization catch left the static chapters and poster visible without an on-page status. |

The Three.js scene used one canvas and one root group. GSAP was initialized after a lazy React effect, and one ScrollTrigger sampled the paused timeline. No Lenis instance, competing trigger, React-owned part transform, or nested scroller was present. Cleanup removed the runtime on preference change or context loss. The only other console error observed was an HTTP 404 for the favicon. Ordinary WebGL scrolling reproduced the boxed presentation, but did not reproduce a frozen timeline.

Two architecture issues accounted for the observed outcomes. The WebGL canvas was constrained to a bordered figure within the editorial grid. The initial and failure states also shared an indistinguishable static layout with three visible chapters. The rebuilt stage reserves its native scroll track from first paint, keeps the canvas full viewport, preserves intentional reduced motion, and labels WebGL failure with a retry control. Short landscape now has a compact live composition.

The rebuild also exposed a browser restoration issue at 390 × 844. Chrome restored the page to 353 px after reload from 1,317 px even though the reserved track measured 2,870 px at DOMContentLoaded. The runtime now stores the normalized pose on page exit and seeks to it on reload. Direct chapter links still use their named stops.

The user's subsequent screen recording shows the page's “Reduced motion is on” notice. That identifies the active branch in their session. The first fix added an explicit opt-in. The user later requested automatic motion, so the experimental page now initializes 3D immediately under either browser preference and ignores saved choices from the former toggle.
