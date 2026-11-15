import { CanvasTexture, SRGBColorSpace } from "three";

const ink = "#182536";

export function createProjectDisplay(anisotropy: number, onTextureReady: () => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 947;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(canvas.width / 1200, canvas.height / 740);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;

  function rect(x: number, y: number, w: number, h: number, color: string, radius = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  }

  function text(value: string, x: number, y: number, size: number, color = ink, weight = 550, mono = false) {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${mono ? "monospace" : "system-ui, sans-serif"}`;
    ctx.fillText(value, x, y);
  }

  function lines(values: readonly string[], x: number, y: number, size: number, leading: number, color = ink, mono = false) {
    values.forEach((value, index) => text(value, x, y + index * leading, size, color, 550, mono));
  }

  function title(name: string, category: string, background: string, accent: string, dark = false) {
    rect(0, 0, 1200, 740, background);
    rect(36, 43, 9, 39, accent);
    text(name, 63, 81, 51, dark ? "#f9f5eb" : ink, 760);
    text(category, 38, 128, 24, dark ? "#b4c4d5" : "#44586b", 650, true);
  }

  function disclosure(value = "ILLUSTRATIVE TECHNICAL DEMONSTRATION", dark = false) {
    text(value, 38, 701, 21, dark ? "#a7bacb" : "#405567", 600, true);
  }

  function institutional() {
    title("PGC-DHA", "INSTITUTIONAL MANAGEMENT SYSTEM", "#edf1f2", "#287999");
    rect(38, 161, 1124, 488, "#fff", 18);
    rect(38, 161, 269, 488, "#162d3f", 18);
    text("OPERATIONS", 63, 219, 25, "#abd4e4", 700, true);
    rect(53, 241, 238, 60, "#244b63", 7);
    lines(["Admissions", "Student records", "Roles", "Reporting"], 72, 282, 27, 72, "#f2f7f8");
    text("Admissions workflow", 343, 236, 50, ink, 730);
    text("Enquiry states and permission-gated reporting", 343, 279, 25, "#4c6676");
    const states = ["Enquiry", "Admission fee", "Admitted"];
    states.forEach((state, index) => {
      const x = 343 + index * 269;
      rect(x, 324, 245, 141, ["#e1eef4", "#f6eedc", "#e5efe8"][index], 12);
      text(`0${index + 1}`, x + 18, 366, 23, "#37566b", 700, true);
      text(state, x + 18, 419, 29, ink, 680);
    });
    rect(343, 498, 783, 109, "#eef3f6", 12);
    text("Reports", 365, 545, 31, ink, 720);
    text("Access controlled by role", 365, 579, 25, "#4c6676");
    disclosure("WORKFLOW ILLUSTRATION / NO INSTITUTIONAL RECORDS");
  }

  function resume() {
    title("ResumeIQ", "SEMANTIC MATCHING WORKBENCH", "#f2ebe2", "#a85432");
    rect(38, 161, 1124, 482, "#faf7f1", 18);
    const panels = [
      { x: 59, w: 310, title: "Resume", note: "INPUT 01", content: ["Example experience", "Built a REST API", "Wrote integration tests", "Documented endpoints"] },
      { x: 387, w: 320, title: "Job description", note: "INPUT 02", content: ["Example requirements", "API development", "Automated testing", "Technical documentation"] },
      { x: 725, w: 415, title: "Analysis", note: "RESULT CATEGORIES", content: ["Semantic fit", "Skill coverage", "Experience context", "Model-assisted feedback"] },
    ];
    for (const panel of panels) {
      rect(panel.x, 187, panel.w, 424, "#fff", 10);
      text(panel.note, panel.x + 18, 232, 20, "#8a4f38", 650, true);
      text(panel.title, panel.x + 18, 294, 37, ink, 720);
      panel.content.forEach((line, index) => {
        rect(panel.x + 18, 324 + index * 63, panel.w - 36, 47, index === 0 ? "#f3e5d8" : "#f7f4ef", 6);
        text(line, panel.x + 29, 355 + index * 63, 22, ink, index === 0 ? 690 : 550);
      });
    }
    disclosure("ILLUSTRATIVE INPUTS / RESULT CATEGORIES ONLY");
  }

  function ledger() {
    title("Ledger", "VS CODE EXECUTION CAPTURE", "#182333", "#76c6a6", true);
    rect(38, 165, 524, 476, "#202e40", 12);
    rect(578, 165, 584, 476, "#223144", 12);
    text("EDITOR / totals.py", 64, 221, 27, "#c6d8eb", 650, true);
    rect(62, 245, 472, 137, "#182433", 7);
    lines(["items = [2, 3]", "print(sum(items))"], 84, 301, 32, 54, "#bde3d3", true);
    text("TERMINAL / CAPTURED RUN", 64, 438, 23, "#b8cadb", 650, true);
    rect(62, 460, 472, 146, "#101b29", 7);
    lines(["$ python totals.py", "5"], 86, 515, 28, 48, "#eff5f2", true);
    text("RECORDED SOURCE DIFF", 602, 221, 26, "#c6d8eb", 650, true);
    rect(602, 250, 536, 67, "#513445", 7);
    rect(602, 330, 536, 67, "#235048", 7);
    lines(["− items = [2, 2]", "+ items = [2, 3]"], 623, 293, 32, 80, "#f6f4ed", true);
    lines(["SHA-256 code snapshot", "Source and stdout compared", "History stored per workspace"], 602, 466, 27, 51, "#a9c8dc");
    disclosure("ILLUSTRATIVE CODE AND OUTPUT / SYNTHETIC RUN", true);
  }

  function folio() {
    title("Folio", "LOCAL DOCUMENT QUESTION ANSWERING", "#e7edf4", "#466eaa");
    rect(38, 165, 426, 477, "#fff", 11);
    rect(482, 165, 680, 477, "#f9fbff", 11);
    text("EXAMPLE PDF", 61, 220, 23, "#466eaa", 700, true);
    text("Systems notes", 61, 274, 43, ink, 730);
    lines(["Page 1", "A cache stores copies", "of frequently used data", "for quicker access."], 61, 333, 30, 48, "#364f69");
    rect(61, 534, 367, 69, "#e7eef8", 7);
    text("P. 1  /  SOURCE PASSAGE", 77, 577, 20, "#355d96", 650, true);
    text("Question", 510, 226, 27, "#466eaa", 700, true);
    text("Why keep a cache?", 510, 280, 42, ink, 720);
    rect(510, 311, 622, 117, "#e4edf9", 9);
    text("RETRIEVED PASSAGE", 532, 352, 22, "#355d96", 700, true);
    text("“A cache stores copies…”", 532, 401, 29, ink);
    text("LOCAL MODEL ANSWER", 510, 489, 22, "#355d96", 700, true);
    lines(["A cache makes frequently used", "data quicker to access. [p. 1]"], 510, 542, 31, 49, ink);
    disclosure("ILLUSTRATIVE ANSWER / AUTHORED SAMPLE DOCUMENT");
  }

  let image: HTMLImageElement | undefined;

  function nudge() {
    title("Nudge", "MOBILE REMINDER LIFECYCLE", "#eee8f6", "#7054a0");
    const steps = [
      ["01", "Enter a reminder", "Capture the reminder label and time."],
      ["02", "Save it locally", "Persist the reminder on the device."],
      ["03", "Schedule the alert", "Trigger a device notification when due."],
    ];
    steps.forEach(([number, heading, detail], index) => {
      const y = 174 + index * 153;
      rect(38, y, 708, 129, "#faf7fc", 12);
      text(number, 59, y + 48, 25, "#7054a0", 700, true);
      text(heading, 116, y + 56, 39, "#281e3c", 730);
      text(detail, 116, y + 99, 25, "#4d4060");
    });
    const height = 602;
    const width = height * 1080 / 2400;
    rect(844, 48, width + 24, height + 24, "#201a29", 20);
    if (image?.complete && image.naturalWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(856, 60, width, height, 13);
      ctx.clip();
      ctx.drawImage(image, 856, 60, width, height);
      ctx.restore();
    }
    disclosure("REPOSITORY ANDROID CAPTURE / ANNOTATED LIFECYCLE");
  }

  const exhibits = [institutional, resume, ledger, folio, nudge];
  let active = -1;
  let disposed = false;

  function draw() {
    exhibits[active]();
    texture.needsUpdate = true;
  }

  function show(index: number) {
    if (index !== active) {
      active = index;
      draw();
    }
    if (index >= 3 && !image) {
      image = new Image();
      image.onload = () => {
        if (disposed || active !== 4) return;
        draw();
        onTextureReady();
      };
      image.src = "/work/nudge-notification.jpg";
    }
  }

  return {
    texture, show,
    get imageReady() { return Boolean(image?.complete && image.naturalWidth); },
    dispose() {
      disposed = true;
      if (image) image.onload = null;
    },
  };
}
