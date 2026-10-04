import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, Layers, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field } from "@/components/builder/fields";
import { createResume } from "@/lib/resume/storage";
import { emptyResumeData, type PersonalInfo } from "@/lib/resume/types";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Import Existing Resume — ResumeForge AI" },
      { name: "description", content: "Upload a PDF or image of your resume and review the extracted details before saving." },
      { property: "og:title", content: "Import Existing Resume — ResumeForge AI" },
      { property: "og:description", content: "Bring your existing resume into ResumeForge AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ImportPage,
});

/** Best-effort extraction from text-based PDFs. Reads literal text runs only. */
async function extractText(file: File): Promise<string> {
  if (file.type !== "application/pdf") return "";
  const raw = new TextDecoder("latin1").decode(await file.arrayBuffer());
  const runs = [...raw.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)].map((m) => (m[1] ?? "").replace(/\\(.)/g, "$1"));
  return runs.join("\n");
}

function guessPersonal(text: string): Partial<PersonalInfo> {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] ?? "";
  const phone = text.match(/\+?\d[\d\s-]{8,}\d/)?.[0] ?? "";
  const linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] ?? "";
  const github = text.match(/github\.com\/[\w-]+/i)?.[0] ?? "";
  const firstLine = text.split("\n").map((l) => l.trim()).find((l) => /^[A-Za-z][A-Za-z .'-]{2,40}$/.test(l)) ?? "";
  return { fullName: firstLine, email, phone, linkedin, github };
}

function ImportPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [personal, setPersonal] = useState<PersonalInfo | null>(null);
  const [summary, setSummary] = useState("");
  const [styleFile, setStyleFile] = useState<File | null>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error("Please upload a file under 10 MB."); return; }
    if (!/pdf|image\//.test(f.type)) { toast.error("Upload a PDF, PNG or JPG file."); return; }
    setFile(f);
    setBusy(true);
    const text = await extractText(f);
    const base = emptyResumeData().personal;
    setPersonal({ ...base, ...guessPersonal(text) });
    setSummary("");
    setBusy(false);
    toast(text ? "We pulled out what we could — please review every field." : "We couldn't read text from this file automatically. Fill in the fields below.");
  };

  const create = () => {
    if (!personal) return;
    const data = { ...emptyResumeData(), personal, summary };
    const doc = createResume({ mode: "experienced", name: `Imported — ${personal.fullName || file?.name || "resume"}`, data });
    toast.success("Imported resume created");
    navigate({ to: "/editor/$resumeId", params: { resumeId: doc.id } });
  };

  const set = (k: keyof PersonalInfo) => (v: string) => setPersonal((p) => (p ? { ...p, [k]: v } : p));

  return (
    <PageShell>
      <PageIntro eyebrow="Import" title="Bring in your existing resume" text="Upload a PDF or image. You'll review everything we detect before a new resume is created — nothing is overwritten." />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Tabs defaultValue="import">
          <TabsList>
            <TabsTrigger value="import"><FileUp className="size-4" /> Import Existing Resume</TabsTrigger>
            <TabsTrigger value="style"><Layers className="size-4" /> Create Similar Style</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="mt-6 space-y-6">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-muted px-6 py-12 text-center transition-colors hover:border-brand/50 focus-within:ring-2 focus-within:ring-ring">
              {busy ? <Loader2 className="size-8 animate-spin text-brand" /> : <Upload className="size-8 text-brand" />}
              <span className="mt-3 font-semibold">{file ? file.name : "Choose a PDF or image"}</span>
              <span className="mt-1 text-sm text-muted-foreground">PDF, PNG or JPG · up to 10 MB</span>
              <input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>

            {personal && (
              <div className="surface-card p-6">
                <h2 className="text-lg font-semibold">Review extracted information</h2>
                <p className="mt-1 text-sm text-muted-foreground">Check and correct everything. You can add education, projects and experience in the builder next.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field id="im-name" label="Full name" value={personal.fullName} onChange={set("fullName")} />
                  <Field id="im-title" label="Professional title" value={personal.title} onChange={set("title")} />
                  <Field id="im-email" label="Email" value={personal.email} onChange={set("email")} />
                  <Field id="im-phone" label="Phone" value={personal.phone} onChange={set("phone")} />
                  <Field id="im-li" label="LinkedIn" value={personal.linkedin} onChange={set("linkedin")} />
                  <Field id="im-gh" label="GitHub" value={personal.github} onChange={set("github")} />
                  <Field id="im-sum" label="Summary" value={summary} onChange={setSummary} multiline rows={3} className="sm:col-span-2" />
                </div>
                <Button className="mt-5" onClick={create}>Create resume from these details</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="mt-6">
            <div className="surface-card p-6">
              <h2 className="text-lg font-semibold">Create Similar Style</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a resume you like. We'll study its structure — section order, spacing, hierarchy and general colour approach — and generate an <strong className="text-foreground">original</strong> template inspired by it. Logos, branding and proprietary template assets are never copied.
              </p>
              <label className="mt-5 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-border bg-surface-muted px-6 py-10 text-center hover:border-brand/50">
                <Layers className="size-7 text-brand" />
                <span className="mt-2 font-medium">{styleFile ? styleFile.name : "Upload a screenshot or PDF"}</span>
                <input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={(e) => setStyleFile(e.target.files?.[0] ?? null)} />
              </label>
              {styleFile && (
                <p className="mt-4 rounded-lg bg-primary-soft p-4 text-sm">
                  Style analysis is coming soon. Your file stays on this device — in the meantime, the Modern, Minimal and Classic templates cover most layouts.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
