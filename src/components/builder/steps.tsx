import { useState } from "react";
import { Award, Briefcase, FolderGit2, GraduationCap, Languages, Loader2, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AddButton, AiImprove, EmptyState, EntryCard, Field, StepHeader } from "./fields";
import { getAIService } from "@/lib/resume/ai";
import {
  PROFICIENCY_LEVELS,
  SKILL_CATEGORIES,
  uid,
  type ResumeData,
  type ResumeDocument,
} from "@/lib/resume/types";

export interface StepProps {
  doc: ResumeDocument;
  update: (fn: (d: ResumeData) => ResumeData) => void;
}

const ai = getAIService();
const isFresher = (doc: ResumeDocument) => doc.mode === "fresher";

/** Generic helper to patch one item of an array section. */
function patchList<K extends keyof ResumeData>(
  update: StepProps["update"],
  key: K,
  id: string,
  patch: Record<string, unknown>,
) {
  update((d) => ({
    ...d,
    [key]: (d[key] as unknown as { id: string }[]).map((item) => (item.id === id ? { ...item, ...patch } : item)),
  }));
}
function removeFromList<K extends keyof ResumeData>(update: StepProps["update"], key: K, id: string) {
  update((d) => ({ ...d, [key]: (d[key] as unknown as { id: string }[]).filter((i) => i.id !== id) }));
}

const isEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUrlish = (v: string) => !v || /^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v.replace(/^https?:\/\//, ""));

/* ---------------- Personal ---------------- */
export function PersonalStep({ doc, update }: StepProps) {
  const p = doc.data.personal;
  const set = (k: keyof typeof p) => (v: string) => update((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));
  return (
    <>
      <StepHeader title="Personal information" text="Only your name is really needed — fill in whatever you'd like recruiters to see." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label="Full name" value={p.fullName} onChange={set("fullName")} placeholder="Ananya Sharma" />
        <Field
          id="title"
          label="Professional title"
          value={p.title}
          onChange={set("title")}
          placeholder={isFresher(doc) ? "Computer Science Student" : "Senior Product Engineer"}
        />
        <Field id="email" label="Email" type="email" value={p.email} onChange={set("email")} placeholder="you@email.com" error={isEmail(p.email) ? undefined : "That email doesn't look quite right."} />
        <Field id="phone" label="Phone" value={p.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
        <Field id="location" label="Location" value={p.location} onChange={set("location")} placeholder="City, Country" />
        <Field id="linkedin" label="LinkedIn URL" value={p.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/you" error={isUrlish(p.linkedin) ? undefined : "Enter a link like linkedin.com/in/you"} />
        <Field id="github" label="GitHub URL" value={p.github} onChange={set("github")} placeholder="github.com/you" error={isUrlish(p.github) ? undefined : "Enter a link like github.com/you"} />
        <Field id="portfolio" label="Portfolio URL" value={p.portfolio} onChange={set("portfolio")} placeholder="yourname.dev" error={isUrlish(p.portfolio) ? undefined : "Enter a valid website address"} />
      </div>
      <PhotoPicker value={p.photo} onChange={(v) => update((d) => ({ ...d, personal: { ...d.personal, photo: v } }))} />
    </>
  );
}

/** Resizes an image to a small square JPEG data URL. */
async function toThumb(file: File, size = 320): Promise<string> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const s = Math.min(img.width, img.height);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
  URL.revokeObjectURL(img.src);
  return c.toDataURL("image/jpeg", 0.85);
}

function PhotoPicker({ value, onChange }: { value?: string | undefined; onChange: (v: string | undefined) => void }) {
  return (
    <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-surface-muted p-4">
      {value ? <img src={value} alt="Profile" className="size-16 rounded-full object-cover" /> : <div className="size-16 rounded-full bg-secondary" />}
      <div className="flex-1">
        <p className="text-sm font-medium">Profile photo (optional)</p>
        <p className="text-xs text-muted-foreground">Shown on the designer templates. ATS templates leave it out.</p>
      </div>
      <Label className="cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
        {value ? "Change" : "Upload"}
        <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try { onChange(await toThumb(f)); } catch { toast.error("Couldn't read that image."); }
        }} />
      </Label>
      {value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>Remove</Button>}
    </div>
  );
}

/* ---------------- Summary ---------------- */
export function SummaryStep({ doc, update }: StepProps) {
  const fresher = isFresher(doc);
  const prompts = fresher
    ? [
        { key: "interests", label: "Career interests", ph: "Frontend development, UX" },
        { key: "background", label: "Education / background", ph: "Final-year B.E. Computer Engineering student" },
        { key: "skills", label: "Main skills", ph: "React, JavaScript, teamwork" },
        { key: "goals", label: "Career goals", ph: "Join a product team as a junior developer" },
      ]
    : [
        { key: "role", label: "Current / previous role", ph: "Senior Product Engineer" },
        { key: "years", label: "Years of experience", ph: "7" },
        { key: "expertise", label: "Main expertise", ph: "Web platforms, performance, team leadership" },
        { key: "focus", label: "Career focus", ph: "Leading product engineering teams" },
      ];
  const [notes, setNotes] = useState<Record<string, string>>({});

  const draft = () => {
    const n = (k: string) => notes[k]?.trim();
    const parts = fresher
      ? [
          n("background") && `${n("background")}.`,
          n("interests") && `Interested in ${n("interests")}.`,
          n("skills") && `Skilled in ${n("skills")}.`,
          n("goals") && `Looking to ${n("goals")!.replace(/^to\s+/i, "")}.`,
        ]
      : [
          n("role") && `${n("role")}${n("years") ? ` with ${n("years")} years of experience` : ""}.`,
          n("expertise") && `Expertise in ${n("expertise")}.`,
          n("focus") && `Currently focused on ${n("focus")}.`,
        ];
    const text = parts.filter(Boolean).join(" ");
    if (!text) {
      toast.error("Answer at least one prompt to draft a summary.");
      return;
    }
    update((d) => ({ ...d, summary: text }));
    toast.success("Draft created from your answers");
  };

  return (
    <>
      <StepHeader
        title="Professional summary"
        text={fresher ? "Two or three sentences about where you are and where you're heading." : "A short snapshot of your experience and what you're great at."}
      />
      <div className="rounded-xl border border-border bg-surface-muted p-4">
        <p className="text-sm font-medium">Not sure what to write? Answer these quick prompts.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {prompts.map((pr) => (
            <Field key={pr.key} id={`prompt-${pr.key}`} label={pr.label} value={notes[pr.key] ?? ""} onChange={(v) => setNotes({ ...notes, [pr.key]: v })} placeholder={pr.ph} />
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={draft}>
          Draft summary from my answers
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        <Field id="summary" label="Summary" multiline rows={5} value={doc.data.summary} onChange={(v) => update((d) => ({ ...d, summary: v }))} placeholder="Write a few sentences in your own words…" hint={`${doc.data.summary.length} characters · aim for 250–450`} />
        <AiImprove
          disabled={!doc.data.summary.trim()}
          run={() => ai.improveSummary({ text: doc.data.summary, mode: doc.mode, title: doc.data.personal.title })}
          onAccept={(t) => update((d) => ({ ...d, summary: t }))}
        />
      </div>
    </>
  );
}

/* ---------------- Education ---------------- */
export function EducationStep({ doc, update }: StepProps) {
  const add = (school = false) =>
    update((d) => ({
      ...d,
      education: [
        ...d.education,
        { id: uid(), institution: "", degree: school ? "Class 12" : "", field: "", startDate: "", endDate: "", grade: "", details: "" },
      ],
    }));
  return (
    <>
      <StepHeader title="Education" text="Add degrees, diplomas or school classes (Class 10 / Class 12). Most recent first." />
      <div className="space-y-4">
        {doc.data.education.length === 0 && (
          <EmptyState icon={<GraduationCap className="size-5" />} title="No education added yet" text="Add your college degree, or your school classes if you're still in school.">
            <Button size="sm" onClick={() => add()}>Add degree</Button>
            <Button size="sm" variant="outline" onClick={() => add(true)}>Add school class</Button>
          </EmptyState>
        )}
        {doc.data.education.map((e, i) => {
          const set = (k: string) => (v: string) => patchList(update, "education", e.id, { [k]: v });
          return (
            <EntryCard key={e.id} title={e.degree || e.institution || `Education ${i + 1}`} onRemove={() => removeFromList(update, "education", e.id)}>
              <Field id={`ed-inst-${e.id}`} label="Institution" value={e.institution} onChange={set("institution")} placeholder="University or school name" />
              <Field id={`ed-deg-${e.id}`} label="Degree / Class" value={e.degree} onChange={set("degree")} placeholder="B.Tech, Class 12 (CBSE)…" />
              <Field id={`ed-field-${e.id}`} label="Field of study" value={e.field} onChange={set("field")} placeholder="Computer Science, Science (PCM)…" />
              <Field id={`ed-grade-${e.id}`} label="Grade / Percentage" value={e.grade} onChange={set("grade")} placeholder="8.6 CGPA or 92%" />
              <Field id={`ed-start-${e.id}`} label="Start date" value={e.startDate} onChange={set("startDate")} placeholder="2021" />
              <Field id={`ed-end-${e.id}`} label="End date" value={e.endDate} onChange={set("endDate")} placeholder="2025 or Expected 2025" />
              <Field id={`ed-det-${e.id}`} label="Relevant coursework or achievements" value={e.details} onChange={set("details")} multiline rows={2} className="sm:col-span-2" />
            </EntryCard>
          );
        })}
        {doc.data.education.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            <AddButton label="Add degree" onClick={() => add()} />
            <AddButton label="Add school class" onClick={() => add(true)} />
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- Skills ---------------- */
export function SkillsStep({ doc, update }: StepProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [suggested, setSuggested] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const groupFor = (category: string) => doc.data.skills.find((g) => g.category === category);
  const addSkill = (category: string, raw: string) => {
    const values = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!values.length) return;
    update((d) => {
      const existing = d.skills.find((g) => g.category === category);
      if (existing) {
        const merged = [...existing.items];
        values.forEach((v) => !merged.some((m) => m.toLowerCase() === v.toLowerCase()) && merged.push(v));
        return { ...d, skills: d.skills.map((g) => (g.id === existing.id ? { ...g, items: merged } : g)) };
      }
      return { ...d, skills: [...d.skills, { id: uid(), category, items: values }] };
    });
    setDrafts((s) => ({ ...s, [category]: "" }));
  };
  const removeSkill = (category: string, item: string) =>
    update((d) => ({
      ...d,
      skills: d.skills
        .map((g) => (g.category === category ? { ...g, items: g.items.filter((i) => i !== item) } : g))
        .filter((g) => g.items.length > 0),
    }));

  const suggest = async () => {
    setLoading(true);
    const result = await ai.suggestSkills(doc.data);
    setSuggested(result);
    setLoading(false);
  };

  return (
    <>
      <StepHeader title="Skills" text="Type a skill and press Enter. Separate several with commas." />
      <div className="mb-5 rounded-xl border border-border bg-surface-muted p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm">Find skills you've already mentioned in your projects, experience or coursework.</p>
          <Button size="sm" variant="secondary" onClick={suggest} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Suggest from my resume
          </Button>
        </div>
        {suggested && (
          <div className="mt-3">
            {suggested.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new terms found yet. Add projects or experience first — we only suggest what you've written.</p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">Only add the ones you genuinely have. Click to add as a technical skill.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggested.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        addSkill("Technical Skills", s);
                        setSuggested((list) => list?.filter((x) => x !== s) ?? null);
                      }}
                      className="rounded-full border border-dashed border-brand/50 px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-primary-soft"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {SKILL_CATEGORIES.map((cat) => {
          const g = groupFor(cat);
          return (
            <div key={cat} className="rounded-xl border border-border bg-surface p-4">
              <Label htmlFor={`skill-${cat}`}>{cat}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {g?.items.map((item) => (
                  <Badge key={item} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1 text-xs">
                    {item}
                    <button type="button" aria-label={`Remove ${item}`} onClick={() => removeSkill(cat, item)} className="rounded-full p-0.5 hover:bg-background">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  id={`skill-${cat}`}
                  value={drafts[cat] ?? ""}
                  placeholder="Add a skill…"
                  onChange={(e) => setDrafts({ ...drafts, [cat]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(cat, drafts[cat] ?? "");
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addSkill(cat, drafts[cat] ?? "")}>Add</Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Projects ---------------- */
export function ProjectsStep({ doc, update }: StepProps) {
  const add = () =>
    update((d) => ({ ...d, projects: [...d.projects, { id: uid(), name: "", description: "", technologies: [], url: "", github: "" }] }));
  return (
    <>
      <StepHeader
        title="Projects"
        text={isFresher(doc) ? "Projects are one of the strongest parts of a fresher resume — academic, personal or freelance all count." : "Highlight notable projects, side work or open-source contributions."}
      />
      <div className="space-y-4">
        {doc.data.projects.length === 0 && (
          <EmptyState icon={<FolderGit2 className="size-5" />} title="No projects yet" text="Describe what you built in plain words — the assistant can help turn it into bullets.">
            <Button size="sm" onClick={add}>Add project</Button>
          </EmptyState>
        )}
        {doc.data.projects.map((p, i) => {
          const set = (k: string) => (v: string) => patchList(update, "projects", p.id, { [k]: v });
          return (
            <EntryCard key={p.id} title={p.name || `Project ${i + 1}`} onRemove={() => removeFromList(update, "projects", p.id)}>
              <Field id={`pr-name-${p.id}`} label="Project name" value={p.name} onChange={set("name")} />
              <Field
                id={`pr-tech-${p.id}`}
                label="Technologies"
                value={p.technologies.join(", ")}
                onChange={(v) => patchList(update, "projects", p.id, { technologies: v.split(",").map((s) => s.trimStart()).filter((s, idx, arr) => s || idx === arr.length - 1) })}
                hint="Comma separated"
              />
              <Field id={`pr-url-${p.id}`} label="Project URL" value={p.url} onChange={set("url")} />
              <Field id={`pr-gh-${p.id}`} label="GitHub URL" value={p.github} onChange={set("github")} />
              <Field id={`pr-desc-${p.id}`} label="Description" value={p.description} onChange={set("description")} multiline rows={4} className="sm:col-span-2" hint="One point per line works best." />
              <AiImprove
                label="Improve description with AI"
                disabled={!p.description.trim()}
                run={() => ai.improveProjectDescription({ name: p.name, text: p.description, technologies: p.technologies.filter(Boolean) })}
                onAccept={(t) => patchList(update, "projects", p.id, { description: t })}
              />
            </EntryCard>
          );
        })}
        {doc.data.projects.length > 0 && <AddButton label="Add another project" onClick={add} />}
      </div>
    </>
  );
}

/* ---------------- Experience ---------------- */
export function ExperienceStep({ doc, update }: StepProps) {
  const fresher = isFresher(doc);
  const add = () =>
    update((d) => ({
      ...d,
      experience: [...d.experience, { id: uid(), role: "", company: "", location: "", startDate: "", endDate: "", current: false, responsibilities: "", achievements: "" }],
    }));
  return (
    <>
      <StepHeader
        title={fresher ? "Experience (optional)" : "Work experience"}
        text={fresher ? "Internships, part-time work, volunteering or freelance — or skip this entirely." : "Most recent role first. Write responsibilities in your own words."}
      />
      <div className="space-y-4">
        {doc.data.experience.length === 0 &&
          (fresher ? (
            <EmptyState icon={<Briefcase className="size-5" />} title="No professional experience yet? That's completely normal." text="Your projects, education, certifications and achievements already tell a strong story. Add an internship if you've done one.">
              <Button size="sm" variant="outline" onClick={add}>Add an internship or role</Button>
            </EmptyState>
          ) : (
            <EmptyState icon={<Briefcase className="size-5" />} title="Add your first role" text="Start with your current or most recent position.">
              <Button size="sm" onClick={add}>Add role</Button>
            </EmptyState>
          ))}
        {doc.data.experience.map((x, i) => {
          const set = (k: string) => (v: string) => patchList(update, "experience", x.id, { [k]: v });
          return (
            <EntryCard key={x.id} title={x.role || x.company || `Role ${i + 1}`} onRemove={() => removeFromList(update, "experience", x.id)}>
              <Field id={`ex-role-${x.id}`} label="Job title" value={x.role} onChange={set("role")} />
              <Field id={`ex-co-${x.id}`} label="Company" value={x.company} onChange={set("company")} />
              <Field id={`ex-loc-${x.id}`} label="Location" value={x.location} onChange={set("location")} />
              <div className="grid grid-cols-2 gap-3">
                <Field id={`ex-start-${x.id}`} label="Start" value={x.startDate} onChange={set("startDate")} placeholder="Jun 2023" />
                {x.current ? (
                  <div className="space-y-1.5"><Label>End</Label><p className="flex h-9 items-center text-sm text-muted-foreground">Present</p></div>
                ) : (
                  <Field id={`ex-end-${x.id}`} label="End" value={x.endDate} onChange={set("endDate")} placeholder="Aug 2024" />
                )}
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <Checkbox checked={x.current} onCheckedChange={(c) => patchList(update, "experience", x.id, { current: c === true })} />
                I currently work here
              </label>
              <Field id={`ex-resp-${x.id}`} label="Responsibilities" value={x.responsibilities} onChange={set("responsibilities")} multiline rows={4} className="sm:col-span-2" hint="One point per line." />
              <AiImprove
                disabled={!x.responsibilities.trim()}
                run={() => ai.improveExperience({ role: x.role, company: x.company, text: x.responsibilities })}
                onAccept={(t) => patchList(update, "experience", x.id, { responsibilities: t })}
              />
              <Field id={`ex-ach-${x.id}`} label="Achievements" value={x.achievements} onChange={set("achievements")} multiline rows={3} className="sm:col-span-2" hint="Real outcomes only — numbers help if you have them." />
            </EntryCard>
          );
        })}
        {doc.data.experience.length > 0 && <AddButton label="Add another role" onClick={add} />}
      </div>
    </>
  );
}

/* ---------------- Certifications ---------------- */
export function CertificationsStep({ doc, update }: StepProps) {
  const add = () =>
    update((d) => ({ ...d, certifications: [...d.certifications, { id: uid(), name: "", issuer: "", date: "", credentialId: "", credentialUrl: "" }] }));
  return (
    <>
      <StepHeader title="Certifications" text="Courses and certificates you've completed." />
      <div className="space-y-4">
        {doc.data.certifications.length === 0 && (
          <EmptyState icon={<Award className="size-5" />} title="No certifications yet" text="Online courses, professional certificates and licences all belong here.">
            <Button size="sm" onClick={add}>Add certification</Button>
          </EmptyState>
        )}
        {doc.data.certifications.map((c, i) => {
          const set = (k: string) => (v: string) => patchList(update, "certifications", c.id, { [k]: v });
          return (
            <EntryCard key={c.id} title={c.name || `Certification ${i + 1}`} onRemove={() => removeFromList(update, "certifications", c.id)}>
              <Field id={`ce-name-${c.id}`} label="Certification name" value={c.name} onChange={set("name")} />
              <Field id={`ce-iss-${c.id}`} label="Issuing organization" value={c.issuer} onChange={set("issuer")} />
              <Field id={`ce-date-${c.id}`} label="Date" value={c.date} onChange={set("date")} placeholder="2024" />
              <Field id={`ce-id-${c.id}`} label="Credential ID (optional)" value={c.credentialId} onChange={set("credentialId")} />
              <Field id={`ce-url-${c.id}`} label="Credential URL" value={c.credentialUrl} onChange={set("credentialUrl")} className="sm:col-span-2" />
            </EntryCard>
          );
        })}
        {doc.data.certifications.length > 0 && <AddButton label="Add another certification" onClick={add} />}
      </div>
    </>
  );
}

/* ---------------- Achievements ---------------- */
export function AchievementsStep({ doc, update }: StepProps) {
  const add = () => update((d) => ({ ...d, achievements: [...d.achievements, { id: uid(), title: "", date: "", description: "" }] }));
  return (
    <>
      <StepHeader title="Achievements" text="Awards, competitions, scholarships, leadership roles or recognitions." />
      <div className="space-y-4">
        {doc.data.achievements.length === 0 && (
          <EmptyState icon={<Award className="size-5" />} title="No achievements yet" text="Hackathons, ranks, scholarships and awards help you stand out.">
            <Button size="sm" onClick={add}>Add achievement</Button>
          </EmptyState>
        )}
        {doc.data.achievements.map((a, i) => {
          const set = (k: string) => (v: string) => patchList(update, "achievements", a.id, { [k]: v });
          return (
            <EntryCard key={a.id} title={a.title || `Achievement ${i + 1}`} onRemove={() => removeFromList(update, "achievements", a.id)}>
              <Field id={`ac-t-${a.id}`} label="Achievement" value={a.title} onChange={set("title")} />
              <Field id={`ac-d-${a.id}`} label="Date" value={a.date} onChange={set("date")} />
              <Field id={`ac-desc-${a.id}`} label="Description" value={a.description} onChange={set("description")} multiline rows={2} className="sm:col-span-2" />
            </EntryCard>
          );
        })}
        {doc.data.achievements.length > 0 && <AddButton label="Add another achievement" onClick={add} />}
      </div>
    </>
  );
}

/* ---------------- Languages ---------------- */
export function LanguagesStep({ doc, update }: StepProps) {
  const add = () => update((d) => ({ ...d, languages: [...d.languages, { id: uid(), name: "", proficiency: "Professional" }] }));
  return (
    <>
      <StepHeader title="Languages" text="Languages you can speak or write." />
      <div className="space-y-3">
        {doc.data.languages.length === 0 && (
          <EmptyState icon={<Languages className="size-5" />} title="No languages added" text="Add the languages you're comfortable working in.">
            <Button size="sm" onClick={add}>Add language</Button>
          </EmptyState>
        )}
        {doc.data.languages.map((l) => (
          <div key={l.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">
            <Field id={`la-${l.id}`} label="Language" value={l.name} onChange={(v) => patchList(update, "languages", l.id, { name: v })} className="min-w-40 flex-1" />
            <div className="w-44 space-y-1.5">
              <Label>Proficiency</Label>
              <Select value={l.proficiency} onValueChange={(v) => patchList(update, "languages", l.id, { proficiency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" aria-label="Remove language" onClick={() => removeFromList(update, "languages", l.id)}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
        {doc.data.languages.length > 0 && <AddButton label="Add another language" onClick={add} />}
      </div>
    </>
  );
}
