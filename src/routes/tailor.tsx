import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, HelpCircle, Loader2, Target } from "lucide-react";
import { toast } from "sonner";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResumePicker, useSavedResumes } from "@/components/resume/ResumePicker";
import { getAIService, type TailorResult } from "@/lib/resume/ai";
import { createResume } from "@/lib/resume/storage";

export const Route = createFileRoute("/tailor")({
  head: () => ({
    meta: [
      { title: "Tailor Resume to a Job — ResumeForge AI" },
      { name: "description", content: "Prioritise your most relevant projects and experience for a specific job description." },
      { property: "og:title", content: "Tailor Resume to a Job — ResumeForge AI" },
      { property: "og:description", content: "Job-specific resumes without fabricating anything." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TailorPage,
});

function TailorPage() {
  const saved = useSavedResumes();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TailorResult | null>(null);
  const resume = saved.find((r) => r.id === id);

  const run = async () => {
    if (!resume) { toast.error("Choose a resume first."); return; }
    if (jd.trim().length < 50) { toast.error("Paste the full job description."); return; }
    setLoading(true);
    setResult(await getAIService().tailorToJob({ data: resume.data, jobDescription: jd }));
    setLoading(false);
  };

  const apply = () => {
    if (!resume || !result) return;
    const order = <T extends { id: string }>(list: T[], ids: string[]) => ids.map((i) => list.find((x) => x.id === i)!).filter(Boolean);
    const doc = createResume({
      mode: resume.mode,
      templateId: resume.templateId,
      name: `${resume.name} — tailored`,
      data: { ...structuredClone(resume.data), projects: order(resume.data.projects, result.prioritisedProjectIds), experience: order(resume.data.experience, result.prioritisedExperienceIds) },
    });
    toast.success("Tailored copy created — your original is unchanged.");
    navigate({ to: "/editor/$resumeId", params: { resumeId: doc.id } });
  };

  return (
    <PageShell>
      <PageIntro eyebrow="Job-specific resume" title="Tailor Resume to Job" text="We reorder your most relevant work and highlight matching skills. Nothing is invented — and you review every change first." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          {saved.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted p-6 text-sm">
              You don't have a saved resume yet. <Link to="/builder" className="font-semibold text-brand underline-offset-4 hover:underline">Create one first</Link>.
            </div>
          ) : (
            <ResumePicker items={saved} value={id} onChange={setId} />
          )}
          <div className="space-y-1.5">
            <Label htmlFor="tjd">Job description</Label>
            <Textarea id="tjd" rows={12} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job description…" />
          </div>
          <Button size="lg" className="w-full" onClick={run} disabled={loading || !saved.length}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Target className="size-4" />} {loading ? "Analyzing…" : "Analyze & suggest changes"}
          </Button>
        </div>
        <div>
          {!result || !resume ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted p-8 text-center">
              <Target className="size-8 text-muted-foreground" />
              <p className="mt-3 font-semibold">Suggested changes appear here</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">You'll be able to review them before anything is applied.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="surface-card p-6">
                <h2 className="text-sm font-semibold">Matching skills & terms</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">{result.matchedSkills.map((k) => <Badge key={k} variant="secondary">{k}</Badge>)}</div>
              </div>
              <div className="surface-card p-6">
                <h2 className="text-sm font-semibold">Proposed order</h2>
                {resume.data.projects.length > 0 && <><p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Projects</p><ol className="mt-1 list-decimal pl-5 text-sm">{result.prioritisedProjectIds.map((i) => <li key={i}>{resume.data.projects.find((p) => p.id === i)?.name || "Untitled project"}</li>)}</ol></>}
                {resume.data.experience.length > 0 && <><p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Experience</p><ol className="mt-1 list-decimal pl-5 text-sm">{result.prioritisedExperienceIds.map((i) => { const x = resume.data.experience.find((e) => e.id === i); return <li key={i}>{x?.role} {x?.company && `— ${x.company}`}</li>; })}</ol></>}
                <ul className="mt-4 space-y-1.5">{result.suggestions.map((s) => <li key={s} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-success" />{s}</li>)}</ul>
              </div>
              {result.questions.length > 0 && (
                <div className="surface-card p-6">
                  <h2 className="flex items-center gap-1.5 text-sm font-semibold"><HelpCircle className="size-4 text-brand" /> Information you could add — only if true</h2>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{result.questions.map((q) => <li key={q}>{q}</li>)}</ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button onClick={apply}><Check className="size-4" /> Apply as a new tailored copy</Button>
                <Button variant="ghost" onClick={() => setResult(null)}>Discard</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
