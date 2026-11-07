# Storyboard implementation

The experimental branch serves one Next.js route with three narrative states. The cream studio fills the viewport. A single sticky stage stays in place for the native document scroll, and its Three.js canvas stays mounted from arrival through the display reveal.

## Scene and ownership

```text
Scene
  Perspective camera and explicit look-at target
  Studio lights, reflection environment, and soft shadow plane
  smt-core
    ceramic-cover
    optical-interface (glass and project texture)
    precision-bezel
    logic-assembly
    aluminum-chassis
    structural-base
```

Each named group retains its local pivot, geometry, materials, and children. The choreography defines closed, exploded, and docked poses for each group. The cover travels around the assembly and docks as the rear cover. The optical layer becomes the display while staying attached to its original group. The project texture is a labeled technical schematic without institutional records.

ScrollTrigger reads the document scroll and seeks the paused GSAP timeline. The timeline provides part poses, parent orientation and scale, camera orbit and target, optical surface reveal, and HTML mask values. A queued render applies the current values at most once per animation frame. The scene remains idle when the scroll position is steady. Resize uses the same canvas and master timeline and recalculates the projection and render buffer.

## Files changed

| Files | Responsibility |
| --- | --- |
| `app/page.tsx`, `components/storyboard.tsx`, `app/styles.css` | Three semantic narrative states, full-viewport pin, live status, and static access |
| `app/icon.svg` | Local favicon for the preview |
| `scene/core.ts` | Stable identity for the root and six component groups |
| `motion/choreography.ts` | Independent poses, camera, HTML masks, and display reveal in one timeline |
| `motion/storyboard-runtime.ts` | Three.js renderer and lifecycle, native scroll binding, framing, and opt-in diagnostics |
| `scripts/check-storyboard.mjs` | Chrome capture, motion measurements, and interaction checks |

The four motion-rebuild documents supersede the first prototype's layout, timeline, and QA notes.

## Responsive behavior

Desktop places the object to the right of the copy within the same full-bleed scene. In portrait up to 780 px, the text sits at the top, the camera's principal point moves lower, and the exploded travel compresses by up to 22%. The cover keeps its full rearward clearance. Short landscape uses a compact side-by-side layout and more vertical camera margin.

The initial HTML reserves the live scroll track. The experimental page initializes 3D automatically, including when the browser reports reduced motion. Scroll still controls the pose. On page exit, the runtime records progress in tab-scoped session storage for reload restoration. Without JavaScript or WebGL, the static layout offers readable text and native anchors. WebGL failure and loss expose a retry control. The module cleans up the trigger, timeline, observer, listeners, renderer, geometry, materials, and textures when the canvas is retired.
