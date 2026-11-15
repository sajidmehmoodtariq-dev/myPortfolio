import { portfolioIdentity } from "./identity";

type Credential = {
  id: string;
  code: string;
  title: string;
  issuer: string;
  kind: "course-completion";
  recipient: string;
  year: number;
  coursework: string;
  verificationUrl: string;
  pdf: string;
  preview: string;
  inspectionPreview: string;
};

export const credentials = [
  {
    id: "cs50x",
    code: "CS50x",
    title: "Introduction to Computer Science",
    issuer: "Harvard University · CS50",
    kind: "course-completion",
    recipient: portfolioIdentity.name,
    year: 2025,
    coursework: "Ten problem sets and one final project.",
    pdf: "/credentials/cs50x.pdf",
    preview: "/credentials/cs50x-1440.webp",
    inspectionPreview: "/credentials/cs50x-2200.webp",
    verificationUrl: "https://cs50.harvard.edu/certificates/f5aa59ca-26eb-4289-af0e-ccf00f4feb78",
  },
  {
    id: "cs50-ai",
    code: "CS50 AI",
    title: "CS50’s Introduction to Artificial Intelligence with Python",
    issuer: "Harvard University · CS50",
    kind: "course-completion",
    recipient: portfolioIdentity.name,
    year: 2026,
    coursework: "Twelve projects.",
    pdf: "/credentials/cs50ai.pdf",
    preview: "/credentials/cs50ai-1440.webp",
    inspectionPreview: "/credentials/cs50ai-2200.webp",
    verificationUrl: "https://cs50.harvard.edu/certificates/fd45fc07-954c-46de-bcbe-1e4597d3426c",
  },
] as const satisfies readonly Credential[];
