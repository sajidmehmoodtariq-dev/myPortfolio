# Animation system

The hero and its settled assembly render on the server. A client enhancement lazily imports GSAP and ScrollTrigger. Anchor navigation, the keyboard skip link, and the mobile disclosure work without the animation runtime.

## Hero and section handoff

The entrance starts with the field and markers, then staggers the two headline phrases, opens the assembly in depth, draws the orange orbit, and settles the supporting copy and links. The sequence lasts about 1.3 seconds. Focusing or pressing inside the hero settles it immediately. A deep link or restored scroll position skips the entrance. No content is gated on motion.

The SVG uses normalized coordinates and separate rear, front, and handoff paths. Rear and front share a coordinate and tangent so the curve can pass behind the assembly before crossing in front. A single ScrollTrigger scrubs the handoff as the hero bottom travels from the viewport bottom to 58% of its height. The terminal points are (818, 1000) on desktop and (760, 1000) below 64rem. Selected Work begins at the matching x coordinates and vertical tangent. The hero's join value reveals the entry segment once the handoff reaches it.

On desktop fine-pointer devices, damped camera tilt is limited to three degrees vertically and four horizontally. Pointer exit returns the camera to neutral. The settled camera, complete path, and CSS geometry remain visible under reduced motion. No continuous idle loop runs.

## Selected Work

Each exhibit has a lightweight SVG segment with a shared endpoint and vertical tangent at its adjacent boundary. ScrollTrigger draws each segment as its exhibit enters and reveals the title and visual once. Wide screens get a small scroll-linked tilt and vertical offset on the media rig. There is no pinning. Case-study links use normal Next.js navigation with a short reveal on the destination page. Reduced motion leaves all copy, paths, and visuals settled.

## Proposed choreography for later sections

- **Inside the system.** Use buttons for layer selection, with visible active states and associated descriptions. Enter, Space, and tap update the same state. A new selection cancels any in-flight visual transition and settles within 350ms. Selection stays usable when 3D fails.
- **Toolbox, experience, notes, and contact.** Keep lists and contact links in document flow. Connect them with the decorative path and end it at the contact heading. Avoid pinning these sections.

Keep a single normalized progress value per scene. If needed, use GSAP and ScrollTrigger inside a scoped client wrapper and revert listeners and timelines on unmount and breakpoint change. Keep reserved geometry stable, animate transforms and opacity, and pause offscreen work. Consider React Three Fiber and Drei only where perspective or manipulation makes the exhibit clearer. Cap DPR at 1.5 initially and lower it if measured device performance warrants it. Add Lenis only if measured results justify it and keyboard, focus, and anchor behavior remain intact.

Keep mobile scenes in unpinned document flow. For scenes that depend on WebGL or video, provide a stable reference frame and accompanying text. Avoid trapping the pointer or keyboard in a canvas.
