# Test plan

## Foundation gate

Use Node 24.x. Install the locked dependencies with `npm ci`. Run `npm run typecheck`, `npm run lint`, and `npm run build`. Serve the production build and check that `/` returns 200 with the correct title, one main landmark, one H1, an H2 for each visible chapter after the hero, and unique section IDs. Verify that the skip link receives keyboard focus and targets main.

## Scene and release gates

- Check 320px, 390px, 768px, and 1440px widths and 200% zoom. Content and controls should stay within the viewport, with readable labels and a logical reading order.
- Test keyboard, touch, and pointer input in Chromium, Firefox, and Safari where available. Verify visible focus, links, deep links, back navigation, and layer controls.
- Scroll the desktop gallery forward and backward with the wheel, then reach projects with its arrow controls, keyboard, and named fragments. Swipe the horizontal rail on a compact viewport. Verify that the page trajectory's leading point stays near the same viewport height during the desktop gallery.
- Test reduced motion, disabled JavaScript, unavailable WebGL, and media request failure. Identity, work links, and annotations must remain accessible.
- Inspect the network and performance traces. Heavy scenes should load only when needed and reserve their layout. Profile scrolling on a midrange mobile device before adding motion dependencies or increasing DPR. Measure frame consistency on actual devices.
- Compare scene composition and phase changes with the reference. Check alignment, orange path continuity, contrast, and cramped labels at each breakpoint.
- Confirm that published claims have evidence and that screenshots contain no private records. Verify case studies return 200 for known slugs and 404 for unknown ones after their routes land.
- Check each closing anchor, toolbox project link, and contact channel. Verify the orange path reaches the final diagram at maximum scroll. Confirm the homepage omits Inside the System, then check that `/work` lists all public case studies and its architecture disclosures start closed. Confirm Notes and its navigation item are hidden when the registry is empty and unlisted note slugs return 404.
