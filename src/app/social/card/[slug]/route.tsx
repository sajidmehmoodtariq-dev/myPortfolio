import { ImageResponse } from "next/og";
import { portfolioIdentity } from "@/content/portfolio";
import { projects } from "@/content/projects";

const indexSlug = "case-studies";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: indexSlug }, ...projects.map(({ slug }) => ({ slug }))];
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project && slug !== indexSlug) return new Response(null, { status: 404 });

  return new ImageResponse(
    <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", flexDirection: "column",
      padding: 72, background: "#0b1310", color: "#f3f4ef", border: "1px solid #293830" }}>
      <div style={{ display: "flex", color: "#e78a55", fontSize: 24, letterSpacing: 4 }}>SMT / THE ENGINEERING EXHIBIT</div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", maxWidth: 800 }}>
        <div style={{ display: "flex", color: "#94a69b", fontSize: 25 }}>{project?.category ?? "Selected engineering work"}</div>
        <div style={{ display: "flex", fontWeight: 700, fontSize: 96, letterSpacing: -6, marginTop: 8 }}>
          {project?.name ?? "Case studies"}
        </div>
        <div style={{ display: "flex", color: "#c1cbc2", fontSize: 31, lineHeight: 1.3, marginTop: 10 }}>
          {project?.focus ?? "Architecture, implementation decisions, and source evidence"}
        </div>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #465a4e", paddingTop: 20, fontSize: 23, color: "#94a69b" }}>
        {portfolioIdentity.name}
      </div>
      <svg width="252" height="392" viewBox="0 0 252 392" style={{ position: "absolute", right: 55, top: 120 }}>
        <path d="M14 183l112-60 112 60v111l-112 61-112-61zm0 0 112 61 112-61m-112 61v111m0-232v121" fill="none" stroke="#536a5c" strokeWidth="2" />
        <path d="M16 283C50 243 230 266 231 167S66 100 127 9" fill="none" stroke="#e78a55" strokeWidth="3" strokeLinecap="round" />
        <circle cx="127" cy="9" r="6" fill="#e78a55" />
      </svg>
    </div>,
    { width: 1200, height: 630 },
  );
}
