# Prototype QA

The production build was served locally and checked in Chromium at 1440 × 900, 768 × 900, and 390 × 844. Captures are stored in `qa-artifacts/<width>/` at 0%, 15%, 30%, 50%, 70%, 85%, and 100%. Each viewport also has a contact sheet. The fallback captures and machine-readable report are at the root of `qa-artifacts/`.

## Checks

- `npm run typecheck`, `npm run lint`, and `npm run build`.
- One canvas retained its DOM identity through every sampled frame. Canvas images were distinct at 25%, 50%, and 75%.
- The sampled reverse path was compared with the forward path. The threshold is 0.3% of pixels with any RGB channel differing by more than 12 levels.
- Visual inspection covered the three viewport widths, including the closed case, exposed logic board, and cover traveling into its rear seat.
- Native keyboard scrolling, chapter link activation, destination focus, compact touch scrolling, reduced motion, and simulated WebGL failure were exercised in the browser.
- The assembled poster and all chapter copy remained available without live 3D.

## Measurements

The final run captured 21 milestone frames. No reverse sample exceeded the pixel-difference threshold.

| Viewport | Canvas pixels | Scroll frame interval, p95 | Chromium JS heap sample |
| --- | ---: | ---: | ---: |
| 1440 × 900 | 420,204 | 133 ms | 20 MiB |
| 768 × 900 | 280,423 | 83 ms | 11 MiB |
| 390 × 844 | 144,137 | 34 ms | 11 MiB |

The frame interval is from a 45-step scroll through the full track. Software rendering was visibly slowest at the desktop width.

## Reproduce

1. Run `npm ci`, then `npx playwright install chromium`.
2. Run `npm run build` and start the build with `npm run start`.
3. Run `npm run qa:storyboard`. Set `STORYBOARD_URL` for a different local URL, or `STORYBOARD_BROWSER_CHANNEL=chrome` to use installed Chrome.

## Known limitations

The display presents an illustrated project schematic. Small secondary labels are clearest at desktop scale. The compact view keeps the project features readable as HTML. Reflections and the grounding shadow approximate studio lighting. Performance and memory measurements use headless Chromium with SwiftShader and do not establish hardware-accelerated frame rates or GPU memory use.
