# Deployment

The portfolio is a Next.js App Router application. The homepage, project case studies, and registered Markdown notes are prerendered. The standard Next.js server also handles responsive image optimization and serves the scrub video with byte ranges. Node 24.18.0 was used for final validation.

## Build and preview

From the repository root in PowerShell:

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1 --port 3000
```

Use `npm` in place of `npm.cmd` on shells where it resolves to the npm executable. Open the loopback preview and verify the homepage, at least one case study, the compact and desktop layouts, and the reduced-motion mode.

## Public origin

Set `SITE_URL` **at build time** to the approved HTTPS origin. It must contain the hostname and optional port, with no path prefix, credentials, query, or fragment. For example:

```powershell
$env:SITE_URL = 'https://portfolio.example.com'
npm.cmd run build
```

The example domain is reserved for QA. Replace it with the approved public origin before release. Without the variable, the build emits `noindex, nofollow`, disallows crawlers in `/robots.txt`, and omits canonical URLs, absolute social image URLs, and sitemap entries. Preview environments should use that unset configuration. Set the variable only on builds intended for indexing. Crawler directives are separate from access control.

With the public origin configured, verify:

- The home page and all five case-study pages return 200 and emit their own title, description, canonical, and Open Graph URL.
- `/social/portfolio.png` returns the 1200 × 630 social preview and is reachable at the same public origin.
- `/robots.txt` allows crawling and points to `/sitemap.xml`. The sitemap lists the homepage, five case studies, and any registered notes. Unknown project and note slugs return 404.
- A byte-range request to `/system/assembly.mp4` returns 206 through the production proxy. The proxy should preserve the asset MIME type and range headers.
- The homepage skip link, mobile disclosure, Work links, architecture controls, and contact channels work on the production host.

## Hosting and release

Use a Next.js-compatible host with the normal build and start commands, or select the Next.js framework preset on a managed host. Keep the lockfile in the checkout and install from it. Keep the production origin specific to the public environment. A raw static-file deployment requires a separate export and image delivery decision because this checkout uses Next.js image optimization. Route rewrites should preserve genuine 404 responses.

Build and verify the exact revision intended for release. Keep the previous artifact or deployment available for rollback. Request authorization before publishing, connecting a hostname, or changing DNS.

[Next.js deployment guidance](https://nextjs.org/docs/app/getting-started/deploying)
