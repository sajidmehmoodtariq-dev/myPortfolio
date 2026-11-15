# Selected Work QA

## Production browser run

Chrome 157.0.8103.39 ran the production build with the storyboard diagnostics flag. The regression suite covered 1440 × 900 desktop, 768 × 1024 tablet, 390 × 844 touch emulation, and 844 × 390 short landscape. It captured the archive handoff, all five project holds, the first inter-project handoff, and the cutaway exit in each viewport.

- ScrollTrigger, timeline, and painted progress agreed within 0.001 on the normalized track. Every project kept the same root and six part IDs. Reverse scrolling reproduced the measured forward poses exactly.
- The optic was dark at each project swap and fully lit at each exhibit stop. At the final pose the optic had lifted, the display was dark, and the logic plate was visible. The exit stops at this pose.
- Keyboard and touch selection updated the active project and focused its heading. Previous and next controls worked in both directions. Direct Nudge entry selected the correct pose. The work index linked to all five case studies, every route returned HTTP 200, and the tested Folio case study returned to its exhibit.
- Case-study controls were clickable in each viewport and the page had no horizontal overflow. The initial short-landscape test found the footer covering project actions. The compact layout brought the controls back above it.
- Earlier scenes passed regressions for pinning, resize, scroll restoration, the learning archive, WebGL loss and retry, and linear HTML without JavaScript.
- Typecheck, lint, and production build passed.

## Desktop pose samples

| Project | ScrollTrigger progress | Camera position | Optic local position | Draw calls |
| --- | --- | --- | --- | --- |
| PGC-DHA | 54.17% | [1.37, 0.91, 10.99] | [0, 0.250, 0] | 27 |
| ResumeIQ | 63.19% | [−0.70, 1.20, 10.87] | [0, 0.281, 0] | 27 |
| Ledger | 72.22% | [1.72, 0.73, 10.85] | [0, 0.225, 0] | 27 |
| Folio | 81.25% | [−1.04, 1.01, 11.09] | [0, 0.290, 0] | 27 |
| Nudge | 90.28% | [0.98, 0.90, 11.07] | [0, 0.245, 0] | 27 |
| Cutaway | 100% | [3.52, 2.20, 10.65] | [0, 0.570, −0.240] | 26 |

## Frame pacing

A dedicated 240-interval forward and reverse sweep measured p95 at 17.2 ms on 390 × 844, and 17.1 ms on 768 × 1024, 1440 × 900, and 1920 × 1080. The browser recorded no long tasks. Each viewport had 9–11 intervals over 25 ms, with a worst interval of 50.1 ms. The shorter regression sweep measured p95 at 33–34 ms. These headless Chrome runs show occasional missed frames and do not establish pacing on physical phones.

Captures and the full diagnostic report are generated in the ignored `qa-artifacts/milestone-04/` and `qa-artifacts/motion/report.json` paths. The illustrations are intentionally schematic. On small screens the in-display annotations are secondary to the readable HTML summaries and case-study links.
