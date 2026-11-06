# Animation system

The hero and its settled assembly render on the server. A client enhancement lazily imports GSAP and ScrollTrigger. Anchor navigation, the keyboard skip link, and the mobile disclosure work without the animation runtime.

## Hero and section handoff

The entrance starts with the field and frame, then staggers the two headline phrases. The upper and lower plates open before the glass, display, and logic layers finish separating along three axes. A slight yaw resolves as the orange orbit draws behind and then in front of the assembly. The technical markers appear near the end. The sequence lasts about 2.25 seconds, with readable content at full opacity. Focusing or pressing inside the hero settles it immediately. A deep link or restored scroll position skips the entrance.

The hero draws a visible foreground curve that joins the handoff at a shared tangent. The handoff ends as the hero bottom reaches 72% of the viewport. One page-level SVG continues from that point behind text and media. Its leading edge follows the same viewport line, using sampled path coordinates to map vertical scroll to actual curve length. The path ends at the contact marker. ResizeObserver updates the geometry when the layout changes.

On desktop fine-pointer devices, damped camera tilt is limited to three degrees vertically and four horizontally. Pointer exit returns the camera to neutral. With reduced motion, the assembly entrance uses shorter travel with no camera tilt or text displacement.

## Selected Work

All five projects share one horizontal rail. On a desktop viewport that fits the gallery, its frame sticks below the header while native document scroll advances or reverses the rail. Smaller viewports use native horizontal swipe and snap. Named anchors, previous and next controls, and keyboard arrows reach the same slides. Case-study links use normal Next.js navigation.

## Inside the System

Inside the System lives below the project list at `/work`. On desktop viewports at least 64rem wide and 42rem tall with motion enabled, CSS reserves the native sticky chapter before hydration. ScrollTrigger maps its visible dwell to the full clip and holds the final frame over the last fifth of that range. The video stays on its opening frame until the visitor scrolls into the exhibit. The six native layer disclosures start closed and work independently of media and JavaScript.

Compact, short, and reduced-motion viewports scrub the media in normal flow. Reduced motion retains the essential video frames without a sticky dwell or additional scrub lag. The poster remains the fallback for disabled JavaScript, unsupported media, or video errors.

## Closing chapters

Toolbox, About, and any published Engineering Notes continue the page trajectory through their layouts. Toolbox modules enter in sequence. About pairs short editorial shifts with a scroll-linked line through the experience timeline. The page trajectory reaches the contact diagram’s center at the bottom of the page. The closing content is immediately readable with reduced motion.

The homepage shares one lazy GSAP and ScrollTrigger load. The closing chapters attach scoped timelines as they approach the viewport. Lenis eases desktop wheel input with quicker settling under reduced motion. Touch, keyboard, and fragment navigation retain browser scrolling. Scene scopes revert on unmount, and the System scope releases video and cancels pending seeks when leaving the case-study index.

Keep a single normalized progress value per scene. If needed, use GSAP and ScrollTrigger inside a scoped client wrapper and revert listeners and timelines on unmount and breakpoint change. Keep reserved geometry stable, animate transforms and opacity, and pause offscreen work. Consider React Three Fiber and Drei only where perspective or manipulation makes the exhibit clearer. Cap DPR at 1.5 initially and lower it if measured device performance warrants it. Add Lenis only if measured results justify it and keyboard, focus, and anchor behavior remain intact.

Keep mobile scenes in unpinned document flow. For scenes that depend on WebGL or video, provide a stable reference frame and accompanying text. Avoid trapping the pointer or keyboard in a canvas.
