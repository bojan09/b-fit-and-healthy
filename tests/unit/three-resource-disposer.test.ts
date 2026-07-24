import { describe, expect, it, vi } from "vitest";
import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Texture,
} from "three";
import { disposeThreeResources } from "@/features/anatomy/three-resource-disposer";

describe("Three.js resource disposal", () => {
  it("disposes unique scene resources and stops the renderer loop", () => {
    const scene = new Scene();
    const geometry = new BufferGeometry();
    const texture = new Texture();
    const material = new MeshBasicMaterial({ map: texture });
    scene.add(new Mesh(geometry, material), new Mesh(geometry, material));
    const geometryDispose = vi.spyOn(geometry, "dispose");
    const materialDispose = vi.spyOn(material, "dispose");
    const textureDispose = vi.spyOn(texture, "dispose");
    const renderer = {
      setAnimationLoop: vi.fn(),
      dispose: vi.fn(),
      renderLists: { dispose: vi.fn() },
    };

    disposeThreeResources(scene, renderer);

    expect(renderer.setAnimationLoop).toHaveBeenCalledWith(null);
    expect(geometryDispose).toHaveBeenCalledTimes(1);
    expect(materialDispose).toHaveBeenCalledTimes(1);
    expect(textureDispose).toHaveBeenCalledTimes(1);
    expect(renderer.renderLists.dispose).toHaveBeenCalledTimes(1);
    expect(renderer.dispose).toHaveBeenCalledTimes(1);
  });
});
