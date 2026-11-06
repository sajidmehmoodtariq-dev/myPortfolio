# Final creative and production audit

Prompt 06 preserves the Engineering Exhibit, including the approved hero, dark green material palette, technical labels, and orange spline. The review covered the design system, original brief, available reference frames, all seven homepage sections, and five published case studies.

## Visual review

| Area | Finding and disposition |
| --- | --- |
| Header and hero | Kept the hero framing, typography, and aperture composition. The entrance now leaves the copy legible throughout. Improved menu focus and short-viewport behavior without changing the header's visual direction. |
| Selected Work | Capped the section heading for the desktop editorial columns. Moved the spline clear of the introduction and corrected a Chromium depth overlap between the mock screen and its rear panel. Enlarged captions while preserving the alternating project layouts. |
| Inside the System | Preserved the supplied isometric render and established crop. Reserved the desktop scroll space before hydration, enlarged the caption, and routed the orange line clear of it at the compact desktop breakpoint. |
| Engineering Toolbox | Preserved the grouped grid, material treatment, and capability labels. Redirected the transition line away from the supporting copy. |
| About | Reviewed the text and timeline as they stack and expand across the six widths. The supplied biographical facts remain the basis of the copy. |
| Engineering Notes | Kept the editorial layout with a single availability message. Its reveal no longer dims readable content. |
| Contact | Preserved the final spline destination and CTA hierarchy. Confirmed that the layout and profile links remain usable in narrow and reduced-motion layouts. |

## Motion and media

- Hero and section motion share one lazy GSAP and ScrollTrigger registration. Each scene owns its media-query scope and reverts its triggers and styles on cleanup. Below-the-fold scenes register on proximity. Case-study entrance motion uses CSS, with a static reduced-motion mode.
- The desktop video follows scroll progress in either direction. The scene limits seeks to one in flight with at least 80 ms between seeks. It attaches the source near the section and releases it when reduced motion is enabled. Mobile and reduced motion use static compositions. Layer explanations work independently of playback, including with JavaScript disabled.
- The experience uses CSS, SVG, and the supplied renders. It creates no WebGL context, GPU textures, or continuous custom render loop.

## Performance measurements

Lighthouse 13.6.0 ran against the loopback production build with the reserved test origin configured. These are individual simulated lab runs.

| Route and preset | Performance / accessibility / best practices / SEO | LCP | TBT | CLS | Transfer |
| --- | --- | ---: | ---: | ---: | ---: |
| Homepage, mobile | 100 / 100 / 100 / 100 | 1.09 s | 47 ms | 0 | 326,402 B |
| Homepage, desktop | 100 / 100 / 100 / 100 | 0.29 s | 0 ms | 0 | 326,402 B |
| PGC-DHA case study, mobile | 100 / 100 / 100 / 100 | 0.92 s | 37 ms | 0 | 323,899 B |

In a separate cold-entry Chromium capture, the normal homepage loaded 191,774 B of encoded JavaScript across 10 requests. The reduced-motion homepage and PGC-DHA case study each loaded 146,805 B across eight requests. The GSAP-free paths requested 44,969 B less JavaScript. Homepage CSS was 12,508 B, and the two preloaded local variable fonts totaled 140,780 B. No cold-entry run requested the video. No layout shift was observed in those runs or when opening the architecture fragment directly. The unthrottled 390px homepage produced one 103 ms task in the 1.6-second sample, making mobile main-thread work a useful target for future device profiling.

The desktop H.264 scrub asset is 1,057,221 B at 1120 × 630 and 24 fps. The server returned 206 for a byte-range request. Desktop and mobile WebP posters are 23,578 B and 16,530 B. The 384px optimized Nudge image transferred as an 8,516 B WebP from the 166,384 B JPEG source. The 1200 × 630 social card is separate from the page rendering path. No production dependencies were added. The npm production dependency audit reported zero advisories at review time.

## Accessibility and browser coverage

- Chromium 158 covered 375 × 812, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 1920 × 1080. Screenshots captured all seven homepage sections at every width. The sweep found no document overflow or clipped project-screen frames after the fixes.
- Browser smoke covered the heading outline, fragment targets, native skip-link focus, Tab and Escape menu behavior, emulated touch navigation, architecture disclosure with Space and touch, forward and reverse video seeking, and live reduced-motion cleanup. The architecture disclosure remained usable with JavaScript disabled.
- Headless Firefox additionally checked the seven sections from 320 to 1920 pixels, desktop and mobile navigation, project routes, anchor targets, and the contact line endpoint. It passed the desktop video range, deferred loading, reverse seeking, and forced media failure checks.
- Axe reported zero automated violations in seven states, covering the desktop homepage, open mobile menu, and all five case studies. The brand link's accessible name now includes its visible label. Axe marked some layered-background contrast checks for manual review. A separate pixel review sampled eight text areas at 390, 1024, and 1440 pixels. The lowest sampled contrast was 5.32:1. The System caption at 1024 pixels measured 7.05:1 after moving the spline.
- Type checking, linting, and the production build passed. HTTP smoke covered the homepage, five project routes, project and note 404s, the social card, icon, robots policy, and sitemap. The configured build also verified route-specific canonicals, share metadata, and homepage profile structured data. The repository has no standalone automated unit test suite.

## Release limits

- The public hostname, verified public email, approved articles and portrait, and authentic captures for the four featured projects are pending. The source reference pack remains incomplete. Project-specific approvals and evidence are tracked in [Content verification](CONTENT_VERIFICATION.md).
- Real-device performance, Safari, 200% browser zoom, a screen-reader walkthrough, and a full manual contrast review remain open. The Lighthouse runs are local measurements. Field Core Web Vitals, including INP, require traffic on the public host.
- The checkout is ready for deployment review. The production origin is intentionally unset locally. See [Deployment](DEPLOYMENT.md) for the build, preview, crawl, and release steps.
