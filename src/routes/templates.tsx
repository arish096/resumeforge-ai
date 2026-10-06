import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TEMPLATES } from "@/components/resume/templates/registry";
import { sampleExperienced, sampleFresher } from "@/lib/resume/sample";
import type { TemplateId } from "@/lib/resume/types";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Resume Templates — ResumeForge AI" },
      { name: "description", content: "ATS-friendly and Canva-style photo resume templates." },
      { property: "og:title", content: "Resume Templates — ResumeForge AI" },
      { property: "og:description", content: "Ten professional and designer layouts that all share one resume record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const navigate = useNavigate();
  const exp = sampleExperienced();
  const fresh = sampleFresher();
  const use = (id: TemplateId) => navigate({ to: "/builder", search: { template: id } });

  return (
    <PageShell>
      <PageIntro
        eyebrow="Templates"
        title="Choose a layout — switch any time"
        text="Every template reads from the same resume information, so you never retype anything when you change your mind."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {TEMPLATES.map((t, i) => (
          <article key={t.id} className="surface-card flex flex-col overflow-hidden">
            <div className="border-b border-border bg-surface-muted p-4">
              <div className="pointer-events-none max-h-80 overflow-hidden">
                <ResumePreview
                  data={i % 2 ? fresh : exp}
                  mode={i % 2 ? "fresher" : "experienced"}
                  templateId={t.id}
                  fit
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{t.name}</h2>
                <Badge variant="secondary">{t.photo ? "Designer · Photo" : "ATS-friendly"}</Badge>
              </div>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.tagline}</p>
              <Button className="mt-4" onClick={() => use(t.id)}>
                Use this template
              </Button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
