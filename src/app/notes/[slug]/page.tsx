import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { SiteHeader } from "@/components/site-header";
import { portfolioPerson, StructuredData } from "@/components/structured-data";
import { formatNoteDate, publishedNotes } from "@/content/notes";
import { pageMetadata, publicUrl } from "@/lib/site-metadata";
import "./note.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNotes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = publishedNotes.find((entry) => entry.slug === slug);
  if (!note) notFound();

  return pageMetadata({
    title: `${note.title} | SMT Engineering Notes`,
    description: note.summary,
    path: `/notes/${note.slug}`,
    publishedOn: note.publishedOn,
  });
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = publishedNotes.find((entry) => entry.slug === slug);
  if (!note) notFound();

  const body = await readFile(path.join(process.cwd(), "src/content/notes", `${note.slug}.md`), "utf8");

  return (
    <>
      <StructuredData entries={[{
        "@type": "BlogPosting",
        headline: note.title,
        description: note.summary,
        datePublished: note.publishedOn,
        mainEntityOfPage: publicUrl(`/notes/${note.slug}`),
        author: portfolioPerson(),
      }]} />
      <SiteHeader onHomepage={false} showNotes />
      <main id="main-content" tabIndex={-1} className="note-page exhibit-container">
        <Link className="note-page__back" href="/#notes">← Engineering notes</Link>
        <article>
          <header>
            <p className="note-page__metadata">{note.topic} / <time dateTime={note.publishedOn}>{formatNoteDate(note.publishedOn)}</time></p>
            <h1>{note.title}</h1>
            <p className="note-page__summary">{note.summary}</p>
          </header>
          <div className="note-page__prose">
            <Markdown skipHtml components={{ h1: "h2" }}>{body}</Markdown>
          </div>
        </article>
      </main>
    </>
  );
}
