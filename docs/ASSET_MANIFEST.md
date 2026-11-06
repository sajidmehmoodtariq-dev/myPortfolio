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

The PGC-DHA, ResumeIQ, Ledger, and Folio scenes are HTML/CSS demonstrations with synthetic inputs. The public trees reviewed did not include usable product screenshots for these four projects. ResumeIQ's repository hero PNG is a decorative illustration. The demonstrations have distinct captions and no client records.

`public/work/nudge-notification.jpg` is the original 1080 × 2400 Android notification screenshot from Nudge's public repository. The Nudge case study links the [pinned source image](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/assets/screenshots/notification.jpg). Next Image serves responsive derivatives. The Client Job Portal is listed with public clearance pending.

## Inside the System

| Runtime asset | Source and preparation | Size |
| --- | --- | --- |
| `public/system/assembly.mp4` | Full source video, H.264 Main at 1120 × 630 and 24 fps, keyframes every four frames, fast-start metadata, and audio removed | 2.16 MiB |
| `public/system/assembly-mobile.mp4` | Same frame sequence at 640 × 360 with stronger compression | 0.83 MiB |
| `public/system/assembly-opening.webp` | First decoded frame, for the initial media load | 14 KiB |
| `public/system/assembly.webp` | `start.jpg` resampled to 1280 × 714 | 23 KiB |
| `public/system/assembly-compact.webp` | Center crop of `start.jpg` at 800 × 600 for narrow screens | 16 KiB |

The short-keyframe encode preserves the supplied composition, lighting, orange orbit, and baked leader animation. Reconstructing in Three.js would allow independent layer controls and camera changes. The supplied images and video leave geometry, materials, and lighting underspecified, and a reconstruction would add asset authoring and runtime costs. A frame sequence would give deterministic random access while adding image requests and decoded frame memory. The single video plus a poster keeps the asset path smaller and simpler.

One source attaches within 80% of a viewport of the figure with motion enabled. Seeking is quantized to source frames, coalesced on the next animation frame, and waits for each in-flight seek. Slow downloads or decoding can delay the first moving frame. The opening frame displays during load, the video retains its latest decoded frame during seeking, and the settled poster is shown on failure or with reduced motion. A desktop failure leaves the preallocated sticky chapter in place to avoid reflow. The compact video preserves the full frame so the baked labels stay within the concept render. The PGC-DHA disclosures supply the readable architecture text separately. The supplied `end.jpg` remains a composition reference.

## Closing chapters

The toolbox uses annotated HTML modules with the same technical grid and surface tokens as the previous exhibits. No separate toolbox reference recording or approved portrait was supplied. About uses type and an undated timeline. The contact diagram is inline SVG and CSS, and its center is the final point of the orange spline.

## Social preview

`public/social/portfolio.png` is a 1200 × 630 branded card composed from the system poster, portfolio typography, and the verified identity. The card is shared across the homepage and case studies. Its absolute URL is emitted when a public origin is configured.
