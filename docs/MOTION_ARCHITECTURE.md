# Motion architecture

## Current implementation

`app/page.tsx` serves eight semantic chapters. `components/storyboard.tsx` mounts the browser runtime behind a client boundary and keeps the HTML visible if WebGL is unavailable. A CSS-sticky studio stays in the viewport on the native document scroll track. One ScrollTrigger publishes progress. The queued paint seeks one paused GSAP timeline, applies the Core and camera poses, selects the HTML narrative state, and draws when the scene or drawing buffer changes. The final hold updates the progress rail without redrawing the settled scene. React stays outside the per-frame loop.

`scene/core.ts` owns the same named six-part assembly through every pose. Two sliding locks are children of the chassis. The document mat, both page planes, and gallery display belong to the original optic. `motion/choreography.ts` owns the part, page, and camera cues on the shared 6.13-unit timeline. `motion/camera.ts` uses bounded cubic interpolation. `motion/storyboard-runtime.ts` applies the camera target and responsive projection, manages the renderer, and disposes of its resources.

| Timeline unit | Camera cue | Azimuth, elevation, orbit radius | Authored look-at target |
| --- | --- | --- | --- |
| 0 | Arrival | .68 rad, .43 rad, 11.40 | [0, −.04, 0] |
| .20 | Initial approach and latch release | .58 rad, .52 rad, 9.80 | [.025, .04, −.02] |
| .39 | Disassembly | .47 rad, .43 rad, 10.25 | [.07, .115, −.06] |
| .50 | Exploded state | .34 rad, .34 rad, 10.85 | [.10, .15, −.08] |
| .70 | Archival mount reassembly | .18 rad, .18 rad, 12.30 | [.09, .23, −.43] |
| .90–1.22 | Near-frontal reading view | .055 → .035 rad, .09 rad, 9.38 | [.02, .08, −.06] |
| 1.56 | PGC-DHA | .12 rad, .072 rad, 9.55 | [.035, .11, −.07] |
| 1.82 | ResumeIQ | −.065 rad, .10 rad, 9.65 | [.01, .10, −.05] |
| 2.08 | Ledger | .16 rad, .055 rad, 9.55 | [−.035, .12, −.04] |
| 2.34 | Folio | −.095 rad, .081 rad, 9.68 | [.03, .10, −.09] |
| 2.60 | Nudge | .09 rad, .068 rad, 9.70 | [−.02, .135, −.05] |
| 2.86 | Cutaway handoff | .31 rad, .18 rad, 10.60 | [.05, .13, −.18] |
| 3.04–3.77 | Request trace | .39 → .23 rad, .46 → .42 rad, 11.35 → 11.55 | [.24, .05, −.03] → [.19, .07, 0] |
| 4.10–4.56 | Lab bench | .19 → −.11 rad, .34 rad, 10.85 → 10.80 | [−.02, .20, −.09] → [.04, .19, −.09] |
| 4.92–5.40 | About | .13 → .28 rad, .43 → .42 rad, 10.20 → 10.35 | [.05, .14, −.15] → [.035, .13, −.13] |
| 5.62 | Cover clearance | .48 rad, .45 rad, 13.80 | [−.08, .27, −.91] |
| 6.03 | Final hold | .68 rad, .43 rad, 11.40 | [0, −.04, 0] |

The listed radius and target are authored values. Responsive fitting can move the camera farther back and follow the cover during the turn. The cover clears the rear edge before crossing the stack axis at .62 timeline units. The optical mat holds the two full-page previews during the new archive window. On exit the mat clears, the base retracts, and the existing PGC-DHA display lights up on the same optic.

The next exhibit becomes active halfway between stable stops. The optic reaches zero emission before the texture changes and restores emission after the handoff. Each transition adjusts the base, optic, bezel, chassis, and root yaw. The corresponding project dossier uses the text transition controller described below. One canvas texture is repainted on project change. The Nudge JPEG loads when Folio becomes active or when a visitor seeks directly to Nudge. Project controls seek native scroll positions. Resize keeps the live projection and current pose on the same canvas.

`scene/engineering.ts` parents the request trace directly to the logic board. During Inside the System, the glass interface and ceramic bezel stow below the PCB, leaving the chips unobstructed. Five component sites represent Interface, Request, API, Auth and Data; Response returns to the first site. Rectilinear traces, a moving signal and interpolated chip outlines show progress on the motherboard itself. The software journey is a schematic visual metaphor, not a claim of literal hardware execution. Reused line buffers update only with the scroll-driven trace cursor. Lab cartridges still share box geometry and belong to the same logic board. Selectors seek the existing timeline and focus the selected HTML dossier.

Portrait mode compresses local travel and temporarily widens the camera during the cover route. The buffer uses pixel budgets and a sustained-slow-frame downshift. The animated route opens in motion, and the engineering chapters link to a linear `?view=reading` alternative without WebGL. Route changes dispose of the renderer, timeline, ScrollTrigger, textures, and listeners.

Native scrolling remains the input for wheel, touch, keys, and links. The existing demand-driven RAF eases displayed progress toward the ScrollTrigger target over 650 ms. Direct chapter selection uses 1100 ms. Each transition ends on the exact target, and heading focus transfers at that point. Per the owner's explicit instruction, the cinematic homepage animates even when the OS reports reduced motion; `?view=reading` is the explicit no-motion alternative. Diagnostics expose target and displayed progress separately and flag when the scene has settled. Earlier pacing measurements describe the earlier interpolation revision.

The loading and live modes share the same dossier layout to keep the hero position stable. A preparation label occupies the visual stage until the live canvas is rendered, then the scene resolves over 1200 ms. The Arrival text starts its entrance in the initial document and retains it through hydration. `motion/text-transitions.ts` owns subsequent HTML masks, opacity and translation through Web Animations. Scroll boundaries select content; exits last 500 ms and entrances use 1000 ms masked headings, 850 ms supporting children and 55 ms staggering. The outgoing panel stays painted but inert until its exit completes. Fast input and reverse selection continue from the currently painted pose. No additional JavaScript animation loop or ScrollTrigger is introduced. The reading route avoids these animations; disposal cancels all animation groups. See `docs/MOTION_POLISH.md` for the text-teleport diagnosis and browser evidence.

Editorial routes use native CSS entrances and an IntersectionObserver for sections reached while reading. The observer animates opacity and translation and disposes on route changes. Already-visible content keeps its painted state at hydration.

The closing timeline reuses the authored Arrival rig, camera, part poses, and lighting. It aligns the lower parts, moves the ceramic cover behind the stack for clearance, and seats it from above. The latches close as the contact copy appears. The scene settles at 6.03 units. The remaining scroll updates the rail.

## Extension contract

- Keep one persistent canvas and one Core instance on the homepage. Extend named chapter ranges on the existing timeline. Each new cue should specify part positions, camera target, and the preceding clearance pose.
- Store authored copy, URLs, and evidence in typed content modules. Pass plain serializable chapter data across the client boundary. Independent case studies should render as Server Components and have no WebGL scene.
- Change typography, focus state, and chapter indicators at named boundaries. Keep chapter links native and synchronize their destinations with scroll progress. Resize should reframe the existing pose.
- Treat optical content changes as texture updates within a physical surface. Use approved stills and a native-anchor text equivalent for fallback. Review reduced-motion behavior with the owner before public release.
- Retain demand-driven rendering, the resolution policy, and explicit disposal. Profile before adding passes or large textures. Review keyboard navigation, direct chapter links, reload, reverse scroll, and context loss for each new cue.
