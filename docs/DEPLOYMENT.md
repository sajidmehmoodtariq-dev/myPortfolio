# Vercel deployment and search indexing

The portfolio is live at [smt-engineering-exhibit.vercel.app](https://smt-engineering-exhibit.vercel.app). The Next.js App Router project uses Node 24.x and is linked to `smt-engineering-exhibit` in Vercel. Releases upload the local checkout through the Vercel CLI. This checkout has no Git remote, so a local commit alone does not trigger a deployment. The homepage, case-study index, individual studies, registered notes, and project social cards are generated at build time.

## Release commands

From the repository root in PowerShell:

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
vercel.cmd deploy --target=preview
vercel.cmd deploy --prod
```

For a new checkout, first run `vercel.cmd link --project smt-engineering-exhibit`. Check the preview before publishing production. Keep the lockfile committed. The CLI link and downloaded local credentials are ignored by Git. The source-only reference media and development documentation are excluded from uploads.

## Canonical host and crawl rules

Vercel supplies the stable production hostname through `VERCEL_PROJECT_PRODUCTION_URL`. The app uses that hostname for canonical URLs, the sitemap, social cards, and structured data. The generated deployment URL is separate from the stable production domain. Keep Vercel's system environment variables exposed to the build.

`SITE_URL` is an optional build-time override for an approved HTTPS origin. Use it when a custom domain is the intended canonical host, or to simulate production locally with `https://portfolio.example.com`. The override must contain only the HTTPS origin, with no path, credentials, query, or fragment. Attach and verify a custom domain in Vercel before setting it as canonical, then redirect alternate production domains to that host.

Production pages emit indexable directives. Vercel previews emit `noindex, nofollow` and an empty sitemap, even when the stable production hostname is known. A public preview's robots rules allow crawlers to read its noindex directive. A build without any public origin has no canonical host and is excluded from indexing.

## Production smoke checks

- Open the production homepage, `/work`, and the five individual case studies. Each should return 200 with a unique title and description, a matching canonical and Open Graph URL, and a reachable 1200 × 630 social card.
- Open `/robots.txt` and `/sitemap.xml`. The sitemap includes the homepage, case-study index, five published studies, and any published notes. Unknown project and note slugs should return a real 404.
- Check the homepage profile markup and case-study breadcrumbs with Google's Rich Results Test. Review the index's case-study links and sample one project on mobile.
- Send a byte-range request to `/system/assembly.mp4` and check for a 206 response. The PGC-DHA exhibit at `/work#system` uses range delivery for scroll-linked playback.
- Keep the last known-good production deployment available in Vercel for rollback.

## Google Search Console

1. Add a URL-prefix property for the stable production HTTPS URL.
2. Select HTML tag verification. Copy the tag's `content` value into the Vercel Production environment as `GOOGLE_SITE_VERIFICATION`, then redeploy. The homepage emits the token on indexable builds.
3. Verify ownership, submit `sitemap.xml` under **Sitemaps**, and inspect the homepage and case-study index. Request indexing once the live inspection passes.
4. Review the indexing and Core Web Vitals reports as data becomes available.

[Vercel CLI deployment](https://vercel.com/docs/projects/deploy-from-cli) · [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables) · [Search Console URL-prefix setup](https://support.google.com/webmasters/answer/34592) · [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
