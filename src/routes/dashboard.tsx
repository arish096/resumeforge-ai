import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, FilePlus2, FileText, Pencil, ScanSearch, Target, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { getTemplate } from "@/components/resume/templates/registry";
import { createResume, deleteResume, duplicateResume, formatRelative, listResumes, subscribe } from "@/lib/resume/storage";
import { sampleFresher } from "@/lib/resume/sample";
import type { ResumeDocument } from "@/lib/resume/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ResumeForge AI" },
      { name: "description", content: "Manage your resumes, import an existing one or analyze it against a job." },
      { property: "og:title", content: "Dashboard — ResumeForge AI" },
      { property: "og:description", content: "Your resumes in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const ACTIONS = [
  { to: "/builder", icon: FilePlus2, title: "Create New Resume", text: "Start from a guided, step-by-step builder." },
  { to: "/import", icon: Upload, title: "Import Resume", text: "Bring in an existing PDF or image and review it." },
  { to: "/ats-analyzer", icon: ScanSearch, title: "ATS Analyzer", text: "Estimate how well your resume matches a job." },
  { to: "/tailor", icon: Target, title: "Tailor for a Job", text: "Prioritise relevant content for a posting." },
] as const;

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ResumeDocument[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ResumeDocument | null>(null);

  useEffect(() => {
    const load = () => setItems(listResumes());
    load();
    return subscribe(load);
  }, []);

  const loadSample = () => {
    const doc = createResume({ mode: "fresher", name: "Sample — Ananya Sharma", templateId: "modern", data: sampleFresher() });
    navigate({ to: "/editor/$resumeId", params: { resumeId: doc.id } });
  };

  return (
    <PageShell>
      <section className="hero-gradient border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6">
          <div>
            <h1 className="text-3xl font-semibold">Welcome to ResumeForge AI</h1>
            <p className="mt-2 text-muted-foreground">Your resumes are saved privately on this device.</p>
          </div>
          <Button asChild size="lg"><Link to="/builder"><FilePlus2 className="size-4" /> Create New Resume</Link></Button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a) => (
            <Link key={a.to} to={a.to} className="surface-card group p-5 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary"><a.icon className="size-5" /></span>
              <h2 className="mt-4 text-sm font-semibold">{a.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Resumes</h2>
          {items && items.length > 0 && <span className="text-sm text-muted-foreground">{items.length} saved</span>}
        </div>

        {items === null ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-secondary" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface-muted px-6 py-14 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-semibold">No resumes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first resume, or open a sample to see how it works.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button asChild><Link to="/builder">Create My Resume</Link></Button>
              <Button variant="outline" onClick={loadSample}>Open a sample resume</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <article key={r.id} className="surface-card flex flex-col overflow-hidden">
                <Link to="/editor/$resumeId" params={{ resumeId: r.id }} className="block h-48 overflow-hidden border-b border-border bg-surface-muted p-3" aria-label={`Edit ${r.name}`}>
                  <div className="pointer-events-none"><ResumePreview data={r.data} mode={r.mode} templateId={r.templateId} fit /></div>
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold">{r.name}</h3>
                    <Badge variant="secondary" className="shrink-0 capitalize">{r.mode}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{getTemplate(r.templateId).name} · Edited {formatRelative(r.updatedAt)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className="flex-1"><Link to="/editor/$resumeId" params={{ resumeId: r.id }}><Pencil className="size-4" /> Edit</Link></Button>
                    <Button size="sm" variant="outline" aria-label="Duplicate" onClick={() => { duplicateResume(r.id); toast.success("Resume duplicated"); }}><Copy className="size-4" /></Button>
                    <Button size="sm" variant="outline" aria-label="Delete" onClick={() => setPendingDelete(r)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pendingDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the resume from this device. It can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (pendingDelete) { deleteResume(pendingDelete.id); toast.success("Resume deleted"); } setPendingDelete(null); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
