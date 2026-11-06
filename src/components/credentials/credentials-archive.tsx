import { credentials } from "@/content/credentials";
import { CredentialRecords } from "./credential-records";
import "./credentials.css";

export function CredentialsArchive() {
  return (
    <section id="credentials" className="credential-archive closing-chapter" aria-labelledby="credentials-heading" tabIndex={-1}>
      <div className="exhibit-container credential-layout">
        <header className="credential-intro">
          <p className="closing-kicker"><b>05</b> / Credentials archive</p>
          <h2 id="credentials-heading">Proof of<br />the journey<span>.</span></h2>
          <p>From the foundations of computer science to the principles of artificial intelligence.</p>
        </header>
        <CredentialRecords />
        <noscript>
          <ul className="credential-fallback" aria-label="Original documents and official verification">
            {credentials.map(({ id, code, title, year, completion, pdf, verificationUrl }) => (
              <li key={id}>
                <strong>{code} · {year}</strong>
                <p>{title}. {completion}</p>
                <a href={pdf}>Open {code} PDF</a>
                {" · "}
                <a href={verificationUrl}>Verify {code} with CS50</a>
              </li>
            ))}
          </ul>
        </noscript>
      </div>
    </section>
  );
}
