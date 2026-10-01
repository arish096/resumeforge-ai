import { Bullets, contactItems, dateRange, Links, type TemplateProps } from "./shared";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mt-5 text-center text-[11pt] font-bold uppercase tracking-[0.18em]">
      <span className="block border-y border-resume-rule py-1">{children}</span>
    </h2>
  );
}

export default function Classic({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div
      className="px-[18mm] py-[16mm] text-[10.5pt] leading-[1.5] text-resume-ink"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <header className="text-center">
        <h1 className="text-[22pt] font-bold tracking-wide">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-1 italic">{p.title}</p>}
        <p className="mt-1.5 text-[9.5pt]">{contactItems(data).join("  •  ")}</p>
      </header>

      {data.summary && (
        <section className="resume-avoid-break">
          <Heading>Objective</Heading>
          <p className="mt-2 text-justify">{data.summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <Heading>Education</Heading>
          {data.education.map((e) => (
            <div key={e.id} className="resume-avoid-break mt-2">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-bold">{e.institution}</p>
                <p className="shrink-0 text-[9.5pt]">{dateRange(e.startDate, e.endDate)}</p>
              </div>
              <p className="italic">
                {e.degree}
                {e.field && `, ${e.field}`}
                {e.grade && ` — ${e.grade}`}
              </p>
              {e.details && <p>{e.details}</p>}
            </div>
          ))}
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <Heading>Experience</Heading>
          {data.experience.map((x) => (
            <div key={x.id} className="resume-avoid-break mt-2">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-bold">{x.company || x.role}</p>
                <p className="shrink-0 text-[9.5pt]">{dateRange(x.startDate, x.endDate, x.current)}</p>
              </div>
              <p className="italic">{[x.role, x.location].filter(Boolean).join(", ")}</p>
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
            <div key={pr.id} className="resume-avoid-break mt-2">
              <p className="font-bold">{pr.name}</p>
              {pr.technologies.length > 0 && <p className="italic">{pr.technologies.join(", ")}</p>}
              <Bullets text={pr.description} />
              <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
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

      {(data.certifications.length > 0 || data.achievements.length > 0) && (
        <section className="resume-avoid-break">
          <Heading>Honours & Certifications</Heading>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {data.certifications.map((c) => (
              <li key={c.id}>
                {c.name}
                {c.issuer && `, ${c.issuer}`}
                {c.date && ` (${c.date})`}
              </li>
            ))}
            {data.achievements.map((a) => (
              <li key={a.id}>
                {a.title}
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
          <p className="mt-1 text-center">
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join("  •  ")}
          </p>
        </section>
      )}
    </div>
  );
}
