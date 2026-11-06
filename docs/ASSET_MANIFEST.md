# Asset manifest

The supplied files are in `assets/`. Keep these source files outside the public runtime asset directory. The hero uses a separate, original CSS 3D assembly with an inline SVG schematic, based on the reference's layered silhouette and callout treatment. The same rendered geometry provides the settled fallback.

| Source | Inspection | Planned use |
| --- | --- | --- |
| `assets/start.jpg` | 2752 × 1536. Open isometric stack with a thin orange loop on dark green and no callouts. | Source for the system posters. |
| `assets/end.jpg` | 2752 × 1536. Related assembly with leader lines and labels. | Annotation spacing and exploded-depth reference. |
| `assets/video.mp4` | 1280 × 720, 10 seconds at 24 fps. The stack expands around 1–3 seconds, settles, then adds callouts around 5–6.5 seconds. | Source for both System animation encodes. |

No `references/` directory, separately identified original portfolio video, or five secondary inspiration recordings were found. The first video frame differs from `start.jpg`. Treat the still as a composition reference rather than assuming it is a literal video frame.

Labels baked into the renders describe the concept. Later exhibits require approved project screenshots or a sanitized recreation tied to verified features. Record dimensions, derivatives, ownership, and fallback for each published asset.

## Selected Work

The PGC-DHA, ResumeIQ, Ledger, and Folio scenes are HTML/CSS diagrams of source-verified implementation flows. The public trees reviewed did not include usable product screenshots for these four projects. ResumeIQ's repository hero PNG is a decorative illustration.

`public/work/nudge-notification.jpg` is the original 1080 × 2400 Android notification screenshot from Nudge's public repository. The Nudge case study links the [pinned source image](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/assets/screenshots/notification.jpg). Next Image serves responsive derivatives. The Client Job Portal remains in the content inventory pending clearance.

## Inside the System

| Runtime asset | Source and preparation | Size |
| --- | --- | --- |
| `public/system/assembly.mp4` | Full source video, H.264 Main at 1120 × 630 and 24 fps, keyframes every four frames, fast-start metadata, and audio removed | 2.16 MiB |
| `public/system/assembly-mobile.mp4` | Same frame sequence at 640 × 360 with stronger compression | 0.83 MiB |
| `public/system/assembly-opening.webp` | First decoded frame, for the initial media load | 14 KiB |
| `public/system/assembly.webp` | `start.jpg` resampled to 1280 × 714 | 23 KiB |
| `public/system/assembly-compact.webp` | Center crop of `start.jpg` at 800 × 600 for narrow screens | 16 KiB |

The short-keyframe encode preserves the supplied composition, lighting, orange orbit, and baked leader animation. Reconstructing in Three.js would allow independent layer controls and camera changes. The supplied images and video leave geometry, materials, and lighting underspecified, and a reconstruction would add asset authoring and runtime costs. A frame sequence would give deterministic random access while adding image requests and decoded frame memory. The single video plus a poster keeps the asset path smaller and simpler.

On the case-study index, a video source attaches after the visitor scrolls the figure into view. Seeking is quantized to source frames, coalesced on the next animation frame, and waits for each in-flight seek. The opening frame displays during load and on failure. The video retains its latest decoded frame during seeking. A desktop failure leaves the preallocated sticky chapter in place to avoid reflow. The compact video preserves the full frame so the baked labels stay within the concept render. The PGC-DHA disclosures supply the readable architecture text separately. The supplied `end.jpg` remains a composition reference.

## Closing chapters

The toolbox uses annotated HTML modules with the same technical grid and surface tokens as the previous exhibits. No separate toolbox reference recording or approved portrait was supplied. About uses type and an undated timeline. The contact diagram is inline SVG and CSS, and its center is the final point of the orange spline.

## Social preview

`public/social/portfolio.png` is a 1200 × 630 branded card composed from the system poster, portfolio typography, and the verified identity. The card is shared across the homepage and case studies. Its absolute URL is emitted when a public origin is configured.

## Credentials Archive

The owner supplied `CS50x_2.pdf` and `CS50AI_2.pdf` for public display. The runtime PDFs below are byte-for-byte copies. Poppler rendered the complete single-page originals at each target width, and Pillow encoded the resulting images as WebP at quality 92. The resulting images preserve the page edges, signature, QR code, and verification address.

| Runtime files in `public/credentials/` | Dimensions | CS50x / CS50 AI size |
| --- | --- | --- |
| `cs50x.pdf`, `cs50ai.pdf` | US Letter, landscape | 415 / 415 KiB |
| `cs50x-720.webp`, `cs50ai-720.webp` | 720 × 557 | 36 / 37 KiB |
| `cs50x-1440.webp`, `cs50ai-1440.webp` | 1440 × 1113 | 96 / 98 KiB |
| `cs50x-2200.webp`, `cs50ai-2200.webp` | 2200 × 1700 | 160 / 168 KiB |

The wide layout uses the 1440px preview. In the compact layout, the browser chooses between the 720px and 1440px variants based on the viewport and pixel density. The 2200px asset is requested only when the visitor opens the inspection viewer. The PDF is fetched when the visitor opens the original. The [credential registry](../src/content/credentials.ts) owns public document paths and official verification URLs.
