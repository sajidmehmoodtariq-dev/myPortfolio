# SMT portfolio

- Read [the master plan](docs/MASTER_PLAN.md), [design system](docs/DESIGN_SYSTEM.md), and [asset manifest](docs/ASSET_MANIFEST.md) before changing a section.
- Work within the current numbered prompt. Create one local Git commit per major prompt after validation. Keep minor adjustments in the working tree until the next authorized milestone. Avoid staging unrelated changes.
- Keep routes and content server-rendered by default. Put browser-only motion and 3D in small, lazy-loaded scene components.
- Preserve native scrolling, accessible links and controls, readable fallback content, and reduced-motion behavior.
- Verify portfolio claims against the evidence rules in [the content inventory](docs/CONTENT_INVENTORY.md). Use sanitized media and synthetic sample data.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` before closing a milestone. Follow the applicable checks in [the test plan](docs/TEST_PLAN.md).
