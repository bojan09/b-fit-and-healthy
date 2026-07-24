import type { Locale } from "@/lib/i18n/config";
import type { MuscleView } from "@/features/anatomy/data";

export type AnatomyRendererProps = {
  view: MuscleView;
  selectedMuscleId: string;
  locale: Locale;
  onSelectMuscle: (muscleId: string) => void;
};
