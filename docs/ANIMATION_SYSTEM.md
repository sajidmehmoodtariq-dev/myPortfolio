# Animation system

Prompt 01 uses native anchor navigation and a keyboard skip link. The page has no motion runtime. Later scenes enhance the server-rendered page and preserve its content and reading order.

## Proposed choreography

- **Hero.** Render name, role, and the work link immediately. On desktop, map progress from the hero top meeting the viewport top to the hero bottom meeting the viewport midpoint. Use progress 0–0.35 to open the stack, 0.35–0.70 to settle the layers and advance the orange path, and 0.70–1 to fade in decorative leaders. Keep labels and copy readable independently of scene progress.
- **Selected work.** Use ordinary links to open case studies. Give links equivalent hover and focus emphasis. On desktop, a single media frame may update as the matching project reaches the viewport midpoint. On mobile, each frame belongs in its own project flow.
- **Inside the system.** Use buttons for layer selection, with visible active states and associated descriptions. Enter, Space, and tap update the same state. A new selection cancels any in-flight visual transition and settles within 350ms. Selection stays usable when 3D fails.
- **Toolbox, experience, notes, and contact.** Keep lists and contact links in document flow. Connect them with the decorative path and end it at the contact heading. Avoid pinning these sections.

Keep a single normalized progress value per scene. If needed, use GSAP and ScrollTrigger inside a scoped client wrapper and revert listeners and timelines on unmount and breakpoint change. Keep reserved geometry stable, animate transforms and opacity, and pause offscreen work. Consider React Three Fiber and Drei only where perspective or manipulation makes the exhibit clearer. Cap DPR at 1.5 initially and lower it if measured device performance warrants it. Add Lenis only if measured results justify it and keyboard, focus, and anchor behavior remain intact.

Under 48rem, use unpinned document flow. With reduced motion, render a stable reference frame and present all annotations as text. Use the same fallback when WebGL or video is unavailable. Avoid trapping the pointer or keyboard in a canvas.
