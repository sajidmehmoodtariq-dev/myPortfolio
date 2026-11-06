import { Finale } from "@/components/finale/finale";
import { Hero } from "@/components/hero/hero";
import { PageMotion } from "@/components/page-motion";
import { SiteHeader } from "@/components/site-header";
import { portfolioPerson, StructuredData } from "@/components/structured-data";
import { SelectedWork } from "@/components/work/selected-work";
import { portfolioIdentity } from "@/content/portfolio";
import { publishedNotes } from "@/content/notes";
import { pageMetadata, publicUrl, siteName } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: `${portfolioIdentity.name} | Full-Stack Developer`,
  description: "Portfolio of Sajid Mehmood Tariq, software engineer and full-stack developer in Lahore. Explore institutional software, developer tools, and applied AI projects.",
  path: "/",
});

const profile = {
  "@type": "ProfilePage",
  url: publicUrl("/"),
  mainEntity: portfolioPerson(),
};

export default function Home() {
  return (
    <>
      <StructuredData entries={[
        { "@type": "WebSite", "@id": publicUrl("/#website"), url: publicUrl("/"), name: siteName, alternateName: portfolioIdentity.name },
        profile,
      ]} />
      <SiteHeader showNotes={publishedNotes.length > 0} />
      <main id="main-content" className="portfolio-main" tabIndex={-1}>
        <Hero chapterCount={publishedNotes.length > 0 ? "06" : "05"} />
        <SelectedWork />
        <Finale />
        <PageMotion />
      </main>
    </>
  );
}
