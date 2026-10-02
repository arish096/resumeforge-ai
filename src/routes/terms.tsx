import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — ResumeForge AI" },
      { name: "description", content: "Terms for using the ResumeForge AI resume builder." },
      { property: "og:title", content: "Terms — ResumeForge AI" },
      { property: "og:description", content: "The basics of using ResumeForge AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Terms" intro="The basics of using ResumeForge AI.">
      <h2>Your content</h2>
      <p>You own everything you write. You are responsible for making sure your resume is accurate and truthful.</p>
      <h2>AI assistance</h2>
      <p>Writing suggestions only rephrase what you provide. Always review them before using them.</p>
      <h2>Compatibility estimates</h2>
      <p>Analyzer results are estimates. No tool can guarantee how a specific applicant tracking system will behave.</p>
    </LegalPage>
  ),
});
