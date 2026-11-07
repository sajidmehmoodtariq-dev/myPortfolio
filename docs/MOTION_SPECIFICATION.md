# Motion specification

ScrollTrigger reads the native scroll position from the sticky track. Its progress sets the paused GSAP timeline directly. Keyframes use sine easing within their intervals. The timeline owns mesh and camera-orbit values, and the renderer derives the camera position and aim from those values. This keeps scroll-to-pose mapping deterministic in both directions.

Chapter copy changes at 26% and 76%. Opacity eases in while inactive chapters are hidden from keyboard navigation. The first arrival uses a short headline mask and canvas entrance. These are CSS effects on the presentation layer. They do not change the physical assembly pose. Loading directly at a later chapter skips the arrival effects.

The chapter controls keep native links for static mode. In enhanced mode they seek to chapter stops, update the URL fragment, and focus the destination heading. Free scrolling preserves native touch, keyboard, and wheel input. Device width changes affect camera fit and renderer size while leaving the timeline intact.

## Rendering budget

- One persistent renderer and a render scheduled at most once per browser frame on scroll or resize. The stage remains idle when the input is idle.
- Device pixel ratio capped at 1.65 for desktop and 1.35 for compact layouts.
- Procedural geometry and local fonts avoid blocking model or third-party asset downloads. The scene module loads separately from the initial document.
- Low-resolution reflection environment, baked gradient shadow, and no post-processing or real-time shadow maps.
- Repeated hardware details share one draw per material within a moving layer.
- Renderer, reflection target, textures, materials, geometry, listeners, and ScrollTrigger are disposed when switching to the static layout or unmounting.

The compact camera prioritizes the device silhouette and readable HTML copy. Fine markings and the secondary labels inside the device screen are clearest on desktop.
