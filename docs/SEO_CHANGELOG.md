# SEO and usability changes

15 November 2026. The original audit was prepared locally without a release. The owner subsequently authorized reviewing, improving and pushing the changes to `main`, which is connected to Vercel production. The deployment must be verified before declaring the public sitemap fixed. Domain/DNS settings remain outside this release.

## Actual deficiencies and fixes

- Live production has no sitemap or robots route, and its homepage lacks a canonical and structured data. The preceding, undeployed migration supplies `/sitemap.xml`, `/robots.txt`, the permanent root canonical and accurate Person/WebSite data. This task preserves and extends that work rather than claiming it was already published.
- Homepage metadata now identifies Sajid's software engineering work and location. Each case study has a distinct descriptive title, description and canonical. No invented project outcomes were added.
- Six generated editorial social images provide the homepage and five projects with distinct 1200 × 630 PNG previews. They use factual existing content and are not product screenshots. Open Graph and Twitter large-image metadata reference the permanent domain.
- Case studies now include accurate Home → Selected Work → Project BreadcrumbList JSON-LD. Existing Person/WebSite data uses the configured GitHub and LinkedIn URLs. There are no fake articles, credentials, reviews or affiliation claims.
- Added a keyboard skip link and matching main targets, an immediately available reading-mode link, native accessible navigation names that match responsive visible labels, and a minimum 24-pixel narrow-screen navigation target. Existing chapter selectors, keyboard behavior, contact and credential actions remain.
- Responsive certificate delivery reduces the measured narrow-screen preview transfer by 88.7%; the full-resolution image and original PDF remain available. See `PERFORMANCE_AUDIT.md` for exact conditions and the cold-image latency tradeoff.
- Release review added preview-only `X-Robots-Tag: noindex, nofollow` HTTP headers. This extends preview indexing protection to original PDFs and generated images, where HTML metadata cannot apply. Production is explicitly checked for absence of that exclusion header. Certificate viewer Open Graph type is `website`, rather than presenting a document viewer as an editorial article.

## Crawlability and content

The homepage already server-renders its real narrative and direct links to all five projects, Credentials, About and Contact. These remain visible in the existing no-JavaScript linear layout. No hidden keywords, duplicate content blocks or layout redesign were introduced. All case studies retain project-specific HTML architecture, technical decisions, evidence notes and source references. Unpublished Notes routes remain 404 and absent from the nine-page sitemap. Article schema will only be appropriate when approved writing exists.

The same single persistent object, geometry, materials, camera keyframes, timeline and runtime are retained. Startup scheduling experiments were rejected after measured LCP regressions; no startup speed improvement is claimed. The established cinematic default remains in place even when the OS requests reduced motion, consistent with the owner's earlier explicit instruction. The visible reading-mode link provides a separate no-motion view without a WebGL canvas.

## Files changed

Application changes, including integration with the prepared migration:

- `content/identity.ts`: permanent root host (preceding migration).
- `content/seo.ts`: shared descriptive homepage metadata and social-image URLs.
- `app/layout.tsx`: metadata defaults, preview indexing protection, Person/WebSite JSON-LD, skip link.
- `app/page.tsx`: homepage canonical/social metadata and first-chapter reading action.
- `app/work/page.tsx`: index canonical/social metadata and main target.
- `app/work/[slug]/page.tsx`: project metadata, individual social cards, BreadcrumbList, main target.
- `app/certificates/[id]/page.tsx`: canonical/social metadata, responsive preview, main target.
- `app/notes/page.tsx`, `app/notes/[slug]/page.tsx`: metadata integration and main targets; no writing published.
- `app/sitemap.ts`, `app/robots.ts`: prepared nine-page sitemap and environment-specific crawl rules.
- `app/social/[slug]/route.tsx`: six static editorial social cards; unknown slugs return 404.
- `next.config.ts`: preview-only indexing headers across all response paths while retaining original PDF download headers.
- `components/storyboard.tsx`, `app/styles.css`: navigation names, bypass/reading controls and narrow-screen touch targets.

Verification/documentation:

- `scripts/check-domain-migration.mjs`: nine-page canonicals, robots, metadata, structured data and six distinct social-card responses.
- `scripts/check-seo-quality.mjs`: no-JavaScript HTML, links, unique metadata, headings, image alternatives, WCAG checks, skip/reading and unavailable-WebGL behavior.
- `scripts/check-storyboard.mjs`: native navigation selectors; responsive-preview sharpness plus full-resolution source/PDF integrity checks.
- `scripts/check-floating-motion.mjs`, `scripts/check-motion-polish.mjs`: selectors aligned with native accessible navigation names.
- `docs/SEO_AUDIT.md`, `docs/PERFORMANCE_AUDIT.md`, `docs/SEO_CHANGELOG.md`: findings, measurements and release follow-up.
- `docs/DEPLOYMENT.md`, `docs/DOMAIN_MIGRATION_AUDIT.md`: prepared migration/release notes.

No application dependency, original public asset, certificate PDF, geometry or animation source was changed. Raw test reports and screenshots are development-only ignored artifacts under `qa-artifacts/`.

## Validation

The checks parse actual server-rendered HTML with JavaScript disabled, validate JSON-LD types/URLs/breadcrumb order, decode social PNG dimensions and compare hashes, and exercise real Chrome rendering. This is local structured-data validation, not a claimed Google Rich Results certification. Live Google validation must use the published version after approval.

| Check | Result |
| --- | --- |
| TypeScript and zero-warning ESLint | Passed. |
| Optimized preview and production builds | Both passed with diagnostics disabled; the final local build is production. |
| `check-domain-migration.mjs`, preview and production | Both passed: all nine published pages, indexing rules, exact canonical/OG origins, JSON-LD and breadcrumb data, six distinct 1200 × 630 social PNGs, unknown-route exclusions and contact destinations. A deliberately unrelated preview hostname did not leak into public metadata. |
| `check-seo-quality.mjs`, final production | Passed: no-JavaScript content and project/chapter discovery, unique metadata, headings/alternatives, keyboard bypass, 1440/390/320-pixel WCAG checks, visible reading alternative and unavailable-WebGL fallback. |
| Storyboard chapter regression | Passed the Arrival/core suites at 1440 × 900, 768 × 900, 390 × 844 and 844 × 390; credential suites at 1440, 768 and 390 pixels; all five gallery exhibits on four sizes; engineering and closing suites on those sizes plus 320 × 568. Checks included intermediate camera/part poses, reverse/reload/resize, touch/keyboard selectors, viewer/source/PDF integrity, case-study routes, lab, About, reassembly and return-to-start. |
| Full `npm run qa:storyboard` release regression | Passed in one uninterrupted run after the owner's push authorization. The saved report contains 4 core, 3 credential, 4 gallery, 5 engineering and 5 closing viewport suites, followed by inherited motion preference, reload/reverse poses, unavailable WebGL/retry, forced context loss, deep links and no-JavaScript checks. |
| Lighthouse lab | Mobile 76 performance; desktop 90; both 100 accessibility/best practices/SEO, CLS 0. See the performance audit for limits and the unchanged mobile startup cost. |
| External destinations | Five public project repositories and both official certificate verification URLs returned HTTP 200. |

Two harness assertions required correction during the original audit. First, the old certificate assertion assumed every device must download a 2200-pixel preview; the replacement checks responsive sharpness/proportions and separately decodes the unchanged 2200 × 1700 original. The final startup assertion also measured the canvas during its existing 1.2-second CSS entrance; it now calls the existing `painted` helper to await completion before measurement. Those initial failures were first rechecked in isolation. The subsequent authorized release review reran the entire corrected script successfully without interruption; its complete report is `qa-artifacts/motion/report.json`. No application motion change was needed.

## Remaining opportunities and release actions

- Mobile WebGL startup is still a confirmed bottleneck: retained Lighthouse mobile TBT is 1,225 ms. Geometry preparation or texture deferral needs a separate measured investigation that preserves the visual result; speculative changes were not shipped here.
- Add only approved technical articles and genuine project evidence when available. Existing illustrative demonstrations stay identified as such. No new testimonials, performance metrics or Harvard degree claims were invented.
- The apex currently redirects to www. The requested canonical host is the apex. Review/approve the Vercel canonical-domain association before release; DNS and associations were not changed in this task. Profile links still pointing to the old `.me` host also require a separate approved external update.
- After approval, publish the prepared build and verify that the canonical host returns 200, `/sitemap.xml` and `/robots.txt` return 200, image URLs resolve and production has no `noindex` directive. Preview builds must retain `noindex` and disallow crawling.
- Submit `https://sajidmehmoodtariq.dev/sitemap.xml` in Search Console only after it returns 200. Inspect the homepage and representative project/certificate URLs and request indexing as appropriate. A Domain property covers apex and www; an existing www-only URL-prefix property does not cover the apex. [Search Console property scope](https://support.google.com/webmasters/answer/34592).
- Check Google's parsed structured data and URL inspection after release. No rankings, indexing date or rich results are promised. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- No production CrUX/INP dataset or physical-phone GPU measurements were available. Lab accessibility scores and emulated mobile checks do not establish complete manual conformance or universal frame pacing.
