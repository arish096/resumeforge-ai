import type { ResumeData, ResumeMode } from "./types";
import { toBullets } from "./types";

/**
 * AI service abstraction.
 *
 * The UI only talks to `getAIService()`. Today it is backed by a local,
 * rule-based rewriter that NEVER invents facts — it only rephrases and
 * restructures what the user already wrote. A hosted model can be dropped in
 * later by implementing this same interface.
 */

export interface AISuggestion {
  /** Rewritten text, derived only from user input. */
  text: string;
  /** Information the user must supply themselves — never auto-filled. */
  missing: string[];
  notes: string[];
}

export interface TailorResult {
  matchedSkills: string[];
  missingKeywords: string[];
  prioritisedProjectIds: string[];
  prioritisedExperienceIds: string[];
  suggestions: string[];
  questions: string[];
}

export interface AtsReport {
  overall: number;
  sections: { label: string; score: number; detail: string }[];
  matchedKeywords: string[];
  missingKeywords: string[];
  formatting: { ok: boolean; message: string }[];
}

export interface AIService {
  improveSummary(input: { text: string; mode: ResumeMode; title?: string }): Promise<AISuggestion>;
  improveProjectDescription(input: { name: string; text: string; technologies: string[] }): Promise<AISuggestion>;
  improveExperience(input: { role: string; company: string; text: string }): Promise<AISuggestion>;
  suggestSkills(data: ResumeData): Promise<string[]>;
  tailorToJob(input: { data: ResumeData; jobDescription: string }): Promise<TailorResult>;
  analyzeAts(input: { resumeText: string; jobDescription: string }): Promise<AtsReport>;
}

const wait = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

const STOPWORDS = new Set(
  `a an the and or but if then than that this those these of for to in on at by with from as is are was were be been being we you your our their they it its into about over under more most such can will should would may might must not no do does did have has had using use used work works working role roles team teams year years experience strong excellent good great ability able including etc via per across within also new other others help helps helped plus job candidate candidates applicant company companies looking join required requirements responsibilities qualifications preferred nice must-have opportunity position`.split(
    /\s+/,
  ),
);

const WEAK_OPENERS: Record<string, string> = {
  "worked on": "Delivered",
  "was responsible for": "Owned",
  "responsible for": "Owned",
  "helped with": "Contributed to",
  "helped to": "Contributed to",
  "helped": "Contributed to",
  "did": "Executed",
  "made": "Built",
  "was doing": "Handled",
  "i was": "",
  "i am": "",
  "i have": "",
  "i": "",
};

function strengthen(line: string) {
  let out = line.trim().replace(/\s+/g, " ");
  const lower = out.toLowerCase();
  for (const [weak, strong] of Object.entries(WEAK_OPENERS)) {
    if (lower.startsWith(weak)) {
      out = `${strong} ${out.slice(weak.length)}`.trim();
      break;
    }
  }
  out = out.replace(/\s+/g, " ").replace(/\.$/, "");
  if (!out) return out;
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export function extractKeywords(text: string, limit = 40): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z+#.\-/]{1,}/g) ?? []) {
    const token = raw.replace(/[.\-/]+$/, "");
    if (token.length < 3 || STOPWORDS.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k]) => k);
}

export function resumeToText(data: ResumeData): string {
  return [
    data.personal.fullName,
    data.personal.title,
    data.summary,
    ...data.education.map((e) => `${e.degree} ${e.field} ${e.institution} ${e.details}`),
    ...data.skills.flatMap((g) => [g.category, ...g.items]),
    ...data.projects.map((p) => `${p.name} ${p.description} ${p.technologies.join(" ")}`),
    ...data.experience.map((x) => `${x.role} ${x.company} ${x.responsibilities} ${x.achievements}`),
    ...data.certifications.map((c) => `${c.name} ${c.issuer}`),
    ...data.achievements.map((a) => `${a.title} ${a.description}`),
    ...data.languages.map((l) => `${l.name} ${l.proficiency}`),
  ]
    .filter(Boolean)
    .join("\n");
}

const localAI: AIService = {
  async improveSummary({ text, mode, title }) {
    await wait();
    const missing: string[] = [];
    const clean = text.trim();
    if (!clean) {
      return {
        text: "",
        missing: [
          "A short description of your background",
          "Your main skills or areas of focus",
          mode === "fresher" ? "The kind of role you are looking for" : "Your years of experience and current role",
        ],
        notes: ["Add a few rough sentences first — rewriting only works with your own information."],
      };
    }
    const sentences = clean
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => strengthen(s));
    if (!/\d/.test(clean) && mode === "experienced") missing.push("Years of experience");
    if (!title) missing.push("A professional title for the header");
    const rewritten = sentences.map((s) => (s.endsWith(".") ? s : `${s}.`)).join(" ");
    return {
      text: rewritten,
      missing,
      notes: ["Wording tightened. No new facts, skills or metrics were added."],
    };
  },

  async improveProjectDescription({ text, technologies }) {
    await wait();
    const bullets = toBullets(text).map((line) => strengthen(line));
    const missing: string[] = [];
    if (!technologies.length) missing.push("Technologies used in this project");
    if (!bullets.some((b) => /\d/.test(b))) {
      missing.push("A real number if you have one (users, records, time saved)");
    }
    return {
      text: bullets.map((b) => `• ${b}`).join("\n"),
      missing,
      notes: ["Turned your notes into resume bullets using only what you wrote."],
    };
  },

  async improveExperience({ text }) {
    await wait();
    const bullets = toBullets(text).map((line) => strengthen(line));
    return {
      text: bullets.map((b) => `• ${b}`).join("\n"),
      missing: bullets.some((b) => /\d/.test(b))
        ? []
        : ["An outcome or number you can genuinely back up"],
      notes: ["Rewritten as concise, action-led bullets. Nothing was invented."],
    };
  },

  async suggestSkills(data) {
    await wait(450);
    const already = new Set(
      data.skills.flatMap((g) => g.items.map((i) => i.toLowerCase())),
    );
    // Suggestions come only from words the user already wrote elsewhere.
    const mentioned = new Set<string>();
    for (const p of data.projects) {
      p.technologies.forEach((t) => mentioned.add(t));
      extractKeywords(p.description, 12).forEach((k) => mentioned.add(k));
    }
    for (const x of data.experience) {
      extractKeywords(`${x.responsibilities} ${x.achievements}`, 12).forEach((k) => mentioned.add(k));
    }
    for (const e of data.education) extractKeywords(e.details, 8).forEach((k) => mentioned.add(k));
    return [...mentioned]
      .filter((s) => s.length > 2 && !already.has(s.toLowerCase()))
      .slice(0, 12);
  },

  async tailorToJob({ data, jobDescription }) {
    await wait(900);
    const jd = extractKeywords(jobDescription, 60);
    const resumeText = resumeToText(data).toLowerCase();
    const matchedSkills = jd.filter((k) => resumeText.includes(k));
    const missingKeywords = jd.filter((k) => !resumeText.includes(k)).slice(0, 15);

    const score = (text: string) =>
      jd.reduce((acc, k) => (text.toLowerCase().includes(k) ? acc + 1 : acc), 0);

    const prioritisedProjectIds = [...data.projects]
      .sort((a, b) => score(`${b.name} ${b.description} ${b.technologies.join(" ")}`) - score(`${a.name} ${a.description} ${a.technologies.join(" ")}`))
      .map((p) => p.id);
    const prioritisedExperienceIds = [...data.experience]
      .sort((a, b) => score(`${b.role} ${b.responsibilities} ${b.achievements}`) - score(`${a.role} ${a.responsibilities} ${a.achievements}`))
      .map((x) => x.id);

    return {
      matchedSkills: matchedSkills.slice(0, 20),
      missingKeywords,
      prioritisedProjectIds,
      prioritisedExperienceIds,
      suggestions: [
        "Move the most relevant project and role to the top of their sections.",
        "Mirror the job's own wording for tools you genuinely use.",
        "Keep your summary focused on the outcome this role cares about.",
      ],
      questions: missingKeywords
        .slice(0, 5)
        .map((k) => `Do you have genuine experience with "${k}"? If yes, where should it appear?`),
    };
  },

  async analyzeAts({ resumeText, jobDescription }) {
    await wait(900);
    const jd = extractKeywords(jobDescription, 40);
    const lower = resumeText.toLowerCase();
    const matchedKeywords = jd.filter((k) => lower.includes(k));
    const missingKeywords = jd.filter((k) => !lower.includes(k));
    const coverage = jd.length ? Math.round((matchedKeywords.length / jd.length) * 100) : 0;

    const expectedSections = ["experience", "education", "skill", "project", "summary"];
    const presentSections = expectedSections.filter((s) => lower.includes(s));
    const sectionScore = Math.round((presentSections.length / expectedSections.length) * 100);

    const hasContact = /@/.test(resumeText) && /\d{6,}/.test(resumeText.replace(/\s/g, ""));
    const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
    const formatting = [
      { ok: hasContact, message: hasContact ? "Email and phone detected." : "Add an email address and phone number." },
      {
        ok: wordCount > 180 && wordCount < 900,
        message:
          wordCount <= 180
            ? "Resume looks short — add more detail to your projects or roles."
            : wordCount >= 900
              ? "Resume looks long — tighten it toward one or two pages."
              : "Length looks appropriate for one to two pages.",
      },
      {
        ok: !/[|┃╎]|\t{2,}/.test(resumeText),
        message: /[|┃╎]|\t{2,}/.test(resumeText)
          ? "Table or column characters detected — plain single-column text parses more reliably."
          : "No table-style characters detected.",
      },
    ];
    const formattingScore = Math.round((formatting.filter((f) => f.ok).length / formatting.length) * 100);

    const skillLine = jd.filter((k) => k.length > 3);
    const skillsScore = skillLine.length
      ? Math.round((skillLine.filter((k) => lower.includes(k)).length / skillLine.length) * 100)
      : 0;

    const overall = Math.round(coverage * 0.4 + sectionScore * 0.2 + formattingScore * 0.2 + skillsScore * 0.2);

    return {
      overall,
      sections: [
        { label: "Keyword Coverage", score: coverage, detail: `${matchedKeywords.length} of ${jd.length} job keywords appear in your resume.` },
        { label: "Skills Alignment", score: skillsScore, detail: "How closely your listed skills echo the job's language." },
        { label: "Section Completeness", score: sectionScore, detail: `Detected: ${presentSections.join(", ") || "none"}.` },
        { label: "Formatting Check", score: formattingScore, detail: "Parsing-friendliness of structure and contact details." },
        { label: "Job Description Alignment", score: Math.round((coverage + skillsScore) / 2), detail: "Overall overlap between your resume and this posting." },
      ],
      matchedKeywords,
      missingKeywords,
    };
  },
};

export const getAIService = (): AIService => localAI;
