import type { MetadataRoute } from "next";
import { indexable, isVercelPreview, publicUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  if (indexable) return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: publicUrl("/sitemap.xml"),
  };
  // Public previews must be crawlable for search engines to see their noindex.
  return { rules: isVercelPreview ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" } };
}
