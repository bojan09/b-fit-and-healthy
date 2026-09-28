"use client";

import Image from "next/image";
import { useState } from "react";
import type { DisplayMedia, MediaFallbackKind } from "@/features/media/catalogue-media";
import { CatalogueImageFallback } from "./catalogue-image-fallback";
import { useOptionalLocale } from "@/components/providers/locale-provider";

const attributionCopy = {
  en: { label: "Image attribution", source: "Source:", creator: "Creator:", licence: "Licence:" },
  mk: { label: "Извор на сликата", source: "Извор:", creator: "Автор:", licence: "Лиценца:" },
} as const;

export type CatalogueImageProps = {
  media: DisplayMedia | null;
  fallback: MediaFallbackKind;
  sizes?: string;
  priority?: boolean;
  showAttribution?: boolean;
  className?: string;
  "data-testid"?: string;
  objectFit?: "contain" | "cover";
};

function ProvenanceLink({ href, children }: { href?: string; children: string }) {
  return href ? <a href={href}>{children}</a> : <span>{children}</span>;
}

export function CatalogueImage({
  media,
  fallback,
  sizes,
  priority = false,
  showAttribution = false,
  className,
  "data-testid": testId,
  objectFit = "cover",
}: CatalogueImageProps) {
  const t = attributionCopy[useOptionalLocale()];
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImageError = Boolean(media?.src && failedSrc === media.src);
  const shouldShowFallback = media === null || hasImageError;

  return (
    <div className={className} data-testid={testId}>
      <div style={{ aspectRatio: "4 / 3", overflow: "hidden", position: "relative" }}>
        {shouldShowFallback ? (
          <CatalogueImageFallback kind={fallback} />
        ) : (
          <Image
            alt={media.alt}
            fill
            onError={() => setFailedSrc(media.src)}
            priority={priority}
            sizes={sizes}
            src={media.src}
            style={{ objectFit, objectPosition: media.focalPoint ?? "center" }}
          />
        )}
      </div>
      {showAttribution && media ? (
        <aside aria-label={t.label}>
          <span>{t.source} <ProvenanceLink href={media.sourceUrl}>{media.sourceName}</ProvenanceLink></span>
          {media.creator ? <span> {t.creator} {media.creator}</span> : null}
          <span> {t.licence} <ProvenanceLink href={media.licenseUrl}>{media.licenseName}</ProvenanceLink></span>
        </aside>
      ) : null}
    </div>
  );
}
