import { gsap } from "gsap";
import type { Group } from "three";
import type { createCore } from "../scene/core";

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
  const base = layer(core.base, { y: -.50 }, { y: -1.61, roll: -.055 }, { y: -.50, z: .22 });
  const parts = [cover, optic, bezel, logic, chassis, base];

  const rig = { pitch: -.045, yaw: -.11, size: .93 };
  const view = {
    azimuth: .73, elevation: .48, radius: 10.8, targetX: 0, targetY: -.05, targetZ: 0,
    screenX: .695, screenY: .51, portraitY: .675, portraitWidthInset: 0,
    fitWidth: 5.75, fitHeight: 3.48, compactSpread: 0,
  };
  const copy = [
    { top: 0, bottom: 0, y: 8 },
    { top: 0, bottom: 100, y: 21 },
    { top: 0, bottom: 100, y: 21 },
  ];
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });

  timeline
    .addLabel("arrival", 0)
    .addLabel("disassembly", .20)
    .addLabel("transformation", .55)
    .addLabel("project", .80)
    .to(rig, { yaw: .17, pitch: 0, size: 1.02, duration: .20 }, 0)
    .to(view, { azimuth: .55, elevation: .57, radius: 9.8, targetY: .06, screenX: .70, fitWidth: 5.45, duration: .20 }, 0)
    .to(copy[0], { y: 0, duration: .15 }, 0)
    .to(copy[0], { top: 100, y: -22, duration: .055 }, .20)
    .to(copy[1], { bottom: 0, y: 0, duration: .08 }, .255)
    .to(cover.pose, { y: .64, z: -.07, duration: .06 }, .20)
    .to(cover.pose, { ...cover.open, duration: .23 }, .26)
    .to(optic.pose, { ...optic.open, duration: .24 }, .267)
    .to(bezel.pose, { ...bezel.open, duration: .22 }, .29)
    .to(logic.pose, { ...logic.open, duration: .21 }, .316)
    .to(chassis.pose, { ...chassis.open, duration: .24 }, .275)
    .to(base.pose, { ...base.open, duration: .275 }, .25)
    .to(rig, { yaw: -.12, size: 1, duration: .34 }, .20)
    .to(view, {
      azimuth: .35, elevation: .34, radius: 10.9, targetY: .15, targetX: .10,
      screenX: .68, portraitY: .658, fitWidth: 5.90, fitHeight: 5.16, compactSpread: 1, duration: .34,
    }, .20)
    // The cover clears the rear edge before crossing the stack axis.
    .to(cover.pose, { x: 0, z: -3.39, pitch: 0, roll: 0, duration: .115 }, .505)
    .to(cover.pose, { y: cover.docked.y, duration: .115 }, .62)
    .to(cover.pose, { z: cover.docked.z, duration: .10 }, .735)
    .to(optic.pose, { ...optic.docked, duration: .20 }, .56)
    .to(bezel.pose, { ...bezel.docked, duration: .17 }, .56)
    .to(logic.pose, { ...logic.docked, duration: .16 }, .57)
    .to(chassis.pose, { ...chassis.docked, duration: .16 }, .59)
    .to(base.pose, { ...base.docked, duration: .19 }, .60)
    .to(rig, { yaw: 0, pitch: Math.PI / 2, size: 1.06, duration: .27 }, .55)
    .to(view, {
      azimuth: .14, elevation: .14, radius: 12.4, targetX: .09, targetY: .23, targetZ: -.43,
      screenX: .69, portraitY: .66, fitWidth: 6.02, fitHeight: 5.37, duration: .16,
    }, .54)
    .to(view, { compactSpread: 0, duration: .17 }, .54)
    .to(view, { portraitWidthInset: .055, duration: .07 }, .52)
    .to(view, { portraitWidthInset: 0, duration: .075 }, .63)
    .to(view, {
      azimuth: .10, elevation: .045, radius: 9.5, targetX: .035, targetY: .10, targetZ: -.07,
      screenX: .695, screenY: .52, portraitY: .666, fitWidth: 5.4, fitHeight: 3.59, duration: .24,
    }, .70)
    .to(copy[1], { top: 100, y: -22, duration: .065 }, .69)
    .to(copy[2], { bottom: 0, y: 0, duration: .085 }, .755)
    .to(core.screen, { opacity: 1, ease: "power1.out", duration: .155 }, .78)
    .set({}, {}, 1);

  function applyPose(compact: boolean) {
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
  }

  return { timeline, view, copy, parts, applyPose };
}
