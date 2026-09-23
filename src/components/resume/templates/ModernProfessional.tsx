import { Bullets, contactItems, dateRange, Links, type TemplateProps } from "./shared";

function Heading({ children }: { children: string }) {
  return (
    <div className="mt-5 flex items-center gap-2">
      <h2 className="text-[10.5pt] font-semibold uppercase tracking-[0.14em] text-resume-accent">{children}</h2>
      <span className="h-px flex-1 bg-resume-rule" />
    </div>
  );
}

export default function ModernProfessional({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="text-[10pt] leading-[1.5] text-resume-ink">
      <header className="border-b-[3px] border-resume-accent px-[16mm] pb-4 pt-[14mm]">
        <h1 className="text-[24pt] font-bold leading-tight">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-1 text-[11.5pt] font-medium text-resume-accent">{p.title}</p>}
        <p className="mt-2 text-[9pt] text-resume-muted">{contactItems(data).join("  ·  ")}</p>
      </header>

      <div className="px-[16mm] pb-[14mm]">
        {data.summary && (
          <section className="resume-avoid-break">
            <Heading>Profile</Heading>
            <p className="mt-2">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <Heading>Experience</Heading>
            {data.experience.map((x) => (
              <div key={x.id} className="resume-avoid-break mt-3">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11pt] font-semibold">{x.role}</p>
                  <p className="shrink-0 text-[9pt] text-resume-muted">
                    {dateRange(x.startDate, x.endDate, x.current)}
                  </p>
                </div>
                <p className="text-resume-accent">{[x.company, x.location].filter(Boolean).join(" · ")}</p>
                <Bullets text={x.responsibilities} />
                <Bullets text={x.achievements} />
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <Heading>Projects</Heading>
            {data.projects.map((pr) => (
              <div key={pr.id} className="resume-avoid-break mt-3">
                <p className="text-[11pt] font-semibold">{pr.name}</p>
                {pr.technologies.length > 0 && (
                  <p className="text-[9pt] text-resume-accent">{pr.technologies.join(" · ")}</p>
                )}
                <Bullets text={pr.description} />
                <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <Heading>Education</Heading>
            {data.education.map((e) => (
              <div key={e.id} className="resume-avoid-break mt-3">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-semibold">
                    {e.degree}
                    {e.field && `, ${e.field}`}
                  </p>
                  <p className="shrink-0 text-[9pt] text-resume-muted">{dateRange(e.startDate, e.endDate)}</p>
                </div>
                <p className="text-resume-accent">{e.institution}</p>
                {e.grade && <p className="text-[9pt] text-resume-muted">{e.grade}</p>}
                {e.details && <p>{e.details}</p>}
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="resume-avoid-break">
            <Heading>Skills</Heading>
            <div className="mt-2 space-y-1">
              {data.skills.map((g) => (
                <p key={g.id}>
                  <span className="font-semibold">{g.category}</span>
                  <span className="text-resume-muted"> — {g.items.join(", ")}</span>
                </p>
              ))}
            </div>
          </section>
        )}

        {(data.certifications.length > 0 || data.achievements.length > 0) && (
          <section className="resume-avoid-break">
            <Heading>Certifications & Achievements</Heading>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {data.certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold">{c.name}</span>
                  {c.issuer && ` — ${c.issuer}`}
                  {c.date && ` (${c.date})`}
                  {c.credentialId && ` · ID ${c.credentialId}`}
                </li>
              ))}
              {data.achievements.map((a) => (
                <li key={a.id}>
                  <span className="font-semibold">{a.title}</span>
                  {a.date && ` (${a.date})`}
                  {a.description && ` — ${a.description}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className="resume-avoid-break">
            <Heading>Languages</Heading>
            <p className="mt-2">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join("  ·  ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
