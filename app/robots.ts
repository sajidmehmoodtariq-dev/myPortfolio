import type { MetadataRoute } from "next";
import { portfolioIdentity } from "../content/identity";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(process.env.VERCEL_ENV === "preview" ? { disallow: "/" } : { allow: "/" }) },
    sitemap: new URL("/sitemap.xml", portfolioIdentity.siteUrl).href,
  };
}
