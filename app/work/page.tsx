import Link from "next/link";
import { projects } from "../../content/projects";
import styles from "./[slug]/project.module.css";

export const metadata = { title: "Selected Work" };

export default function WorkIndex() {
  return (
    <main className={styles.shell}>
      <Link className={styles.back} href="/#transformation">← Back to the exhibition</Link>
      <section className={styles.content} aria-labelledby="work-title" data-reveal="intro">
        <p className={styles.label}>Engineering portfolio</p>
        <h1 id="work-title">Selected work</h1>
        <p className={styles.summary}>From real-world platforms to intelligent tools and experiments.</p>
        <ol className={styles.index}>
          {projects.map((project) => (
            <li key={project.slug} data-reveal>
              <Link href={`/work/${project.slug}`}>
                <strong>{project.name}</strong>
                <span>{project.category}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
