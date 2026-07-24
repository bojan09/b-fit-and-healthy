"use client";

import type { AnatomyAssetManifest } from "@/features/anatomy/anatomy-asset-manifest";
import type { AnatomyRendererProps } from "@/features/anatomy/anatomy-renderer-types";
import { SvgAnatomyRenderer } from "@/features/anatomy/svg-anatomy-renderer";

export function ThreeAnatomyRenderer(
  props: AnatomyRendererProps & { manifest: AnatomyAssetManifest },
) {
  return <div data-renderer-status="asset-integration-required">
    <SvgAnatomyRenderer {...props} />
  </div>;
}
