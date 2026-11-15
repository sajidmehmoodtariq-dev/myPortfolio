export const storyDuration = 6.13;
export const credentialWindow = { start: .71, switch: 1.077, end: 1.38 } as const;
export const projectInterval = .26;
export const projectExit = 2.72;
export const systemStart = 2.88;
export const labStart = 3.91;
export const aboutStart = 4.72;
export const finaleStart = 5.48;
export const finaleSettled = 5.99;
export const finaleStop = 6.04;
const firstProjectTime = 1.56;
export const projectSlugs = ["pgc-dha", "resumeiq", "ledger", "folio", "nudge"] as const;
export const projectStops = projectSlugs.map((slug, index) => ({
  id: `project-${slug}`, at: firstProjectTime + index * projectInterval,
  time: (firstProjectTime + index * projectInterval) / storyDuration,
}));

export function projectAt(time: number) {
  return Math.max(0, Math.min(projectStops.length - 1, Math.floor((time - firstProjectTime) / projectInterval + .5)));
}

function stopsAt<const T extends string>(ids: readonly T[], first: number, interval: number) {
  return ids.map((id, index) => {
    const at = first + index * interval;
    return { id, at, time: at / storyDuration };
  });
}

export const requestStops = stopsAt(["trace-interface", "trace-request", "trace-api", "trace-auth", "trace-data", "trace-response"], 3.04, .145);
export const labStops = stopsAt(["lab-structura", "lab-inkly", "lab-micro-vlm"], 4.10, .23);
export const aboutStops = stopsAt(["about-profile", "about-journey", "about-skills"], 4.90, .20);

export function stopAt(stops: readonly { at: number }[], time: number) {
  const next = stops.findIndex((stop, index) => index > 0 && time < (stops[index - 1].at + stop.at) / 2);
  return next < 0 ? stops.length - 1 : next - 1;
}

export const chapters = [
  { id: "arrival", name: "Arrival", shortName: "Start", time: 0 },
  { id: "disassembly", name: "Disassembly", shortName: "Core", time: .50 / storyDuration },
  { id: "credentials", name: "Credentials", shortName: "CS50", time: .91 / storyDuration },
  { id: "transformation", name: "Selected Work", shortName: "Work", time: projectStops[0].time },
  { id: "inside-system", name: "Inside the System", shortName: "System", time: requestStops[0].time },
  { id: "engineering-lab", name: "Engineering Lab", shortName: "Lab", time: labStops[0].time },
  { id: "about", name: "About", time: aboutStops[0].time },
  { id: "finale", name: "Contact", time: finaleStop / storyDuration },
];

export const credentialStops = [
  { id: "cs50x", time: .91 / storyDuration },
  { id: "cs50-ai", time: 1.20 / storyDuration },
];
