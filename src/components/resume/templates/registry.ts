import type { ComponentType } from "react";
import type { TemplateId } from "@/lib/resume/types";
import type { TemplateProps } from "./shared";
import AtsSimple from "./AtsSimple";
import ModernProfessional from "./ModernProfessional";
import Minimal from "./Minimal";
import Classic from "./Classic";
import Developer from "./Developer";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tagline: string;
  atsFriendly: boolean;
  component: ComponentType<TemplateProps>;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern Professional",
    tagline: "Strong hierarchy with a subtle blue accent.",
    atsFriendly: true,
    component: ModernProfessional,
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Generous whitespace and quiet typography.",
    atsFriendly: true,
    component: Minimal,
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Traditional serif layout trusted by recruiters.",
    atsFriendly: true,
    component: Classic,
  },
  {
    id: "ats-simple",
    name: "ATS Simple",
    tagline: "Single column, no graphics, maximum parse-ability.",
    atsFriendly: true,
    component: AtsSimple,
  },
  {
    id: "developer",
    name: "Developer",
    tagline: "Projects and tech stack lead the page.",
    atsFriendly: true,
    component: Developer,
  },
];

export const getTemplate = (id: TemplateId): TemplateMeta =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
