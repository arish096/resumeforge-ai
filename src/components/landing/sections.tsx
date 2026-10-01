import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Download,
  Eye,
  GraduationCap,
  LayoutTemplate,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TEMPLATES } from "@/components/resume/templates/registry";
import { sampleExperienced, sampleFresher } from "@/lib/resume/sample";

const demo = sampleExperienced();
const demoFresher = sampleFresher();

export function Hero() {
  return (
    <section className="hero-gradient border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5" /> Build. Tailor. Get Hired.
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            Build a Resume That Gets Noticed.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Create professional, ATS-friendly resumes with AI, choose from modern templates, and tailor your
            resume for every opportunity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/builder">
                Create My Resume <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/templates">Explore Templates</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No sign-up to start", "Works for freshers & professionals", "Selectable-text PDF export"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" /> {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="relative">
          <div className="pointer-events-none select-none overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-lift sm:p-6">
            <ResumePreview data={demo} mode="experienced" templateId="modern" fit />
          </div>
          <div className="surface-card absolute -bottom-5 left-4 flex items-center gap-2 px-3 py-2 text-xs font-medium sm:left-8">
            <ShieldCheck className="size-4 text-success" /> ATS-friendly structure
          </div>
        </div>
      </div>
    </section>
  );
}

const HIGHLIGHTS = [
  { icon: BrainCircuit, title: "AI-Powered", text: "Rewrites your own words into sharp resume language." },
  { icon: ShieldCheck, title: "ATS-Friendly", text: "Clean structure that parsers can read reliably." },
  { icon: LayoutTemplate, title: "Professional Templates", text: "Five layouts, one shared resume record." },
  { icon: Download, title: "PDF Export", text: "True A4 pages with selectable text." },
];

export function Highlights() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="surface-card p-5">
            <h.icon className="size-5 text-brand" />
            <h3 className="mt-3 text-sm font-semibold">{h.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { title: "Enter Your Information", text: "Short, guided steps — no 40-field forms. Everything autosaves." },
  { title: "Improve With AI", text: "Tighten your summary, projects and bullets using only what you wrote." },
  { title: "Choose Your Template", text: "Switch layouts instantly; your information never has to be re-entered." },
  { title: "Download Your Resume", text: "Export a clean A4 PDF that is ready to attach to applications." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading eyebrow="How it works" title="Four steps to a resume you can send today" />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="surface-card p-6">
              <span className="band-gradient inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI Resume Builder",
    text: "Turn rough notes into professional bullet points. The assistant never invents experience, metrics or skills.",
  },
  {
    icon: GraduationCap,
    title: "Fresher & Experienced Modes",
    text: "The form adapts: students lead with projects and education, professionals lead with impact and scope.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-Friendly Templates",
    text: "Single-column options with predictable headings, real text and no decorative graphics.",
  },
  { icon: Eye, title: "Live Resume Preview", text: "See an accurate A4 page update as you type, on any screen size." },
  {
    icon: Target,
    title: "Job-Specific Resume",
    text: "Paste a job description to reorder relevant work and surface the wording that matters.",
  },
  {
    icon: ScanSearch,
    title: "Resume Analyzer",
    text: "An estimated compatibility read on keywords, sections and formatting — never a pass/fail promise.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to go from blank page to applied"
          text="Your information lives in one structured record, so every template, export and analysis works from the same source."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="surface-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TemplatesPreview({ limit = 5 }: { limit?: number }) {
  return (
    <section id="templates" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading eyebrow="Templates" title="Five layouts, one resume record" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.slice(0, limit).map((t, i) => (
            <article key={t.id} className="surface-card overflow-hidden">
              <div className="overflow-hidden border-b border-border bg-surface-muted p-4">
                <div className="pointer-events-none mx-auto max-h-64 overflow-hidden rounded-sm">
                  <ResumePreview
                    data={i % 2 === 0 ? demo : demoFresher}
                    mode={i % 2 === 0 ? "experienced" : "fresher"}
                    templateId={t.id}
                    scale={0.42}
                  />
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
                </div>
                {t.atsFriendly && (
                  <Badge variant="secondary" className="shrink-0">
                    ATS
                  </Badge>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/templates">View All Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="band-gradient">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
        <h2 className="text-3xl font-semibold text-primary-foreground sm:text-4xl">
          Your next opportunity starts with a better resume.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Start from scratch or import what you already have. Your drafts are saved on this device.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/builder">
              Create My Resume <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link to="/import">Import Existing Resume</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{text}</p>}
    </div>
  );
}
