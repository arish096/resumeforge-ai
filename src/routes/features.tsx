import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { CtaBand, FeatureGrid, Highlights } from "@/components/landing/sections";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — ResumeForge AI" },
      { name: "description", content: "AI writing help, fresher and experienced modes, ATS templates, live preview and more." },
      { property: "og:title", content: "Features — ResumeForge AI" },
      { property: "og:description", content: "Everything you need to go from blank page to applied." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell>
      <FeatureGrid />
      <Highlights />
      <CtaBand />
    </PageShell>
  ),
});
