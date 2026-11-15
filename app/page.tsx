import { Storyboard } from "../components/storyboard";
import { EngineeringChapters } from "../components/engineering-chapters";
import { ClosingChapters } from "../components/closing-chapters";
import Image from "next/image";
import Link from "next/link";
import { credentials } from "../content/credentials";
import { getProject } from "../content/projects";
import { chapters, projectStops, projectSlugs } from "../content/storyboard";

export default function Home() {
  return (
    <Storyboard chapters={chapters}>
      <section id="arrival" className="chapter chapter--arrival" aria-labelledby="arrival-title">
        <p className="eyebrow"><span /> SAJID MEHMOOD TARIQ</p>
        <h1 id="arrival-title">
          <span>I build things</span>
          <span>that work</span>
          <span className="quiet">beautifully.</span>
        </h1>
        <p className="role">Software Engineer <b>·</b> Full-Stack Developer <b>·</b> AI/ML</p>
        <p className="lede">Building thoughtful digital products, intelligent systems, and tools for the people who use them.</p>
        <a className="chapter-link" href="#disassembly"><span aria-hidden="true">↓</span> Explore the assembly</a>
      </section>
      <section id="disassembly" className="chapter chapter--disassembly" aria-labelledby="disassembly-title">
        <p className="eyebrow"><span /> 02 / INSIDE THE CORE</p>
        <h2 id="disassembly-title">Every system<br />has a <em>story.</em></h2>
        <p className="lede">From computer science fundamentals to software built for real users.</p>
        <ul className="parts">
          <li><span>01</span> Ceramic cover</li>
          <li><span>02</span> Optical interface</li>
          <li><span>03</span> Precision bezel</li>
          <li><span>04</span> Logic assembly</li>
          <li><span>05</span> Aluminum chassis</li>
        </ul>
        <a className="chapter-link" href="#credentials"><span aria-hidden="true">↓</span> Explore the credentials</a>
      </section>
      <section id="credentials" className="chapter chapter--credentials" aria-labelledby="credentials-title">
        <p className="eyebrow"><span /> 03 / LEARNING ARCHIVE</p>
        <h2 id="credentials-title">Built on <em>curiosity.</em></h2>
        <p className="lede">From the fundamentals of computer science to the foundations of artificial intelligence.</p>
        <nav className="credential-index" aria-label="Choose a certificate">
          {credentials.map(({ id, code }) => <a key={id} href={`#${id}`} data-credential-link>{code}</a>)}
        </nav>
        <div className="credential-entries">
          {credentials.map((credential) => (
            <article key={credential.id} id={credential.id} className="credential-entry" aria-labelledby={`${credential.id}-title`}>
              <p className="credential-year">{credential.issuer} · {credential.year}</p>
              <h3 id={`${credential.id}-title`}>{credential.title}</h3>
              <p className="credential-detail">{credential.coursework} {credential.id === "cs50-ai" && "Project-based AI with Python."}</p>
              <div className="credential-actions">
                <a href={`/certificates/${credential.id}`} target="_blank" rel="noopener" aria-label={`View full certificate — ${credential.code}`}>View full certificate ↗</a>
                <a href={credential.verificationUrl} target="_blank" rel="noopener" aria-label={`Verify credential — ${credential.code}`}>Verify credential ↗</a>
              </div>
              <Image className="credential-fallback" src={credential.preview} width={1440} height={1113} unoptimized
                alt={`${credential.code} course completion certificate for ${credential.recipient}`} />
            </article>
          ))}
        </div>
        <p className="credential-note">Harvard CS50 course completions · BS Computer Science at UET Lahore, New Campus (KSK)</p>
        <a className="chapter-link" href="#transformation"><span aria-hidden="true">↓</span> Continue to selected work</a>
      </section>
      <section id="transformation" className="chapter chapter--transformation" aria-labelledby="transformation-title">
        <p className="eyebrow"><span /> 04 / SELECTED WORK</p>
        <h2 id="transformation-title">Things I&apos;ve<br /> brought to <em>life.</em></h2>
        <p className="lede">From real-world platforms to intelligent tools and experiments.</p>
        <nav className="project-index" aria-label="Choose a project">
          {projectStops.map(({ id }, index) => (
            <a key={id} href={`#${id}`} data-project-link>{getProject(projectSlugs[index])?.name}</a>
          ))}
        </nav>
        <div className="project-entries">
          {projectStops.map(({ id }, index) => {
            const project = getProject(projectSlugs[index]);
            if (!project) return null;
            const previous = projectStops[index - 1];
            const next = projectStops[index + 1];
            return (
              <article key={id} id={id} className="project-entry" aria-labelledby={`${id}-title`}>
                <div className="project-heading">
                  <h3 id={`${id}-title`}>{project.name}</h3>
                  <p className="project-count">{String(index + 1).padStart(2, "0")} / {String(projectStops.length).padStart(2, "0")}</p>
                </div>
                <p className="project-category">{project.category}</p>
                <p className="project-detail">{project.summary}</p>
                <p className="project-stack">{project.stack.join(" · ")}</p>
                <p className="project-note">{project.exhibit}</p>
                <div className="project-controls">
                  <Link href={`/work/${project.slug}`} prefetch={false}>Read case study <span aria-hidden="true">↗</span></Link>
                  <div>
                    {previous && <a href={`#${previous.id}`} aria-label="Previous project">←</a>}
                    {next && <a href={`#${next.id}`} aria-label="Next project">→</a>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <Link className="work-index-link" href="/work" prefetch={false}>View all work <span aria-hidden="true">↗</span></Link>
      </section>
      <EngineeringChapters />
      <ClosingChapters />
    </Storyboard>
  );
}
