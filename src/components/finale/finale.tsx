import Link from "next/link";
import { CredentialsArchive } from "@/components/credentials/credentials-archive";
import { credentials } from "@/content/credentials";
import { formatNoteDate, publishedNotes } from "@/content/notes";
import { portfolioIdentity } from "@/content/portfolio";
import { toolbox } from "@/content/toolbox";
import { FinaleMotion } from "./finale-motion";
import "./finale.css";

function EngineeringToolbox() {
  return (
    <section id="toolbox" className="closing-chapter toolbox" aria-labelledby="toolbox-heading" tabIndex={-1} data-closing-chapter>
      <div className="exhibit-container closing-inner">
        <header className="closing-heading">
          <div>
            <p className="closing-kicker"><b>03</b> / Capabilities</p>
            <h2 id="toolbox-heading">Engineering toolbox<span aria-hidden="true">.</span></h2>
          </div>
          <p>Tools grouped by the work they support, with examples from the projects in this exhibit.</p>
        </header>
        <div className="toolbox-grid">
          {toolbox.map((group, index) => (
            <article className="toolbox-module" key={group.title}>
              <header>
                <span className="closing-kicker" aria-hidden="true"><b>0{index + 1}</b> / {group.focus}</span>
                <h3>{group.title}</h3>
              </header>
              <ul className="toolbox-examples">
                {group.examples.map(({ tools, label, href }) => (
                  <li key={tools[0]}>
                    <span className="toolbox-tools">{tools.join(" · ")}</span>
                    {href.startsWith("/work/") ? (
                      <Link href={href}>{label} <span aria-hidden="true">↗</span></Link>
                    ) : (
                      <a href={href}>{label} <span aria-hidden="true">↗</span></a>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceAbout() {
  return (
    <section id="about" className="closing-chapter experience" aria-labelledby="about-heading" tabIndex={-1} data-closing-chapter>
      <div className="exhibit-container closing-inner experience-layout">
        <header className="experience-intro">
          <p className="closing-kicker"><b>04</b> / About &amp; experience</p>
          <h2 id="about-heading">{portfolioIdentity.name}<span aria-hidden="true">.</span></h2>
          <p className="experience-role">Software Engineer and Full-Stack Developer</p>
          <p>I build production software for institutions and clients, from application interfaces to the APIs and data behind them. I’m exploring how AI and machine learning can support tools people use in their work.</p>
        </header>
        <ol className="experience-timeline" aria-label="Academic, professional, and independent work">
          <li>
            <p className="closing-kicker">Academic</p>
            <h3>Computer science</h3>
            <p>{portfolioIdentity.education}.</p>
            <p>Completed Harvard’s {credentials[0].code} and {credentials[1].title}. <a href="#credentials">View course credentials <span aria-hidden="true">↘</span></a></p>
          </li>
          <li>
            <p className="closing-kicker">Professional</p>
            <h3>Freelance development</h3>
            <p>Full-stack development for institutional and client applications, including the admissions workflows in <Link href="/work/pgc-dha">PGC-DHA</Link>.</p>
          </li>
          <li>
            <p className="closing-kicker">Independent</p>
            <h3>Developer tools &amp; applied AI</h3>
            <p><Link href="/work/ledger">Ledger</Link> explores terminal-run history and code snapshots. <Link href="/work/folio">Folio</Link> explores local PDF question answering.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}

function EngineeringNotes() {
  return (
    <section id="notes" className="closing-chapter notes-chapter" aria-labelledby="notes-heading" tabIndex={-1} data-closing-chapter>
      <div className="exhibit-container closing-inner notes-layout">
        <header>
          <p className="closing-kicker"><b>06</b> / Writing</p>
          <h2 id="notes-heading">Engineering notes<span aria-hidden="true">.</span></h2>
          <p>Writing on application architecture, developer tools, and applied AI.</p>
        </header>
        <ul className="note-index" aria-label="Published engineering notes">
            {publishedNotes.map((note) => (
              <li key={note.slug} data-note-reveal>
                <article>
                  <p className="closing-kicker">{note.topic} / <time dateTime={note.publishedOn}>{formatNoteDate(note.publishedOn)}</time></p>
                  <h3><Link href={`/notes/${note.slug}`}>{note.title} <span aria-hidden="true">↗</span></Link></h3>
                  <p>{note.summary}</p>
                </article>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

function ContactScene() {
  const chapter = publishedNotes.length > 0 ? "07" : "06";

  return (
    <section id="contact" className="closing-chapter contact-scene" aria-labelledby="contact-heading" tabIndex={-1} data-closing-chapter>
      <div className="contact-terminal" aria-hidden="true">
        <svg viewBox="0 0 240 240" className="contact-terminal__figure">
          <path d="M120 9v222M9 120h222M30 30h26m-26 0v26m180-26h-26m26 0v26M30 210h26m-26 0v-26m180 26h-26m26 0v-26" />
          <path d="m120 47 73 73-73 73-73-73zm0 22 51 51-51 51-51-51z" />
          <circle cx="120" cy="120" r="31" strokeDasharray="2 5" />
        </svg>
        <span className="contact-terminal__point" data-contact-terminal />
        <span className="contact-terminal__label">{chapter} / Signal endpoint</span>
      </div>
      <div className="exhibit-container closing-inner contact-content">
        <p className="closing-kicker"><b>{chapter}</b> / Contact</p>
        <h2 id="contact-heading">Have something worth building?</h2>
        <p>Let’s turn a complex idea into a thoughtful digital product.</p>
        <ul className="contact-links" aria-label="Contact channels">
          <li><a className="closing-link" href={portfolioIdentity.github}>GitHub <span aria-hidden="true">↗</span></a></li>
          <li><a className="closing-link" href={portfolioIdentity.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a></li>
        </ul>
      </div>
      <footer className="exhibit-container closing-inner contact-footer">
        <span>SMT / The Engineering Exhibit</span>
        <a href="#intro">Back to top <span aria-hidden="true">↑</span></a>
      </footer>
    </section>
  );
}

export function Finale() {
  return (
    <>
      <EngineeringToolbox />
      <ExperienceAbout />
      <CredentialsArchive />
      {publishedNotes.length > 0 && <EngineeringNotes />}
      <ContactScene />
      <FinaleMotion />
    </>
  );
}
