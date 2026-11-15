# The Making of SMT

The portfolio tells Sajid Mehmood Tariq’s story through one modular device. The SMT Core opens to show how the work is made, becomes a display for the work, exposes the systems underneath it, and closes as the visitor reaches contact.

## Milestone 01

The cinematic prototype is preserved in Git checkpoint `2461c9a`. The homepage still plays Arrival, Disassembly, and Transformation with the same canvas, timeline, and geometry. This milestone adds the eight-chapter plan, typed content registries, five statically generated case-study scaffolds, and shared metadata.

The case studies are directly addressable at `/work/[slug]`. Each offers a sourced summary and repository links. Homepage chapter links continue to address the existing prototype. The case-study scaffolds use `noindex, follow` until their final copy, media, and canonical routes are approved.

## Portfolio structure

| Layer | Current foundation | Later work |
| --- | --- | --- |
| Home | App Router page with semantic HTML, one persistent Three.js scene, and GSAP scroll choreography | Eight scenes on the shared track, introduced in stages |
| Projects | Five evidence-backed data records and a shared server-rendered route | Reviewed case studies and accessible project media |
| Credentials | Two Harvard CS50 course-completion records | Original document intake and a reading-friendly exhibit |
| About and contact | Identity, education, owner-supplied freelance experience, and profile links | Compact chapters and confirmed contact channels |
| Writing | Typed registry with zero entries | Publish authored pieces after approval |
| SEO | Shared title template, author, metadata base, and project descriptions | Confirm the canonical host and indexable routes at release |

Keep Next.js App Router, TypeScript, direct Three.js, GSAP/ScrollTrigger, Geist, and the existing CSS. The prototype already owns its renderer and uses browser-only modules behind a client boundary. A renderer migration or utility CSS dependency would add work without helping this foundation.

The [creative direction](CREATIVE_DIRECTION.md), [storyboard](STORYBOARD.md), and [motion architecture](MOTION_ARCHITECTURE.md) define the continuous experience. The [content registry](CONTENT_REGISTRY.md), [asset manifest](ASSET_MANIFEST.md), and [implementation roadmap](IMPLEMENTATION_ROADMAP.md) define the next review points. The deployment branch and domain settings stay outside this milestone.

## Local validation

The Chrome storyboard regression suite passed forward and reverse travel, viewport fit, resize, reload, keyboard and touch input, automatic animation under reduced-motion emulation, and WebGL failure and recovery. The homepage, scene, motion, and dependency files match the checkpoint. All five case-study routes rendered with JavaScript disabled and returned distinct titles, descriptions, and evidence links. Unknown project slugs returned HTTP 404. A local preview is available with `npm run dev`. Open `/` for the prototype or `/work/pgc-dha` to inspect the route scaffold.
