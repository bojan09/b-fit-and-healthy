import { getFitnessCopy } from "@/features/fitness/content";
import { ExerciseLibrary } from "@/features/fitness/exercise-library";
import { getLocale } from "@/lib/i18n/server";

export default async function ExercisesPage() {
  const locale = await getLocale();
  const c = getFitnessCopy(locale);
  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.catalogueEyebrow}</p>
          <h1>{c.exercises}</h1>
          <p>{c.catalogueIntro}</p>
        </div>
      </header>
      <ExerciseLibrary locale={locale} />
    </main>
  );
}
