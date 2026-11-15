import { ImageResponse } from "next/og";
import { portfolioIdentity } from "../../../content/identity";
import { projects } from "../../../content/projects";
import { caseStudies } from "../../../content/case-studies";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return [{ slug: "home" }, ...projects.map(project => ({ slug: project.slug }))]; }

const accents: Record<string, string> = { institution: "#225a62", career: "#814426", terminal: "#355752", document: "#355b6b", mobile: "#57417e" };

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(entry => entry.slug === slug);
  if (slug !== "home" && !project) return new Response("Not found", { status: 404 });
  const accent = project ? accents[caseStudies[project.slug].accent] : "#225a62";
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#f5f4f0", color: "#0f172a", padding: "50px 64px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #c9c8be", paddingBottom: 22, fontSize: 22 }}>
        <span>{portfolioIdentity.siteName}</span><span style={{ color: accent }}>{project ? "ENGINEERING CASE STUDY" : "SOFTWARE ENGINEER / LAHORE"}</span>
      </div>
      <div style={{ display: "flex", marginTop: 34, color: accent, fontSize: 28 }}>{project?.category || portfolioIdentity.name}</div>
      <div style={{ display: "flex", marginTop: 14, maxWidth: 1050, fontSize: project ? 100 : 78, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-4px" }}>
        {project?.name || "I build things that work beautifully."}
      </div>
      <div style={{ display: "flex", marginTop: 28, maxWidth: 990, fontSize: 27, lineHeight: 1.35, color: "#525f70" }}>
        {project?.summary || "Full-stack products, intelligent systems and developer tools."}
      </div>
      <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", borderTop: "1px solid #c9c8be", paddingTop: 20, fontSize: 21 }}>
        <span>{project ? project.stack.slice(0, 4).join(" / ") : portfolioIdentity.role}</span>
        <span style={{ color: accent }}>{new URL(portfolioIdentity.siteUrl).hostname}</span>
      </div>
    </div>, { width: 1200, height: 630 },
  );
}
