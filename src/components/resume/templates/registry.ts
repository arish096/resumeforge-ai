import type { ComponentType } from "react";
import type { TemplateId } from "@/lib/resume/types";
import type { TemplateProps } from "./shared";
import AtsSimple from "./AtsSimple";
import ModernProfessional from "./ModernProfessional";
import Minimal from "./Minimal";
import Classic from "./Classic";
import Developer from "./Developer";
import CreativeSidebar from "./CreativeSidebar";
import BoldHeader from "./BoldHeader";
import ElegantPhoto from "./ElegantPhoto";
import TwoTone from "./TwoTone";
import Timeline from "./Timeline";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tagline: string;
  atsFriendly: boolean;
  photo?: boolean;
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
  { id: "creative-sidebar", name: "Creative Sidebar", tagline: "Photo and skills in a bold colour sidebar.", atsFriendly: false, photo: true, component: CreativeSidebar },
  { id: "bold-header", name: "Bold Header", tagline: "Big name banner with your photo up front.", atsFriendly: false, photo: true, component: BoldHeader },
  { id: "elegant-photo", name: "Elegant", tagline: "Centred portrait with refined serif headings.", atsFriendly: false, photo: true, component: ElegantPhoto },
  { id: "two-tone", name: "Two-Tone", tagline: "Tinted header, project cards and a round photo.", atsFriendly: false, photo: true, component: TwoTone },
  { id: "timeline", name: "Timeline", tagline: "Career story on a visual timeline with photo.", atsFriendly: false, photo: true, component: Timeline },
];

export const getTemplate = (id: TemplateId): TemplateMeta =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]!;
