import Link from "next/link";
import { capabilities, journey } from "../content/experience";
import { portfolioIdentity } from "../content/identity";
import { getProject } from "../content/projects";
import { writing } from "../content/writing";
import { ReadingLinks } from "./engineering-chapters";

const aboutSections = [
  { id: "about-profile", label: "Profile" },
  { id: "about-journey", label: "Journey" },
  { id: "about-skills", label: "Skills" },
];

export function ClosingChapters() {
  const { name, location, education, linkedin, github } = portfolioIdentity;
  return (
    <>
      <section id="about" className="chapter chapter--about" aria-labelledby="about-title">
        <p className="eyebrow"><span /> 07 / ABOUT &amp; EXPERIENCE</p>
        <h2 id="about-title">{name}</h2>
        <p className="about-location">{location}</p>
        <nav className="engineering-index about-index" aria-label="About sections">
          {aboutSections.map(({ id, label }) => <a key={id} href={`#${id}`} data-engineering-link="about">{label}</a>)}
        </nav>
        <div className="engineering-dossiers about-dossiers">
          <article id="about-profile" className="engineering-dossier" data-engineering-entry="about" aria-labelledby="about-profile-title">
            <h3 id="about-profile-title">What I build</h3>
            <p className="engineering-detail">I build full-stack software for clients as a freelancer. My independent work spans product engineering, intelligent systems, AI/ML, developer tools, and creative technology. I like following a design decision from the interface through to the data and seeing what it changes for the people using it.</p>
            <p className="about-education">{education.program} at UET Lahore, {education.campus}.</p>
          </article>
          <article id="about-journey" className="engineering-dossier" data-engineering-entry="about" aria-labelledby="about-journey-title">
            <h3 id="about-journey-title">Professional journey</h3>
            <ol className="journey-list">
              {journey.map(({ label, detail, year }) => (
                <li key={label}>
                  {year ? <time dateTime={String(year)}>{year}</time> : <span aria-hidden="true">·</span>}
                  <div><strong>{label}</strong><p>{detail}</p></div>
                </li>
              ))}
            </ol>
          </article>
          <article id="about-skills" className="engineering-dossier" data-engineering-entry="about" aria-labelledby="about-skills-title">
            <h3 id="about-skills-title">Capabilities in practice</h3>
            <ul className="capability-list">
              {capabilities.map(({ name: capability, example, project, source }) => {
                const entry = getProject(project)!;
                return (
                  <li key={capability}>
                    <strong>{capability}</strong>
                    {source
                      ? <a href={source} title={`${entry.name} implementation`}>{example} <span aria-hidden="true">↗</span></a>
                      : <Link href={`/work/${project}`} prefetch={false} title={`${entry.name} case study`}>{example} <span aria-hidden="true">↗</span></Link>}
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
        <div className="engineering-actions">
          <a href="#finale">Contact <span aria-hidden="true">→</span></a>
          {writing.length > 0 && <Link href="/notes">Engineering Notes <span aria-hidden="true">↗</span></Link>}
          <ReadingLinks chapter="about" />
        </div>
      </section>
      <section id="finale" className="chapter chapter--finale" aria-labelledby="finale-title">
        <p className="eyebrow"><span /> 08 / FINAL ASSEMBLY</p>
        <h2 id="finale-title">Have something<br /> worth <em>building?</em></h2>
        <p className="lede">Let&apos;s turn an ambitious idea into thoughtful software.</p>
        <a className="contact-primary" href={linkedin}>Message me on LinkedIn <span aria-hidden="true">↗</span></a>
        <nav className="contact-profiles" aria-label={`${name} profiles`}>
          <a href={github}>GitHub <span aria-hidden="true">↗</span></a>
          <a href={linkedin}>LinkedIn <span aria-hidden="true">↗</span></a>
        </nav>
        <div className="engineering-actions">
          <a href="#arrival"><span aria-hidden="true">↑</span> Back to beginning</a>
          <ReadingLinks chapter="finale" />
        </div>
      </section>
    </>
  );
}
