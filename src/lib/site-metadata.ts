import type { Metadata } from "next";
import { portfolioIdentity } from "@/content/portfolio";

export const siteName = "The Engineering Exhibit";
const vercelEnvironment = process.env.VERCEL_ENV;

function readSiteOrigin() {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const value = process.env.SITE_URL?.trim() || (productionHost && `https://${productionHost}`);
  if (!value) return undefined;

  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password ||
    url.pathname !== "/" || url.search || url.hash) {
    throw new Error("The public portfolio origin must be a bare HTTPS origin.");
  }
  return url;
}

export const siteOrigin = readSiteOrigin();
export const indexable = Boolean(siteOrigin && (!vercelEnvironment || vercelEnvironment === "production"));
export const isVercelPreview = vercelEnvironment === "preview";

export function publicUrl(path: string) {
  if (!siteOrigin) return undefined;
  return path === "/" ? siteOrigin.origin : new URL(path, siteOrigin).href;
}

export function pageMetadata({
  title,
  description,
  path,
  publishedOn,
  imagePath = "/social/portfolio.png",
  imageAlt = `${portfolioIdentity.name} — ${siteName}`,
}: {
  title: string;
  description: string;
  path: string;
  publishedOn?: string;
  imagePath?: string;
  imageAlt?: string;
}): Metadata {
  const url = publicUrl(path);
  const image = publicUrl(imagePath);
  const images = image ? [{
    url: image,
    width: 1200,
    height: 630,
    alt: imageAlt,
  }] : undefined;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      ...(publishedOn ? { type: "article", publishedTime: publishedOn } : { type: "website" }),
      siteName,
      locale: "en_US",
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
