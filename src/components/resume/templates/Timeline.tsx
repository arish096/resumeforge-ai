import { Bullets, contactItems, dateRange, Links, Photo, type TemplateProps } from "./shared";

function H({ children }: { children: string }) {
  return <h2 className="mt-5 text-[12pt] font-extrabold text-resume-band">{children}</h2>;
}

function Item({ date, children }: { date: string; children: React.ReactNode }) {
  return (
    <div className="resume-avoid-break relative grid grid-cols-[26mm_1fr] gap-4 pb-3">
      <p className="pt-0.5 text-right text-[8.5pt] font-semibold text-resume-pop">{date}</p>
      <div className="relative border-l-2 border-resume-rule pl-4">
        <span className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-resume-pop" />
        {children}
      </div>
    </div>
  );
}

export default function Timeline({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="px-[14mm] py-[12mm] text-[9.5pt] leading-[1.5] text-resume-ink">
      <header className="resume-avoid-break flex items-center gap-[7mm] border-b-2 border-resume-band pb-5">
        <Photo data={data} className="size-[28mm] shrink-0 rounded-xl text-[18pt]" />
        <div>
          <h1 className="text-[24pt] font-black leading-none text-resume-band">{p.fullName || "Your Name"}</h1>
          {p.title && <p className="mt-1.5 text-[11pt] font-semibold">{p.title}</p>}
          <p className="mt-1.5 text-[8.5pt] text-resume-muted">{contactItems(data).join("  /  ")}</p>
        </div>
      </header>
      {data.summary && <p className="mt-4 rounded-lg bg-resume-tint p-3">{data.summary}</p>}
      {data.experience.length > 0 && (
        <section>
          <H>Experience</H>
          <div className="mt-2">
            {data.experience.map((x) => (
              <Item key={x.id} date={dateRange(x.startDate, x.endDate, x.current)}>
                <p className="font-bold">{x.role}</p>
                <p className="text-resume-muted">{[x.company, x.location].filter(Boolean).join(" · ")}</p>
                <Bullets text={x.responsibilities} /><Bullets text={x.achievements} />
              </Item>
            ))}
          </div>
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <H>Education</H>
          <div className="mt-2">
            {data.education.map((e) => (
              <Item key={e.id} date={dateRange(e.startDate, e.endDate)}>
                <p className="font-bold">{e.degree}{e.field && `, ${e.field}`}</p>
                <p className="text-resume-muted">{e.institution}{e.grade && ` · ${e.grade}`}</p>
                {e.details && <p>{e.details}</p>}
              </Item>
            ))}
          </div>
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <H>Projects</H>
          {data.projects.map((pr) => (
            <div key={pr.id} className="resume-avoid-break mt-2">
              <p className="font-bold">{pr.name}{pr.technologies.length > 0 && <span className="font-normal text-resume-pop"> · {pr.technologies.join(", ")}</span>}</p>
              <Bullets text={pr.description} />
              <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
            </div>
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section className="resume-avoid-break">
          <H>Skills</H>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.skills.flatMap((g) => g.items).map((i) => <span key={i} className="rounded-full border border-resume-band px-2 py-0.5 text-[8.5pt]">{i}</span>)}
          </div>
        </section>
      )}
      {(data.certifications.length > 0 || data.achievements.length > 0 || data.languages.length > 0) && (
        <section className="resume-avoid-break">
          <H>Highlights</H>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {data.certifications.map((c) => <li key={c.id}>{c.name}{c.issuer && ` — ${c.issuer}`}</li>)}
            {data.achievements.map((a) => <li key={a.id}>{a.title}{a.description && ` — ${a.description}`}</li>)}
            {data.languages.length > 0 && <li>Languages: {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</li>}
          </ul>
        </section>
      )}
    </div>
  );
}
