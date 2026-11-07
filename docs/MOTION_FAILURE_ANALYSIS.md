# Motion failure analysis

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
