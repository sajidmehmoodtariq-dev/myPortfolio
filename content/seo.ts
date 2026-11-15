import { portfolioIdentity } from "./identity";

export const homepageTitle = `${portfolioIdentity.name} — Software Engineer | SMT`;
export const homepageDescription = "Sajid Mehmood Tariq is a software engineer in Lahore building full-stack products, intelligent systems and developer tools. Explore his work and completed CS50 courses.";

export function socialImage(slug = "home", title: string = portfolioIdentity.siteName) {
  return { url: new URL(`/social/${slug}`, portfolioIdentity.siteUrl).href, width: 1200, height: 630,
    alt: `${title} — ${portfolioIdentity.name}` };
}
