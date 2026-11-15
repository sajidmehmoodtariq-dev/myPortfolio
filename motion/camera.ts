const arrival = {
  azimuth: .68, elevation: .43, radius: 11.4, targetX: 0, targetY: -.04, targetZ: 0,
  screenX: .692, screenY: .51, portraitY: .674, fitWidth: 5.84, fitHeight: 3.56,
};
const benchEnd = {
  azimuth: -.11, elevation: .34, radius: 10.80, targetX: .04, targetY: .19, targetZ: -.09,
  screenX: .70, screenY: .51, portraitY: .741, fitWidth: 5.72, fitHeight: 4.93,
};

const cues = [
  { at: 0, pose: arrival },
  { at: .20, pose: {
    azimuth: .58, elevation: .52, radius: 9.8, targetX: .025, targetY: .04, targetZ: -.02,
    screenX: .698, screenY: .51, portraitY: .665, fitWidth: 5.58, fitHeight: 3.65,
  } },
  { at: .39, pose: {
    azimuth: .47, elevation: .43, radius: 10.25, targetX: .07, targetY: .115, targetZ: -.06,
    screenX: .691, screenY: .511, portraitY: .66, fitWidth: 5.82, fitHeight: 4.68,
  } },
  { at: .50, pose: {
    azimuth: .34, elevation: .34, radius: 10.85, targetX: .10, targetY: .15, targetZ: -.08,
    screenX: .68, screenY: .511, portraitY: .654, fitWidth: 5.98, fitHeight: 5.22,
  } },
  { at: .70, pose: {
    azimuth: .18, elevation: .18, radius: 12.3, targetX: .09, targetY: .23, targetZ: -.43,
    screenX: .691, screenY: .51, portraitY: .66, fitWidth: 6.14, fitHeight: 5.40,
  } },
  { at: .90, pose: {
    azimuth: .055, elevation: .09, radius: 9.38, targetX: .02, targetY: .08, targetZ: -.06,
    screenX: .698, screenY: .52, portraitY: .711, fitWidth: 5.05, fitHeight: 3.34,
  } },
  { at: 1.22, pose: {
    azimuth: .035, elevation: .09, radius: 9.38, targetX: .02, targetY: .08, targetZ: -.06,
    screenX: .698, screenY: .52, portraitY: .711, fitWidth: 5.05, fitHeight: 3.34,
  } },
  { at: 1.56, pose: {
    azimuth: .12, elevation: .072, radius: 9.55, targetX: .035, targetY: .11, targetZ: -.07,
    screenX: .702, screenY: .518, portraitY: .72, fitWidth: 5.45, fitHeight: 3.68,
  } },
  { at: 1.82, pose: {
    azimuth: -.065, elevation: .10, radius: 9.65, targetX: .01, targetY: .10, targetZ: -.05,
    screenX: .707, screenY: .52, portraitY: .722, fitWidth: 5.37, fitHeight: 3.62,
  } },
  { at: 2.08, pose: {
    azimuth: .16, elevation: .055, radius: 9.55, targetX: -.035, targetY: .12, targetZ: -.04,
    screenX: .700, screenY: .51, portraitY: .719, fitWidth: 5.39, fitHeight: 3.67,
  } },
  { at: 2.34, pose: {
    azimuth: -.095, elevation: .081, radius: 9.68, targetX: .03, targetY: .10, targetZ: -.09,
    screenX: .707, screenY: .522, portraitY: .725, fitWidth: 5.50, fitHeight: 3.70,
  } },
  { at: 2.60, pose: {
    azimuth: .09, elevation: .068, radius: 9.7, targetX: -.02, targetY: .135, targetZ: -.05,
    screenX: .705, screenY: .519, portraitY: .723, fitWidth: 5.46, fitHeight: 3.67,
  } },
  { at: 2.86, pose: {
    azimuth: .31, elevation: .18, radius: 10.6, targetX: .05, targetY: .13, targetZ: -.18,
    screenX: .70, screenY: .518, portraitY: .721, fitWidth: 5.64, fitHeight: 3.77,
  } },
  { at: 3.04, pose: {
    azimuth: .39, elevation: .52, radius: 10.6, targetX: .06, targetY: .23, targetZ: 0,
    screenX: .686, screenY: .50, portraitY: .741, fitWidth: 5.65, fitHeight: 4.3,
  } },
  { at: 3.38, pose: {
    azimuth: .29, elevation: .52, radius: 10.7, targetX: .04, targetY: .24, targetZ: 0,
    screenX: .681, screenY: .50, portraitY: .746, fitWidth: 5.65, fitHeight: 4.3,
  } },
  { at: 3.77, pose: {
    azimuth: .23, elevation: .49, radius: 10.65, targetX: .03, targetY: .24, targetZ: 0,
    screenX: .686, screenY: .50, portraitY: .745, fitWidth: 5.65, fitHeight: 4.3,
  } },
  { at: 4.10, pose: {
    azimuth: .19, elevation: .34, radius: 10.85, targetX: -.02, targetY: .20, targetZ: -.09,
    screenX: .70, screenY: .51, portraitY: .743, fitWidth: 5.68, fitHeight: 4.96,
  } },
  { at: 4.33, pose: {
    azimuth: .035, elevation: .37, radius: 10.70, targetX: .02, targetY: .19, targetZ: -.07,
    screenX: .697, screenY: .51, portraitY: .742, fitWidth: 5.65, fitHeight: 4.87,
  } },
  { at: 4.56, pose: benchEnd },
  { at: 4.69, pose: benchEnd },
  { at: 4.92, pose: {
    azimuth: .13, elevation: .43, radius: 10.2, targetX: .05, targetY: .14, targetZ: -.15,
    screenX: .704, screenY: .51, portraitY: .754, fitWidth: 6.25, fitHeight: 5.65,
  } },
  { at: 5.40, pose: {
    azimuth: .28, elevation: .42, radius: 10.35, targetX: .035, targetY: .13, targetZ: -.13,
    screenX: .705, screenY: .51, portraitY: .756, fitWidth: 6.27, fitHeight: 5.61,
  } },
  { at: 5.62, pose: {
    azimuth: .48, elevation: .45, radius: 13.8, targetX: -.08, targetY: .27, targetZ: -.91,
    screenX: .695, screenY: .50, portraitY: .733, fitWidth: 7.40, fitHeight: 6.30,
  } },
  { at: 5.77, pose: {
    azimuth: .57, elevation: .48, radius: 13.2, targetX: -.07, targetY: .25, targetZ: -.71,
    screenX: .695, screenY: .50, portraitY: .710, fitWidth: 7.10, fitHeight: 5.65,
  } },
  { at: 6.03, pose: arrival },
] as const;

type Channel = keyof (typeof cues)[number]["pose"];
type CameraPose = Record<Channel, number>;
const lastCue = cues[cues.length - 1];
export const cameraSettledAt = lastCue.at;

const channels = (Object.keys(cues[0].pose) as Channel[]).map((key) => ({
  key,
  // Monotone cubic tangents preserve velocity at the joins without overshooting a framing limit.
  tangents: cues.map((cue, index) => {
    const previous = cues[index - 1];
    const next = cues[index + 1];
    if (!previous || !next) return 0;
    const before = cue.at - previous.at;
    const after = next.at - cue.at;
    const left = (cue.pose[key] - previous.pose[key]) / before;
    const right = (next.pose[key] - cue.pose[key]) / after;
    if (left * right <= 0) return 0;
    const a = 2 * after + before;
    const b = after + 2 * before;
    return (a + b) / (a / left + b / right);
  }),
}));

export function createCameraPose(): CameraPose {
  return { ...cues[0].pose };
}

export function sampleCamera(progress: number, pose: CameraPose) {
  if (progress >= cameraSettledAt) {
    Object.assign(pose, lastCue.pose);
    return;
  }

  const end = cues.findIndex((cue, index) => index > 0 && progress <= cue.at);
  const left = cues[end - 1];
  const right = cues[end];
  const span = right.at - left.at;
  const t = (progress - left.at) / span;
  const t2 = t * t;
  const t3 = t2 * t;
  for (const { key, tangents } of channels) {
    pose[key] = (2 * t3 - 3 * t2 + 1) * left.pose[key] +
      (t3 - 2 * t2 + t) * span * tangents[end - 1] +
      (-2 * t3 + 3 * t2) * right.pose[key] +
      (t3 - t2) * span * tangents[end];
  }
}
