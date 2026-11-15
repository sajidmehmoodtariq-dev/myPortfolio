# Performance audit

Date: 15 November 2026. All measurements here are local lab results collected before the subsequently authorized release, not production field data. See `SEO_CHANGELOG.md` for release verification.

## Method

The baseline was the optimized local build containing the preceding prepared domain migration, before this task's SEO/accessibility/image changes. Chrome 157 and Lighthouse 13.6.0 ran on the same Windows development machine. Lighthouse mobile used its default simulated mobile/network/CPU configuration; desktop used its desktop preset. Baseline mobile was repeated three times. Browser profiling used 1440 × 900 and 390 × 844 CSS viewports with native inherited motion preferences and default DPR 1. The final WebGL regression uses a separate diagnostic build.

Native PerformanceObserver records captured LCP, layout shifts, long tasks and Event Timing. A 180-frame forward/reverse sweep sampled requestAnimationFrame intervals. Axe's own analysis tasks are excluded from final startup-task records. Event Timing samples from a few controlled clicks are **not field INP**. No CrUX/Search Console field export or RUM dataset was available; no field INP or Core Web Vitals pass is claimed.

## Retained production build

| Local Lighthouse mobile | Baseline run 1 | Baseline run 2 | Baseline run 3 | Retained build |
| --- | ---: | ---: | ---: | ---: |
| Performance score | 76 | 56 | 76 | 76 |
| Simulated LCP | 912 ms | 5,323 ms | 913 ms | 916 ms |
| Total blocking time | 1,186 ms | 1,212 ms | 1,205 ms | 1,225 ms |
| CLS | 0 | 0 | 0 | 0 |

The baseline LCP outlier demonstrates why a single score is insufficient. The retained build does not establish a WebGL startup speed improvement: mobile startup still blocks substantially on slower CPU assumptions. Its mobile accessibility, best-practice and SEO scores were each 100. These scores do not establish complete manual accessibility conformance or search ranking.

The retained desktop run scored 90 for performance and 100 for accessibility, best practices and SEO, with LCP 249 ms, total blocking time 264 ms and CLS 0. There is no matched baseline desktop Lighthouse result in this audit, so no desktop before/after improvement is claimed.

## Confirmed optimization retained

The certificate viewer previously downloaded the 2200-pixel preview regardless of the viewport. At 390 × 844 / DPR 1, the CS50x preview response encoded **164,334 bytes**. It now uses Next Image's responsive delivery with an explicit `sizes` value. The same test selected a 640-pixel response encoding **18,606 bytes**, an **88.7% reduction**. Other DPRs may select different sizes, so this is not a universal percentage.

The original 2200-pixel image remains available from its existing full-resolution link, and the original PDFs and preview assets are unchanged. Aspect ratio is preserved. First-time optimization can add server processing latency; the local cold response took about 145 ms versus 13 ms for the original static response. The retained benefit is reduced transfer size on narrow screens, not a fabricated claim of lower cold response latency. Vercel's image delivery/cache should be checked after an authorized release.

## Startup experiments rejected

The measured baseline mobile startup attributed roughly 2.7 seconds of simulated script work to the dynamic scene chunk. Native startup also contained a long task. Experiments split construction into browser-scheduled tasks and used parallel shader compilation. They preserved all geometry operations/material values and camera/choreography data, but were **not retained**:

| Experiment | Simulated mobile LCP | TBT | Decision |
| --- | ---: | ---: | --- |
| Asynchronous preparation, three runs | 4,655–4,704 ms | 746–793 ms | Reject LCP regression despite lower blocking. |
| More granular part-construction scheduling | 4,484 ms | 584 ms | Reject the same LCP tradeoff. |
| Waiting for the existing initial copy reveal | 4,602 ms | 842 ms | Reject added startup delay. |

The original runtime, geometry factory, camera and GSAP choreography were restored exactly. No mesh simplification, material reduction, DPR change, camera change or animation removal was used to raise a score. Investigation snapshots and results stay in ignored QA artifacts; they are not application code.

## Render and loading findings

The scene remains one persistent canvas with one assembly and one scroll authority. React does not update part transforms each frame. Rendering is demand-driven and stops on a settled pose. There is no added animation loop. Existing cleanup disposes the renderer, scene geometry/materials/textures, ScrollTrigger, timeline and listeners; context-loss/retry behavior is covered by regression tests.

The local baseline transferred about 350 KB of compressed JavaScript across the initial/runtime chunks, plus two self-hosted variable-font files totaling 140,780 bytes. Both 1440-pixel certificate scene textures load during initialization, totaling 198,550 encoded bytes. Fonts already use self-hosted Next font handling. These are recorded opportunities, not evidence that removing required Three.js code or reducing typography quality is safe. The added social-card generator runs on the server/build and does not add its image-rendering dependencies to the WebGL client bundle. Normal navigation does not request Open Graph images.

Native baseline LCP samples were 144 ms desktop and 132 ms mobile, with CLS 0. In the retained diagnostic browser sweep, desktop frame intervals had median 16.7 ms, p95 17.0 ms and max 33.1 ms; mobile had median 16.7 ms, p95 16.9 ms and max 33.4 ms. The sweep is artificial input on this development machine, not physical-phone frame pacing. Controlled interaction Event Timing maxima were 56 ms desktop and 40 ms mobile in that run; they are not production INP.

## Remaining work and limits

- WebGL initialization remains the main confirmed mobile startup cost. A future measured investigation could evaluate exact precomputed geometry delivery or off-main-thread preparation, while proving identical output. Those architectural changes were not introduced speculatively here.
- Certificate scene texture deferral might reduce unused initial transfer but could leave a document blank on fast/deep navigation. It was not introduced without a slow-network visual test.
- Field LCP/INP/CLS require sufficient production traffic or approved RUM instrumentation. No collection endpoint or telemetry dependency was added without an owner decision.
- Physical mobile devices and throttled on-device GPU behavior remain unmeasured. Lighthouse simulation and headless Chrome cannot establish universal smoothness.

## Evidence

Ignored `qa-artifacts/seo/baseline/`, `after/`, `final/` and `retained/` hold the Lighthouse JSON, browser resources, accessibility results, native Event Timing and frame samples. `after/` and intermediate `final/` files include rejected experiments and must not be mistaken for the retained build. Retained loading scores are in `retained/lighthouse-mobile.json` and `retained/lighthouse-desktop.json`. The certificate byte comparison uses `baseline/browser.json` and `retained/browser.json`.
