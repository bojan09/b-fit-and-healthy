import Link from "next/link";
import { Activity, Apple, ArrowRight, BookOpen, Brain, Dumbbell, HeartPulse, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionIntro } from "@/components/content/section-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata, siteUrl } from "@/lib/seo/metadata";

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
    <section className="shell public-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><HeartPulse aria-hidden="true" size={17} />{c.home.eyebrow}</p>
        <h1 id="hero-title">{c.home.title}</h1>
        <p className="lede">{c.home.body}</p>
        <div className="action-row"><Button asChild size="lg"><Link href="/features">{c.home.primary}<ArrowRight aria-hidden="true" size={18} /></Link></Button><Button asChild size="lg" variant="secondary"><Link href="/blog">{c.home.secondary}</Link></Button></div>
        <p className="supporting-note">{c.common.educational}</p>
      </div>
      <div className="system-orbit" aria-label={c.home.signal}>
        <div className="orbit-core"><Brain aria-hidden="true" /><strong>B</strong><span>{locale === "en" ? "Your daily context" : "Твојот дневен контекст"}</span></div>
        <span className="orbit-node orbit-one"><Apple aria-hidden="true" />{locale === "en" ? "Fuel" : "Гориво"}</span>
        <span className="orbit-node orbit-two"><Dumbbell aria-hidden="true" />{locale === "en" ? "Move" : "Движење"}</span>
        <span className="orbit-node orbit-three"><BookOpen aria-hidden="true" />{locale === "en" ? "Learn" : "Знаење"}</span>
      </div>
    </section>

    <section className="public-section shell" aria-labelledby="modules-title">
      <SectionIntro eyebrow={c.home.signal} title={c.home.modulesTitle} body={c.home.modulesBody} />
      <div className="module-grid">{modules.map(([Icon, title, body, href], index) => <Card className={`module-card module-${index + 1}`} key={href}><Icon aria-hidden="true" /><span className="module-index">0{index + 1}</span><h2>{title}</h2><p>{body}</p><Link className="text-link" href={href}>{c.common.learnMore}<MoveRight aria-hidden="true" size={18} /></Link></Card>)}</div>
    </section>

    <section className="public-section feature-story shell">
      <div className="feature-visual nutrition-visual"><div><span>07:40</span><strong>{locale === "en" ? "Breakfast" : "Појадок"}</strong><small>{locale === "en" ? "A useful start, not a score" : "Корисен почеток, не оцена"}</small></div><div className="nutrient-lines"><i /><i /><i /></div></div>
      <SectionIntro eyebrow={locale === "en" ? "Nutrition" : "Исхрана"} title={c.home.nutritionTitle} body={c.home.nutritionBody} action={<Button asChild variant="secondary"><Link href="/features/nutrition">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
    </section>

    <section className="public-section feature-story feature-story-reverse shell">
      <div className="feature-visual training-visual"><div className="training-row"><span>01</span><strong>{locale === "en" ? "Squat pattern" : "Чучнување"}</strong><small>3 × 8</small></div><div className="training-row"><span>02</span><strong>{locale === "en" ? "Horizontal pull" : "Хоризонтално влечење"}</strong><small>3 × 10</small></div><div className="training-row"><span>03</span><strong>{locale === "en" ? "Loaded carry" : "Носење товар"}</strong><small>4 × 30 m</small></div></div>
      <SectionIntro eyebrow={locale === "en" ? "Training" : "Тренинг"} title={c.home.trainingTitle} body={c.home.trainingBody} action={<Button asChild variant="secondary"><Link href="/features/training">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
    </section>

    <section className="public-section split-callouts shell"><Card className="callout anatomy-callout"><Activity aria-hidden="true" /><div><p className="eyebrow">{c.nav.anatomy}</p><h2>{c.home.anatomyTitle}</h2><p>{c.home.anatomyBody}</p><Link className="text-link" href="/anatomy">{c.common.explore}<ArrowRight aria-hidden="true" size={18} /></Link></div></Card><Card className="callout knowledge-callout"><BookOpen aria-hidden="true" /><div><p className="eyebrow">{c.nav.blog}</p><h2>{c.home.knowledgeTitle}</h2><p>{c.home.knowledgeBody}</p><Link className="text-link" href="/blog">{c.common.explore}<ArrowRight aria-hidden="true" size={18} /></Link></div></Card></section>

    <section className="public-section shell"><div className="final-cta"><div><p className="eyebrow">B Fit & Healthy</p><h2>{c.home.finalTitle}</h2><p>{c.home.finalBody}</p></div><Button asChild size="lg"><Link href="/features">{c.common.explore}<ArrowRight aria-hidden="true" size={18} /></Link></Button></div></section>
  </main>;
}
