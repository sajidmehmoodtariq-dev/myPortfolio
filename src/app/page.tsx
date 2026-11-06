import { Finale } from "@/components/finale/finale";
import { Hero } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header";
import { InsideSystem } from "@/components/system/inside-system";
import { SelectedWork } from "@/components/work/selected-work";
import { portfolioIdentity } from "@/content/portfolio";
import { pageMetadata, publicUrl, siteName } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: `${portfolioIdentity.name} | ${siteName}`,
  description: "Portfolio of Sajid Mehmood Tariq, software engineer and full-stack developer in Lahore. Explore institutional software, developer tools, and applied AI projects.",
  path: "/",
});

const profile = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: publicUrl("/"),
  mainEntity: {
    "@type": "Person",
    name: portfolioIdentity.name,
    jobTitle: portfolioIdentity.role,
    url: publicUrl("/"),
    sameAs: [portfolioIdentity.github, portfolioIdentity.linkedin],
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(profile).replace(/</g, "\\u003c"),
      }} />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <SelectedWork />
        <InsideSystem />
        <Finale />
      </main>
    </>
  );
}
