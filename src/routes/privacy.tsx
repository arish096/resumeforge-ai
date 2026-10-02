import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — ResumeForge AI" },
      { name: "description", content: "How ResumeForge AI handles your resume information." },
      { property: "og:title", content: "Privacy — ResumeForge AI" },
      { property: "og:description", content: "Your resume drafts stay on your device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Privacy" intro="Plain-language summary of how your information is handled.">
      <h2>Where your data lives</h2>
      <p>Resumes you create are stored in your browser on this device. They are not uploaded to our servers.</p>
      <h2>Clearing your data</h2>
      <p>Delete resumes from the dashboard, or clear your browser storage to remove everything.</p>
      <h2>Future accounts</h2>
      <p>If cloud accounts are added later, this policy will be updated before any data leaves your device.</p>
    </LegalPage>
  ),
});
