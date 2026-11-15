# Production release

The cinematic portfolio replaces the previous `master` site. The sole release branch is `main`, connected to the existing Vercel project `smt-engineering-exhibit`. The production hostname is `https://www.sajidmehmoodtariq.dev`; the apex redirects there. Canonical metadata uses the www hostname.

Run `npm run typecheck`, `npm run lint` and `npm run build` before release. Deploy through the linked Vercel project with `vercel deploy --prod`. The Git integration must track `main` for subsequent production pushes.

`.vercelignore` excludes local environment files, QA recordings, Git backups, development documentation, dependencies and generated build output. `.env.local` and `.vercel/` are local-only ignored settings. The public project assets and original certificate PDFs are deployed.

Before deleting the previous branch refs, the old repository history was saved and verified in the ignored local `qa-artifacts/release/before-main-replacement.bundle`. Existing Vercel deployment history is retained for rollback. No backup branch is created.

Verify the live homepage, the five `/work/<slug>` routes, both certificate viewers and PDFs, keyboard/direct chapter navigation, the animated scene under the inherited browser preference, motherboard request activity and mobile framing. QA evidence stays local rather than shipping to Vercel.
