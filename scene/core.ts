import {
  BoxGeometry, CanvasTexture, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, MeshStandardMaterial, Path, PlaneGeometry, Shape, SRGBColorSpace, type Material,
} from "three";
import { mergeGeometries, toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { createDisplayTexture } from "./display";

function profile(width: number, depth: number, radius: number, outline: Shape | Path) {
  const x = width / 2;
  const z = depth / 2;
  outline.moveTo(-x + radius, -z);
  outline.lineTo(x - radius, -z);
  outline.quadraticCurveTo(x, -z, x, -z + radius);
  outline.lineTo(x, z - radius);
  outline.quadraticCurveTo(x, z, x - radius, z);
  outline.lineTo(-x + radius, z);
  outline.quadraticCurveTo(-x, z, -x, z - radius);
  outline.lineTo(-x, -z + radius);
  outline.quadraticCurveTo(-x, -z, -x + radius, -z);
  return outline;
}

function slab(
  group: Group, material: Material, width: number, depth: number, height: number,
  radius: number, y = 0, bevel = .035, hole?: [number, number, number],
) {
  const shape = new Shape();
  profile(width, depth, radius, shape);
  if (hole) {
    const path = new Path();
    profile(...hole, path);
    shape.holes.push(path);
  }
  const geometry = new ExtrudeGeometry(shape, {
    depth: height - bevel * 2, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel,
    bevelSegments: 4, curveSegments: 10, steps: 1,
  });
  geometry.translate(0, 0, -(height - bevel * 2) / 2);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new Mesh(toCreasedNormals(geometry, Math.PI / 4), material);
  mesh.position.y = y;
  group.add(mesh);
  return mesh;
}

function box(group: Group, material: Material, size: [number, number, number], at: [number, number, number]) {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.position.set(...at);
  group.add(mesh);
}

function batchDetails(group: Group) {
  const batches = new Map<Material, Mesh<BoxGeometry, Material>[]>();
  for (const detail of group.children) {
    if (!(detail instanceof Mesh) || !(detail.geometry instanceof BoxGeometry) || Array.isArray(detail.material)) continue;
    const batch = batches.get(detail.material) ?? [];
    batch.push(detail);
    batches.set(detail.material, batch);
  }
  for (const [material, meshes] of batches) {
    if (meshes.length < 2) continue;
    const geometry = mergeGeometries(meshes.map(({ geometry, position }) =>
      geometry.translate(position.x, position.y, position.z)));
    for (const mesh of meshes) {
      group.remove(mesh);
      mesh.geometry.dispose();
    }
    group.add(new Mesh(geometry, material));
  }
}

function stamp(group: Group, kind: "cover" | "chip", anisotropy: number) {
  const isCover = kind === "cover";
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = isCover ? "#086789" : "#9cd2db";
  ctx.fillRect(38, 36, 99, 12);
  ctx.fillStyle = isCover ? "#172a39" : "#d2dddd";
  ctx.font = isCover ? "750 226px system-ui, sans-serif" : "720 135px system-ui, sans-serif";
  ctx.fillText(isCover ? "SMT" : "SMT / LOGIC", 29, isCover ? 253 : 222);
  ctx.font = isCover ? "600 56px monospace" : "600 53px monospace";
  ctx.fillText(isCover ? "CORE / MODULAR SYSTEMS" : "PRECISION ASSEMBLY", 37, 343);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  const width = isCover ? 1.64 : 1.08;
  const print = new Mesh(new PlaneGeometry(width, width * .375), new MeshBasicMaterial({
    map: texture, transparent: true, depthWrite: false, toneMapped: false, alphaTest: .015,
  }));
  print.rotation.x = -Math.PI / 2;
  print.position.set(isCover ? -.91 : 0, isCover ? .153 : .172, isCover ? -.15 : 0);
  group.add(print);
}

export function createCore(anisotropy: number) {
  const root = new Group();
  const cover = new Group();
  const optic = new Group();
  const bezel = new Group();
  const logic = new Group();
  const chassis = new Group();
  const base = new Group();
  root.name = "smt-core";
  cover.name = "ceramic-cover";
  optic.name = "optical-interface";
  bezel.name = "precision-bezel";
  logic.name = "logic-assembly";
  chassis.name = "aluminum-chassis";
  base.name = "structural-base";
  root.add(cover, optic, bezel, logic, chassis, base);

  const ceramic = new MeshPhysicalMaterial({
    color: "#e4ded2", roughness: .34, metalness: .025, clearcoat: .24, clearcoatRoughness: .26,
  });
  const edge = new MeshPhysicalMaterial({
    color: "#929da1", roughness: .32, metalness: .87, anisotropy: .37,
  });
  const silver = new MeshStandardMaterial({ color: "#b7c5c7", roughness: .39, metalness: .74 });
  const graphite = new MeshStandardMaterial({ color: "#24313a", roughness: .58, metalness: .21 });
  const board = new MeshStandardMaterial({ color: "#214345", roughness: .64, metalness: .21 });
  const amber = new MeshStandardMaterial({ color: "#c68144", roughness: .34, metalness: .58 });
  const cyan = new MeshStandardMaterial({ color: "#46a4be", roughness: .33, metalness: .43 });
  const frosted = new MeshStandardMaterial({
    color: "#86aeb8", transparent: true, opacity: .26, roughness: .19, metalness: .14, depthWrite: false,
  });

  slab(cover, ceramic, 4.58, 2.96, .30, .24, 0, .065);
  slab(cover, edge, 4.47, 2.86, .075, .23, -.165, .02);
  stamp(cover, "cover", anisotropy);
  for (let i = 0; i < 8; i++) {
    box(cover, graphite, [.19, .005, .022], [1.77, .153, -.59 + i * .069]);
  }
  box(cover, cyan, [.25, .018, .07], [1.44, .067, 1.52]);
  box(cover, amber, [.068, .018, .07], [1.67, .067, 1.52]);

  slab(optic, frosted, 3.88, 2.40, .075, .09, 0, .023);
  const screen = new Mesh(new PlaneGeometry(3.84, 2.368), new MeshBasicMaterial({
    map: createDisplayTexture(anisotropy), toneMapped: false, opacity: 0, transparent: true, depthWrite: false,
  }));
  screen.rotation.x = -Math.PI / 2;
  screen.position.y = .043;
  screen.renderOrder = 3;
  optic.add(screen);

  slab(bezel, ceramic, 4.46, 2.87, .16, .20, 0, .04, [3.97, 2.49, .13]);
  slab(bezel, graphite, 4.40, 2.82, .07, .18, -.093, .025, [3.94, 2.46, .12]);
  box(bezel, amber, [.23, .009, .032], [1.66, .083, 1.36]);

  slab(logic, board, 4.01, 2.44, .10, .10, 0, .02);
  slab(logic, graphite, 1.24, 1.06, .12, .1, .107, .025);
  stamp(logic, "chip", anisotropy);
  for (let i = 0; i < 10; i++) {
    const z = -.45 + i * .10;
    box(logic, amber, [.26, .027, .023], [-.74, .062, z]);
    box(logic, amber, [.26, .027, .023], [.74, .062, z]);
  }
  for (let i = 0; i < 6; i++) {
    box(logic, silver, [.48, .08, .15], [1.40, .085, -.85 + i * .32]);
    box(logic, graphite, [.33, .10, .12], [-1.37, .083, -.80 + i * .32]);
    box(logic, cyan, [.022, .006, .33], [-.50 + i * .20, .054, .80]);
    box(logic, amber, [.022, .006, .31], [-.50 + i * .20, .054, -.80]);
  }

  slab(chassis, edge, 4.47, 2.87, .23, .20, 0, .036, [3.89, 2.29, .10]);
  for (const x of [-1.98, 1.98]) {
    for (const z of [-1.21, 1.21]) {
      const fastener = new Mesh(new CylinderGeometry(.073, .073, .055, 12), silver);
      fastener.position.set(x, .13, z);
      chassis.add(fastener);
      box(chassis, graphite, [.085, .006, .012], [x, .16, z]);
    }
  }
  for (let i = 0; i < 12; i++) {
    box(chassis, graphite, [.074, .052, .009], [-.98 + i * .17, -.006, 1.47]);
  }
  box(chassis, graphite, [.55, .085, .015], [1.51, -.002, 1.47]);
  box(chassis, silver, [.39, .017, .02], [1.51, -.023, 1.48]);

  slab(base, ceramic, 4.55, 2.93, .19, .24, 0, .045);
  slab(base, graphite, 4.40, 2.79, .08, .21, -.105, .022);
  for (const x of [-1.53, 1.53]) {
    for (const z of [-.86, .86]) {
      const foot = new Mesh(new CylinderGeometry(.15, .15, .056, 18), graphite);
      foot.position.set(x, -.16, z);
      base.add(foot);
    }
  }

  for (const part of [cover, logic, chassis]) batchDetails(part);

  return { root, cover, optic, bezel, logic, chassis, base, screen: screen.material, screenMesh: screen };
}
