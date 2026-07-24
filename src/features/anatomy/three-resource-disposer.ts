import type { Object3D } from "three";

type Disposable = { dispose: () => void };
type SceneNode = Object3D & {
  geometry?: Disposable;
  material?: Disposable | Disposable[];
  skeleton?: Disposable;
};
type RendererLike = {
  setAnimationLoop: (callback: null) => void;
  dispose: () => void;
  renderLists?: { dispose: () => void };
};

function isDisposable(value: unknown): value is Disposable {
  return Boolean(value && typeof value === "object" && "dispose" in value && typeof (value as Disposable).dispose === "function");
}

export function disposeThreeResources(root: Object3D, renderer: RendererLike) {
  const resources = new Set<Disposable>();
  root.traverse((object) => {
    const node = object as SceneNode;
    if (isDisposable(node.geometry)) resources.add(node.geometry);
    const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
    for (const material of materials) {
      resources.add(material);
      for (const value of Object.values(material)) {
        if (isDisposable(value) && "isTexture" in value) resources.add(value);
      }
    }
    if (isDisposable(node.skeleton)) resources.add(node.skeleton);
  });
  renderer.setAnimationLoop(null);
  for (const resource of resources) resource.dispose();
  renderer.renderLists?.dispose();
  renderer.dispose();
}
