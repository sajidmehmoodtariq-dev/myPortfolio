# Asset manifest

The supplied files are in `assets/`. Keep these source files outside the public runtime asset directory. The hero uses a separate, original CSS 3D assembly with an inline SVG schematic, based on the reference's layered silhouette and callout treatment. The same rendered geometry provides the settled fallback.

| Source | Inspection | Planned use |
| --- | --- | --- |
| `assets/start.jpg` | 2752 × 1536. Open isometric stack with a thin orange loop on dark green and no callouts. | Source for the system posters. |
| `assets/end.jpg` | 2752 × 1536. Related assembly with leader lines and labels. | Annotation spacing and exploded-depth reference. |
| `assets/video.mp4` | 1280 × 720, 10 seconds at 24 fps. The stack expands around 1–3 seconds, settles, then adds callouts around 5–6.5 seconds. | Source for the desktop system animation. |

No `references/` directory, separately identified original portfolio video, or five secondary inspiration recordings were found. The first video frame differs from `start.jpg`. Treat the still as a composition reference rather than assuming it is a literal video frame.

Labels baked into the renders describe the concept. Later exhibits require approved project screenshots or a sanitized recreation tied to verified features. Record dimensions, derivatives, ownership, and fallback for each published asset.

## Selected Work

The PGC-DHA, ResumeIQ, Ledger, and Folio scenes are HTML/CSS demonstrations with synthetic inputs. The public trees reviewed did not include usable product screenshots for these four projects. ResumeIQ's repository hero PNG is a decorative illustration. The demonstrations have distinct captions and no client records.

`public/work/nudge-notification.jpg` is the original 1080 × 2400 Android notification screenshot from Nudge's public repository. The Nudge case study links the [pinned source image](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/assets/screenshots/notification.jpg). Next Image serves responsive derivatives. The Client Job Portal is listed with public clearance pending.

## Inside the System

| Runtime asset | Source and preparation | Size |
| --- | --- | --- |
| `public/system/assembly.mp4` | First 7.25 seconds of the source clip, H.264 Main at 1120 × 630 and 24 fps, keyframes every six frames, fast-start metadata, and audio removed | 1.01 MiB |
| `public/system/assembly.webp` | `start.jpg` resampled to 1280 × 714 | 23 KiB |
| `public/system/assembly-compact.webp` | Center crop of `start.jpg` at 800 × 600 for narrow screens | 16 KiB |

The short-keyframe encode preserves the supplied composition, lighting, orange orbit, and baked leader animation. Reconstructing in Three.js would allow independent layer controls and camera changes. The supplied images and video leave geometry, materials, and lighting underspecified, and a reconstruction would add asset authoring and runtime costs. A frame sequence would give deterministic random access while adding image requests and decoded frame memory. The single video plus a poster keeps the asset path smaller and simpler.

The desktop source attaches within 400px of the viewport and only with motion enabled. Seeking is quantized to source frames, coalesced to the newest target, spaced by at least 80ms, and waits for each in-flight seek. Browser decoding and slow networks may delay the first moving frame. The poster remains in place until media is ready and returns on failure. A desktop decode or load failure can leave the native sticky chapter in place with the poster. Compact and reduced-motion views load only the relevant poster. The baked labels are kept within the concept render. The PGC-DHA disclosures use independently verified source text. The supplied `end.jpg` is a reference for the spacing of callouts in the final pose.

## Closing chapters

The toolbox uses annotated HTML modules with the same technical grid and surface tokens as the previous exhibits. No separate toolbox reference recording or approved portrait was supplied. About uses type and an undated timeline. The contact diagram is inline SVG and CSS, and its center is the final point of the orange spline.
