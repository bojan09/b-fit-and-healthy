"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { AnatomyAssetManifest } from "@/features/anatomy/anatomy-asset-manifest";
import type { AnatomyRendererProps } from "@/features/anatomy/anatomy-renderer-types";
import { SvgAnatomyRenderer } from "@/features/anatomy/svg-anatomy-renderer";
import { canUseThreeRenderer } from "@/features/motion/preferences";
import { useMotionCapabilities } from "@/features/motion/use-motion-profile";

type ThreeProps = AnatomyRendererProps & { manifest: AnatomyAssetManifest };
type ThreeModule = { ThreeAnatomyRenderer: ComponentType<ThreeProps> };
export type ThreeRendererLoader = () => Promise<ThreeModule>;

export function loadThreeRenderer() {
  return import("./three-anatomy-renderer");
}

export function ThreeAnatomyBoundary({
  manifest,
  loadRenderer = loadThreeRenderer,
  ...props
}: AnatomyRendererProps & {
  manifest: AnatomyAssetManifest | null;
  loadRenderer?: ThreeRendererLoader;
}) {
  const capabilities = useMotionCapabilities();
  const [Renderer, setRenderer] = useState<ComponentType<ThreeProps> | null>(null);
  const eligible = Boolean(manifest && canUseThreeRenderer(capabilities, true));

  useEffect(() => {
    if (!eligible) return;
    let active = true;
    void loadRenderer()
      .then((loaded) => active && setRenderer(() => loaded.ThreeAnatomyRenderer))
      .catch(() => undefined);
    return () => { active = false; };
  }, [eligible, loadRenderer]);

  if (!eligible || !manifest || !Renderer) return <SvgAnatomyRenderer {...props} />;
  return <Renderer {...props} manifest={manifest} />;
}
