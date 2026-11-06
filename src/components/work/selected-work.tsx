import { projects } from "@/content/projects";
import type { Project } from "@/content/projects";
import { ProjectLinks, ProjectTools } from "./project-links";
import { ProjectVisual } from "./project-visual";
import { ProjectRail } from "./project-rail";
import Link from "next/link";
import "./work.css";

function Feature({ project, index }: { project: Project; index: number }) {
  return (
    <article id={`exhibit-${project.slug}`} className="work-feature" aria-labelledby={`title-${project.slug}`} tabIndex={-1}>
      <div className="work-feature__inner">
        <div className="work-feature__copy">
          <p className="work-kicker"><b>0{index + 1}</b> / {project.category}</p>
          <h3 id={`title-${project.slug}`}>{project.name}</h3>
          <p className="work-feature__summary">{project.summary}</p>
          <p className="work-focus"><span>Engineering focus</span>{project.focus}</p>
          <ProjectTools project={project} />
          <ProjectLinks project={project} />
        </div>
        <ProjectVisual project={project} />
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="selected-work" aria-labelledby="work-heading" tabIndex={-1}>
      <div className="work-intro">
        <div className="exhibit-container work-intro__inner">
          <div>
            <p className="work-kicker"><b>02</b> / Project exhibits</p>
            <h2 id="work-heading">Selected work<span>.</span></h2>
          </div>
          <div>
            <p className="work-intro__note">From admissions workflows to the tools developers use to inspect their own work.</p>
            <ol className="work-index" aria-label="Featured project index">
              {projects.map((project) => (
                <li key={project.slug}><a href={`#exhibit-${project.slug}`}>{project.name}</a></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <ProjectRail count={projects.length}>
        {projects.map((project, index) => <Feature key={project.slug} project={project} index={index} />)}
      </ProjectRail>
      <div className="exhibit-container work-all">
        <Link className="project-link project-link--primary" href="/work">All case studies <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
