import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { publishedNotes } from "@/content/notes";

export default function NotFound() {
  return (
    <>
      <SiteHeader onHomepage={false} showNotes={publishedNotes.length > 0} />
      <main id="main-content" className="exhibit-container py-24" tabIndex={-1}>
        <p className="font-mono text-accent">404</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Page not found</h1>
        <div className="mt-8 flex flex-wrap gap-5 underline underline-offset-4">
          <Link href="/">Back to the portfolio</Link>
          <Link href="/work">Browse case studies</Link>
        </div>
      </main>
    </>
  );
}
