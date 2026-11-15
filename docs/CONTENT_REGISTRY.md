# Content registry

The TypeScript registries in `content/` are the application’s content foundation. Identity and title metadata live in [identity.ts](../content/identity.ts). Project summaries and revision-pinned evidence live in [projects.ts](../content/projects.ts). The homepage retains its existing copy until the associated chapters are implemented.

| Claim | Evidence and publication boundary |
| --- | --- |
| Sajid Mehmood Tariq, Lahore, and Full-Stack Developer | Supplied in the Milestone 01 brief and corroborated by the [public GitHub profile](https://github.com/sajidmehmoodtariq-dev). The Software Engineer label is owner-supplied professional positioning. |
| BS Computer Science at University of Engineering and Technology Lahore, New Campus (KSK) | The brief supplies the full institution and campus. GitHub identifies BSCS at UET KSK. Enrollment dates and graduation status are unspecified. |
| Approximately two years of freelance software development | Owner-supplied estimate as of the brief. Institutional work, client applications, developer tools, and AI projects are owner-supplied domains. Confirm any named client, dates, individual project responsibilities, and quantified results separately. |
| Frontend, backend, AI/ML, tooling, mobile, and systems programming | Owner positioning corroborated at the domain level by the projects below and the public [Structura repository](https://github.com/sajidmehmoodtariq-dev/Structura). Tool proficiency, release history, and outcomes require project-specific evidence. |
| GitHub, LinkedIn, and intended domain | Owner-supplied destinations. GitHub links to the stated [LinkedIn profile](https://www.linkedin.com/in/sajid-mehmood-tariq/). `sajidmehmoodtariq.dev` is the supplied metadata base. Direct access to LinkedIn and the domain could not be confirmed in this review. |

## Credentials

[credentials.ts](../content/credentials.ts) registers both items as course completions and links their live previews and original PDFs. The recipient, award years, coursework, and printed verification addresses were checked against the rendered owner-supplied documents from the legacy credential archive.

| Credential | Record |
| --- | --- |
| CS50x, Introduction to Computer Science | 2025. Ten problem sets and one final project. [Issuer verification](https://cs50.harvard.edu/certificates/f5aa59ca-26eb-4289-af0e-ccf00f4feb78). |
| CS50’s Introduction to Artificial Intelligence with Python | 2026. Twelve projects. [Issuer verification](https://cs50.harvard.edu/certificates/fd45fc07-954c-46de-bcbe-1e4597d3426c). |

The issuer pages could not be fetched by the web tool. Browser tests exercise navigation to the exact addresses printed on the PDFs. The learning chapter separately identifies UET Lahore, New Campus (KSK), as the bachelor's institution. See the [asset manifest](ASSET_MANIFEST.md) for document provenance and dimensions.

## Selected work

The live gallery and `/work` share the five entries below. [case-studies.ts](../content/case-studies.ts) adds editorial copy keyed to those project slugs. The case-study pages show scope, context, contributions, architecture, implementation evidence, and source links. Contribution language comes from PGC-DHA’s developer credit and source history for the other projects. The example outcomes describe inspected code, controlled runs, or repository captures.

The gallery illustrations and editorial evidence are separate. The PGC-DHA case uses a synthetic record and the pinned enquiry states. ResumeIQ’s invented input excerpts carry no computed score. Ledger’s two Python programs were executed locally and their normalized UTF-8 source was hashed. Folio’s sample PDF was extracted and checked against the pinned repository quote matcher with one matching and one unrelated sentence. The Folio example answer is authored. Nudge’s two captures match the original pinned repository blobs.

The production case-study routes were checked in Chrome at 1440, 768, 390, and 320 px. The checks covered canonical metadata, no horizontal overflow, image loading and original links, keyboard activation of chapter links and Ledger digests, reduced motion, next-project navigation, and the Folio round trip from the exhibition. Typecheck, lint, and production build passed. Local captures and the browser report are under the ignored `qa-artifacts/milestone-05/` directory.

| Project | What the source supports | Review before publishing a full case study |
| --- | --- | --- |
| PGC-DHA | Admissions enquiries, records, class assignment, permission-gated reports, and README developer credit. [Project README](https://github.com/sajidmehmoodtariq-dev/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8/README.md) | Responsibility boundaries, deployment, and impact. |
| ResumeIQ | Semantic scoring, LLM feedback, and PDF export. The pinned documentation uses ResumeMatcher as its title. The brief supplies ResumeIQ as the portfolio label. [Project README](https://github.com/sajidmehmoodtariq-dev/ResumeIQ/blob/04ae2266f8f078303216ba50e87444e589b75614/README.md) | Final public naming, responsibility boundaries, and scoring or job-search outcomes. |
| Ledger | Terminal capture, code snapshots with SHA-256, and source/output comparisons. [Project README](https://github.com/sajidmehmoodtariq-dev/Ledger/blob/6798f0bb10462b01615354f0b6db995cb65f86d4/README.md) | Release scope, distribution, and usage. |
| Folio | Local document answering, page references, and a quote-checking step. [Answer pipeline](https://github.com/sajidmehmoodtariq-dev/Folio/blob/e5af889183ceccba8ad87820b6a3709395894047/src/answer.py) | Citation accuracy, supported documents, and individual scope. |
| Nudge | React Native reminder storage and device notification scheduling. [Reminder lifecycle](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/reminders/reminderService.ts), [Notification service](https://github.com/sajidmehmoodtariq-dev/Nudge/blob/7fc459413a355a97f5c296c37a153f00db92f9bb/src/notifications/notificationService.ts) | Store release, device coverage, and notification reliability. |

The job portal remains in intake pending public clearance. Adoption, usage figures, production URLs, and confidential client names require separate approval and evidence. [experience.ts](../content/experience.ts) records the owner-supplied experience. [writing.ts](../content/writing.ts) is empty pending approved authored work.

## About and contact

About uses the owner-supplied identity and the institution label UET Lahore, New Campus (KSK). The journey dates are the two course completion years in the credential registry. Freelance work and independent projects use descriptive labels. The capability groups link to case studies or to the pinned database connection implementation. The main contact action uses the LinkedIn URL linked from Sajid’s GitHub profile. [Public GitHub profile](https://github.com/sajidmehmoodtariq-dev).

## Engineering Notes workflow

Add an approved entry to `content/writing.ts` with a URL-safe slug, title, summary, category, ISO calendar date, and references. Put the Markdown body in `content/notes/<slug>.md`. Start body headings at level two because the page supplies the title. Use fenced code blocks for examples. The server-rendered article provides its canonical URL and Open Graph metadata, and estimates reading time from the body. The Notes index and About link activate when the approved registry has an entry. Unknown slugs return 404.

## Engineering chapters

The live trace follows `StudentReport` through `GET /api/users`. The client guard checks whether to render the enquiry report. The Axios interceptor attaches a bearer token when available. Express mounts the users router, whose middleware verifies the JWT and session before the handler queries the Mongoose User model. The handler pages and counts matching documents and returns a success envelope. React reads the rows into state. The portfolio uses this source sequence as a diagram and carries no report records or tokens. [React report](https://github.com/sajidmehmoodtariq-dev/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8/client/src/pages/admin/StudentReport.jsx#L96-L181) · [Axios client](https://github.com/sajidmehmoodtariq-dev/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8/client/src/services/api.js) · [Users router](https://github.com/sajidmehmoodtariq-dev/PGC-DHA/blob/c7a83dc57f67d00ebda7cfef109e3df86f6ebdb8/server/routes/users.js).

| Lab module | Status and evidence |
| --- | --- |
| Structura | In development. The repository labels it active development and documents C++ parsing, playback, and the memory model. [Repository guide](https://github.com/sajidmehmoodtariq-dev/Structura/blob/27277740702c8150c3679185e27f605a0d6a16ef/README.md). |
| Inkly | Prototype. The article schema implements draft, review, published, and archived states and sets the publication timestamp. The README references a beta whose live availability could not be confirmed. [Article schema](https://github.com/sajidmehmoodtariq-dev/Inkly/blob/f1a0708a18c7643246dba8bb5b44975c3ea9d103/server/models/ArticleModel.js). |
| Micro-VLM | Prototype. The PyTorch source includes image-patch processing and a UTF-8 byte tokenizer. The chapter describes architecture without model-quality or speed claims. [Vision encoder](https://github.com/sajidmehmoodtariq-dev/micro-vlm-from-scratch/blob/e92d2699a777de01ef5bbedc8f736bfe8c4880a1/src/model/vision.py) · [Byte tokenizer](https://github.com/sajidmehmoodtariq-dev/micro-vlm-from-scratch/blob/e92d2699a777de01ef5bbedc8f736bfe8c4880a1/src/model/tokenizer.py). |
