import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProjectTools } from "@/components/work/project-links";
import { ProjectVisual } from "@/components/work/project-visual";
import { WorkMotion } from "@/components/work/work-motion";
import { projects } from "@/content/projects";
import "@/components/work/work.css";

type Props = { params: Promise<{ slug: string }> };

const chapters = [
  ["B", "Problem", "problem"],
  ["C", "Context and constraints", "context"],
  ["D", "Role and contribution", "role"],
  ["E", "Solution", "solution"],
  ["F", "Architecture", "architecture"],
  ["G", "Engineering decisions", "decisions"],
] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();

  return {
    title: `${project.name} | The Engineering Exhibit`,
    description: project.summary,
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((entry) => entry.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <SiteHeader onHomepage={false} />
      <main id="main-content" tabIndex={-1} className="case-study">
        <div className="case-hero">
          <div className="exhibit-container">
            <Link className="case-back" href="/#work">← Selected work</Link>
            <div data-case-intro>
              <p className="work-kicker" data-work-reveal><b>A / 0{index + 1}</b> / {project.category}</p>
              <h1 data-work-reveal>{project.name}</h1>
              <p className="case-lede" data-work-reveal>{project.summary}</p>
            </div>
            <ProjectTools project={project} />
            <a className="project-link" href={project.repository}>Source code <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="exhibit-container case-body">
          {chapters.map(([letter, title, key]) => (
            <section className="case-chapter" key={key} aria-labelledby={`chapter-${key}`}>
              <span className="case-chapter__number" aria-hidden="true">{letter}</span>
              <h2 id={`chapter-${key}`}>{title}</h2>
              <p>{project[key]}</p>
            </section>
          ))}
          <section className="case-showcase" aria-labelledby="case-showcase">
            <p className="work-kicker"><b>H</b> / Project exhibit</p>
            <h2 id="case-showcase">Visual showcase</h2>
            <ProjectVisual project={project} />
          </section>
          <section className="case-chapter" aria-labelledby="case-outcome">
            <span className="case-chapter__number" aria-hidden="true">I</span>
            <h2 id="case-outcome">Verified outcome</h2>
            <div>
              <p>{project.outcome}</p>
              <h3 className="case-sources-heading">Evidence reviewed</h3>
              <ul className="case-sources">
                {project.sources.map(({ label, href }) => <li key={href}><a href={href}>{label} <span aria-hidden="true">↗</span></a></li>)}
              </ul>
            </div>
          </section>
          <nav className="case-next" aria-label="Case-study navigation">
            <p className="work-kicker"><b>J</b> / Next project</p>
            <Link href={`/work/${next.slug}`}>
              <span>{next.name}<small>{next.category}</small></span><span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
        <WorkMotion />
      </main>
    </>
  );
}
