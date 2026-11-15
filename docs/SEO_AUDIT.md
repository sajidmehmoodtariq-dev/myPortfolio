# SEO audit

Audit date: 15 November 2026. Initial findings were recorded before the SEO/UX changes in this task. The preceding domain migration is already present as uncommitted local work and is preserved.

## Confirmed production findings

Read-only HTTP checks against `https://sajidmehmoodtariq.dev` resolve to www. The homepage returns 200 but has no canonical tag or JSON-LD in the currently deployed HTML. `/sitemap.xml` and `/robots.txt` both return 404 on production. The Folio case study returns 200 with a www canonical and its own title/description. The sitemap file exists only in the prepared local migration; no migration deployment occurred because the owner explicitly prohibited it. The correct sitemap extension is `.xml`, not `.xm`.

The Vercel root-to-www association remains an external release prerequisite for the requested root canonical. This task does not change DNS/domain associations or deploy.

## Local build findings before this task's changes

The prepared migration already provides root-domain metadata, accurate Person/WebSite JSON-LD, route-specific canonicals, a nine-page sitemap and robots. Production and preview indexing settings were verified in the migration audit. This is the local baseline, not the currently deployed site.

The homepage's narrative, identity, location, education, five project names, original credential actions, About and Contact are real server-rendered HTML. All five project case studies have direct anchor URLs in that HTML. Chapter anchors link to Credentials, About and Contact. No duplicate SEO text or keyword block is needed. With JavaScript disabled the stylesheet's `scripting` media query exposes the full linear content. Case studies contain substantial HTML explanations, architecture, contribution, decisions, evidence and source links; no missing content was filled with invented claims. No approved articles exist; Notes stays 404 and is excluded from the sitemap.

Confirmed improvement gaps: the homepage metadata describes an interactive study without identifying the professional role; case-study titles contain project names without their descriptive category; no social-preview image is configured for the homepage or individual projects; no project breadcrumb structured data exists. The first animated chapter offers no visible direct reading-mode link, although later chapters do. These are metadata/usability improvements, not evidence that existing project content is uncrawlable.

Baseline axe checks found zero automated WCAG/best-practice violations on desktop/mobile Arrival, the mobile reading view, all five mobile case studies and a certificate viewer. This does not establish complete manual accessibility conformance. Existing visible focus styling, descriptive screenshot alternatives, certificate verification links, keyboard selectors and contact destinations are retained. The homepage deliberately animates under the inherited OS reduced-motion setting at the owner's earlier explicit request; the separate reading route is its no-motion alternative. That choice must not silently disable the cinematic experience again.

The initial axe tag subset did not include WCAG 2.1 Level A. Lighthouse's broader check then confirmed three mobile label-content mismatches: visible Start, Core and CS50 were omitted from the corresponding Arrival, Disassembly and Credentials accessible names. The final navigation uses its native visible text as its accessible name, so responsive labels and names stay aligned without overriding ARIA labels. Full chapter names remain available as titles. The final axe run includes WCAG 2.1 A as well. A keyboard bypass link and immediately available reading-mode action are small usability improvements; the initial automated score alone did not establish these were already present.

## Performance audit scope

Before changing the application, a local optimized-build browser run captured resource transfers, LCP, CLS, long tasks, interaction Event Timing and a 180-frame forward/reverse sweep. Mobile Lighthouse was run separately to avoid competing with the browser sweep. The measured critical startup and resource findings, limitations and follow-up results are recorded in `PERFORMANCE_AUDIT.md`. Geometry, camera cues, materials, DPR and scene timelines are outside the permitted optimization scope unless measurements justify a change; none is altered for an arbitrary score.

Detailed final implementation, validation and release follow-up are recorded in `SEO_CHANGELOG.md`. Raw evidence is development-only under ignored `qa-artifacts/seo/`.

## Additional confirmed checks

The full final WCAG tag set also identified a too-small Lab navigation target at a 320-pixel viewport. A scoped 24-pixel minimum width corrects that target without changing the chapter layout. Final automated accessibility checks cover the narrow viewport as well as desktop and conventional mobile sizes.

Read-only HTTP checks returned 200 for all five configured public GitHub repositories and both exact official CS50 verification URLs. These checks confirm destination availability, not a new audit of every line of project source. Existing source-derived claims and evidence labels were preserved.

The subsequent authorized release review found that preview indexing protection covered HTML metadata and robots rules, but `next.config.ts` only configured PDF attachment headers. Preview document/image responses therefore lacked their own HTTP indexing directive. Preview-only `X-Robots-Tag: noindex, nofollow` now covers all paths, including PDFs and social images. Build-mode tests check both its preview presence and production absence. Certificate viewers also use the Open Graph `website` type to describe their actual document-viewing role.
