import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RULES = `You are a professional resume writer. STRICT RULES:
- Never invent facts, employers, numbers, metrics, dates, skills or achievements.
- Only rephrase, tighten and restructure what the user provided.
- If important information is missing, list it under "missing" instead of making it up.
- Reply with JSON only, no prose, no code fences.`;

const TASKS: Record<string, string> = {
  summary: `Rewrite the professional summary to be concise (2-4 sentences, 250-450 chars), confident and ATS-friendly. Return {"text": string, "missing": string[], "notes": string[]}.`,
  project: `Rewrite the project description as 2-4 strong action-led resume bullets (each line starts with "• "). Return {"text": string, "missing": string[], "notes": string[]}.`,
  experience: `Rewrite the job responsibilities as 3-6 strong action-led resume bullets (each line starts with "• "). Return {"text": string, "missing": string[], "notes": string[]}.`,
  skills: `Suggest up to 12 skills that the person CLEARLY demonstrates in their projects/experience/education text but has not listed in their skills. Return {"skills": string[]}.`,
  tailor: `Compare the resume to the job description. Return {"matchedSkills": string[], "missingKeywords": string[] (important JD keywords absent from the resume, max 15), "prioritisedProjectIds": string[] (all project ids, most relevant first), "prioritisedExperienceIds": string[] (all experience ids, most relevant first), "suggestions": string[] (3-6 concrete edits using only real info), "questions": string[] (questions to ask the user about missing keywords)}.`,
  ats: `Act as an ATS scanner. Score the resume against the job description. Return {"overall": number 0-100, "sections": [{"label": string, "score": number 0-100, "detail": string}] with labels exactly "Keyword Coverage","Skills Alignment","Section Completeness","Formatting Check","Job Description Alignment", "matchedKeywords": string[], "missingKeywords": string[], "formatting": [{"ok": boolean, "message": string}] (3-5 checks)}.`,
};

export const aiTask = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ task: z.enum(["summary", "project", "experience", "skills", "tailor", "ats"]), payload: z.string().max(60000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { runModel, parseJson } = await import("./ai.server");
    try {
      const text = await runModel(`${RULES}\n\nTASK: ${TASKS[data.task]}`, [{ role: "user", content: data.payload }]);
      return { ok: true as const, json: JSON.stringify(parseJson(text)) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "AI request failed." };
    }
  });

const IMPORT_PROMPT = `Extract ALL information from this resume exactly as written. Do not invent anything; leave fields empty ("") if absent. Return JSON:
{"personal":{"fullName":"","title":"","email":"","phone":"","location":"","linkedin":"","github":"","portfolio":""},
"summary":"",
"education":[{"institution":"","degree":"","field":"","startDate":"","endDate":"","grade":"","details":""}],
"skills":[{"category":"","items":[""]}],
"projects":[{"name":"","description":"","technologies":[""],"url":"","github":""}],
"experience":[{"role":"","company":"","location":"","startDate":"","endDate":"","current":false,"responsibilities":"","achievements":""}],
"certifications":[{"name":"","issuer":"","date":"","credentialId":"","credentialUrl":""}],
"achievements":[{"title":"","date":"","description":""}],
"languages":[{"name":"","proficiency":""}]}
Put bullet points on separate lines. JSON only.`;

export const aiImportResume = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ base64: z.string().max(12_000_000), mediaType: z.string(), filename: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { runModel, parseJson } = await import("./ai.server");
    try {
      const isImage = data.mediaType.startsWith("image/");
      const text = await runModel(RULES, [
        {
          role: "user",
          content: [
            { type: "text", text: IMPORT_PROMPT },
            isImage
              ? { type: "image", image: data.base64, mediaType: data.mediaType }
              : { type: "file", data: data.base64, mediaType: data.mediaType, filename: data.filename },
          ],
        },
      ]);
      return { ok: true as const, json: JSON.stringify(parseJson(text)) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Import failed." };
    }
  });
