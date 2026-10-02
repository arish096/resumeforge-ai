import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { CtaBand, FeatureGrid, Hero, Highlights, HowItWorks, TemplatesPreview } from "@/components/landing/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeForge AI — Build a Resume That Gets Noticed" },
      {
        name: "description",
        content: "Create professional, ATS-friendly resumes with AI, choose modern templates and tailor for every job.",
      },
      { property: "og:title", content: "ResumeForge AI — Build a Resume That Gets Noticed" },
      {
        property: "og:description",
        content: "AI-assisted resume builder for freshers and professionals with live preview and PDF export.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <Hero />
      <Highlights />
      <HowItWorks />
      <FeatureGrid />
      <TemplatesPreview />
      <CtaBand />
    </PageShell>
  );
}
