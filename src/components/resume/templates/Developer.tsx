import { Bullets, dateRange, Links, type TemplateProps } from "./shared";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mt-4 text-[9.5pt] font-bold uppercase tracking-[0.16em] text-resume-accent">
      {children}
      <span className="mt-1 block h-px w-full bg-resume-rule" />
    </h2>
  );
}

export default function Developer({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="px-[14mm] py-[14mm] text-[9.5pt] leading-[1.45] text-resume-ink">
      <header className="resume-avoid-break">
        <h1 className="text-[21pt] font-bold tracking-tight">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="text-[10.5pt] font-medium text-resume-accent">{p.title}</p>}
        <p className="mt-1.5 text-[8.5pt] text-resume-muted">
          {[p.email, p.phone, p.location].filter(Boolean).join("  |  ")}
        </p>
        <p className="text-[8.5pt] text-resume-muted">
          {[p.github, p.linkedin, p.portfolio].filter(Boolean).join("  |  ")}
        </p>
      </header>

      {data.summary && <p className="mt-3">{data.summary}</p>}

      <div className="mt-2 grid grid-cols-[1fr_58mm] gap-x-[8mm]">
        <div>
          {data.projects.length > 0 && (
            <section>
              <Heading>Projects</Heading>
              {data.projects.map((pr) => (
                <div key={pr.id} className="resume-avoid-break mt-2">
                  <p className="font-semibold">{pr.name}</p>
                  {pr.technologies.length > 0 && (
                    <p className="text-[8.5pt] text-resume-accent">{pr.technologies.join(" / ")}</p>
                  )}
                  <Bullets text={pr.description} />
                  <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
                </div>
              ))}
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <Heading>Experience</Heading>
              {data.experience.map((x) => (
                <div key={x.id} className="resume-avoid-break mt-2">
                  <p className="font-semibold">
                    {x.role}
                    {x.company && ` @ ${x.company}`}
                  </p>
                  <p className="text-[8.5pt] text-resume-muted">
                    {[dateRange(x.startDate, x.endDate, x.current), x.location].filter(Boolean).join(" · ")}
                  </p>
                  <Bullets text={x.responsibilities} />
                  <Bullets text={x.achievements} />
                </div>
              ))}
            </section>
          )}

          {data.achievements.length > 0 && (
            <section className="resume-avoid-break">
              <Heading>Achievements</Heading>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
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
        </div>

        <aside>
          {data.skills.length > 0 && (
            <section className="resume-avoid-break">
              <Heading>Tech Stack</Heading>
              <div className="mt-1 space-y-1.5">
                {data.skills.map((g) => (
                  <div key={g.id}>
                    <p className="font-semibold">{g.category}</p>
                    <p className="text-resume-muted">{g.items.join(", ")}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section className="resume-avoid-break">
              <Heading>Education</Heading>
              {data.education.map((e) => (
                <div key={e.id} className="mt-1.5">
                  <p className="font-semibold">{e.degree}</p>
                  <p>{e.institution}</p>
                  <p className="text-resume-muted">
                    {[dateRange(e.startDate, e.endDate), e.grade].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ))}
            </section>
          )}

          {data.certifications.length > 0 && (
            <section className="resume-avoid-break">
              <Heading>Certifications</Heading>
              {data.certifications.map((c) => (
                <div key={c.id} className="mt-1.5">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-resume-muted">{[c.issuer, c.date].filter(Boolean).join(" · ")}</p>
                </div>
              ))}
            </section>
          )}

          {data.languages.length > 0 && (
            <section className="resume-avoid-break">
              <Heading>Languages</Heading>
              <div className="mt-1 space-y-0.5">
                {data.languages.map((l) => (
                  <p key={l.id}>
                    {l.name} <span className="text-resume-muted">— {l.proficiency}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
