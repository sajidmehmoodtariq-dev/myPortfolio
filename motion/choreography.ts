import { gsap } from "gsap";
import type { Group } from "three";
import type { createCore } from "../scene/core";
import { createCameraPose, sampleCamera } from "./camera";
import { aboutStart, chapters, credentialWindow, finaleSettled, finaleStart, labStart, labStops, projectExit, projectInterval, projectStops, requestStops, storyDuration, systemStart } from "../content/storyboard";

const galleryPoses = [
  { yaw: -.085, support: .24, bezel: .236, chassis: -.30 },
  { yaw: .08, support: .19, bezel: .18, chassis: -.31 },
  { yaw: -.065, support: .265, bezel: .245, chassis: -.275 },
  { yaw: .05, support: .215, bezel: .20, chassis: -.29 },
];

type Pose = { x?: number; y: number; z?: number; pitch?: number; yaw?: number; roll?: number; size?: number };

function complete({ x = 0, y, z = 0, pitch = 0, yaw = 0, roll = 0, size = 1 }: Pose) {
  return { x, y, z, pitch, yaw, roll, size };
}

function layer(group: Group, closed: Pose, open: Pose, docked: Pose = closed) {
  return { group, closed, open: complete(open), docked: complete(docked), pose: complete(closed) };
}

export function createChoreography(core: ReturnType<typeof createCore>) {
  const cover = layer(core.cover, { y: .50 }, { y: 2.08, x: -.13, z: -.12, pitch: -.075, roll: .075 }, { y: -.91 });
  const optic = layer(core.optic, { y: .25 }, { y: 1.25, z: .40, pitch: .045, size: .92 });
  const bezel = layer(core.bezel, { y: .205 }, { y: .58, yaw: -.13, roll: -.05 });
  const logic = layer(core.logic, { y: -.06 }, { y: -.23, x: .24, pitch: .14, yaw: .16, roll: .05 });
  const chassis = layer(core.chassis, { y: -.285 }, { y: -1.02, x: -.10, yaw: -.10 });
  const base = layer(core.base, { y: -.50 }, { y: -1.61, roll: -.055 }, { y: -.50, z: .34 });
  const parts = [cover, optic, bezel, logic, chassis, base];

  const arrivalRig = { pitch: -.045, yaw: -.11, size: .93 };
  const rig = { ...arrivalRig };
  const view = { ...createCameraPose(), portraitWidthInset: 0, compactSpread: 0, engineeringFrame: 0 };
  const cameraTime = { value: 0 };
  const locks = { release: 0 };
  const copy = chapters.map((_, index) => index === 0
    ? { top: 0, bottom: 0, y: 8 }
    : { top: 0, bottom: 100, y: 21 });
  const engineering = { trace: 0, signal: 0, lab: 0, module: 0 };
  const studioLight = { key: 2.18, edge: 1.08, environment: .69 };
  const light = { ...studioLight };
  const [firstPage, secondPage] = core.archive.pages;
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });

  timeline
    .addLabel("arrival", 0)
    .addLabel("unlock", .145)
    .addLabel("disassembly", .245)
    .addLabel("document-mount", .55)
    .addLabel("credentials", credentialWindow.start)
    .addLabel("project", credentialWindow.end)
    .to(cameraTime, { value: storyDuration, duration: storyDuration, ease: "none" }, 0)
    .to(rig, { yaw: .11, pitch: 0, size: 1.01, duration: .20 }, 0)
    .to(copy[0], { y: 0, duration: .15 }, 0)
    .to(copy[0], { top: 100, y: -22, duration: .056 }, .19)
    .to(copy[1], { bottom: 0, y: 0, duration: .08 }, .246)
    .to(locks, { release: 1, duration: .065 }, .145)
    .to(cover.pose, { y: .61, z: -.09, duration: .04 }, .205)
    .to(cover.pose, { ...cover.open, duration: .245 }, .245)
    .to(optic.pose, { ...optic.open, duration: .228 }, .279)
    .to(bezel.pose, { ...bezel.open, duration: .22 }, .29)
    .to(logic.pose, { ...logic.open, duration: .21 }, .316)
    .to(chassis.pose, { ...chassis.open, duration: .24 }, .275)
    .to(base.pose, { ...base.open, duration: .275 }, .25)
    .to(rig, { yaw: -.12, size: 1, duration: .34 }, .20)
    .to(view, { compactSpread: 1, duration: .34 }, .20)
    // The cover clears the rear edge before crossing the stack axis.
    .to(cover.pose, { x: 0, z: -3.46, pitch: 0, roll: 0, duration: .115 }, .505)
    .to(cover.pose, { y: cover.docked.y, duration: .115 }, .62)
    .to(cover.pose, { z: cover.docked.z, duration: .10 }, .735)
    .to(optic.pose, { ...optic.docked, duration: .20 }, .56)
    .to(bezel.pose, { ...bezel.docked, duration: .17 }, .56)
    .to(logic.pose, { ...logic.docked, duration: .16 }, .57)
    .to(chassis.pose, { ...chassis.docked, duration: .16 }, .59)
    .to(base.pose, { ...base.docked, duration: .19 }, .60)
    .to(rig, { yaw: 0, pitch: 1.47, size: 1.06, duration: .28 }, .55)
    .to(view, { compactSpread: 0, duration: .17 }, .54)
    .to(view, { portraitWidthInset: .065, duration: .085 }, .505)
    .to(view, { portraitWidthInset: 0, duration: .085 }, .63)
    .to(copy[1], { top: 100, y: -22, duration: .06 }, credentialWindow.start - .06)
    .to(copy[2], { bottom: 0, y: 0, duration: .085 }, credentialWindow.start)
    .to(core.archive.mat.material, { opacity: 1, duration: .06 }, .775)
    .to(firstPage.position, { x: 0, duration: .08 }, .805)
    .to(firstPage.material, { opacity: 1, duration: .08 }, .805)
    .to(firstPage.position, { x: -.30, duration: .066 }, 1.012)
    .to(firstPage.material, { opacity: 0, duration: .066 }, 1.012)
    .to(secondPage.position, { x: 0, duration: .067 }, credentialWindow.switch)
    .to(secondPage.material, { opacity: 1, duration: .067 }, credentialWindow.switch)
    .to(locks, { release: 0, duration: .07 }, .85)
    .to(secondPage.position, { x: -.27, duration: .075 }, 1.28)
    .to(secondPage.material, { opacity: 0, duration: .075 }, 1.28)
    .to(copy[2], { top: 100, y: -22, duration: .06 }, credentialWindow.end - .06)
    .to(core.archive.mat.material, { opacity: 0, duration: .045 }, 1.337)
    .to(rig, { pitch: Math.PI / 2, duration: .12 }, 1.33)
    .to(base.pose, { z: .22, duration: .10 }, 1.35)
    .to(copy[3], { bottom: 0, y: 0, duration: .09 }, credentialWindow.end)
    .to(core.screen, { opacity: 1, ease: "power2.out", duration: .08 }, 1.39);

  projectStops.slice(1).forEach(({ at }, index) => {
    const handoff = at - projectInterval / 2;
    const start = handoff - .075;
    const pose = galleryPoses[index];
    timeline
      .to(core.screen, { opacity: 0, duration: .073 }, start)
      .to(core.screen, { opacity: 1, duration: .073 }, handoff + .002)
      .to(rig, { yaw: pose.yaw, duration: .15 }, start)
      .to(base.pose, { z: .29, duration: .075 }, start)
      .to(base.pose, { z: pose.support, duration: .075 }, handoff)
      .to(bezel.pose, { y: pose.bezel, duration: .15 }, start)
      .to(optic.pose, { y: pose.bezel + .045, duration: .15 }, start)
      .to(chassis.pose, { y: pose.chassis, duration: .15 }, start);
  });

  timeline
    .addLabel("gallery-exit", projectExit)
    .to(core.screen, { opacity: 0, duration: .08 }, projectExit)
    .to(optic.pose, { y: .57, z: -.24, pitch: -.13, duration: .12 }, projectExit + .018)
    .to(bezel.pose, { y: .34, duration: .12 }, projectExit + .018)
    .to(base.pose, { z: .31, duration: .12 }, projectExit + .018)
    .to(rig, { yaw: .095, duration: .12 }, projectExit + .018);

  timeline
    .addLabel("inside-system", systemStart)
    .to(copy[3], { top: 100, y: -22, duration: .065 }, systemStart - .065)
    .to(copy[4], { bottom: 0, y: 0, duration: .10 }, systemStart)
    .to(rig, { pitch: .64, yaw: -.065, size: 1, duration: .22 }, systemStart - .015)
    .to(view, { compactSpread: .74, engineeringFrame: 1, duration: .145 }, systemStart)
    // Stow the glass and ceramic bezel below the PCB: this chapter works on the
    // exposed motherboard rather than highlighting a lid floating in front of it.
    .to(optic.pose, { x: 0, y: -.96, z: -.08, pitch: 0, duration: .22 }, systemStart - .025)
    .to(bezel.pose, { x: 0, y: -.78, z: -.08, duration: .22 }, systemStart)
    .to(logic.pose, { x: 0, y: .28, z: 0, duration: .20 }, systemStart)
    .to(chassis.pose, { x: 0, y: -.47, z: 0, duration: .20 }, systemStart)
    .to(cover.pose, { x: 0, y: -1.15, z: 0, duration: .20 }, systemStart)
    .to(base.pose, { x: 0, y: -1.40, z: .05, duration: .22 }, systemStart - .02)
    .to(engineering, { trace: 1, duration: .10 }, systemStart + .07);

  requestStops.slice(1).forEach(({ at }, index) => {
    timeline.to(engineering, { signal: index + 1, duration: .10 }, at - .115);
  });

  timeline
    .addLabel("engineering-lab", labStart)
    .to(copy[4], { top: 100, y: -22, duration: .07 }, labStart - .07)
    .to(engineering, { trace: 0, duration: .08 }, labStart - .08)
    .to(copy[5], { bottom: 0, y: 0, duration: .10 }, labStart)
    .to(rig, { pitch: 1.10, yaw: .02, duration: .19 }, labStart - .025)
    .to(view, { compactSpread: .28, duration: .18 }, labStart)
    .to(optic.pose, { x: -.24, y: -.29, z: -1.77, pitch: -.12, duration: .21 }, labStart - .035)
    .to(bezel.pose, { x: .10, y: -.19, z: -1.30, duration: .20 }, labStart - .02)
    .to(logic.pose, { x: 0, y: .25, z: .28, pitch: -.07, duration: .18 }, labStart)
    .to(chassis.pose, { x: .07, y: -.50, z: .22, duration: .18 }, labStart)
    .to(cover.pose, { x: -.14, y: -.91, z: 0, duration: .18 }, labStart)
    .to(base.pose, { x: 0, y: -.99, z: .76, duration: .18 }, labStart)
    .to(engineering, { lab: 1, duration: .14 }, labStart + .05);

  labStops.slice(1).forEach(({ at }, index) => {
    timeline
      .to(engineering, { module: index + 1, duration: .17 }, at - .18)
      .to(logic.pose, { yaw: index === 0 ? -.06 : .065, x: index === 0 ? .09 : -.10, duration: .17 }, at - .18);
  });

  timeline
    .addLabel("about", aboutStart)
    .to(copy[5], { top: 100, y: -22, duration: .07 }, aboutStart - .07)
    .to(copy[6], { bottom: 0, y: 0, duration: .11 }, aboutStart)
    .to(engineering, { lab: 0, duration: .12 }, aboutStart - .025)
    .to(rig, { pitch: .86, yaw: -.07, duration: .21 }, aboutStart)
    .to(logic.pose, { x: -.12, y: .19, z: .21, yaw: -.03, duration: .22 }, aboutStart)
    .to(optic.pose, { z: -1.42, duration: .19 }, aboutStart)
    .to(bezel.pose, { z: -1.02, duration: .20 }, aboutStart)
    .to(rig, { yaw: .05, duration: .36 }, 5.04)
    .to(logic.pose, { yaw: .045, duration: .32 }, 5.06);

  timeline
    .addLabel("reassembly", finaleStart)
    .to(copy[6], { top: 100, y: -22, duration: .075 }, finaleStart - .075)
    .to(rig, { ...arrivalRig, duration: .45 }, finaleStart)
    .to(view, { compactSpread: 0, engineeringFrame: 0, duration: .43 }, finaleStart)
    .to(light, { key: 2.08, edge: 1.23, environment: .73, duration: .22 }, finaleStart)
    .to(light, { ...studioLight, duration: .24 }, finaleSettled - .24)
    .to(locks, { release: .66, duration: .09 }, finaleStart)
    .to(locks, { release: 0, duration: .07 }, finaleSettled - .07)
    // The cover clears the back edge before crossing the stacked parts.
    .to(cover.pose, { x: 0, z: -3.46, duration: .125 }, finaleStart)
    .to(cover.pose, { y: .81, duration: .135 }, finaleStart + .125)
    .to(cover.pose, { z: 0, duration: .14 }, finaleStart + .26)
    .to(cover.pose, { ...complete(cover.closed), duration: .11 }, finaleSettled - .11)
    .to(optic.pose, { x: 0, y: .84, pitch: 0, duration: .105 }, finaleStart)
    .to(bezel.pose, { x: 0, y: .46, duration: .105 }, finaleStart)
    .to(base.pose, { ...complete(base.closed), duration: .18 }, finaleStart + .04)
    .to(chassis.pose, { ...complete(chassis.closed), duration: .16 }, finaleStart + .06)
    .to(logic.pose, { ...complete(logic.closed), duration: .16 }, finaleStart + .075)
    .to(bezel.pose, { ...complete(bezel.closed), duration: .13 }, finaleStart + .125)
    .to(optic.pose, { ...complete(optic.closed), duration: .13 }, finaleStart + .145)
    .to(copy[7], { bottom: 0, y: 0, duration: .09 }, finaleSettled - .04);

  function applyPose(compact: boolean) {
    sampleCamera(cameraTime.value, view);
    const compression = compact ? view.compactSpread * .22 : 0;
    core.root.rotation.set(rig.pitch, rig.yaw, 0);
    core.root.scale.setScalar(rig.size);
    for (const { group, closed, pose } of parts) {
      const y = pose.y + (closed.y - pose.y) * compression;
      const z = pose.z > 0 ? pose.z * (1 - compression) : pose.z;
      group.position.set(pose.x * (1 - compression), y, z);
      group.rotation.set(pose.pitch, pose.yaw, pose.roll);
      group.scale.setScalar(pose.size);
    }
    for (const { tab, direction } of core.latches) tab.position.x = direction * (.105 * locks.release - .048);
  }

  return { timeline, view, copy, parts, applyPose, engineering, light };
}
