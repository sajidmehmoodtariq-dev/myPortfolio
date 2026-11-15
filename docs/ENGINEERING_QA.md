# Engineering chapters QA

The engineering trace follows the source path recorded in the content registry. Local content drives the request diagram and Lab illustrations. The source links point to inspected repository revisions. [Content registry](CONTENT_REGISTRY.md).

## Exposed motherboard refinement

The owner requested removing the floating lid from Inside the System and making the activity happen on the motherboard. The existing optical interface and bezel now stow under the PCB, which remains the uppermost working surface. The camera frames it more closely. The same parts return for Lab and final reassembly.

The previous full-layer rectangle and off-board connector route were replaced by five chip-level outlines, small status LEDs, sixteen routed trace segments and a scroll-controlled signal. Completed traces light in cyan as the request advances. The trace is a child of `logic-assembly`, so it shares the PCB's transforms. Highlight weights interpolate with the master timeline cursor. No timer, particle effect, extra canvas or independent animation loop was added. This is an illustrative software request path represented on the board; source-derived API descriptions are unchanged.

`scripts/check-motherboard.mjs` captures all six request states and checks chip/cover clearance, shared object identities, board parenting, viewport framing, reverse poses, direct selection, Lab exit and exact final reassembly. Evidence and the browser recording are saved under ignored `qa-artifacts/motherboard/`. The earlier measurements below describe the preceding layer-trace composition.

The production Chrome run passed at 1440 × 900, 768 × 1024, 390 × 844 and 844 × 390. All 24 request captures kept the motherboard above the glass and bezel and the complete assembly inside the viewport. Five distinct signal locations were recorded, with Response returning to Interface. Reverse selections restored the same signal and component poses. The Lab and finale retained the same object hierarchy; finale component positions and rotations matched Arrival exactly. Browser inspection found no console exceptions or horizontal overflow. Type checking, lint and production build passed. Phone and tablet evidence uses browser emulation.

## Browser verification

Chrome captured all nine engineering cues at 1440 × 900, 768 × 1024, 390 × 844, 844 × 390, and 320 × 568. Forward and reverse samples matched across the camera, parts, request marker, and cartridge positions. All nine cues kept the original canvas, assembly, and six part identities. The request marker returned to the interface pin on the response step.

The checks exercised keyboard and touch selection, heading focus, source-link hit targets, the jump from the request trace into the Lab, and the reading view’s return to animation. The reading route exposed the complete HTML list with zero canvases. Browser inspection found no horizontal overflow at the five tested sizes. Visual review led to smaller framing on short portrait screens and tighter navigation on short landscape screens.

Per-cue screenshots and the measured transforms are in the ignored `qa-artifacts/milestone-06/` and `qa-artifacts/motion/report.json` paths.

## Frame pacing

The production Chrome profiler collected 240 frame intervals per viewport over the complete forward and reverse track. The table uses the 92 intervals per viewport whose endpoints both fell inside the engineering chapters.

| CSS viewport | Engineering p95 | Longest engineering interval |
| --- | ---: | ---: |
| 390 × 844 | 16.9 ms | 17.5 ms |
| 768 × 1024 | 16.8 ms | 16.9 ms |
| 1440 × 900 | 16.9 ms | 17.3 ms |
| 1920 × 1080 | 17.0 ms | 17.8 ms |

The sweep registered no long tasks. These measurements describe headless Chrome on the development machine. Physical phone performance remains unmeasured. The profiler output is under the ignored `qa-artifacts/refinement/milestone-06/` directory.
