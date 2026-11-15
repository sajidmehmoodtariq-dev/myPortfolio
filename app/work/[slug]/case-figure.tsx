import Image from "next/image";
import type { ProjectSlug } from "../../../content/case-studies";
import styles from "./case-study.module.css";

const enquiryStages = ["Not purchased", "Purchased", "Returned", "Admission fee submitted", "First installment submitted"];
const runs = [
  { input: "[2, 2]", stdout: "4", hash: "54f3b9819406f697df5ce0d2a13ffdc14eef80458a06d3a68ab79b29e31867b7" },
  { input: "[2, 3]", stdout: "5", hash: "c6d9f6413af061d0fe7303fafee4f335c944cbdac9d96642a24791c90d671762" },
];
const captures = [
  { src: "/work/nudge-entry.jpg", title: "Reminder entry", alt: "Nudge reminder entry overlay on Android with Type, Paste, and Speak tabs." },
  { src: "/work/nudge-notification.jpg", title: "Active alarm", alt: "Nudge Android alarm for Call Sajid with Snooze 10m and Dismiss controls." },
];

function InstitutionalPlate() {
  return (
    <div className={styles.workflow}>
      <div className={styles.plateIntro}>
        <span className={styles.micro}>ADMISSIONS / DEMO-014</span>
        <strong>One enquiry, five stages.</strong>
      </div>
      <ol className={styles.stages}>
        {enquiryStages.map((stage, index) => (
          <li key={stage}>
            <span className={styles.micro}>0{index + 1}</span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>
      <p className={styles.plateFoot}>The source also defines a rejected state.</p>
    </div>
  );
}

function ResumePlate() {
  return (
    <div className={styles.resume}>
      <div className={styles.documents}>
        <div><span className={styles.micro}>INPUT 01 / RESUME</span><p>Built REST endpoints and wrote integration tests.</p></div>
        <div><span className={styles.micro}>INPUT 02 / JOB DESCRIPTION</span><p>Develop APIs and maintain automated integration coverage.</p></div>
      </div>
      <div className={styles.resumeOutput}>
        <div><span className={styles.micro}>ALGORITHMIC</span><strong>Match score</strong><p>Semantic similarity, skill evidence, and experience.</p></div>
        <div><span className={styles.micro}>OPTIONAL MODEL</span><strong>Writing suggestions</strong><p>Draft language for the applicant to review.</p></div>
      </div>
    </div>
  );
}

function TerminalPlate() {
  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}><span className={styles.micro}>TERMINAL / totals.py</span><span className={styles.micro}>PYTHON</span></div>
      <div className={styles.runs}>
        {runs.map((run, index) => (
          <div key={run.hash}>
            <p className={styles.micro}>RUN 0{index + 1}</p>
            <code>items = {run.input}<br />print(sum(items))</code>
            <p className={styles.stdout}><span className={styles.micro}>STDOUT</span><code>{run.stdout}</code></p>
            <details className={styles.digest}>
              <summary>SHA-256 <code>{run.hash.slice(0, 12)}…</code></summary>
              <code>{run.hash}</code>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentPlate() {
  return (
    <div className={styles.document}>
      <div className={styles.paper}>
        <span className={styles.micro}>CACHE MAINTENANCE NOTES / P. 1</span>
        <strong>When to replace a cached copy</strong>
        <p>A cache stores a working copy near the reader.</p>
        <blockquote>Replace the cached copy after the source document changes.</blockquote>
      </div>
      <div className={styles.answer}>
        <span className={styles.micro}>EXAMPLE ANSWER</span>
        <strong>Refresh after the source changes.</strong>
        <a href="/work/folio-cache-notes.pdf#page=1">Read the source passage <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  );
}

function MobilePlate() {
  return (
    <div className={styles.phonePair}>
      {captures.map(({ src, title, alt }, index) => (
        <div key={src}>
          <a href={src} aria-label={`Open full-size screenshot of Nudge ${title.toLowerCase()}`}>
            <Image src={src} width={1080} height={2400} sizes="(max-width: 460px) 36vw, (max-width: 820px) 23vw, 165px" alt={alt} />
          </a>
          <p className={styles.micro}>0{index + 1} / {title}</p>
        </div>
      ))}
    </div>
  );
}

const plates = {
  "pgc-dha": InstitutionalPlate,
  resumeiq: ResumePlate,
  ledger: TerminalPlate,
  folio: DocumentPlate,
  nudge: MobilePlate,
};

export function CaseFigure({ slug, type, caption }: { slug: ProjectSlug; type: string; caption: string }) {
  const Plate = plates[slug];
  return (
    <figure id="evidence" className={styles.figure} data-reveal="intro">
      <div className={styles.frame}>
        <div className={styles.frameLabel}><span>FIG. 01</span><span>{type}</span></div>
        <Plate />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
