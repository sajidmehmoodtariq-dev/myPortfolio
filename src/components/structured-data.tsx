import { portfolioIdentity } from "@/content/portfolio";
import { publicUrl } from "@/lib/site-metadata";

export function portfolioPerson() {
  return {
    "@type": "Person",
    "@id": publicUrl("/#sajid"),
    name: portfolioIdentity.name,
    url: publicUrl("/"),
    jobTitle: portfolioIdentity.role,
    sameAs: [portfolioIdentity.github, portfolioIdentity.linkedin],
  };
}

export function breadcrumbs(items: readonly { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: publicUrl(path),
    })),
  };
}

export function StructuredData({ entries }: { entries: readonly Record<string, unknown>[] }) {
  if (!publicUrl("/")) return null;

  const data = { "@context": "https://schema.org", "@graph": entries };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }} />;
}
