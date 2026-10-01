import { Link } from "@tanstack/react-router";
import { Brand } from "./SiteHeader";

const COLUMNS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { to: "/builder", label: "Resume Builder" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/import", label: "Import Resume" },
      { to: "/tailor", label: "Tailor for a Job" },
    ],
  },
  {
    title: "Explore",
    links: [
      { to: "/features", label: "Features" },
      { to: "/templates", label: "Templates" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/ats-analyzer", label: "ATS Analyzer" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Build. Tailor. Get Hired. Professional, ATS-friendly resumes with AI assistance that never invents
            facts about you.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} ResumeForge AI. Compatibility analysis is an estimate and does not guarantee
        any applicant tracking system outcome.
      </div>
    </footer>
  );
}
