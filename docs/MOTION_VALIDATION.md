# Motion validation

The diagnostic production build was inspected in Chrome using the native document scroller. Each viewport has seven screenshots at 0%, 20%, 35%, 50%, 65%, 80%, and 100%. The captures and contact sheets are in `qa-artifacts/motion/`. The ignored `report.json` records ScrollTrigger progress, painted timeline progress, camera position and target, root identity and pose, all six part transforms in local and world space, projected bounds, and display opacity.

## Results

| Viewport | Captures | Largest projected extent over 21 framing samples |
| --- | ---: | ---: |
| 1440 × 900 | 7 | .962 |
| 768 × 900 | 7 | .973 |
| 390 × 844, mobile emulation | 7 | .993 |
| 844 × 390, short landscape | 7 | .826 |

An extent of 1 is the viewport edge. The camera, cover, optic, and logic assembly visibly change through the sampled states. The following points show the actual desktop camera and cover positions in world units.

| Scroll | Camera position | Cover position |
| --- | --- | --- |
| 0% | [6.97, 5.39, 7.79] | [0, .46, −.02] |
| 50% | [3.94, 4.07, 12.47] | [−.13, 2.08, −.01] |
| 100% | [1.03, .49, 10.94] | [0, 0, −.96] |

- The canvas, root, and all six part IDs persisted through each sequence. At least three part positions changed meaningfully between every pair of 0%, 50%, and 100%. Multiple layers also rotated independently.
- Backward scrolling restored the exact sampled transforms. Slow wheel input advanced monotonically. The End key reached the final pose, which held after input stopped.
- Reload restored the same 65% pose. Resize repainted the projection on the existing object. Keyboard chapter activation, destination heading focus, a direct chapter URL, mobile touch scrolling, and mobile tap navigation passed.
- Blocked WebGL with retry, simulated context loss, and disabled JavaScript all produced the expected fallback. The live runs reported no page or console errors.
- Chrome at the recording's 1838 × 1028 dimensions initialized the full-screen canvas automatically with reduced motion enabled and the former paused choice present in storage. The scene opened at 50%, restored that pose on reload, revealed the display at 100%, and returned to its original pose at 0%. Changing the browser preference during the test preserved the same scene instance.

The exploded frame used 32 draw calls in the diagnostic capture. Headless Chrome reported a 17 ms p95 frame interval in each viewport during the short programmed scroll after resize. This is a local smoke measurement. It does not establish performance on physical mobile devices.

Type checking, linting, and the regular production build passed. A separate Chrome smoke test advanced and reversed that build with one canvas and confirmed that its diagnostic listener was disabled.

## Reproduce

Run `npm ci` and `npx playwright install chromium`. Start with `npm run dev`, or build with `NEXT_PUBLIC_STORYBOARD_DIAGNOSTICS=1` before `npm run start`. In a separate terminal, run `npm run qa:storyboard`. `STORYBOARD_URL` selects a different loopback port and `STORYBOARD_BROWSER_CHANNEL=chrome` uses installed Chrome. The regular production build disables the diagnostic event.

## Remaining visual limits

The studio contact shadow is an approximation and the display floats slightly above it at the end of the turn. Secondary labels inside the project visualization are small on phone screens. The main project details remain available as HTML. The final project image is a technical schematic. Physical mobile hardware and other browser engines remain untested.
