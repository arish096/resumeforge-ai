import { Bullets, dateRange, Links, Photo, type TemplateProps } from "./shared";

function H({ children, light }: { children: string; light?: boolean }) {
  return (
    <h2 className={`mt-5 text-[9.5pt] font-bold uppercase tracking-[0.18em] ${light ? "text-resume-band-ink" : "text-resume-band"}`}>
      {children}
    </h2>
  );
}

export default function CreativeSidebar({ data }: TemplateProps) {
  const p = data.personal;
  return (
    <div className="grid min-h-[297mm] grid-cols-[68mm_1fr] text-[9.5pt] leading-[1.5] text-resume-ink">
      <aside className="bg-resume-band px-[8mm] py-[12mm] text-resume-band-ink">
        <Photo data={data} className="mx-auto size-[38mm] rounded-full border-4 border-resume-band-ink/30 text-[22pt]" />
        <H light>Contact</H>
        <div className="mt-2 space-y-1 break-words text-[8.5pt] opacity-90">
          {[p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio].filter(Boolean).map((c) => <p key={c}>{c}</p>)}
        </div>
        {data.skills.length > 0 && (
          <>
            <H light>Skills</H>
            {data.skills.map((g) => (
              <div key={g.id} className="mt-2">
                <p className="text-[8.5pt] font-semibold">{g.category}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {g.items.map((i) => <span key={i} className="rounded bg-resume-band-ink/15 px-1.5 py-0.5 text-[8pt]">{i}</span>)}
                </div>
              </div>
            ))}
          </>
        )}
        {data.languages.length > 0 && (
          <>
            <H light>Languages</H>
            {data.languages.map((l) => <p key={l.id} className="mt-1 text-[8.5pt]">{l.name} — {l.proficiency}</p>)}
          </>
        )}
        {data.certifications.length > 0 && (
          <>
            <H light>Certifications</H>
            {data.certifications.map((c) => <p key={c.id} className="mt-1 text-[8.5pt]"><span className="font-semibold">{c.name}</span>{c.issuer && ` · ${c.issuer}`}</p>)}
          </>
        )}
      </aside>
      <main className="px-[10mm] py-[12mm]">
        <h1 className="text-[26pt] font-extrabold leading-none tracking-tight">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-2 text-[12pt] font-medium text-resume-pop">{p.title}</p>}
        {data.summary && <p className="mt-4">{data.summary}</p>}
        {data.experience.length > 0 && (
          <section>
            <H>Experience</H>
            {data.experience.map((x) => (
              <div key={x.id} className="resume-avoid-break mt-3">
                <div className="flex justify-between gap-3"><p className="font-bold">{x.role}</p><p className="shrink-0 text-[8.5pt] text-resume-muted">{dateRange(x.startDate, x.endDate, x.current)}</p></div>
                <p className="text-resume-pop">{[x.company, x.location].filter(Boolean).join(" · ")}</p>
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
                {pr.technologies.length > 0 && <p className="text-[8.5pt] text-resume-pop">{pr.technologies.join(" · ")}</p>}
                <Bullets text={pr.description} />
                <Links items={[{ label: "Live", value: pr.url }, { label: "Code", value: pr.github }]} />
              </div>
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section>
            <H>Education</H>
            {data.education.map((e) => (
              <div key={e.id} className="resume-avoid-break mt-3">
                <div className="flex justify-between gap-3"><p className="font-bold">{e.degree}{e.field && `, ${e.field}`}</p><p className="shrink-0 text-[8.5pt] text-resume-muted">{dateRange(e.startDate, e.endDate)}</p></div>
                <p>{e.institution}{e.grade && ` · ${e.grade}`}</p>
              </div>
            ))}
          </section>
        )}
        {data.achievements.length > 0 && (
          <section className="resume-avoid-break">
            <H>Achievements</H>
            <ul className="mt-2 list-disc space-y-1 pl-4">{data.achievements.map((a) => <li key={a.id}><span className="font-semibold">{a.title}</span>{a.description && ` — ${a.description}`}</li>)}</ul>
          </section>
        )}
      </main>
    </div>
  );
}
