import { Bullets, contactItems, dateRange, Links, type TemplateProps } from "./shared";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mt-4 border-b border-resume-rule pb-1 text-[11pt] font-bold uppercase tracking-wide text-resume-ink">
      {children}
    </h2>
  );
}

export default function AtsSimple({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="px-[16mm] py-[14mm] text-[10pt] leading-[1.45] text-resume-ink">
      <header>
        <h1 className="text-[20pt] font-bold uppercase tracking-wide">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-0.5 text-[11pt]">{p.title}</p>}
        <p className="mt-1 text-resume-muted">{contactItems(data).join(" | ")}</p>
      </header>

      {data.summary && (
        <section className="resume-avoid-break">
          <Heading>Summary</Heading>
          <p className="mt-1">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <Heading>Professional Experience</Heading>
          {data.experience.map((x) => (
            <div key={x.id} className="resume-avoid-break mt-2">
              <p className="font-bold">
                {x.role}
                {x.company && ` — ${x.company}`}
              </p>
              <p className="text-resume-muted">
                {[dateRange(x.startDate, x.endDate, x.current), x.location].filter(Boolean).join(" | ")}
              </p>
              <Bullets text={x.responsibilities} />
              <Bullets text={x.achievements} />
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <Heading>Education</Heading>
          {data.education.map((e) => (
            <div key={e.id} className="resume-avoid-break mt-2">
              <p className="font-bold">
                {e.degree}
                {e.field && `, ${e.field}`}
              </p>
              <p>{e.institution}</p>
              <p className="text-resume-muted">
                {[dateRange(e.startDate, e.endDate), e.grade].filter(Boolean).join(" | ")}
              </p>
              {e.details && <p>{e.details}</p>}
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Skills</Heading>
          {data.skills.map((g) => (
            <p key={g.id} className="mt-1">
              <span className="font-bold">{g.category}:</span> {g.items.join(", ")}
            </p>
          ))}
        </section>
      )}

      {data.projects.length > 0 && (
        <section>
          <Heading>Projects</Heading>
          {data.projects.map((pr) => (
            <div key={pr.id} className="resume-avoid-break mt-2">
              <p className="font-bold">{pr.name}</p>
              {pr.technologies.length > 0 && <p className="text-resume-muted">{pr.technologies.join(", ")}</p>}
              <Bullets text={pr.description} />
              <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
            </div>
          ))}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Certifications</Heading>
          {data.certifications.map((c) => (
            <p key={c.id} className="mt-1">
              <span className="font-bold">{c.name}</span>
              {c.issuer && ` — ${c.issuer}`}
              {c.date && ` (${c.date})`}
              {c.credentialId && ` · ID: ${c.credentialId}`}
            </p>
          ))}
        </section>
      )}

      {data.achievements.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Achievements</Heading>
          {data.achievements.map((a) => (
            <p key={a.id} className="mt-1">
              <span className="font-bold">{a.title}</span>
              {a.date && ` (${a.date})`}
              {a.description && ` — ${a.description}`}
            </p>
          ))}
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="resume-avoid-break">
          <Heading>Languages</Heading>
          <p className="mt-1">{data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>
        </section>
      )}
    </div>
  );
}
