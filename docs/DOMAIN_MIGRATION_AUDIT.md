# Domain migration audit

Date: 15 November 2026.

The migration is implemented and verified locally. It has **not** been committed, pushed or deployed. DNS, Vercel domain associations, external profile settings and environment variables were not changed. The existing production deployment remains unchanged.

The permanent canonical origin is **https://sajidmehmoodtariq.dev**, without www. `content/identity.ts` remains the single production source of truth. The existing root `metadataBase` reads it; relative page canonicals and Open Graph URLs resolve against it. No competing environment variable or component-level origin configuration was introduced. Vercel preview hostnames cannot override it.

## Findings and corrected references

The baseline current checkout contained **zero expired `.me` portfolio references** in source or public assets. The remaining inconsistency was the www variant of the new domain:

| Location | Before | Prepared result |
| --- | --- | --- |
| `content/identity.ts`, `portfolioIdentity.siteUrl` | `https://www.sajidmehmoodtariq.dev` | `https://sajidmehmoodtariq.dev` |
| `docs/DEPLOYMENT.md`, current canonical-host guidance | www was described as canonical, with the root redirecting to www | Root is the intended canonical origin; the existing external redirect is explicitly documented as pending follow-up |
| Five case studies' generated canonical and Open Graph URLs | Inherited the www metadata base | Inherit the root metadata base and retain their own `/work/<slug>` paths |
| Prepared Notes metadata | Inherited the www metadata base | Inherits the root base; unpublished Notes still return 404 |

Homepage, work-index and certificate canonicals were absent rather than stale. They now have explicit route-specific canonical and Open Graph URLs. Sitemap, robots and Person/WebSite structured data were also absent; minimal URL-bearing SEO outputs were added to satisfy migration verification. No application design, scene, content registry evidence, motion or styling was changed.

## Every file modified or added

| File | Change |
| --- | --- |
| `content/identity.ts` | Changed the existing central site URL to the root origin. GitHub and LinkedIn destinations are unchanged. |
| `app/layout.tsx` | Kept the existing metadata base; added default social-card metadata, production/preview indexing directives and root-origin Person/WebSite JSON-LD. No homepage canonical is inherited by all pages. |
| `app/page.tsx` | Added the homepage's canonical and Open Graph URL. |
| `app/work/page.tsx` | Added the work index's own canonical, Open Graph URL and description. |
| `app/certificates/[id]/page.tsx` | Added distinct certificate-viewer canonical and Open Graph URLs. Original PDF and verification destinations are untouched. |
| `app/notes/page.tsx` | Added a matching Open Graph URL for the existing Notes canonical. Empty Notes remain unpublished. |
| `app/sitemap.ts` | Added registry-driven entries for the nine published pages, all on the root origin. |
| `app/robots.ts` | Added the root-origin sitemap reference; production allows crawling and preview builds disallow crawling. |
| `scripts/check-domain-migration.mjs` | Added browser checks against generated production and preview metadata. |
| `docs/DEPLOYMENT.md` | Updated canonical-host guidance and recorded the release hold and external redirect follow-up. |
| `docs/DOMAIN_MIGRATION_AUDIT.md` | This audit, findings, verification results and external follow-up. |

The existing `app/work/[slug]/page.tsx` and `app/notes/[slug]/page.tsx` already generate distinct relative canonicals and Open Graph URLs; they required no edits.

## Search and asset coverage

The case-insensitive search covered tracked and non-ignored application source, configuration, content, scripts, documentation, public assets and local settings. Searches included the old host, www and protocol variants, the username, literal `.me` occurrences and Vercel deployment hosts. GitHub repository paths and LinkedIn URLs were classified separately and preserved. JavaScript properties and unrelated text containing `.me` were not treated as expired domains.

The asset/settings pass inspected 91 source/config paths at that stage, then the added audit and test files were included in the final search. Dependencies, generated build output, Git internals and ignored QA/history backups were excluded from direct source modification. Generated HTML and crawler output were inspected separately after builds.

All **14 public assets** were compared with release commit `a9f6374` using SHA-256 and remain byte-for-byte identical:

- Both original Harvard certificate PDFs: extracted text, document metadata and link annotations were inspected with the bundled PDF tooling. No old portfolio host was found.
- The four faithful certificate previews were preserved.
- `public/work/folio-cache-notes.pdf`: both pages, metadata and annotations were inspected; no old portfolio host was found.
- Both original Nudge screenshots: image metadata and visible content were inspected; no old portfolio address was found.
- Four storyboard atlases: image metadata and visible frames were inspected; they contain the Core/product artwork, with no old portfolio address.
- `public/core-poster.svg`: source was searched and preserved.

No source-controlled standalone social-preview generator/image, downloadable resume, web manifest or pre-rendered HTML source required regeneration. No binary, original third-party certificate or authentic screenshot was edited. Twitter uses a summary card; no new share-image asset was fabricated.

## Local environment and Vercel variables

`.env.local` is the only local environment file present. It contains the generated `VERCEL_OIDC_TOKEN` variable; only its name and the absence of an outdated domain were recorded. Its value was neither printed nor changed. `.env` and `.env.production` are absent.

Read-only `vercel env ls` inspection reported **no configured project environment variables** for `smt-engineering-exhibit`. There is no configured `SITE_URL`, `NEXT_PUBLIC_SITE_URL` or authentication callback variable requiring manual replacement. No new variable is required: the existing typed identity configuration is authoritative. Vercel's system/preview host variables do not supply the canonical origin.

The app has no authentication callback routes, runtime CORS allowlist or portfolio-domain API endpoint configuration to migrate. Authentication and API examples inside case studies describe the separate source projects and were not altered.

`.vercel/project.json`, `.gitignore`, `.vercelignore`, `next.config.ts` and package/config files were checked. No old-domain change was needed there. No CI/CD configuration is present in this checkout. `.env.local` and `.vercel/` remain ignored.

## Generated SEO verification

All nine published routes returned 200 from a **local optimized production server**, with one distinct canonical and matching Open Graph URL each:

| Route | Canonical origin and path |
| --- | --- |
| `/` | `https://sajidmehmoodtariq.dev/` |
| `/work` | `https://sajidmehmoodtariq.dev/work` |
| `/work/pgc-dha` | `https://sajidmehmoodtariq.dev/work/pgc-dha` |
| `/work/resumeiq` | `https://sajidmehmoodtariq.dev/work/resumeiq` |
| `/work/ledger` | `https://sajidmehmoodtariq.dev/work/ledger` |
| `/work/folio` | `https://sajidmehmoodtariq.dev/work/folio` |
| `/work/nudge` | `https://sajidmehmoodtariq.dev/work/nudge` |
| `/certificates/cs50x` | `https://sajidmehmoodtariq.dev/certificates/cs50x` |
| `/certificates/cs50-ai` | `https://sajidmehmoodtariq.dev/certificates/cs50-ai` |

Next.js serializes the root canonical/OG address without the trailing slash; URL normalization confirms it identifies the same homepage. The sitemap uses the equivalent slash-terminated homepage URL.

Further results:

- The sitemap contains exactly nine unique, valid published URLs. Unapproved Notes and unknown routes remain 404 and are not listed.
- Robots references `https://sajidmehmoodtariq.dev/sitemap.xml`.
- Person/WebSite `url`, `@id` and publisher references use the root domain. `sameAs` retains the exact GitHub and LinkedIn URLs.
- Twitter summary-card metadata is present on all nine pages, with no stale image or website URL.
- Homepage GitHub and primary LinkedIn contact links match the previous approved destinations.
- Generated link/resource metadata contained no HTTP mixed-content destinations, repeated protocol prefixes, malformed URL paths, old portfolio domain or www canonical host.
- Both production and preview builds were generated with `VERCEL_URL=temporary-preview.vercel.app`. All canonical, Open Graph, JSON-LD and sitemap URLs still used the permanent root origin.
- Production emitted `index, follow` and `Allow: /`. Preview emitted `noindex, nofollow` and `Disallow: /` while retaining the correct canonical origin. These were local build-mode tests, not Vercel deployments.
- The last generated local build is the production version, not the preview/noindex version.

`npm run typecheck`, `npm run lint` and `npm run build` passed. `scripts/check-domain-migration.mjs` passed against both optimized build modes, inspecting 18 page responses in total. Final source and generated-output searches found no outdated production references.

Development-only evidence is under ignored `qa-artifacts/domain-migration/`: `repository-assets-environment.json`, `generated-seo.json`, `generated-seo-preview.json` and local screenshots. No secrets are stored in those reports.

## Historical references deliberately retained

There were no intentional `.me` history passages in the baseline application/docs that needed preservation. This audit now records the expired host and old www configuration only as migration findings and external follow-up; they are not current application URLs. Ignored Git bundles, previous QA reports and repository history remain unchanged as historical records. Their old URLs are not deployed application configuration.

## External follow-up — unchanged

| Service/setting | Read-only observation | Follow-up for a later authorized release |
| --- | --- | --- |
| Active Vercel project `smt-engineering-exhibit`, root domain | `sajidmehmoodtariq.dev` currently redirects to `www.sajidmehmoodtariq.dev` with 308 | Review and reverse the redirect so www redirects to the intended root canonical. Do not leave the canonical destination redirecting away. DNS/domain associations were explicitly out of scope and were not changed. |
| GitHub public profile website (`blog`) | `sajidmehmoodtariq.me` | Update the website field to `https://sajidmehmoodtariq.dev`. The GitHub username/profile URL is unchanged. |
| GitHub `myPortfolio` repository About website (`homepage`) | `https://www.sajidmehmoodtariq.dev/` | Update the website field to the root origin when the migration is released. |
| Legacy Vercel project `portfolio-8iwy` | Still associates `sajidmehmoodtariq.me`, `www.sajidmehmoodtariq.me` and `portfolio-8iwy.vercel.app`; connected to the separate `portfolio` repository | Review separately if desired. This migration did not remove domains or modify that unrelated deployment. Domain availability/expiry was not inferred from the association alone. |
| LinkedIn website field, Search Console properties, social directories and cached previews | Not authenticated or verified in this audit | Review manually for old website addresses; no claim is made that these currently contain a stale URL. The approved LinkedIn contact URL remains unchanged. |

No Vercel environment variable needs manual updating based on the inspected project. The pending Vercel action is a **domain redirect setting**, not an environment variable.

## Release status

Source and generated SEO now consistently use the requested root origin. Production is **not updated** by this work. No push or deployment was performed because the migration brief explicitly prohibits deployment without further permission. The existing main-branch release workflow is documented, but it must only run after the owner authorizes release and the external canonical-domain redirect has been reviewed.

Subsequent release authorization, 15 November 2026: the owner requested review, improvements and a push to the production-connected `main` branch. This supersedes the original local-only hold above. See `SEO_CHANGELOG.md` and `DEPLOYMENT.md` for the reviewed release and verification; DNS/domain associations remain unchanged.

Implementation reference: [Next.js metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
