import { clientProject, projects } from "@/content/projects";
import type { Project } from "@/content/projects";
import { ProjectLinks, ProjectTools } from "./project-links";
import { ProjectVisual } from "./project-visual";
import { WorkMotion } from "./work-motion";
import "./work.css";

const featuredProjects = projects.slice(0, 4);
const nudge = projects[4];

const paths = [
  ["M818 0 C818 170 945 210 945 440 S894 760 894 1000", "M760 0 C760 175 970 255 970 485 S950 800 950 1000"],
  ["M894 0 C894 300 963 360 963 610 S918 840 918 1000", "M950 0 C950 300 975 390 975 640 S955 840 955 1000"],
  ["M918 0 C918 300 963 420 963 650 S927 830 927 1000", "M955 0 C955 350 978 400 978 640 S955 830 955 1000"],
  ["M927 0 C927 260 968 430 968 660 S900 840 900 1000", "M955 0 C955 300 975 400 975 660 S950 830 950 1000"],
  ["M900 0 C900 310 949 450 949 650 S900 850 900 1000", "M950 0 C950 310 970 500 970 670 S945 870 945 1000"],
  ["M900 0 C900 360 955 530 927 725 C900 900 835 890 835 1000", "M945 0 C945 350 976 480 954 710 C935 909 877 884 877 1000"],
] as const;

function WorkSignal({ segment }: { segment: number }) {
  const [desktop, compact] = paths[segment];
  return (
    <svg className={`work-signal${segment === 0 ? " work-signal--entry" : ""}`} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <path className="work-signal__wide" d={desktop} pathLength="1" />
      <path className="work-signal__compact" d={compact} pathLength="1" />
    </svg>
  );
}

function Feature({ project, index }: { project: Project; index: number }) {
  return (
  <article id={`exhibit-${project.slug}`} className={`work-feature work-feature--${project.slug}`} aria-labelledby={`title-${project.slug}`} tabIndex={-1} data-work-feature>
      <WorkSignal segment={index + 1} />
      <div className="exhibit-container work-feature__inner">
        <div className="work-feature__copy">
          <p className="work-kicker" data-work-reveal><b>0{index + 1}</b> / {project.category}</p>
          <h3 id={`title-${project.slug}`} data-work-reveal>{project.name}</h3>
          <p className="work-feature__summary" data-work-reveal>{project.summary}</p>
          <p className="work-focus" data-work-reveal><span>Engineering focus</span>{project.focus}</p>
          <ProjectTools project={project} />
          <ProjectLinks project={project} />
        </div>
        <ProjectVisual project={project} animate />
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="selected-work" aria-labelledby="work-heading" tabIndex={-1}>
      <div className="work-intro" data-work-feature>
        <WorkSignal segment={0} />
        <div className="exhibit-container work-intro__inner">
          <div>
            <p className="work-kicker" data-work-reveal><b>02</b> / Project exhibits</p>
            <h2 id="work-heading" data-work-reveal>Selected work<span>.</span></h2>
          </div>
          <div>
            <p className="work-intro__note" data-work-reveal>From admissions workflows to the tools developers use to inspect their own work.</p>
            <ol className="work-index" aria-label="Featured project index">
              {featuredProjects.map((project) => (
                <li key={project.slug}><a href={`#exhibit-${project.slug}`}>{project.name}</a></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      {featuredProjects.map((project, index) => <Feature key={project.slug} project={project} index={index} />)}
      <div className="work-support" data-work-feature>
        <WorkSignal segment={5} />
        <div className="exhibit-container work-support__inner">
          <p className="work-kicker" data-work-reveal><b>05–06</b> / Supporting work</p>
          <div className="work-support__rows">
            <article>
              <h3>{nudge.name}</h3>
              <p>{nudge.category}</p>
              <p className="work-support__focus">{nudge.focus}</p>
              <ProjectLinks project={nudge} />
            </article>
            <article>
              <h3>{clientProject.name}</h3>
              <p>{clientProject.category}</p>
              <p className="work-support__focus">{clientProject.focus}</p>
              <p className="work-pending">{clientProject.status}</p>
            </article>
          </div>
        </div>
      </div>
      <WorkMotion />
    </section>
  );
}
