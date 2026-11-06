# Content inventory

[src/content/portfolio.ts](../src/content/portfolio.ts) holds owner-supplied identity, education, tenure, and toolkit claims. [src/content/projects.ts](../src/content/projects.ts) holds case-study copy and evidence links pinned to the public revisions reviewed for Prompt 03. Source inspection establishes implementation details. Deployment, adoption, and outcomes require separate evidence.

| Project | Evidence reviewed | Requires confirmation |
| --- | --- | --- |
| PGC-DHA | Developer credit in the README, role checks, enquiry statuses, permission-gated reporting, class and student endpoints, and the MongoDB connection | Contribution boundaries, deployment, institutional adoption or impact, and an approved screen with synthetic records |
| ResumeIQ | Upload and scoring routes, FastEmbed/BGE semantic scorer, Gemini adapter, and ReportLab renderer | Public naming because the README says ResumeMatcher, contribution scope, scoring evaluation, job-search outcomes, and approved screenshots |
| Ledger | VS Code terminal integration, snapshot hashing, bounded workspace storage, and code and output diff views | Contribution scope, distribution, adoption or usage outcomes, and approved extension screenshots |
| Folio | Page extraction and retrieval flow, FAISS indexing, local answering, and source quote matching | Contribution scope, supported document coverage, citation and answer accuracy, and approved demo media |
| Nudge | App input and navigation, SQLite reminder lifecycle, Notifee triggers, and the public Android reminder screenshot | Contribution scope, store release, device coverage, and notification reliability |
| Client Job Portal | Owner brief identifies the ServiceM8 recruitment project and its technical focus | Clearance for public discussion, scope and role, redacted OAuth and role-flow evidence, approved imagery, and any outcome. The public listing stays at the owner-supplied summary until confirmed. |

Keep client identities, credentials, and student records out of published content. The four featured visuals use synthetic examples labeled as illustrative demos. An implementation finding may describe what the code does. Any deployment, performance, adoption, or business outcome needs its own verifiable source. Publish notes when the author and final text are supplied.

## Closing chapters

| Area | Evidence used | Pending |
| --- | --- | --- |
| Toolbox | Local exhibit dependencies for Next.js, TypeScript, and GSAP. PGC-DHA, ResumeIQ, Folio, Ledger, and Nudge case-study sources support the linked examples. PGC-DHA includes [Vercel configuration](https://github.com/sajidmehmoodtariq-dev/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8/client/vercel.json). Structura documents [C++ visualization](https://github.com/sajidmehmoodtariq-dev/Structura/blob/27277740702c8150c3679185e27f605a0d6a16ef/README.md) and contains [its Rust desktop shell](https://github.com/sajidmehmoodtariq-dev/Structura/blob/27277740702c8150c3679185e27f605a0d6a16ef/src-tauri/Cargo.toml). | Project-specific evidence for Three.js, Redis, and Linux. |
| About and experience | Owner brief for freelance work, institutional and client applications, AI/ML interests, and CS50x. Public GitHub profile identifies the developer and BSCS at UET KSK. | Dates, additional role detail, and an approved portrait if one is wanted. |
| Engineering Notes | No approved authored articles were supplied. Public checks did not identify an authored article to republish. | Approved article text, title, summary, topic, and publication date. |
| Contact | Owner-supplied GitHub and LinkedIn profiles, corroborated by the GitHub profile. | A verified public contact email. |

### Publishing a note

Save the approved Markdown body to `src/content/notes/<slug>.md`. Register the unique kebab-case slug, title, summary, topic, and ISO publication date in [src/content/notes.ts](../src/content/notes.ts). The page renders the title and metadata, so begin article sections with level-two headings. Use public asset paths for approved images. Keep drafts out of the registry. The homepage index and the static route at `/notes/<slug>` both use that registry.
