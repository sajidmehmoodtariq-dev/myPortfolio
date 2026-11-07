import { CanvasTexture, SRGBColorSpace } from "three";

export function createDisplayTexture(anisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 947;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(canvas.width / 1200, canvas.height / 740);

  function block(x: number, y: number, width: number, height: number, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  function label(value: string, x: number, y: number, size: number, color: string, weight = 500) {
    ctx.font = `${weight} ${size}px system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  }

  block(0, 0, 1200, 740, "#f0f3f3");
  block(0, 0, 252, 740, "#142331");
  block(252, 0, 948, 88, "#fff");
  block(252, 87, 948, 2, "#c9d4d8");
  block(30, 30, 9, 30, "#69c6e4");
  label("PGC-DHA", 52, 59, 39, "#f9fbfc", 720);
  label("MODULES", 30, 157, 23, "#a4b8c7", 660);

  const modules = ["Admissions", "Students", "Access", "Reporting"];
  for (const [index, title] of modules.entries()) {
    const y = 181 + index * 79;
    if (index === 0) block(14, y, 224, 63, "#234259");
    block(31, y + 25, 8, 8, index === 0 ? "#69c6e4" : "#8499a9");
    label(title, 53, y + 40, 30, "#f0f6fa", 590);
  }

  label("INSTITUTIONAL MANAGEMENT SYSTEM", 298, 55, 29, "#324657", 660);
  label("Operations overview", 298, 172, 65, "#132434", 730);
  label("TECHNICAL VISUALIZATION", 301, 219, 29, "#38647c", 660);
  const captions = ["Intake and enquiries", "Student management", "Role-based access", "Operational reports"];
  for (const [index, title] of modules.entries()) {
    const x = 298 + (index % 2) * 435;
    const y = 253 + Math.floor(index / 2) * 185;
    block(x, y, 417, 164, "#cfdadd");
    block(x + 2, y + 2, 413, 160, "#fff");
    block(x + 24, y + 25, 47, 5, index === 2 ? "#b96137" : "#397f9f");
    label(`0${index + 1}`, x + 352, y + 49, 24, "#466679", 650);
    label(title, x + 24, y + 94, 45, "#172a3b", 715);
    label(captions[index], x + 24, y + 135, 30, "#4a5c6b");
  }
  label("SCHEMATIC VIEW  /  NO INSTITUTIONAL RECORDS", 298, 683, 27, "#40576a", 650);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}
