import type { MetadataRoute } from "next";
import { publishedNotes } from "@/content/notes";
import { projects } from "@/content/projects";
import { publicUrl, siteOrigin } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];

  return [
    "/",
    ...projects.map(({ slug }) => `/work/${slug}`),
    ...publishedNotes.map(({ slug }) => `/notes/${slug}`),
  ].flatMap((path) => {
    const url = publicUrl(path);
    return url ? [{ url }] : [];
  });
}
