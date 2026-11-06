# Animation recovery audit

## Findings before implementation

- The supplied screen recording shows the current exhibit layout and a poster-like System passage during a quick scroll. It starts on the settled hero, so it cannot show whether the entrance ran before capture. The recording alone cannot establish codec, network, or preference settings.
- The repository already contains a real H.264 derivative. The old scrubber only attaches it on screens at least 1024px wide and 672px tall, with reduced motion off and the requested codec supported. Other layouts always show the still. The desktop playhead starts advancing as the section enters the lower viewport, before the sticky figure settles, and can keep advancing as the scene exits. The original 80ms seek floor caps visual updates at 12.5 per second even with local media. The fallback is composed from a reference still that differs from the first decoded frame.
- FFmpeg identified the 10.03-second, 1280 × 720, 24 fps source with one video keyframe at the start. The prior 1120 × 630 runtime encode retains 7.25 seconds at 24 fps with a six-frame GOP. The source inspection shows a compact assembly, a visibly separated stack, moving orange signals, and baked callouts. The separate creative reference named `gemini_generated_video_4cd501b4.mp4` was absent from the repository, neighboring project search, and attachment inventory.
- The hero has six independently positioned CSS 3D layers and an SVG signal. Its entrance used a single brief spread tween, introduced markers before the assembly opened, and skipped the entrance on restored scroll, deep links, or early interaction. Selected Work used very similar 10px reveals and a common four-point parallax span. Toolbox and About only drew their section splines.

## Recovery plan

Keep the existing scene composition and native scrolling. Extract a reusable video scrubber, use responsive fast-start encodes with shorter GOPs, and map playhead progress across the visible dwell with a final hold. Use matching opening frames during loading and a settled fallback for reduced motion or media failure. Give the hero distinct depth and annotation beats. Add scene-specific transitions for the projects, toolbox, and About while retaining the connected spline and final contact target.

## Implementation

`ScrollDrivenVideo` attaches one responsive source near the scene and waits for seekable media. It quantizes the newest scroll target to a source frame, coalesces updates with animation-frame scheduling, and waits for the in-flight seek before requesting another. The component holds the last decoded frame during a seek and cleans up listeners, the observer, and the media source when reduced motion is enabled or the scene unmounts. The outer page spline stays behind the exhibit frame, while the source's orbit and labels play inside it.

Both FFmpeg encodes retain all 240 frames, remove audio, and place a keyframe every 0.167 seconds. The desktop file is 2,262,972 bytes and the compact file is 872,646 bytes. The compact layout delays scrubbing until the full frame is visible when viewport height allows it. Its baked labels are part of the artwork. The adjacent native disclosures provide readable text.

## Browser verification

- Chromium 158 on the local production build captured compact, intermediate, and settled hero states at 1440 × 900 and 390 × 844. The assembly visibly separates before the callouts finish.
- On both viewports, Chromium captured five distinct decoded video frames at 0%, 25%, 50%, 75%, and 100%. The captured times were approximately 0, 2.50, 4.96–5.00, 7.46–7.50, and 9.96 seconds. Reverse scrolling returned to the earlier targets and reproduced the same decoded pixels at matching timestamps. Screenshots also covered scene entry and exit.
- On loopback after the media was available, individual scroll-to-frame checks settled within 39 ms at the sampled positions. During a separate 1.5-second scroll ramp, Chromium reported 89 distinct presented frames on desktop and 90 on compact, with longest observed frame intervals of 33 ms and 17 ms. Neither viewport recorded a layout shift during the test. These measurements apply to the test workstation.
- At 390px with emulated touch, 4× CPU slowdown, 1.6 Mbps download, and 150 ms latency, direct navigation to the System section reached a decoded opening frame in about 4.1 seconds. A touch swipe advanced the compact clip from 0 to 6.25 seconds.
- Firefox decoded the compact source at 320, 390, 768, and 1024px in short or narrow viewports. Its desktop run verified byte-range delivery, deferred loading, reversible frames and spline, media-error fallback, and the architecture anchor. Separate runs verified the reduced-motion poster and no-JavaScript disclosures. Chromium also verified live source release when switching to reduced motion.
- TypeScript, lint, and the production build passed. Safari and physical mobile devices were outside this verification. Creative comparison used the supplied assembly clip, stills, and current recording. The separately named original creative-reference clip remains unavailable.
