import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Info, Loader2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumePicker, useSavedResumes } from "@/components/resume/ResumePicker";
import { getAIService, resumeToText, type AtsReport } from "@/lib/resume/ai";

export const Route = createFileRoute("/ats-analyzer")({
  head: () => ({
    meta: [
      { title: "ATS Analyzer — ResumeForge AI" },
      { name: "description", content: "Estimate keyword coverage, section completeness and formatting against a job description." },
      { property: "og:title", content: "ATS Analyzer — ResumeForge AI" },
      { property: "og:description", content: "An estimated compatibility analysis for your resume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AtsPage,
});

function AtsPage() {
  const saved = useSavedResumes();
  const [source, setSource] = useState("__paste");
  const [pasted, setPasted] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AtsReport | null>(null);

  const resumeText = source === "__paste" ? pasted : resumeToText(saved.find((r) => r.id === source)?.data ?? ({} as never));

  const run = async () => {
    if (resumeText.trim().length < 50) { toast.error("Add your resume text (at least a few lines)."); return; }
    if (jd.trim().length < 50) { toast.error("Paste the full job description."); return; }
    setLoading(true);
    try {
      setReport(await getAIService().analyzeAts({ resumeText, jobDescription: jd }));
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageIntro eyebrow="ATS Analyzer" title="Estimated compatibility analysis" text="See how your resume lines up with a job posting. Results are an estimate — no tool can guarantee how a specific applicant tracking system will behave." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <ResumePicker items={saved} value={source} onChange={setSource} allowPaste />
          {source === "__paste" && (
            <div className="space-y-1.5">
              <Label htmlFor="resume-text">Resume text</Label>
              <Textarea id="resume-text" rows={9} value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="Paste the text of your resume…" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="jd">Job description</Label>
            <Textarea id="jd" rows={9} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job description…" />
          </div>
          <Button onClick={run} disabled={loading} size="lg" className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ScanSearch className="size-4" />} {loading ? "Analyzing…" : "Analyze"}
          </Button>
        </div>

        <div>
          {!report ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted p-8 text-center">
              <ScanSearch className="size-8 text-muted-foreground" />
              <p className="mt-3 font-semibold">Your analysis will appear here</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Choose a resume, paste a job description and run the analysis.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="surface-card p-6">
                <p className="text-sm text-muted-foreground">Estimated compatibility</p>
                <p className="mt-1 font-display text-5xl font-semibold">{report.overall}<span className="text-2xl text-muted-foreground">/100</span></p>
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" /> An estimate based on keyword overlap and structure — not a guarantee of passing any ATS.</p>
                <div className="mt-6 space-y-4">
                  {report.sections.map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm"><span className="font-medium">{s.label}</span><span className="text-muted-foreground">{s.score}%</span></div>
                      <Progress value={s.score} className="mt-1.5 h-2" />
                      <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface-card p-6">
                <h2 className="text-sm font-semibold">Relevant keywords found</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {report.matchedKeywords.length ? report.matchedKeywords.map((k) => <Badge key={k} variant="secondary">{k}</Badge>) : <p className="text-sm text-muted-foreground">None detected.</p>}
                </div>
                <h2 className="mt-6 text-sm font-semibold">Keywords not found</h2>
                <p className="mt-1 text-xs text-muted-foreground">If you genuinely have this skill, consider representing it more clearly in your resume. Never add skills you don't have.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {report.missingKeywords.slice(0, 24).map((k) => <Badge key={k} variant="outline">{k}</Badge>)}
                </div>
              </div>
              <div className="surface-card p-6">
                <h2 className="text-sm font-semibold">Formatting check</h2>
                <ul className="mt-3 space-y-2">
                  {report.formatting.map((f) => (
                    <li key={f.message} className="flex items-start gap-2 text-sm">
                      {f.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />} {f.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
