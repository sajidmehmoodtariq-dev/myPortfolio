import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { noteDate, writing } from "../../../content/writing";
import styles from "../notes.module.css";

type NotePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return writing.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = writing.find((entry) => entry.slug === slug);
  if (!note) notFound();

  const canonical = `/notes/${slug}`;
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical },
    openGraph: { type: "article", title: note.title, description: note.summary, url: canonical, publishedTime: note.publishedOn },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = writing.find((entry) => entry.slug === slug);
  if (!note) notFound();

  const markdown = await readFile(join(process.cwd(), "content", "notes", `${note.slug}.md`), "utf8");
  const minutes = Math.max(1, Math.ceil((markdown.match(/\S+/g)?.length ?? 0) / 220));

  return (
    <main className={styles.shell}>
      <Link className={styles.back} href="/notes">← Engineering Notes</Link>
      <article>
        <header data-reveal="intro">
          <p className={styles.label}>{note.category} · <time dateTime={note.publishedOn}>{noteDate(note.publishedOn)}</time> · {minutes} min read</p>
          <h1>{note.title}</h1>
          <p className={styles.summary}>{note.summary}</p>
        </header>
        <div className={styles.prose} data-reveal>
          <Markdown skipHtml components={{ pre: ({ children }) => <pre tabIndex={0}>{children}</pre> }}>{markdown}</Markdown>
        </div>
        {note.references.length > 0 && (
          <section className={styles.references} aria-labelledby="references-title" data-reveal>
            <h2 id="references-title">References</h2>
            <ul>{note.references.map(({ title, href }) => <li key={href}><a href={href}>{title}</a></li>)}</ul>
          </section>
        )}
      </article>
    </main>
  );
}
