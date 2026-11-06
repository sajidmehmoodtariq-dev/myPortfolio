import { portfolioIdentity } from "./portfolio";

function documentPaths(id: string) {
  return {
    preview: `/credentials/${id}-1440.webp`,
    compactPreview: `/credentials/${id}-720.webp`,
    inspectionPreview: `/credentials/${id}-2200.webp`,
    pdf: `/credentials/${id}.pdf`,
  };
}

export const credentials = [
  {
    id: "cs50x",
    code: "CS50x",
    title: "Introduction to Computer Science",
    issuer: "Harvard University · CS50",
    year: 2025,
    recipient: portfolioIdentity.name,
    completion: "Ten problem sets and one final project.",
    verificationUrl: "https://cs50.harvard.edu/certificates/f5aa59ca-26eb-4289-af0e-ccf00f4feb78",
    ...documentPaths("cs50x"),
  },
  {
    id: "cs50ai",
    code: "CS50 AI",
    title: "CS50’s Introduction to Artificial Intelligence with Python",
    issuer: "Harvard University · CS50",
    year: 2026,
    recipient: portfolioIdentity.name,
    completion: "Twelve projects.",
    verificationUrl: "https://cs50.harvard.edu/certificates/fd45fc07-954c-46de-bcbe-1e4597d3426c",
    ...documentPaths("cs50ai"),
  },
] as const;

export type Credential = (typeof credentials)[number];
