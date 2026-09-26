import type { CSSProperties } from "react";
import Link from "next/link";
import { Activity, Apple, ArrowRight, BookOpen, CheckCircle2, Circle, Dumbbell, HeartPulse, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionIntro } from "@/components/content/section-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata, siteUrl } from "@/lib/seo/metadata";
import { GuidedHealthPath } from "@/features/landing/guided-health-path";
import { MotionReveal } from "@/features/motion/motion-reveal";

export const metadata = publicMetadata("Health and fitness, connected", "Understand nutrition, training, anatomy, habits, and health knowledge in one calm system.", "/");

export default async function HomePage() {
  const locale = await getLocale();
  const c = getPublicContent(locale);
  const modules = [
    [Apple, c.nav.nutrition, c.features.nutrition, "/features/nutrition"],
    [Dumbbell, c.nav.training, c.features.training, "/features/training"],
    [Activity, c.nav.anatomy, c.features.anatomy, "/anatomy"],
    [BookOpen, c.nav.blog, c.features.knowledge, "/blog"]
  ] as const;
  return <main id="main-content" tabIndex={-1}>
    <JsonLd value={[
      { "@context": "https://schema.org", "@type": "Organization", name: "B Fit & Healthy", url: siteUrl.href },
      { "@context": "https://schema.org", "@type": "WebSite", name: "B Fit & Healthy", url: siteUrl.href }
    ]} />
    <section className="shell public-hero" aria-labelledby="hero-title" data-motion-hero>
      <div className="hero-copy">
        <p className="eyebrow"><HeartPulse aria-hidden="true" size={17} />{c.home.eyebrow}</p>
        <h1 id="hero-title">{c.home.title}</h1>
        <p className="lede">{c.home.body}</p>
        <div className="action-row hero-account-actions"><Button asChild size="lg"><Link href="/demo/today">{c.home.tryDemoLabel}<ArrowRight aria-hidden="true" size={18} /></Link></Button><Button asChild size="lg" variant="secondary"><Link href="/sign-up">{c.nav.getStarted}</Link></Button></div>
        <p className="supporting-note">{c.common.educational}</p>
      </div>
      <GuidedHealthPath locale={locale} />
    </section>

    <MotionReveal className="landing-reveal"><section className="public-section shell" aria-labelledby="modules-title" data-motion-section>
      <SectionIntro eyebrow={c.home.signal} title={c.home.modulesTitle} body={c.home.modulesBody} />
      <div className="module-grid">{modules.map(([Icon, title, body, href], index) => <Card className={`module-card module-${index + 1} depth-card`} key={href} style={{ "--i": index } as CSSProperties}><Icon aria-hidden="true" /><span className="module-index">0{index + 1}</span><h2>{title}</h2><p>{body}</p><Link className="text-link" href={href}>{c.common.learnMore}<MoveRight aria-hidden="true" size={18} /></Link></Card>)}</div>
    </section></MotionReveal>

    <MotionReveal className="landing-reveal" variant="tilt"><section className="public-section feature-story shell" data-motion-section>
      <div className="feature-visual nutrition-visual">
        <div className="nutrition-visual-header"><span>07:40</span><strong>{c.home.breakfastLabel}</strong><small>{c.home.breakfastNote}</small></div>
        <div className="nutrition-stat"><strong>420</strong><span>{c.home.caloriesUnit}</span></div>
        <div className="nutrient-lines">
          {([[c.home.proteinLabel, "32g"], [c.home.carbsLabel, "48g"], [c.home.fatLabel, "14g"]] as const).map(([label, value]) => (
            <div className="nutrient-line" key={label}><span>{label}</span><i /><b>{value}</b></div>
          ))}
        </div>
      </div>
      <SectionIntro eyebrow={c.home.nutritionVisualLabel} title={c.home.nutritionTitle} body={c.home.nutritionBody} action={<Button asChild variant="secondary"><Link href="/features/nutrition">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
    </section></MotionReveal>

    <MotionReveal className="landing-reveal" variant="tilt"><section className="public-section feature-story feature-story-reverse shell" data-motion-section>
      <div className="feature-visual training-visual">
        <div className="training-visual-header"><strong>{c.home.workoutSessionLabel}</strong><span>{c.home.workoutDurationLabel}</span></div>
        {([[c.home.squatLabel, "3 × 8", true], [c.home.pullLabel, "3 × 10", true], [c.home.carryLabel, "4 × 30 m", false]] as const).map(([label, sets, done]) => (
          <div className="training-row" data-done={done} key={label}>
            {done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
            <strong>{label}</strong>
            <small>{sets}</small>
            <span className="training-row-status">{done ? c.home.exerciseDoneLabel : c.home.exercisePendingLabel}</span>
          </div>
        ))}
      </div>
      <SectionIntro eyebrow={c.home.trainingVisualLabel} title={c.home.trainingTitle} body={c.home.trainingBody} action={<Button asChild variant="secondary"><Link href="/features/training">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
    </section></MotionReveal>

    <MotionReveal className="landing-reveal"><section className="public-section split-callouts shell" data-motion-section><Card className="callout anatomy-callout"><Activity aria-hidden="true" /><div><p className="eyebrow">{c.nav.anatomy}</p><h2>{c.home.anatomyTitle}</h2><p>{c.home.anatomyBody}</p><Link className="text-link" href="/anatomy">{c.common.explore}<ArrowRight aria-hidden="true" size={18} /></Link></div></Card><Card className="callout knowledge-callout"><BookOpen aria-hidden="true" /><div><p className="eyebrow">{c.nav.blog}</p><h2>{c.home.knowledgeTitle}</h2><p>{c.home.knowledgeBody}</p><Link className="text-link" href="/blog">{c.common.explore}<ArrowRight aria-hidden="true" size={18} /></Link></div></Card></section></MotionReveal>

    <MotionReveal className="landing-reveal"><section className="public-section shell" data-motion-section><div className="final-cta"><div><p className="eyebrow">B Fit & Healthy</p><h2>{c.home.finalTitle}</h2><p>{c.home.finalBody}</p></div><div className="final-account-actions"><Button asChild size="lg"><Link href="/sign-up">{c.nav.getStarted}<ArrowRight aria-hidden="true" size={18} /></Link></Button><Link className="text-link" href="/sign-in">{c.nav.signIn}</Link></div></div></section></MotionReveal>
  </main>;
}
