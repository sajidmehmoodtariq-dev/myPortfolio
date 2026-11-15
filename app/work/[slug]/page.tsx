import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "../../../content/case-studies";
import { getProject, projects } from "../../../content/projects";
import { CaseFigure } from "./case-figure";
import styles from "./case-study.module.css";
import { portfolioIdentity } from "../../../content/identity";
import { socialImage } from "../../../content/seo";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const canonical = `/work/${project.slug}`;
  const title = `${project.name} — ${project.category}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical },
    openGraph: { type: "article", title, description: project.summary, url: canonical, images: [socialImage(project.slug, project.name)] },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [socialImage(project.slug, project.name)] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const study = caseStudies[project.slug];
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const number = String(index + 1).padStart(2, "0");
  const breadcrumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "/" }, { name: "Selected Work", path: "/work" }, { name: project.name, path: `/work/${project.slug}` },
    ].map(({ name, path }, index) => ({ "@type": "ListItem", position: index + 1, name, item: new URL(path, portfolioIdentity.siteUrl).href })),
  };

  return (
    <main id="main-content" tabIndex={-1} className={styles.study} data-case={study.accent}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
      <div className={styles.wrap}>
        <nav aria-label="Work navigation" className={styles.masthead}>
          <Link href={`/#project-${project.slug}`}><span aria-hidden="true">←</span> Back to the exhibition</Link>
          <Link href="/work">All work <span aria-hidden="true">↗</span></Link>
        </nav>
        <article aria-labelledby="case-title">
          <header className={styles.hero}>
            <div className={styles.heroCopy} data-reveal="intro">
              <p className={styles.kicker}>SMT / CASE STUDY <span>{number} / {String(projects.length).padStart(2, "0")}</span></p>
              <p className={styles.category}>{project.category}</p>
              <h1 id="case-title">{project.name}</h1>
              <p className={styles.thesis}>{study.line}</p>
              <p className={styles.purpose}>{project.summary}</p>
              <ul className={styles.stack} aria-label="Technology stack">
                {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </div>
            <CaseFigure slug={project.slug} {...study.figure} />
          </header>
          <nav className={styles.jump} aria-label="In this case study">
            <a href="#brief">01 / Brief</a>
            <a href="#architecture">02 / Architecture</a>
            <a href="#decisions">03 / Engineering</a>
            <a href="#sources">04 / Sources</a>
          </nav>
          <section id="brief" className={styles.section} aria-labelledby="brief-title" data-reveal>
            <header><p className={styles.kicker}>01 / Brief</p><h2 id="brief-title">The problem</h2></header>
            <div className={styles.prose}>
              <p className={styles.lead}>{study.problem}</p>
              <h3>Context and constraints</h3>
              <p>{study.context}</p>
              <h3>My contribution</h3>
              <p>{study.role}</p>
            </div>
          </section>
          <section id="architecture" className={styles.section} aria-labelledby="architecture-title" data-reveal>
            <header><p className={styles.kicker}>02 / System</p><h2 id="architecture-title">Architecture</h2></header>
            <div className={styles.prose}>
              <ol className={styles.flow} aria-label="Architecture flow">
                {study.architecture.map(({ title, detail }, step) => (
                  <li key={title}><span aria-hidden="true">0{step + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></li>
                ))}
              </ol>
              <h3 className={styles.subhead}>Core functionality</h3>
              <dl className={styles.features}>
                {study.functionality.map(({ title, detail }) => (
                  <div key={title}><dt>{title}</dt><dd>{detail}</dd></div>
                ))}
              </dl>
            </div>
          </section>
          <section id="decisions" className={styles.section} aria-labelledby="decisions-title" data-reveal>
            <header><p className={styles.kicker}>03 / Engineering</p><h2 id="decisions-title">Decisions and evidence</h2></header>
            <div className={styles.prose}>
              <h3>{study.decision.title}</h3>
              <p>{study.decision.detail}</p>
              <div className={styles.outcome}>
                <p className={styles.kicker}>Observed in source or example</p>
                <h3>{study.outcome.title}</h3>
                <p>{study.outcome.detail}</p>
                <a href="#evidence">Revisit the evidence plate <span aria-hidden="true">↑</span></a>
              </div>
            </div>
          </section>
          <section id="sources" className={styles.section} aria-labelledby="sources-title" data-reveal>
            <header><p className={styles.kicker}>04 / References</p><h2 id="sources-title">Read the source</h2></header>
            <div className={styles.prose}>
              <div className={styles.sourceActions}>
                <a href={project.repository}>Browse the repository <span aria-hidden="true">↗</span></a>
                {study.demo && <a href={study.demo.href}>{study.demo.label} <span aria-hidden="true">↗</span></a>}
              </div>
              <ul className={styles.sourceList}>
                {project.evidence.map(({ href, label }) => <li key={href}><a href={href}>{label} <span aria-hidden="true">↗</span></a></li>)}
              </ul>
            </div>
          </section>
        </article>
        <footer className={styles.next} data-reveal>
          <Link href={`/work/${next.slug}`} prefetch={false}>
            <span className={styles.kicker}>Next project</span>
            <strong>{next.name}</strong>
            <span aria-hidden="true" className={styles.nextArrow}>↗</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
