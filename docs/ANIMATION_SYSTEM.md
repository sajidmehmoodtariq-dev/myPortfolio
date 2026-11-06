# Animation system

The hero and its settled assembly render on the server. A client enhancement lazily imports GSAP and ScrollTrigger. Anchor navigation, the keyboard skip link, and the mobile disclosure work without the animation runtime.

## Hero and section handoff

The entrance starts with the field and markers, then staggers the two headline phrases, opens the assembly in depth, draws the orange orbit, and settles the supporting copy and links. The sequence lasts about 1.3 seconds. Readable content stays at full opacity throughout. Focusing or pressing inside the hero settles it immediately. A deep link or restored scroll position skips the entrance.

The SVG uses normalized coordinates and separate rear, front, and handoff paths. Rear and front share a coordinate and tangent so the curve can pass behind the assembly before crossing in front. A single ScrollTrigger scrubs the handoff as the hero bottom travels from the viewport bottom to 58% of its height. The terminal points are (818, 1000) on desktop and (760, 1000) below 64rem. Selected Work begins at the matching x coordinates and vertical tangent. The hero's join value reveals the entry segment once the handoff reaches it.

On desktop fine-pointer devices, damped camera tilt is limited to three degrees vertically and four horizontally. Pointer exit returns the camera to neutral. The settled camera, complete path, and CSS geometry remain visible under reduced motion. No continuous idle loop runs.

## Selected Work

Each exhibit has a lightweight SVG segment with a shared endpoint and vertical tangent at its adjacent boundary. ScrollTrigger draws each segment as its exhibit enters and reveals the title and visual once. Wide screens get a small scroll-linked tilt and vertical offset on the media rig. There is no pinning. Case-study links use normal Next.js navigation with a short CSS translation on the destination page. Reduced motion leaves all copy, paths, and visuals settled.

## Inside the System

On desktop viewports at least 64rem wide and 42rem tall with motion enabled, CSS reserves the native sticky chapter before hydration. ScrollTrigger moves through the compact opening, expansion, settled assembly, and baked annotation reveal. Both the video playhead and the spline reverse on upward scroll. The assembly leaves the viewport in normal flow as the enquiry explanation comes into view. An anchor jumps directly to the six native layer disclosures, which work independently of media and JavaScript.

The Selected Work trajectory ends at x=835 desktop and x=877 compact in normalized coordinates. The system scene begins there with a vertical tangent and joins the explanation at x=924 and x=954 respectively. Each segment completes at the same 70% viewport line used to start its successor. The explanation hands the path to the toolbox at x=903 and x=940. Reduced motion shows the full path and settled poster. Compact or short viewports skip the sticky chapter.

## Closing chapters

Toolbox, About, and Engineering Notes continue the normalized trajectory along the edge of their layouts. Adjacent segments share a vertical tangent and use the same 70% viewport line for their handoffs. The final segment reaches the contact diagram’s center at the bottom of the page. The notes index has a short, one-time reveal. These sections stay in document flow, and reduced motion shows the complete path and all content immediately.

The homepage shares one lazy GSAP and ScrollTrigger load. A reduced-motion visit skips that load entirely. Work, System, and the closing chapters attach their own scoped timelines when they approach the viewport. Each scope reverts on unmount or a change to reduced motion. The system scope releases video and cancels any pending seek. Case studies use CSS for their small entrance, so they do not request GSAP.

Keep a single normalized progress value per scene. If needed, use GSAP and ScrollTrigger inside a scoped client wrapper and revert listeners and timelines on unmount and breakpoint change. Keep reserved geometry stable, animate transforms and opacity, and pause offscreen work. Consider React Three Fiber and Drei only where perspective or manipulation makes the exhibit clearer. Cap DPR at 1.5 initially and lower it if measured device performance warrants it. Add Lenis only if measured results justify it and keyboard, focus, and anchor behavior remain intact.

Keep mobile scenes in unpinned document flow. For scenes that depend on WebGL or video, provide a stable reference frame and accompanying text. Avoid trapping the pointer or keyboard in a canvas.
