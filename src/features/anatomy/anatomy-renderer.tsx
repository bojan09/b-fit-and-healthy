"use client";

import {
  getAnatomyAssetManifest,
  type AnatomyAssetManifest,
} from "@/features/anatomy/anatomy-asset-manifest";
import type { AnatomyRendererProps } from "@/features/anatomy/anatomy-renderer-types";
import {
  ThreeAnatomyBoundary,
  type ThreeRendererLoader,
} from "@/features/anatomy/three-anatomy-boundary";
import { SvgAnatomyRenderer } from "@/features/anatomy/svg-anatomy-renderer";
import { canUseThreeRenderer } from "@/features/motion/preferences";

export function AnatomyRenderer({
  manifest = getAnatomyAssetManifest(),
  loadThreeRenderer,
  ...props
}: AnatomyRendererProps & {
  manifest?: AnatomyAssetManifest | null;
  loadThreeRenderer?: ThreeRendererLoader;
}) {
  if (!manifest) return <SvgAnatomyRenderer {...props} />;
  return <ThreeAnatomyBoundary
    {...props}
    manifest={manifest}
    loadRenderer={loadThreeRenderer}
  />;
}

export { canUseThreeRenderer };
