# Production release

The cinematic portfolio replaces the previous `master` site. The sole release branch is `main`, connected to the existing Vercel project `smt-engineering-exhibit`. The permanent canonical origin is `https://sajidmehmoodtariq.dev`, defined once in `content/identity.ts`. Canonicals, social metadata, structured data, sitemap and robots URLs use that origin.

On 15 November 2026 the owner authorized reviewing, improving and pushing the prepared SEO/domain-migration changes to `main`. That supersedes the earlier local-only hold; the Git push can trigger the connected production deployment. The currently observed Vercel association redirects the root domain to www (308), which still needs a separate canonical-domain configuration review. This release does not change DNS, domain associations or environment variables. See `docs/DOMAIN_MIGRATION_AUDIT.md` for the original audit and historical release hold.

Run `npm run typecheck`, `npm run lint` and `npm run build` before release. Deploy through the linked Vercel project with `vercel deploy --prod`. The Git integration must track `main` for subsequent production pushes.

Before a migration release, run `node scripts/check-domain-migration.mjs` against a local production server on port 3138 (or set `STORYBOARD_URL` to its local URL). This verifies route-specific canonical/Open Graph URLs, structured data, sitemap, robots, indexing response headers and contact destinations. Repeat against a preview build with `MIGRATION_QA_PREVIEW=1`; the preview must send `X-Robots-Tag: noindex, nofollow` on HTML, PDFs, social images and crawl-control endpoints. Production must not send that exclusion header.

Also run `node scripts/check-seo-quality.mjs` for server-rendered content, keyboard bypass, mobile accessibility and the first-chapter reading alternative. Social images are generated as six static PNG responses under `/social/<slug>` and referenced with the permanent canonical origin. See `SEO_AUDIT.md`, `PERFORMANCE_AUDIT.md` and `SEO_CHANGELOG.md` for the measured results and remaining release prerequisites.

`.vercelignore` excludes local environment files, QA recordings, Git backups, development documentation, dependencies and generated build output. `.env.local` and `.vercel/` are local-only ignored settings. The public project assets and original certificate PDFs are deployed.

Before deleting the previous branch refs, the old repository history was saved and verified in the ignored local `qa-artifacts/release/before-main-replacement.bundle`. Existing Vercel deployment history is retained for rollback. No backup branch is created.

Verify the live homepage, the five `/work/<slug>` routes, both certificate viewers and PDFs, keyboard/direct chapter navigation, the animated scene under the inherited browser preference, motherboard request activity and mobile framing. QA evidence stays local rather than shipping to Vercel.
