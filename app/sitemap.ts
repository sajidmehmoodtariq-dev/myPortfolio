import type { MetadataRoute } from "next";
import { portfolioIdentity } from "../content/identity";
import { projects } from "../content/projects";
import { credentials } from "../content/credentials";
import { writing } from "../content/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", ...projects.map(project => `/work/${project.slug}`),
    ...credentials.map(credential => `/certificates/${credential.id}`),
    ...(writing.length ? ["/notes", ...writing.map(note => `/notes/${note.slug}`)] : [])];
  return paths.map(path => ({ url: new URL(path, portfolioIdentity.siteUrl).href }));
}
