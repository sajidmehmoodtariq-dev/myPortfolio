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
            <div><span>Enquiry request</span><span>Responsibility</span></div>
            <div><code>React</code><span>Render enquiry and report views</span></div>
            <div><code>Express</code><span>Validate the session</span></div>
            <div><code>MongoDB</code><span>Aggregate filtered records</span></div>
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
          <p className="screen-label">01 / Text extraction</p>
          <p className="screen-title">Resume + job text</p>
          <p>Read the uploaded PDF or pasted resume text and the supplied job description.</p>
        </div>
        <div className="resume-input">
          <p className="screen-label">02 / Semantic scoring</p>
          <p className="screen-title">FastEmbed + BGE</p>
          <p>Embed both inputs and compare them with cosine similarity. PDF export runs separately.</p>
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
            <span>Terminal command</span><span>Output + exit status</span>
          </div>
          <div className="ledger-diff">
            <p className="screen-label">Snapshot / SHA-256</p>
            <code>Normalized file text</code>
            <p className="screen-label">Run comparison</p>
            <code className="diff-old">Source changes</code>
            <code className="diff-new">Stdout changes</code>
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
          <p className="screen-label">01 / Retrieval</p>
          <p className="screen-title">PDF pages</p>
          <p><mark>FAISS retrieves passages with their original page numbers.</mark></p>
        </div>
        <div className="folio-answer">
          <p className="screen-label">02 / Local answer</p>
          <p>llama.cpp answers using the retrieved passages.</p>
          <p className="screen-label">03 / Quote check</p>
          <p>Compare the proposed quote with source text and return its page.</p>
        </div>
      </div>
    </div>
  );
}

const diagrams = { "pgc-dha": Admissions, resumeiq: Resume, ledger: Ledger, folio: Folio };

export function ProjectVisual({ project }: { project: Project }) {
  const Diagram = project.slug === "nudge" ? null : diagrams[project.slug];

  return (
    <figure className="project-visual">
      <div className={`project-visual__stage project-visual__stage--${project.slug}`}>
        <span className="project-visual__registration" aria-hidden="true">{Diagram ? "FLOW" : "FIG"} / {project.name}</span>
        <div className="project-visual__rig" aria-hidden={Diagram ? true : undefined}>
          {Diagram ? <Diagram /> : (
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
        <strong>{project.visual.kind === "diagram" ? "Implementation diagram" : "Repository screenshot"}</strong>
        <span>{project.visual.description}</span>
        {project.visual.source && <a href={project.visual.source.href}>Original image ↗</a>}
      </figcaption>
    </figure>
  );
}
