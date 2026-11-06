import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { breadcrumbs, StructuredData } from "@/components/structured-data";
import { InsideSystem } from "@/components/system/inside-system";
import { publishedNotes } from "@/content/notes";
import { projects } from "@/content/projects";
import { pageMetadata, publicUrl } from "@/lib/site-metadata";
import "@/components/work/work.css";

export const metadata = pageMetadata({
  title: "Case studies | Sajid Mehmood Tariq",
  description: "Implementation decisions and source evidence for Sajid Mehmood Tariq’s software projects.",
  path: "/work",
  imagePath: "/social/card/case-studies",
  imageAlt: "Case studies by Sajid Mehmood Tariq",
});

export default function WorkIndex() {
  return (
    <>
      <StructuredData entries={[
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Case studies", path: "/work" }]),
        {
          "@type": "CollectionPage",
          name: "Case studies",
          url: publicUrl("/work"),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.name,
              url: publicUrl(`/work/${project.slug}`),
            })),
          },
        },
      ]} />
      <SiteHeader onHomepage={false} showNotes={publishedNotes.length > 0} />
      <main id="main-content" className="case-index" tabIndex={-1}>
        <header className="case-hero">
          <div className="exhibit-container">
            <p className="work-kicker"><b>SMT</b> / Selected engineering work</p>
            <h1>Case studies<span aria-hidden="true">.</span></h1>
            <p className="case-lede">How each project works, the decisions behind it, and the source code that supports the write-up.</p>
          </div>
        </header>
        <div className="exhibit-container case-index__studies">
          <ol aria-label="Project case studies">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link href={`/work/${project.slug}`}>
                  <span className="work-kicker"><b>0{index + 1}</b> / {project.category}</span>
                  <h2>{project.name}</h2>
                  <span className="case-index__focus">{project.focus}</span>
                  <span className="case-index__arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
          <a className="project-link" href="#system">Walk through PGC-DHA’s architecture <span aria-hidden="true">↓</span></a>
        </div>
        <InsideSystem />
      </main>
    </>
  );
}
