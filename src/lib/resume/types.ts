export type ResumeMode = "fresher" | "experienced";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  /** Optional profile photo as a small data URL. */
  photo?: string | undefined;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  details: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  achievements: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
}

/** The single source of truth. Templates only read from this object. */
export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
  languages: LanguageEntry[];
}

export interface ResumeDocument {
  id: string;
  name: string;
  mode: ResumeMode;
  templateId: TemplateId;
  createdAt: string;
  updatedAt: string;
  data: ResumeData;
}

export type TemplateId =
  | "ats-simple"
  | "modern"
  | "minimal"
  | "classic"
  | "developer"
  | "creative-sidebar"
  | "bold-header"
  | "elegant-photo"
  | "two-tone"
  | "timeline";

export const SKILL_CATEGORIES = [
  "Technical Skills",
  "Programming Languages",
  "Frameworks & Libraries",
  "Tools & Platforms",
  "Soft Skills",
] as const;

export const PROFICIENCY_LEVELS = ["Native", "Fluent", "Professional", "Intermediate", "Basic"] as const;

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyResumeData = (): ResumeData => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
  languages: [],
});

/** Split a free-text block into clean resume bullet lines. */
export const toBullets = (value: string): string[] =>
  value
    .split(/\r?\n|(?<=\.)\s{1,}(?=[A-Z])/)
    .map((line) => line.replace(/^[-•*\u2022]\s*/, "").trim())
    .filter(Boolean);
