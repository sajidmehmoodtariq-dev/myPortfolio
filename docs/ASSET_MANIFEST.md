# Asset manifest

## Current prototype

| Asset | Location and use | Status |
| --- | --- | --- |
| SMT Core | `scene/core.ts` generates the ceramic cover, optic, bezel, logic plate, chassis, and base. | Current live geometry. Layer identities and pivots carry forward. |
| Cover and chip markings | Canvas textures generated in `scene/core.ts`. | Current live assets with anisotropic sampling. |
| Selected Work displays | `scene/display.ts` redraws one 1536 × 947 texture on the existing optic. | Four labeled technical illustrations cover PGC-DHA, ResumeIQ, Ledger, and Folio. The PGC-DHA view contains no institutional records. |
| Engineering overlays | `scene/engineering.ts` builds the request lines, marker, and three Lab cartridges in the persistent scene. | Authored procedural geometry. The Lab cartridges share mesh geometry. The trace uses no recorded institutional data. |
| Nudge Android capture | `public/work/nudge-notification.jpg`, the original 1080 × 2400 JPEG retained from the legacy portfolio and shown inside the Nudge exhibit. | Unmodified image file. SHA-256 `1a572088aa2a986e3308cb586988a908ed53ebb68f778c94add458b1aa055114`. The companion lifecycle diagram is authored. [Pinned repository capture](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/assets/screenshots/notification.jpg). |
| CS50 course-completion originals | `public/credentials/cs50x.pdf` and `public/credentials/cs50ai.pdf`, copied byte for byte from owner-approved archive commit `95e4a24`. | Both are single-page, 792 × 612 pt landscape PDFs. The full-document viewer provides them as downloads. |
| CS50 page previews | `public/credentials/cs50x-1440.webp` and `public/credentials/cs50ai-1440.webp`, with `-2200.webp` counterparts for the viewers, from the same archive. | Full-page Poppler derivatives at 1440 × 1113 and 2200 × 1700 pixels. The scene plane uses the exact 792:612 ratio. |
| Studio lighting | `motion/storyboard-runtime.ts` generates the reflection environment and soft shadow. | Current one-time environment bake and one contact-shadow plane. |
| Static illustration and site icon | `public/core-poster.svg` and `app/icon.svg`. | Current fallback and favicon. |
| Geist and Geist Mono | Bundled `geist` package imported from `app/layout.tsx`. | Current local typography. |
| Four WebP atlases | `public/storyboard/atlas-0.webp` through `atlas-3.webp`. | Present in the checkpoint and unreferenced by the app. Review provenance and purpose before use. |

The local `qa-artifacts/` captures are test evidence. They are excluded from version control and are separate from the public assets.

## Case-study evidence

| Asset | Provenance |
| --- | --- |
| PGC-DHA and ResumeIQ evidence plates | Responsive HTML using illustrative content. The PGC-DHA record identifier is fictional. |
| Ledger execution comparison | Responsive HTML showing two controlled Python runs. The source uses UTF-8 and LF line endings with a final newline. The displayed output and SHA-256 digests were computed locally. |
| Folio sample PDF | `public/work/folio-cache-notes.pdf`, an original two-page sample released under CC0 1.0. Page 1 contains the verified excerpt. The adjacent answer is authored. |
| Nudge reminder entry | `public/work/nudge-entry.jpg`, an unchanged 1080 × 2400 original. Git blob `c0d98044f1f89e9833ed973710ab743619f1e7d3`. [Pinned Android capture](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/assets/screenshots/setting_a_reminder.jpg). |

The Nudge case study also reuses the notification capture above, whose Git blob matches the pinned source. Both images have responsive derivatives and link to their originals.

## Intake for later chapters

| Asset | Available evidence | Intake requirement |
| --- | --- | --- |
| Additional project captures | Selected Work contains four labeled illustrations and the Nudge capture. | Review rights-cleared imagery before replacing an illustration. Remove private records, credentials, and identifiers. |
| Inside the System diagram | Pinned PGC-DHA sources. | Author a synthetic client/API/permissions/data flow and provide equivalent HTML. |
| Lab media | Public repository evidence for candidate experiments. | Confirm selection, then capture short examples with transcripts or descriptions as appropriate. |
| Portrait and contact media | Public profile links only in this branch. | Obtain an approved portrait if wanted and confirm any public email address. |
| Eight-chapter fallback stills and social card | Assembled illustration and the two full-page credential previews. | Capture approved poses, supply useful text equivalents, and add social metadata at release. |

## Document inspection

Poppler opened and rendered both complete originals before import. The pages preserve the margins, recipient, signature, QR code, and printed verification URL. The archived files retain their original permissions and bytes. The static `/certificates/[id]` routes show the full page and provide both the high-resolution image and original PDF without relying on an embedded PDF plugin.

- CS50x SHA-256 `3b7c36811d0a6a2a8550daa1a621b47c45ac6f554b014dbfe4c74f8761066b68`
- CS50 AI SHA-256 `c27dbf44a03ef08a929e8ef318ee303e072ecfa7b73794582517b154a793491d`
