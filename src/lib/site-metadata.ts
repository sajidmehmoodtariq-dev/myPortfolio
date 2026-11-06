import type { Metadata } from "next";
import { portfolioIdentity } from "@/content/portfolio";

export const siteName = "The Engineering Exhibit";

function readSiteOrigin() {
  const value = process.env.SITE_URL?.trim();
  if (!value) return undefined;

  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password ||
    url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must be the HTTPS origin of the public portfolio.");
  }
  return url;
}

export const siteOrigin = readSiteOrigin();

export function publicUrl(path: string) {
  return siteOrigin ? new URL(path, siteOrigin).href : undefined;
}

export function pageMetadata({
  title,
  description,
  path,
  publishedOn,
}: {
  title: string;
  description: string;
  path: string;
  publishedOn?: string;
}): Metadata {
  const url = publicUrl(path);
  const image = publicUrl("/social/portfolio.png");
  const images = image ? [{
    url: image,
    width: 1200,
    height: 630,
    alt: `${portfolioIdentity.name} — ${siteName}`,
  }] : undefined;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      ...(publishedOn ? { type: "article", publishedTime: publishedOn } : { type: "website" }),
      siteName,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
