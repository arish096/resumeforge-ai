# ResumeForge AI

Build a modern, professional, fully responsive AI-powered resume builder web application called ResumeForge AI.

The goal is to build a real functional MVP, not just a static landing-page mockup.

PRODUCT VISION

ResumeForge AI helps students, freshers, and experienced professionals create professional, ATS-friendly resumes using AI.

Core concept:

User Profile/Data → AI-assisted content → Resume JSON → Template Engine → Live Preview → PDF Export

The application should support both:

Fresher / Student resumes

Experienced Professional resumes

The architecture should be modular so advanced AI and ATS features can be added later.

BRAND & DESIGN

Product name:
ResumeForge AI

Tagline:
Build. Tailor. Get Hired.

Design style:

Modern SaaS

Professional

Clean

Premium but not flashy

Strong typography

Excellent spacing

Responsive on desktop, tablet and mobile

Light background with dark navy/blue primary accents

Subtle gradients only where appropriate

Rounded cards

Soft shadows

Smooth hover and transition effects

Accessible contrast

Avoid excessive animations

Use a consistent design system throughout the application.

LANDING PAGE

Create a polished landing page with:

Navbar

ResumeForge AI logo

Features

Templates

How It Works

Sign In

Get Started button

Hero Section

Headline:

Build a Resume That Gets Noticed.

Subheadline:

Create professional, ATS-friendly resumes with AI, choose from modern templates, and tailor your resume for every opportunity.

Primary CTA:
Create My Resume

Secondary CTA:
Explore Templates

Add a professional resume preview/mockup beside the hero content.

Trust / Feature Highlights

Show:

AI-Powered

ATS-Friendly

Professional Templates

PDF Export

How It Works

3 or 4 steps:

Enter Your Information

Improve With AI

Choose Your Template

Download Your Resume

Features Section

Cards for:

AI Resume Builder

Fresher & Experienced Modes

ATS-Friendly Templates

Live Resume Preview

Job-Specific Resume

Resume Analyzer

Templates Preview

Display several template cards with resume thumbnails.

Include:

Modern

Minimal

Classic

Professional

ATS Simple

Button:
View All Templates

CTA Section

Headline:

Your next opportunity starts with a better resume.

Button:
Create My Resume

Footer

Include:

ResumeForge AI

Product links

Features

Templates

Contact

Privacy

Terms

RESUME CREATION FLOW

When the user clicks "Create My Resume", open a clean multi-step resume builder.

First screen:

How would you like to build your resume?

Two large cards:

Fresher / Student

For:

Students

Fresh graduates

Internship seekers

People without professional experience

Experienced Professional

For:

Working professionals

Experienced candidates

Career switchers

The selected mode should change the relevant fields and content suggestions.

RESUME BUILDER

Use a multi-step interface with a progress indicator.

Steps:

Personal Information

Professional Summary

Education

Skills

Projects

Experience

Certifications

Achievements

Languages

Template & Preview

Allow users to move backward and forward without losing data.

Autosave form state locally.

PERSONAL INFORMATION

Fields:

Full Name

Professional Title

Email

Phone

Location

LinkedIn URL

GitHub URL

Portfolio URL

Do not require every field.

PROFESSIONAL SUMMARY

For fresher mode:

Ask about career interests

Education/background

Main skills

Career goals

For experienced mode:

Current/previous role

Years of experience

Main expertise

Career focus

Add an AI button:

Improve with AI

The AI should improve wording while preserving the user's actual information.

IMPORTANT:
Never invent fake experience, qualifications, achievements, companies, metrics, skills or certifications.

EDUCATION

Allow multiple education entries.

Fields:

Institution

Degree / Class

Field of Study

Start Date

End Date

Grade / Percentage

Relevant coursework or achievements

For school students, support Class 10 / Class 12 style education.

SKILLS

Allow users to add categorized skills:

Technical Skills

Programming Languages

Frameworks

Tools

Soft Skills

Allow adding/removing skills.

Add AI suggestions based only on information already entered by the user.

Do not fabricate skills.

PROJECTS

Allow multiple projects.

Fields:

Project Name

Description

Technologies

Project URL

GitHub URL

Add:

Improve Description with AI

AI should transform simple user-written descriptions into professional resume bullet points without inventing facts.

EXPERIENCE

For experienced mode:

Allow multiple entries.

Fields:

Job Title

Company

Location

Start Date

End Date

Responsibilities

Achievements

Add:

Improve with AI

AI should convert responsibilities into concise professional resume bullets based only on user-provided information.

For fresher mode, make Experience optional and prominently support:

No professional experience yet

Then encourage:

Projects

Internships

Certifications

Education

Achievements

Do NOT make the user feel that a lack of experience is a problem.

CERTIFICATIONS

Fields:

Certification Name

Issuing Organization

Date

Credential ID

Credential URL

Credential ID should be optional.

ACHIEVEMENTS

Allow multiple achievements.

Fields:

Achievement

Date

Description

LANGUAGES

Allow:

Language

Proficiency

RESUME DATA ARCHITECTURE

Use a structured resume object/JSON internally.

Example structure:

{
personal: {},
summary: "",
education: [],
skills: [],
projects: [],
experience: [],
certifications: [],
achievements: [],
languages: []
}

Templates should consume this structured data instead of storing duplicate resume information.

This is important because users should be able to switch templates without entering their information again.

TEMPLATE SYSTEM

Create a reusable template engine.

Initial templates:

1. ATS Simple

Single column

Black/dark text

No decorative graphics

Clear headings

ATS-friendly

2. Modern Professional

Modern typography

Strong visual hierarchy

Subtle blue accent

3. Minimal

Clean whitespace

Simple typography

Very readable

4. Classic

Traditional professional resume layout

5. Developer

Designed for software developers

Skills and projects emphasized

Still ATS-friendly

Every template must use the same Resume JSON data.

Allow users to switch templates instantly.

LIVE RESUME PREVIEW

The builder should have:

Left side:
Form/editor

Right side:
Live resume preview

On mobile:
Use tabs or a toggle between Editor and Preview.

Preview should resemble an actual A4 resume.

Add:
Download PDF

and:
Change Template

buttons.

PDF EXPORT

Implement a working PDF export flow.

Requirements:

A4 page

Professional spacing

Text should remain selectable

No screenshot-based PDF

Preserve resume layout

Avoid unnecessary blank pages

The exported PDF should be suitable for job applications.

AI FEATURES

Create an AI service abstraction so the actual AI provider can be connected later without rewriting the UI.

AI features needed:

Improve professional summary

Improve project descriptions

Improve experience bullet points

Suggest relevant section wording

Resume content suggestions

Important AI rule:

AI must never invent information.

If information is missing, ask the user for it or provide a clearly marked suggestion rather than presenting fabricated facts.

ATS ANALYZER

Create an ATS Analyzer page/section.

User can:

Upload/paste their resume

Paste a Job Description

Analyze:

Relevant keywords

Missing keywords

Resume sections

Formatting concerns

Skill alignment

Job description relevance

Show a visual analysis dashboard.

Do NOT claim that an exact ATS score guarantees passing an ATS.

Instead present it as an estimated compatibility analysis.

Example sections:

Keyword Coverage
Skills Alignment
Section Completeness
Formatting Check
Job Description Alignment

If a keyword is missing, phrase it carefully:

"If you genuinely have this skill, consider representing it more clearly in your resume."

Never encourage users to add skills they don't actually possess.

JOB-SPECIFIC RESUME

Add a feature:

Tailor Resume to Job

User pastes a Job Description.

AI analyzes the job description and user's existing resume.

Then:

Prioritize relevant projects

Prioritize relevant experience

Improve relevant wording

Highlight matching skills

Suggest missing information that the user can provide

Do not fabricate experience or qualifications.

Allow the user to review changes before applying them.

EXISTING RESUME IMPORT

Create an interface:

Import Existing Resume

Allow:

PDF upload

Image upload

The system should eventually extract resume information into the structured Resume JSON.

Show extracted information in editable fields before creating the final resume.

Important:
Do not silently overwrite user information.

RESUME STYLE IMPORT

Add a future-ready feature called:

Create Similar Style

User can upload a resume screenshot/PDF.

Analyze:

Layout structure

Section ordering

Typography characteristics

Spacing

Visual hierarchy

General color approach

Then generate an ORIGINAL template inspired by those structural characteristics.

Do not copy proprietary logos, exact branding, or copyrighted template assets.

Clearly make this an original design.

DASHBOARD

Create a dashboard after the landing page.

Dashboard should show:

Welcome to ResumeForge AI

Cards:

Create New Resume

My Resumes

Import Resume

ATS Analyzer

Tailor for a Job

Resume cards should show:

Resume name

Last edited

Template

Edit

Duplicate

Delete

Also include:

Create New Resume

button.

For the initial MVP, local storage can be used for saved resumes if authentication/database is not yet configured.

Keep the architecture ready for database integration later.

UX REQUIREMENTS

Forms should be easy to understand

Clear validation messages

Autosave

No data loss when navigating steps

Loading states for AI operations

Error states

Empty states

Success notifications

Confirmation before deleting resumes

Responsive design

Keyboard accessible controls

Avoid overwhelming users with too many fields at once.

IMPORTANT PRODUCT RULES

Do not build this as a static demo.

Components should be reusable.

Resume data must be separated from template presentation.

Keep templates modular.

Keep AI functionality behind a service abstraction.

Do not fabricate user information.

Keep ATS claims realistic.

Make the UI professional enough for a real SaaS product.

Do not add unnecessary libraries or heavy dependencies.

Keep the codebase clean and easy to extend.

INITIAL MVP PRIORITY

Prioritize these features first:

Landing page

Dashboard

Fresher / Experienced selection

Resume builder

Structured resume data

5 templates

Live preview

PDF export

Local resume saving

Build the architecture so the following can be added next:

AI API integration

ATS Analyzer

Job-specific tailoring

Resume import

Authentication

Cloud database

Premium templates

Payments

FINAL QUALITY BAR

The finished MVP should feel like a real modern SaaS product rather than a college demo.

Use realistic sample resume data in previews so the interface looks polished.

Make sure navigation works, forms work, template switching works, live preview works, local saving works, and PDF export works.

Do not leave major buttons as non-functional placeholders if they are part of the MVP.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://resumeforge-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1b4a42c3-ab87-4162-9e0c-f1db0fb81e07).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
