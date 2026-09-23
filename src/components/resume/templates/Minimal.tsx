import { Bullets, contactItems, dateRange, Links, type TemplateProps } from "./shared";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mt-6 text-[9pt] font-semibold uppercase tracking-[0.22em] text-resume-muted">{children}</h2>
  );
}

export default function Minimal({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="px-[20mm] py-[20mm] text-[10pt] leading-[1.6] text-resume-ink">
      <header>
        <h1 className="text-[21pt] font-light tracking-tight">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-1 text-[10.5pt] text-resume-muted">{p.title}</p>}
        <p className="mt-3 text-[9pt] text-resume-muted">{contactItems(data).join("   ")}</p>
      </header>

      {data.summary && (
        <section className="resume-avoid-break">
          <Heading>Summary</Heading>
          <p className="mt-2">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <Heading>Experience</Heading>
          {data.experience.map((x) => (
            <div key={x.id} className="resume-avoid-break mt-3">
              <p className="font-medium">
                {x.role}
                {x.company && <span className="text-resume-muted"> · {x.company}</span>}
              </p>
              <p className="text-[9pt] text-resume-muted">
                {[dateRange(x.startDate, x.endDate, x.current), x.location].filter(Boolean).join(" · ")}
              </p>
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
              <p className="font-medium">{pr.name}</p>
              {pr.technologies.length > 0 && (
                <p className="text-[9pt] text-resume-muted">{pr.technologies.join(" · ")}</p>
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
              <p className="font-medium">
                {e.degree}
                {e.field && `, ${e.field}`}
              </p>
              <p className="text-resume-muted">
                {[e.institution, dateRange(e.startDate, e.endDate), e.grade].filter(Boolean).join(" · ")}
              </p>
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
                <span className="text-resume-muted">{g.category}</span> — {g.items.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Certifications</Heading>
          <div className="mt-2 space-y-1">
            {data.certifications.map((c) => (
              <p key={c.id}>
                {c.name}
                {c.issuer && <span className="text-resume-muted"> · {c.issuer}</span>}
                {c.date && <span className="text-resume-muted"> · {c.date}</span>}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.achievements.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Achievements</Heading>
          <div className="mt-2 space-y-1">
            {data.achievements.map((a) => (
              <p key={a.id}>
                {a.title}
                {a.date && <span className="text-resume-muted"> · {a.date}</span>}
                {a.description && <span className="text-resume-muted"> — {a.description}</span>}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Languages</Heading>
          <p className="mt-2">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join("   ")}</p>
        </section>
      )}
    </div>
  );
}
