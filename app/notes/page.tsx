import Link from "next/link";
import { notFound } from "next/navigation";
import { noteDate, writing } from "../../content/writing";
import styles from "./notes.module.css";
import { socialImage } from "../../content/seo";

export const metadata = {
  title: "Engineering Notes",
  description: "Notes by Sajid Mehmood Tariq on building and inspecting software.",
  alternates: { canonical: "/notes" },
  openGraph: {
    type: "website", url: "/notes", title: "Engineering Notes",
    description: "Notes by Sajid Mehmood Tariq on building and inspecting software.", images: [socialImage()],
  },
};

export default function NotesIndex() {
  if (!writing.length) notFound();

  return (
    <main id="main-content" tabIndex={-1} className={styles.shell}>
      <Link className={styles.back} href="/#about">← About</Link>
      <h1 data-reveal="intro">Engineering Notes</h1>
      <ul className={styles.index}>
        {[...writing].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn)).map((note) => (
          <li key={note.slug} data-reveal>
            <p className={styles.label}>{note.category} · <time dateTime={note.publishedOn}>{noteDate(note.publishedOn)}</time></p>
            <h2><Link href={`/notes/${note.slug}`}>{note.title}</Link></h2>
            <p>{note.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
