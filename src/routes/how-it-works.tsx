import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { CtaBand, HowItWorks } from "@/components/landing/sections";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — ResumeForge AI" },
      { name: "description", content: "Enter your information, improve it with AI, pick a template and download a PDF." },
      { property: "og:title", content: "How It Works — ResumeForge AI" },
      { property: "og:description", content: "Four simple steps to a professional resume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PageShell>
      <HowItWorks />
      <CtaBand />
    </PageShell>
  ),
});
