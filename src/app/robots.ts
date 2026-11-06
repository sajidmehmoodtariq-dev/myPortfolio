import type { MetadataRoute } from "next";
import { publicUrl, siteOrigin } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return siteOrigin ? {
    rules: { userAgent: "*", allow: "/" },
    sitemap: publicUrl("/sitemap.xml"),
  } : {
    rules: { userAgent: "*", disallow: "/" },
  };
}
