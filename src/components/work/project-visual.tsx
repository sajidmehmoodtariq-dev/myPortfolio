import Image from "next/image";
import type { Project } from "@/content/projects";

const enquiryStages = ["Not purchased", "Purchased", "Returned", "Fee submitted", "Admitted"];

function Admissions() {
  return (
    <>
      <div className="project-visual__sheet" />
      <div className="project-screen admissions-screen">
        <div className="screen-bar"><span>PGC-DHA</span><span>Admissions workspace</span></div>
        <div className="admissions-main">
          <p className="screen-label">Enquiry management / Institute admin</p>
          <p className="screen-title">Admission enquiries</p>
          <ol className="admission-stages">
            {enquiryStages.map((stage, index) => (
              <li key={stage}><span>0{index + 1}</span>{stage}</li>
            ))}
          </ol>
          <div className="admission-records">
            <div><span>Example enquiry</span><span>Current status</span></div>
            <div><code>ENQ-014</code><span>Returned</span></div>
            <div><code>ENQ-021</code><span>Fee submitted</span></div>
            <div><code>ENQ-032</code><span>Admitted</span></div>
          </div>
        </div>
      </div>
      <div className="project-visual__callout admissions-callout">
        <span className="screen-label">Access / By role</span>
        <span>Enquiries</span><span>Class assignments</span><span>Reports</span>
      </div>
    </>
  );
}

function Resume() {
  return (
    <div className="project-screen resume-screen">
      <div className="screen-bar"><span>ResumeIQ</span><span>Match analysis</span></div>
      <div className="resume-panes">
        <div className="resume-input">
          <p className="screen-label">01 / Resume excerpt</p>
          <p className="screen-title">API developer</p>
          <p>Built REST endpoints and wrote integration tests for a Python service.</p>
        </div>
        <div className="resume-input">
          <p className="screen-label">02 / Job excerpt</p>
          <p className="screen-title">Backend engineer</p>
          <p>Develop Python APIs and maintain automated tests for service integrations.</p>
        </div>
      </div>
      <div className="resume-signals">
        <span>Semantic fit</span><span>Skill coverage</span><span>Experience quality</span>
      </div>
    </div>
  );
}

function Ledger() {
  return (
    <>
      <div className="project-visual__sheet" />
      <div className="project-screen ledger-screen">
        <div className="screen-bar"><span>Ledger</span><span>Run comparison</span></div>
        <div className="ledger-body">
          <div className="ledger-history">
            <p className="screen-label">Workspace history</p>
            <span>Run B / Exit 0</span><span>Run A / Exit 0</span>
          </div>
          <div className="ledger-diff">
            <p className="screen-label">Code snapshot / parse.js</p>
            <code className="diff-old">− return line;</code>
            <code className="diff-new">+ return line.trim();</code>
            <p className="screen-label">Stdout / A → B</p>
            <code>“ sample ” → “sample”</code>
          </div>
        </div>
      </div>
    </>
  );
}

function Folio() {
  return (
    <div className="project-screen folio-screen">
      <div className="screen-bar"><span>Folio</span><span>Local PDF pipeline</span></div>
      <div className="folio-panes">
        <div className="folio-paper">
          <p className="screen-label">Sample manual / P. 12</p>
          <p className="screen-title">Export settings</p>
          <p><mark>The export keeps the source page numbers.</mark></p>
        </div>
        <div className="folio-answer">
          <p className="screen-label">Question</p>
          <p>What happens to page numbers during export?</p>
          <p className="screen-label">Answer / Page 12</p>
          <p>Export preserves the original page numbering.</p>
        </div>
      </div>
    </div>
  );
}

const demos = { "pgc-dha": Admissions, resumeiq: Resume, ledger: Ledger, folio: Folio };

export function ProjectVisual({ project, animate = false }: { project: Project; animate?: boolean }) {
  const Demo = project.slug === "nudge" ? null : demos[project.slug];

  return (
    <figure className="project-visual" data-work-visual={animate ? "" : undefined}>
      <div className={`project-visual__stage project-visual__stage--${project.slug}`} data-work-mask>
        <span className="project-visual__registration" aria-hidden="true">{Demo ? "DEMO" : "FIG"} / {project.name}</span>
        <div className="project-visual__rig" data-work-rig aria-hidden={Demo ? true : undefined}>
          {Demo ? <Demo /> : (
            <Image
              src="/work/nudge-notification.jpg"
              alt="Nudge Android reminder showing the scheduled time and snooze and dismiss controls"
              width={1080}
              height={2400}
              sizes="(max-width: 640px) 200px, 240px"
              className="nudge-screen"
            />
          )}
        </div>
      </div>
      <figcaption>
        <strong>{project.visual.kind === "demo" ? "Illustrative demo" : "Repository screenshot"}</strong>
        <span>{project.visual.description}</span>
        {project.visual.source && <a href={project.visual.source.href}>Original image ↗</a>}
      </figcaption>
    </figure>
  );
}
