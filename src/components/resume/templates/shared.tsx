import type { ResumeData, ResumeDocument } from "@/lib/resume/types";
import { toBullets } from "@/lib/resume/types";

export interface TemplateProps {
  data: ResumeData;
  mode: ResumeDocument["mode"];
}

export const contactItems = (data: ResumeData) =>
  [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
    data.personal.github,
    data.personal.portfolio,
  ].filter(Boolean);

export const dateRange = (start: string, end: string, current?: boolean) => {
  const right = current ? "Present" : end;
  return [start, right].filter(Boolean).join(" – ");
};

export const hasContent = (data: ResumeData) =>
  Boolean(
    data.personal.fullName ||
      data.summary ||
      data.education.length ||
      data.skills.length ||
      data.projects.length ||
      data.experience.length,
  );

export function Bullets({ text, className = "" }: { text: string; className?: string }) {
  const bullets = toBullets(text);
  if (!bullets.length) return null;
  return (
    <ul className={`mt-1 list-disc space-y-0.5 pl-4 ${className}`}>
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export function Links({ items }: { items: { label: string; value: string }[] }) {
  const shown = items.filter((i) => i.value);
  if (!shown.length) return null;
  return (
    <p className="mt-0.5 text-resume-muted">
      {shown.map((i, idx) => (
        <span key={i.label}>
          {idx > 0 && " · "}
          {i.label}: {i.value}
        </span>
      ))}
    </p>
  );
}

export function Photo({ data, className = "" }: { data: ResumeData; className?: string }) {
  const p = data.personal;
  const initials = (p.fullName || "Your Name").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return p.photo ? (
    <img src={p.photo} alt={p.fullName || "Profile photo"} className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-resume-tint font-bold text-resume-band ${className}`}>{initials}</div>
  );
}
