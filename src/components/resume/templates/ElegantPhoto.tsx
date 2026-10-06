import { Bullets, contactItems, dateRange, Links, Photo, type TemplateProps } from "./shared";

function H({ children }: { children: string }) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-resume-rule" />
      <h2 className="font-serif text-[11pt] uppercase tracking-[0.3em] text-resume-band">{children}</h2>
      <span className="h-px flex-1 bg-resume-rule" />
    </div>
  );
}

export default function ElegantPhoto({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="px-[16mm] py-[14mm] text-[9.5pt] leading-[1.55] text-resume-ink">
      <header className="resume-avoid-break flex flex-col items-center text-center">
        <Photo data={data} className="size-[30mm] rounded-full ring-2 ring-resume-pop ring-offset-4 text-[18pt]" />
        <h1 className="mt-4 font-serif text-[26pt] tracking-wide">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-1 text-[10pt] uppercase tracking-[0.25em] text-resume-pop">{p.title}</p>}
        <p className="mt-2 text-[8.5pt] text-resume-muted">{contactItems(data).join("   ◦   ")}</p>
      </header>
      {data.summary && (<section><H>Profile</H><p className="mt-2 text-center italic">{data.summary}</p></section>)}
      {data.experience.length > 0 && (
        <section>
          <H>Experience</H>
          {data.experience.map((x) => (
            <div key={x.id} className="resume-avoid-break mt-3">
              <div className="flex justify-between gap-3"><p className="font-serif text-[11pt] font-semibold">{x.role}, <span className="font-normal italic">{x.company}</span></p><p className="shrink-0 text-[8.5pt] text-resume-muted">{dateRange(x.startDate, x.endDate, x.current)}</p></div>
              <Bullets text={x.responsibilities} /><Bullets text={x.achievements} />
            </div>
          ))}
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <H>Projects</H>
          {data.projects.map((pr) => (
            <div key={pr.id} className="resume-avoid-break mt-3">
              <p className="font-serif text-[11pt] font-semibold">{pr.name}{pr.technologies.length > 0 && <span className="font-sans text-[8.5pt] font-normal text-resume-muted"> — {pr.technologies.join(", ")}</span>}</p>
              <Bullets text={pr.description} />
              <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
            </div>
          ))}
        </section>
      )}
      <div className="grid grid-cols-2 gap-x-[10mm]">
        {data.education.length > 0 && (
          <section>
            <H>Education</H>
            {data.education.map((e) => (
              <div key={e.id} className="resume-avoid-break mt-2">
                <p className="font-semibold">{e.degree}{e.field && `, ${e.field}`}</p>
                <p className="italic">{e.institution}</p>
                <p className="text-[8.5pt] text-resume-muted">{dateRange(e.startDate, e.endDate)}{e.grade && ` · ${e.grade}`}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <H>Skills</H>
            {data.skills.map((g) => <p key={g.id} className="mt-1"><span className="font-semibold">{g.category}:</span> {g.items.join(", ")}</p>)}
            {data.languages.length > 0 && <p className="mt-1"><span className="font-semibold">Languages:</span> {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</p>}
          </section>
        )}
      </div>
      {(data.certifications.length > 0 || data.achievements.length > 0) && (
        <section className="resume-avoid-break">
          <H>Honours</H>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {data.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}{c.date && ` (${c.date})`}</li>)}
            {data.achievements.map((a) => <li key={a.id}>{a.title}{a.description && ` — ${a.description}`}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
