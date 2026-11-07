# Prototype architecture

The experimental branch is a standalone Next.js App Router app. Its only public experience is the three-act storyboard at `/`. The production build prerenders the headings, copy, figure, and chapter navigation.

| File | Ownership |
| --- | --- |
| `app/page.tsx` | Chapter order, semantic headings, and project content |
| `app/styles.css` | Editorial layout, sticky stage, stage register, static poster, and responsive composition |
| `components/storyboard.tsx` | Stage host, lazy loading, and motion preference lifecycle |
| `motion/storyboard-runtime.ts` | Renderer, camera, ScrollTrigger, navigation, accessibility state, and disposal |
| `motion/choreography.ts` | Shared, reversible part and camera timeline |
| `scene/core.ts` | Procedural geometry, materials, part pivots, and markings |
| `scene/display.ts` | Illustrated PGC-DHA display texture |

The enhanced layout uses a sticky studio within a finite scroll track. The renderer appends one canvas and retains one root assembly for the lifetime of the enhanced view. Scroll progress updates object transforms and DOM indicators directly. React owns the static structure.

The page initially serves a local SVG illustration and all three chapters in reading order. This layout also handles reduced motion, narrow landscape viewports up to 430 px tall, and unavailable or lost WebGL contexts. In static mode the chapter links point to native section anchors. The project description is available as HTML in either mode.

Run `npm ci` and `npm run dev` to preview the prototype. Use `npm run build` and `npm run start` to serve the production build locally.
