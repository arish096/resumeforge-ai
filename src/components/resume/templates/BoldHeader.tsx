import { Bullets, contactItems, dateRange, Links, Photo, type TemplateProps } from "./shared";

function H({ children }: { children: string }) {
  return (
    <h2 className="mt-5 inline-block border-b-[3px] border-resume-pop pb-0.5 text-[11pt] font-extrabold uppercase tracking-wide text-resume-band">
      {children}
    </h2>
  );
}

export default function BoldHeader({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="text-[9.5pt] leading-[1.5] text-resume-ink">
      <header className="flex items-center gap-[8mm] bg-resume-band px-[14mm] py-[10mm] text-resume-band-ink">
        <Photo data={data} className="size-[32mm] shrink-0 rounded-2xl text-[20pt]" />
        <div>
          <h1 className="text-[28pt] font-black uppercase leading-none tracking-tight">{p.fullName || "Your Name"}</h1>
          {p.title && <p className="mt-2 text-[12pt] font-semibold text-resume-pop">{p.title}</p>}
          <p className="mt-2 text-[8.5pt] opacity-85">{contactItems(data).join("  •  ")}</p>
        </div>
      </header>
      <div className="grid grid-cols-[1fr_60mm] gap-[8mm] px-[14mm] pb-[12mm]">
        <div>
          {data.summary && (<section><H>About Me</H><p className="mt-2">{data.summary}</p></section>)}
          {data.experience.length > 0 && (
            <section>
              <H>Experience</H>
              {data.experience.map((x) => (
                <div key={x.id} className="resume-avoid-break mt-3">
                  <p className="font-bold">{x.role} <span className="font-normal text-resume-muted">@ {x.company}</span></p>
                  <p className="text-[8.5pt] text-resume-muted">{dateRange(x.startDate, x.endDate, x.current)}{x.location && ` · ${x.location}`}</p>
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
                  <p className="font-bold">{pr.name}</p>
                  <Bullets text={pr.description} />
                  <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
                </div>
              ))}
            </section>
          )}
        </div>
        <div>
          {data.skills.length > 0 && (
            <section>
              <H>Skills</H>
              {data.skills.map((g) => (
                <div key={g.id} className="mt-2"><p className="font-semibold">{g.category}</p><p className="text-resume-muted">{g.items.join(", ")}</p></div>
              ))}
            </section>
          )}
          {data.education.length > 0 && (
            <section>
              <H>Education</H>
              {data.education.map((e) => (
                <div key={e.id} className="resume-avoid-break mt-2">
                  <p className="font-semibold">{e.degree}{e.field && `, ${e.field}`}</p>
                  <p>{e.institution}</p>
                  <p className="text-[8.5pt] text-resume-muted">{dateRange(e.startDate, e.endDate)}{e.grade && ` · ${e.grade}`}</p>
                </div>
              ))}
            </section>
          )}
          {data.certifications.length > 0 && (
            <section><H>Certifications</H>{data.certifications.map((c) => <p key={c.id} className="mt-1"><span className="font-semibold">{c.name}</span>{c.issuer && ` — ${c.issuer}`}</p>)}</section>
          )}
          {data.achievements.length > 0 && (
            <section><H>Awards</H>{data.achievements.map((a) => <p key={a.id} className="mt-1"><span className="font-semibold">{a.title}</span>{a.date && ` (${a.date})`}</p>)}</section>
          )}
          {data.languages.length > 0 && (
            <section><H>Languages</H>{data.languages.map((l) => <p key={l.id} className="mt-1">{l.name} — {l.proficiency}</p>)}</section>
          )}
        </div>
      </div>
    </div>
  );
}
