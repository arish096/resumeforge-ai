/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, Layers, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field } from "@/components/builder/fields";
import { createResume } from "@/lib/resume/storage";
import {
  emptyResumeData, uid, type AchievementEntry, type CertificationEntry, type EducationEntry, type ExperienceEntry,
  type LanguageEntry, type PersonalInfo, type ProjectEntry, type ResumeData, type SkillGroup,
} from "@/lib/resume/types";
import { aiImportResume } from "@/lib/resume/ai.functions";

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

const withIds = <T extends object>(list: unknown): (T & { id: string })[] =>
  Array.isArray(list) ? list.map((x) => ({ ...(x as T), id: uid() })) : [];

function normalise(raw: any): ResumeData {
  const base = emptyResumeData();
  return {
    personal: { ...base.personal, ...(raw?.personal ?? {}) },
    summary: String(raw?.summary ?? ""),
    education: withIds<EducationEntry>(raw?.education),
    skills: withIds<SkillGroup>(raw?.skills).map((g) => ({ ...g, category: g.category || "Skills", items: Array.isArray(g.items) ? g.items.filter(Boolean) : [] })),
    projects: withIds<ProjectEntry>(raw?.projects).map((p) => ({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies.filter(Boolean) : [] })),
    experience: withIds<ExperienceEntry>(raw?.experience).map((x) => ({ ...x, current: Boolean(x.current) })),
    certifications: withIds<CertificationEntry>(raw?.certifications),
    achievements: withIds<AchievementEntry>(raw?.achievements),
    languages: withIds<LanguageEntry>(raw?.languages),
  };
}

const toBase64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(f);
  });

function ImportPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<ResumeData | null>(null);
  const personal = parsed?.personal ?? null;
  const setPersonal = (fn: (p: PersonalInfo | null) => PersonalInfo | null) => setParsed((d) => (d ? { ...d, personal: fn(d.personal)! } : d));
  const [summary, setSummary] = useState("");
  const [styleFile, setStyleFile] = useState<File | null>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error("Please upload a file under 10 MB."); return; }
    if (!/pdf|image\//.test(f.type)) { toast.error("Upload a PDF, PNG or JPG file."); return; }
    setFile(f);
    setBusy(true);
    try {
      const res = await aiImportResume({ data: { base64: await toBase64(f), mediaType: f.type, filename: f.name } });
      if (!res.ok) throw new Error(res.error);
      const data = normalise(JSON.parse(res.json));
      setParsed(data);
      setSummary(data.summary);
      toast.success("Resume read — please review everything before saving.");
    } catch (e) {
      setParsed(emptyResumeData());
      setSummary("");
      toast.error(e instanceof Error ? e.message : "Couldn't read this file", { description: "Fill in the details below instead." });
    } finally {
      setBusy(false);
    }
  };

  const create = () => {
    if (!parsed || !personal) return;
    const data = { ...parsed, summary };
    const doc = createResume({ mode: "experienced", name: `Imported — ${personal.fullName || file?.name || "resume"}`, data });
    toast.success("Imported resume created");
    navigate({ to: "/editor/$resumeId", params: { resumeId: doc.id } });
  };

  const set = (k: keyof PersonalInfo) => (v: string) => setPersonal((p) => (p ? { ...p, [k]: v } : p));

  return (
    <PageShell>
      <PageIntro eyebrow="Import" title="Bring in your existing resume" text="Upload a PDF or image — AI reads every section. You'll review everything we detect before a new resume is created — nothing is overwritten." />
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
                <p className="mt-1 text-sm text-muted-foreground">Check and correct everything. AI read your file as written — nothing was invented.</p>
                {parsed && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {([["Education", parsed.education.length], ["Experience", parsed.experience.length], ["Projects", parsed.projects.length], ["Skill groups", parsed.skills.length], ["Certifications", parsed.certifications.length], ["Achievements", parsed.achievements.length], ["Languages", parsed.languages.length]] as const).map(([l, n]) => (
                      <span key={l} className="rounded-full bg-secondary px-2.5 py-1">{l}: {n}</span>
                    ))}
                  </div>
                )}
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
