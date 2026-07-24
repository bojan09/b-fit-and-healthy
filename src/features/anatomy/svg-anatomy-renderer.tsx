import { AnatomyFigure } from "@/features/anatomy/anatomy-figure";
import type { AnatomyRendererProps } from "@/features/anatomy/anatomy-renderer-types";

export function SvgAnatomyRenderer({
  view,
  locale,
  selectedMuscleId,
  onSelectMuscle,
}: AnatomyRendererProps) {
  return <AnatomyFigure
    view={view}
    locale={locale}
    selected={selectedMuscleId}
    onSelect={onSelectMuscle}
  />;
}
