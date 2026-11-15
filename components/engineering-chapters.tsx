import { labModules, requestExhibits } from "../content/engineering";

export function ReadingLinks({ chapter }: { chapter: "inside-system" | "engineering-lab" | "about" | "finale" }) {
  // A document navigation starts the chosen mode before mounting the scene.
  return (
    <>
      <a className="engineering-reading" href={`/?view=reading#${chapter}`}>Read without motion</a>
      <a className="engineering-resume" href={`/#${chapter}`}>Return to animation</a>
    </>
  );
}

function Dossiers({ items, kind, label }: {
  items: typeof requestExhibits | typeof labModules;
  kind: "trace" | "lab";
  label: string;
}) {
  return (
    <>
      <nav className={`engineering-index engineering-index--${kind}`} aria-label={label}>
        {items.map(({ id, label }) => <a key={id} href={`#${id}`} data-engineering-link={kind}>{label}</a>)}
      </nav>
      <div className="engineering-dossiers">
        {items.map(({ id, title, note, detail, source }, index) => (
          <article id={id} key={id} data-engineering-entry={kind} className="engineering-dossier" aria-labelledby={`${id}-title`}>
            <p className="engineering-note"><span>{note}</span><span>0{index + 1} / 0{items.length}</span></p>
            <h3 id={`${id}-title`}>{title}</h3>
            <p className="engineering-detail">{detail}</p>
            <a className="engineering-source" href={source}>Read {kind === "lab" ? `${title} source` : "implementation"} <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </div>
    </>
  );
}

export function EngineeringChapters() {
  return (
    <>
      <section id="inside-system" className="chapter chapter--system" aria-labelledby="system-title">
        <p className="eyebrow"><span /> 05 / INSIDE THE SYSTEM</p>
        <h2 id="system-title">There&apos;s more<br /> beneath the <em>surface.</em></h2>
        <p className="lede">Follow a PGC-DHA admissions report request across the exposed core.</p>
        <Dossiers items={requestExhibits} kind="trace" label="Request stages" />
        <div className="engineering-actions">
          <a href="#engineering-lab">Next <span aria-hidden="true">→</span> Engineering Lab</a>
          <ReadingLinks chapter="inside-system" />
        </div>
      </section>
      <section id="engineering-lab" className="chapter chapter--lab" aria-labelledby="lab-title">
        <p className="eyebrow"><span /> 06 / ENGINEERING LAB</p>
        <h2 id="lab-title">Always building.<br /> Always <em>exploring.</em></h2>
        <p className="lede">Memory, publishing, and multimodal models.</p>
        <Dossiers items={labModules} kind="lab" label="Lab experiments" />
        <div className="engineering-actions">
          <a href="#inside-system"><span aria-hidden="true">←</span> Request trace</a>
          <ReadingLinks chapter="engineering-lab" />
        </div>
      </section>
    </>
  );
}
