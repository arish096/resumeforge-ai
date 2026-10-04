import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CloudCheck, Download, LayoutTemplate, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brand } from "@/components/site/SiteHeader";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { PrintableResume } from "@/components/resume/PrintableResume";
import { TEMPLATES } from "@/components/resume/templates/registry";
import {
  AchievementsStep,
  CertificationsStep,
  EducationStep,
  ExperienceStep,
  LanguagesStep,
  PersonalStep,
  ProjectsStep,
  SkillsStep,
  SummaryStep,
  type StepProps,
} from "@/components/builder/steps";
import { StepHeader } from "@/components/builder/fields";
import { getResume, saveResume } from "@/lib/resume/storage";
import { exportResumePdf } from "@/lib/resume/pdf";
import type { ResumeData, ResumeDocument, TemplateId } from "@/lib/resume/types";

export const Route = createFileRoute("/editor/$resumeId")({
  head: () => ({
    meta: [
      { title: "Resume Editor — ResumeForge AI" },
      { name: "description", content: "Edit your resume with live A4 preview and PDF export." },
      { property: "og:title", content: "Resume Editor — ResumeForge AI" },
      { property: "og:description", content: "Edit your resume with live preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditorPage,
});

function TemplateStep({ doc, setTemplate, onDownload }: { doc: ResumeDocument; setTemplate: (t: TemplateId) => void; onDownload: () => void }) {
  return (
    <>
      <StepHeader title="Template & preview" text="Pick a layout. Your information stays exactly the same." action={<Button onClick={onDownload}><Download className="size-4" /> Download PDF</Button>} />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {TEMPLATES.map((t) => {
          const active = t.id === doc.templateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              aria-pressed={active}
              className={`overflow-hidden rounded-xl border-2 bg-surface text-left transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${active ? "border-brand shadow-lift" : "border-border hover:border-brand/40"}`}
            >
              <div className="pointer-events-none h-44 overflow-hidden bg-surface-muted p-2">
                <ResumePreview data={doc.data} mode={doc.mode} templateId={t.id} fit />
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm font-semibold">{t.name}</span>
                {active && <Check className="size-4 text-brand" />}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

const STEPS: { key: string; label: string; Component?: (p: StepProps) => React.ReactNode }[] = [
  { key: "personal", label: "Personal", Component: PersonalStep },
  { key: "summary", label: "Summary", Component: SummaryStep },
  { key: "education", label: "Education", Component: EducationStep },
  { key: "skills", label: "Skills", Component: SkillsStep },
  { key: "projects", label: "Projects", Component: ProjectsStep },
  { key: "experience", label: "Experience", Component: ExperienceStep },
  { key: "certifications", label: "Certifications", Component: CertificationsStep },
  { key: "achievements", label: "Achievements", Component: AchievementsStep },
  { key: "languages", label: "Languages", Component: LanguagesStep },
  { key: "template", label: "Template & Preview" },
];

function EditorPage() {
  const { resumeId } = Route.useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<ResumeDocument | null | undefined>(undefined);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"editor" | "preview">("editor");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const found = getResume(resumeId);
    setDoc(found ?? null);
    const saved = Number(window.sessionStorage.getItem(`rf-step-${resumeId}`));
    if (saved >= 0 && saved < STEPS.length) setStep(saved);
  }, [resumeId]);

  useEffect(() => {
    if (doc) window.sessionStorage.setItem(`rf-step-${resumeId}`, String(step));
  }, [step, doc, resumeId]);

  const persist = useCallback((next: ResumeDocument) => {
    setSaving("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveResume(next);
      setSaving("saved");
    }, 500);
  }, []);

  const mutate = (fn: (d: ResumeDocument) => ResumeDocument) =>
    setDoc((prev) => {
      if (!prev) return prev;
      const next = fn(prev);
      persist(next);
      return next;
    });

  const update = (fn: (d: ResumeData) => ResumeData) => mutate((d) => ({ ...d, data: fn(d.data) }));
  const setTemplate = (templateId: TemplateId) => mutate((d) => ({ ...d, templateId }));

  const download = () => {
    if (!doc) return;
    if (!doc.data.personal.fullName.trim()) {
      toast.error("Add your full name before downloading.");
      setStep(0);
      setView("editor");
      return;
    }
    if (timer.current) {
      clearTimeout(timer.current);
      saveResume(doc);
      setSaving("saved");
    }
    toast.success("Choose “Save as PDF” in the print dialog.");
    exportResumePdf(`${doc.data.personal.fullName} Resume`);
  };

  if (doc === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading your resume…
      </div>
    );
  }
  if (doc === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Resume not found</h1>
        <p className="text-muted-foreground">It may have been deleted, or it was created on another device.</p>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/dashboard">Go to dashboard</Link></Button>
          <Button asChild><Link to="/builder">Create a new resume</Link></Button>
        </div>
      </div>
    );
  }

  const Current = STEPS[step]!;
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <Brand className="hidden sm:flex" />
          <Button asChild variant="ghost" size="sm" className="sm:hidden" aria-label="Back to dashboard">
            <Link to="/dashboard"><ArrowLeft className="size-4" /></Link>
          </Button>
          <Input
            aria-label="Resume name"
            value={doc.name}
            onChange={(e) => mutate((d) => ({ ...d, name: e.target.value }))}
            className="h-9 max-w-56 border-transparent bg-transparent font-medium shadow-none hover:border-border focus-visible:border-input"
          />
          <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex" aria-live="polite">
            {saving === "saving" ? <><Loader2 className="size-3.5 animate-spin" /> Saving…</> : <><CloudCheck className="size-3.5" /> Saved on this device</>}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Select value={doc.templateId} onValueChange={(v) => setTemplate(v as TemplateId)}>
              <SelectTrigger className="hidden h-9 w-48 md:flex" aria-label="Change template">
                <LayoutTemplate className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={download}><Download className="size-4" /> <span className="hidden sm:inline">Download PDF</span></Button>
            <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex"><Link to="/dashboard">Dashboard</Link></Button>
          </div>
        </div>
        <div className="h-1 bg-secondary"><div className="band-gradient h-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
        <nav aria-label="Builder steps" className="flex gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary-soft text-primary hover:bg-accent" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </nav>
        <div className="flex border-t border-border lg:hidden" role="tablist">
          {(["editor", "preview"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`flex-1 py-2.5 text-sm font-medium capitalize ${view === v ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}>
              {v}
            </button>
          ))}
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className={`${view === "editor" ? "block" : "hidden"} px-4 py-8 sm:px-8 lg:block`}>
          <div className="mx-auto max-w-2xl">
            {Current.Component ? (
              <Current.Component doc={doc} update={update} />
            ) : (
              <TemplateStep doc={doc} setTemplate={setTemplate} onDownload={download} />
            )}
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)}>Next <ArrowRight className="size-4" /></Button>
              ) : (
                <Button onClick={() => { saveResume(doc); toast.success("Resume saved"); navigate({ to: "/dashboard" }); }}>Finish</Button>
              )}
            </div>
          </div>
        </section>
        <aside className={`${view === "preview" ? "block" : "hidden"} border-l border-border bg-surface-muted px-4 py-8 sm:px-8 lg:block`}>
          <div className="lg:sticky lg:top-44">
            <ResumePreview data={doc.data} mode={doc.mode} templateId={doc.templateId} fit />
          </div>
        </aside>
      </div>
      <PrintableResume data={doc.data} mode={doc.mode} templateId={doc.templateId} />
    </div>
  );
}
