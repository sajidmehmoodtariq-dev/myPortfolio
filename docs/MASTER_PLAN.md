# SMT — The Engineering Exhibit

Sajid Mehmood Tariq’s portfolio presents software engineering as a sequence of exhibits. The viewer moves from an introduction to shipped work, then into system design, tools, experience, writing, and contact. A warm orange spline connects the scenes on a deep green canvas. Technical annotation and exploded assemblies borrow their visual grammar from the supplied media.

## Routes and component boundaries

| Stop | Anchor | Component plan | Purpose |
| --- | --- | --- | --- |
| 01 | `#intro` | Hero and HeroScene | Establish name, role, and exhibition concept. Link to selected work. |
| 02 | `#work` | SelectedWork and ProjectFeature | Lead with verified projects and link to case studies. |
| 03 | `#system` | InsideSystem and SystemScene | Explain the layers of one verified system. |
| 04 | `#toolbox` | EngineeringToolbox and ToolGroup | Group tools by demonstrated use. |
| 05 | `#about` | ExperienceAbout | Present freelance work, education, and current interests. |
| 06 | `#notes` | EngineeringNotes and NoteLink | Index authored engineering notes. |
| 07 | `#contact` | ContactScene and ContactLinks | Close the spline and provide direct ways to connect. |

The App Router root layout owns metadata, language, typography, and the skip link. The home page owns the main landmark and composes section shells from the section registry. Each stop can become its own Server Component once it has content. Keep scene loaders and browser-only logic at the owning section. Case studies will live at `/work/[slug]` with server-rendered content and unknown slugs handled by `notFound()`. Publish a case-study route only after its content and assets are ready.

## Implementation order

1. Prompt 01 delivers this planning set, local Git history, a strict Next.js foundation, and seven heading-only sections.
2. The next milestone implements only the hero. Compare the supplied frames, choose a responsive crop or reproduction, build identity copy and the selected-work link, then tune the orange path entrance and a reduced-motion still. Validate mobile, keyboard, asset failure, and desktop fidelity.
3. Implement selected work and verified case-study routes. Collect approved screenshots before publishing them.
4. Build Inside the System, then the toolbox, experience, notes, and contact sections. Extend the spline as each stop lands.
5. Tune whole-page performance and accessibility with real devices, then review the release against the test plan.
