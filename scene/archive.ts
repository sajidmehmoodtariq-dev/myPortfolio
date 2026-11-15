import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from "three";
import { credentials } from "../content/credentials";

export function createArchive(anisotropy: number, onTextureReady: () => void) {
  const mount = new Group();
  mount.name = "optical-document-mount";
  const mat = new Mesh(new PlaneGeometry(3.84, 2.368), new MeshBasicMaterial({
    color: "#e5dfd2", toneMapped: false, transparent: true, depthWrite: false, opacity: 0,
  }));
  mat.rotation.x = -Math.PI / 2;
  mat.position.y = .043;
  mat.renderOrder = 3;
  mount.add(mat);

  const loader = new TextureLoader();
  const pages = credentials.map(({ id, preview }, index) => {
    const texture = loader.load(preview, onTextureReady);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = anisotropy;
    const page = new Mesh(new PlaneGeometry(2.94, 2.94 * 612 / 792), new MeshBasicMaterial({
      map: texture, toneMapped: false, transparent: true, depthWrite: false, opacity: 0,
    }));
    page.name = id;
    page.rotation.x = -Math.PI / 2;
    page.position.set(.30, .047 + .002 * index, 0);
    page.renderOrder = 4 + index;
    mount.add(page);
    return page;
  });
  mount.visible = false;
  return { mount, mat, pages };
}
