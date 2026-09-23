import type { ResumeData, ResumeMode } from "./types";

/** Realistic demo content used for template thumbnails and empty previews. */
export const sampleFresher = (): ResumeData => ({
  personal: {
    fullName: "Ananya Sharma",
    title: "Computer Science Graduate · Frontend Developer",
    email: "ananya.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Pune, India",
    linkedin: "linkedin.com/in/ananyasharma",
    github: "github.com/ananyasharma",
    portfolio: "ananya.dev",
  },
  summary:
    "Computer Science graduate with hands-on project experience in React and Node.js. Comfortable turning designs into accessible, responsive interfaces and eager to join a product team where I can keep learning engineering fundamentals.",
  education: [
    {
      id: "e1",
      institution: "Savitribai Phule Pune University",
      degree: "B.E. Computer Engineering",
      field: "Computer Engineering",
      startDate: "2021",
      endDate: "2025",
      grade: "8.6 CGPA",
      details: "Coursework: Data Structures, DBMS, Operating Systems, Web Technologies",
    },
    {
      id: "e2",
      institution: "Delhi Public School",
      degree: "Class 12 (CBSE)",
      field: "Science (PCM)",
      startDate: "2019",
      endDate: "2021",
      grade: "92.4%",
      details: "",
    },
  ],
  skills: [
    { id: "s1", category: "Programming Languages", items: ["JavaScript", "TypeScript", "Python", "SQL"] },
    { id: "s2", category: "Frameworks & Libraries", items: ["React", "Node.js", "Express", "Tailwind CSS"] },
    { id: "s3", category: "Tools & Platforms", items: ["Git", "Figma", "Postman", "Vercel"] },
    { id: "s4", category: "Soft Skills", items: ["Collaboration", "Written communication", "Ownership"] },
  ],
  projects: [
    {
      id: "p1",
      name: "CampusHub — Student Event Portal",
      description:
        "Built a college event portal where students browse and register for events.\nImplemented role-based dashboards for organisers and attendees.\nAdded email confirmations and a searchable event archive.",
      technologies: ["React", "Node.js", "MongoDB"],
      url: "campushub.demo",
      github: "github.com/ananyasharma/campushub",
    },
    {
      id: "p2",
      name: "StudyTrack — Revision Planner",
      description:
        "Created a planner that breaks syllabus topics into daily revision tasks.\nDesigned an offline-first data layer so plans work without connectivity.",
      technologies: ["TypeScript", "React", "IndexedDB"],
      url: "",
      github: "github.com/ananyasharma/studytrack",
    },
  ],
  experience: [
    {
      id: "x1",
      role: "Frontend Development Intern",
      company: "Brightlane Technologies",
      location: "Remote",
      startDate: "Jun 2024",
      endDate: "Aug 2024",
      current: false,
      responsibilities:
        "Built reusable UI components for the customer dashboard.\nFixed accessibility issues reported in the design review.",
      achievements: "Shipped the onboarding checklist feature used by the support team.",
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "Meta Front-End Developer Certificate",
      issuer: "Coursera",
      date: "2024",
      credentialId: "",
      credentialUrl: "",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "Runner-up, Inter-College Hackathon",
      date: "2024",
      description: "Team of four; built an accessibility audit tool in 36 hours.",
    },
  ],
  languages: [
    { id: "l1", name: "English", proficiency: "Fluent" },
    { id: "l2", name: "Hindi", proficiency: "Native" },
    { id: "l3", name: "Marathi", proficiency: "Professional" },
  ],
});

export const sampleExperienced = (): ResumeData => ({
  personal: {
    fullName: "Rohan Mehta",
    title: "Senior Product Engineer",
    email: "rohan.mehta@email.com",
    phone: "+91 90000 12345",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/rohanmehta",
    github: "github.com/rohanmehta",
    portfolio: "rohanmehta.dev",
  },
  summary:
    "Product engineer with 7 years building customer-facing web platforms. I lead small teams through discovery to delivery, with a focus on performance, reliability and measurable product outcomes.",
  education: [
    {
      id: "e1",
      institution: "National Institute of Technology, Surathkal",
      degree: "B.Tech Information Technology",
      field: "Information Technology",
      startDate: "2014",
      endDate: "2018",
      grade: "8.2 CGPA",
      details: "",
    },
  ],
  skills: [
    { id: "s1", category: "Programming Languages", items: ["TypeScript", "Go", "Python", "SQL"] },
    { id: "s2", category: "Frameworks & Libraries", items: ["React", "Next.js", "NestJS", "GraphQL"] },
    { id: "s3", category: "Tools & Platforms", items: ["AWS", "Docker", "Terraform", "PostgreSQL"] },
    { id: "s4", category: "Soft Skills", items: ["Technical leadership", "Mentoring", "Stakeholder communication"] },
  ],
  projects: [
    {
      id: "p1",
      name: "Checkout Performance Programme",
      description:
        "Led a cross-team effort to reduce checkout latency.\nIntroduced request-level tracing and a shared performance budget.",
      technologies: ["React", "Node.js", "OpenTelemetry"],
      url: "",
      github: "",
    },
  ],
  experience: [
    {
      id: "x1",
      role: "Senior Product Engineer",
      company: "Northwind Commerce",
      location: "Bengaluru, India",
      startDate: "Mar 2022",
      endDate: "",
      current: true,
      responsibilities:
        "Lead a squad of five engineers across the storefront and checkout surfaces.\nOwn architecture decisions for the design system and API contracts.\nPartner with design and analytics to shape quarterly roadmaps.",
      achievements:
        "Cut checkout page load time by 41% through rendering and bundle changes.\nMentored three engineers who were promoted within two review cycles.",
    },
    {
      id: "x2",
      role: "Product Engineer",
      company: "Sightline Analytics",
      location: "Pune, India",
      startDate: "Jul 2018",
      endDate: "Feb 2022",
      current: false,
      responsibilities:
        "Built reporting dashboards used by enterprise customers.\nMigrated the reporting service from a monolith to a queue-based pipeline.",
      achievements: "Reduced report generation failures from 6% to under 1%.",
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Certified Solutions Architect — Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-ASA-88214",
      credentialUrl: "",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "Engineering Excellence Award",
      date: "2023",
      description: "Recognised for leading the platform reliability initiative.",
    },
  ],
  languages: [
    { id: "l1", name: "English", proficiency: "Fluent" },
    { id: "l2", name: "Hindi", proficiency: "Native" },
  ],
});

export const sampleFor = (mode: ResumeMode) => (mode === "fresher" ? sampleFresher() : sampleExperienced());
