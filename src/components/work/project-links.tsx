import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      <Link href={`/work/${project.slug}`} className="project-link project-link--primary" aria-label={`Case study for ${project.name}`}>
        Case study <span aria-hidden="true">↗</span>
      </Link>
      <a href={project.repository} className="project-link" aria-label={`Source code for ${project.name}`}>
        Source code <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export function ProjectTools({ project }: { project: Project }) {
  return (
    <ul className="project-tools" aria-label="Technologies">
      {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
    </ul>
  );
}
