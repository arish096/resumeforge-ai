import { Bullets, dateRange, Links, Photo, type TemplateProps } from "./shared";

function H({ children }: { children: string }) {
  return <h2 className="mt-5 rounded-md bg-resume-band px-3 py-1 text-[9.5pt] font-bold uppercase tracking-[0.14em] text-resume-band-ink">{children}</h2>;
}

export default function TwoTone({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="text-[9.5pt] leading-[1.5] text-resume-ink">
      <header className="relative bg-resume-tint px-[14mm] pb-[8mm] pt-[12mm]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[26pt] font-extrabold leading-none text-resume-band">{p.fullName || "Your Name"}</h1>
            {p.title && <p className="mt-2 text-[11.5pt] font-semibold text-resume-pop">{p.title}</p>}
          </div>
          <Photo data={data} className="size-[30mm] shrink-0 rounded-full border-[5px] border-resume-surface text-[18pt]" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-0.5 text-[8.5pt] text-resume-muted">
          {[p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio].filter(Boolean).map((c) => <span key={c} className="truncate">{c}</span>)}
        </div>
      </header>
      <div className="px-[14mm] pb-[12mm]">
        {data.summary && (<section><H>Summary</H><p className="mt-2">{data.summary}</p></section>)}
        {data.skills.length > 0 && (
          <section className="resume-avoid-break">
            <H>Skills</H>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {data.skills.map((g) => <p key={g.id}><span className="font-semibold text-resume-band">{g.category}:</span> {g.items.join(", ")}</p>)}
            </div>
          </section>
        )}
        {data.experience.length > 0 && (
          <section>
            <H>Work Experience</H>
            {data.experience.map((x) => (
              <div key={x.id} className="resume-avoid-break mt-3 border-l-2 border-resume-pop pl-3">
                <div className="flex justify-between gap-3"><p className="font-bold">{x.role} · {x.company}</p><p className="shrink-0 text-[8.5pt] text-resume-muted">{dateRange(x.startDate, x.endDate, x.current)}</p></div>
                <Bullets text={x.responsibilities} /><Bullets text={x.achievements} />
              </div>
            ))}
          </section>
        )}
        {data.projects.length > 0 && (
          <section>
            <H>Projects</H>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {data.projects.map((pr) => (
                <div key={pr.id} className="resume-avoid-break rounded-md border border-resume-rule p-2.5">
                  <p className="font-bold">{pr.name}</p>
                  {pr.technologies.length > 0 && <p className="text-[8pt] text-resume-pop">{pr.technologies.join(" · ")}</p>}
                  <Bullets text={pr.description} />
                  <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
                </div>
              ))}
            </div>
          </section>
        )}
        {data.education.length > 0 && (
          <section>
            <H>Education</H>
            {data.education.map((e) => (
              <div key={e.id} className="resume-avoid-break mt-2 flex justify-between gap-3">
                <p><span className="font-bold">{e.degree}{e.field && `, ${e.field}`}</span> — {e.institution}{e.grade && ` · ${e.grade}`}</p>
                <p className="shrink-0 text-[8.5pt] text-resume-muted">{dateRange(e.startDate, e.endDate)}</p>
              </div>
            ))}
          </section>
        )}
        {(data.certifications.length > 0 || data.achievements.length > 0 || data.languages.length > 0) && (
          <section className="resume-avoid-break">
            <H>More</H>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {data.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}</li>)}
              {data.achievements.map((a) => <li key={a.id}>{a.title}{a.description && ` — ${a.description}`}</li>)}
              {data.languages.length > 0 && <li>Languages: {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</li>}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
