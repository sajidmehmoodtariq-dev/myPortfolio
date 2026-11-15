import {
  BoxGeometry, BufferAttribute, BufferGeometry, Group, LineBasicMaterial, LineSegments,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, Vector3,
} from "three";

// Logical request stages are illustrated by real component locations on the PCB.
// This is a software journey represented on hardware, not a literal CPU trace.
const boardNodes = [
  { x: -1.37, z: -.80, width: .23, depth: .105 },
  { x: -1.37, z: .48, width: .23, depth: .105 },
  { x: 0, z: 0, width: .70, depth: .60 },
  { x: -.77, z: .86, width: .14, depth: .105 },
  { x: 1.40, z: .43, width: .30, depth: .105 },
];
const route = [0, 1, 2, 3, 4, 0];
const glyphs = [
  [-.31, -.26, -.08, -.26, -.08, -.26, -.08, .23, -.08, .23, -.31, .23, -.31, .23, -.31, -.26,
    -.27, -.09, -.12, -.09, -.27, .08, -.12, .08, -.08, -.02, .31, -.02, .31, -.02, .20, -.13,
    .31, -.02, .20, .09, .09, -.24, .33, -.24, .33, -.24, .33, .22, .33, .22, .09, .22],
  [-.29, -.28, .29, -.28, .29, -.28, .29, .28, .29, .28, -.29, .28, -.29, .28, -.29, -.28,
    -.18, -.14, .15, -.14, -.18, -.01, .15, -.01, -.13, .14, -.02, .21, -.02, .21, .17, .08],
  [-.30, -.23, -.02, -.23, -.30, -.23, -.30, .23, -.30, .23, -.02, .23, -.02, -.23, -.02, .23,
    -.30, 0, -.02, 0, -.16, -.23, -.16, .23, .08, -.17, .30, -.17, .08, -.02, .30, -.02,
    .08, .13, .30, .13],
];

function segmentBuffer(segments: number, color: string) {
  const position = new BufferAttribute(new Float32Array(segments * 6), 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", position);
  const line = new LineSegments(geometry, new LineBasicMaterial({ color, transparent: true, depthWrite: false }));
  line.frustumCulled = false;
  return { line, position };
}

export function createEngineering(plates: readonly Group[]) {
  const trace = new Group();
  trace.name = "Motherboard request activity";
  const connectors = segmentBuffer(16, "#76b4b8");
  const current = segmentBuffer(16, "#36d7e3");
  const indicator = new Mesh(new SphereGeometry(.055, 12, 8), new MeshBasicMaterial({
    color: "#78f0f3", transparent: true, depthWrite: false,
  }));
  indicator.renderOrder = 5;
  trace.add(connectors.line, current.line, indicator);
  plates[2].add(trace);

  const highlights = boardNodes.map(({ x, z, width, depth }, index) => {
    const frame = segmentBuffer(4, "#35d0db");
    const y = index === 2 ? .192 : .153;
    const corners = [new Vector3(x - width, y, z - depth), new Vector3(x + width, y, z - depth),
      new Vector3(x + width, y, z + depth), new Vector3(x - width, y, z + depth)];
    for (let edge = 0; edge < 4; edge++) segment(frame.position, edge, corners[edge], corners[(edge + 1) % 4]);
    const led = new Mesh(new SphereGeometry(.035, 8, 6), new MeshBasicMaterial({ color: "#43d1dc", transparent: true }));
    led.position.set(x - width + .035, y + .012, z - depth - .055);
    trace.add(frame.line, led);
    return { ...frame, led };
  });

  const paths = [
    [[-1.37, -.80], [-1.73, -.80], [-1.73, .48], [-1.37, .48]],
    [[-1.37, .48], [-.97, .48], [-.97, 0], [0, 0]],
    [[0, 0], [0, .65], [-.77, .65], [-.77, .86]],
    [[-.77, .86], [-.77, 1.08], [1.40, 1.08], [1.40, .43]],
    [[1.40, .43], [1.77, .43], [1.77, -1.08], [-1.37, -1.08], [-1.37, -.80]],
  ].map(path => path.map(([x, z]) => new Vector3(x, .19, z)));
  let wire = 0;
  for (const path of paths) for (let point = 0; point < path.length - 1; point++) {
    segment(connectors.position, wire++, path[point], path[point + 1]);
  }
  const lengths = paths.map(path => path.slice(1).reduce((length, point, index) => length + point.distanceTo(path[index]), 0));

  const tiles = new Group();
  tiles.name = "Engineering lab cartridges";
  plates[2].add(tiles);
  const cartridge = new BoxGeometry(1.03, .14, 1.02);
  const modules = glyphs.map((glyph, index) => {
    const slot = new Group();
    const body = new Mesh(cartridge, new MeshStandardMaterial({ color: "#cbd4d1", roughness: .58, metalness: .22 }));
    const positions = glyph.flatMap((value, coordinate) => coordinate % 2 === 0 ? [value, .074] : [value]);
    const geometry = new BufferGeometry().setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    const symbol = new LineSegments(geometry, new LineBasicMaterial({ color: "#203e45" }));
    slot.add(body, symbol);
    slot.position.x = (index - 1) * 1.26;
    tiles.add(slot);
    return { slot, body, symbol };
  });
  trace.visible = tiles.visible = false;

  const point = new Vector3();
  const muted = "#cbd4d1";
  const live = "#76ced5";

  function segment(attribute: BufferAttribute, index: number, a: Vector3, b: Vector3) {
    attribute.setXYZ(index * 2, a.x, a.y, a.z);
    attribute.setXYZ(index * 2 + 1, b.x, b.y, b.z);
  }

  function updateTrace(opacity: number, cursor: number, active: number) {
    trace.visible = opacity > .001 && active >= 0;
    if (!trace.visible) return;
    const phase = Math.min(4, Math.floor(cursor));
    const fraction = Math.min(1, cursor - phase);
    let litSegments = 0;
    paths.forEach((path, index) => {
      let remaining = lengths[index] * (index < phase ? 1 : index === phase ? fraction : 0);
      for (let step = 0; step < path.length - 1; step++) {
        const start = path[step];
        const end = path[step + 1];
        const length = start.distanceTo(end);
        const amount = Math.max(0, Math.min(1, remaining / length));
        point.copy(start).lerp(end, amount);
        if (remaining > 0) segment(current.position, litSegments++, start, point);
        if (index === phase && remaining >= 0 && remaining <= length) indicator.position.copy(point);
        remaining -= length;
      }
    });
    if (cursor <= 0) indicator.position.copy(paths[0][0]);
    if (cursor >= 5) indicator.position.copy(paths[4][4]);
    current.position.needsUpdate = true;
    current.line.geometry.setDrawRange(0, litSegments * 2);
    connectors.line.material.opacity = opacity * .42;
    current.line.material.opacity = opacity * .95;
    highlights.forEach(({ line, led }, index) => {
      const weight = (route[phase] === index ? 1 - fraction : 0) + (route[phase + 1] === index ? fraction : 0);
      line.material.opacity = opacity * (.10 + .90 * weight);
      led.material.opacity = opacity * (.20 + .80 * weight);
      led.scale.setScalar(1 + weight * .65);
    });
    indicator.material.opacity = opacity;
  }

  function updateLab(amount: number, cursor: number, active: number, compact: boolean) {
    tiles.visible = amount > .001;
    if (!tiles.visible) return;
    tiles.scale.setScalar(amount);
    tiles.position.y = .29;
    modules.forEach(({ slot, body }, index) => {
      const lift = Math.max(0, 1 - Math.abs(cursor - index));
      slot.position.y = lift * (compact ? .15 : .29);
      slot.position.z = lift * .17;
      slot.rotation.z = lift * (index - 1) * .12;
      body.material.color.set(index === active ? live : muted);
    });
  }

  function dispose() {
    for (const { line } of [connectors, current, ...highlights]) {
      line.geometry.dispose();
      line.material.dispose();
    }
    for (const { led } of highlights) { led.geometry.dispose(); led.material.dispose(); }
    for (const { symbol } of modules) {
      symbol.geometry.dispose();
      symbol.material.dispose();
    }
  }

  return { updateTrace, updateLab, dispose, trace, indicator, tiles, modules };
}
