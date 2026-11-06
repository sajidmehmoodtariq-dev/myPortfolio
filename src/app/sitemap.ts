import type { MetadataRoute } from "next";
import { publishedNotes } from "@/content/notes";
import { projects } from "@/content/projects";
import { indexable, publicUrl } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];

  return [
    "/",
    "/work",
    ...projects.map(({ slug }) => `/work/${slug}`),
    ...publishedNotes.map(({ slug }) => `/notes/${slug}`),
  ].flatMap((path) => {
    const url = publicUrl(path);
    return url ? [{ url }] : [];
  });
}
