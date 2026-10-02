import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Check, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { createResume } from "@/lib/resume/storage";
import type { ResumeMode, TemplateId } from "@/lib/resume/types";
import { TEMPLATES } from "@/components/resume/templates/registry";

const TEMPLATE_IDS = TEMPLATES.map((t) => t.id);

export const Route = createFileRoute("/builder")({
  validateSearch: (search: Record<string, unknown>): { template?: TemplateId } => {
    const t = search.template;
    return typeof t === "string" && (TEMPLATE_IDS as string[]).includes(t) ? { template: t as TemplateId } : {};
  },
  head: () => ({
    meta: [
      { title: "Create a Resume — ResumeForge AI" },
      { name: "description", content: "Choose fresher or experienced mode and start building your resume." },
      { property: "og:title", content: "Create a Resume — ResumeForge AI" },
      { property: "og:description", content: "Guided resume builder for students and professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ModeSelect,
});

const MODES: { mode: ResumeMode; icon: typeof GraduationCap; title: string; for: string[]; lead: string }[] = [
  {
    mode: "fresher",
    icon: GraduationCap,
    title: "Fresher / Student",
    lead: "Lead with education, projects and potential.",
    for: ["Students", "Fresh graduates", "Internship seekers", "People without professional experience"],
  },
  {
    mode: "experienced",
    icon: Briefcase,
    title: "Experienced Professional",
    lead: "Lead with roles, impact and expertise.",
    for: ["Working professionals", "Experienced candidates", "Career switchers"],
  },
];

function ModeSelect() {
  const navigate = useNavigate();
  const { template } = Route.useSearch();

  const start = (mode: ResumeMode) => {
    const doc = createResume({ mode, templateId: template ?? (mode === "fresher" ? "developer" : "modern") });
    navigate({ to: "/editor/$resumeId", params: { resumeId: doc.id } });
  };

  return (
    <PageShell footer={false}>
      <div className="hero-gradient min-h-[calc(100vh-4rem)]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand">New resume</p>
          <h1 className="mt-3 text-center text-3xl font-semibold sm:text-4xl">How would you like to build your resume?</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            This tailors the questions and suggestions. You can include any section either way.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {MODES.map((m) => (
              <button
                key={m.mode}
                type="button"
                onClick={() => start(m.mode)}
                className="surface-card group flex flex-col p-7 text-left outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <m.icon className="size-6" />
                </span>
                <h2 className="mt-5 text-xl font-semibold">{m.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{m.lead}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {m.for.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  Start building <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="link" onClick={() => navigate({ to: "/import" })}>
              Already have a resume? Import it instead
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
