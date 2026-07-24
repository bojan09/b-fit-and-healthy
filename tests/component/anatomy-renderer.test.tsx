import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentType } from "react";
import type { AnatomyRendererProps } from "@/features/anatomy/anatomy-renderer-types";

const capabilities = vi.hoisted(() => ({
  snapshot: {
    reducedMotion: false,
    coarsePointer: false,
    saveData: false,
    documentVisible: true,
    hardwareConcurrency: 8,
    deviceMemory: 8,
    webgl2: true,
  },
}));
vi.mock("@/features/motion/use-motion-profile", () => ({
  useMotionCapabilities: () => capabilities.snapshot,
}));

import { AnatomyRenderer } from "@/features/anatomy/anatomy-renderer";
import type { AnatomyAssetManifest } from "@/features/anatomy/anatomy-asset-manifest";

const props: AnatomyRendererProps = {
  view: "front",
  selectedMuscleId: "pectorals",
  locale: "en",
  onSelectMuscle: vi.fn(),
};
const manifest: AnatomyAssetManifest = {
  assetUrl: "/models/clinical.glb",
  licenseName: "Commercial",
  licenseUrl: "https://example.com/license",
  attribution: "Studio",
  commercialUseAllowed: true,
  modelVersion: "1",
  muscleMeshes: { pectorals: ["Pectoralis"] },
};

describe("AnatomyRenderer", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    capabilities.snapshot.reducedMotion = false;
  });

  it("renders the accessible SVG when no licensed manifest exists", () => {
    render(<AnatomyRenderer {...props} manifest={null} />);
    expect(screen.getByRole("group", { name: "Front muscle view" })).toBeInTheDocument();
    expect(screen.queryByTestId("three-renderer")).not.toBeInTheDocument();
  });

  it("keeps SVG for reduced motion even when a manifest exists", () => {
    capabilities.snapshot.reducedMotion = true;
    const loader = vi.fn();
    render(<AnatomyRenderer {...props} manifest={manifest} loadThreeRenderer={loader} />);
    expect(screen.getByRole("group", { name: "Front muscle view" })).toBeInTheDocument();
    expect(loader).not.toHaveBeenCalled();
  });

  it("loads the isolated renderer only when capability and licensing pass", async () => {
    const Three: ComponentType<AnatomyRendererProps & { manifest: AnatomyAssetManifest }> =
      () => <div data-testid="three-renderer">Three renderer</div>;
    const loader = vi.fn(async () => ({ ThreeAnatomyRenderer: Three }));
    render(<AnatomyRenderer {...props} manifest={manifest} loadThreeRenderer={loader} />);
    await waitFor(() => expect(screen.getByTestId("three-renderer")).toBeInTheDocument());
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("falls back safely when the renderer loader fails", async () => {
    const loader = vi.fn(async () => { throw new Error("raw loader detail"); });
    render(<AnatomyRenderer {...props} manifest={manifest} loadThreeRenderer={loader} />);
    await waitFor(() => expect(loader).toHaveBeenCalled());
    expect(screen.getByRole("group", { name: "Front muscle view" })).toBeInTheDocument();
    expect(screen.queryByText(/raw loader detail/i)).not.toBeInTheDocument();
  });
});
