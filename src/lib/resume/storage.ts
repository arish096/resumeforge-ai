import { emptyResumeData, uid, type ResumeDocument, type ResumeMode, type TemplateId } from "./types";

/**
 * Local persistence layer. Kept behind a small API so it can be swapped for a
 * cloud database later without touching UI code.
 */
const KEY = "resumeforge.resumes.v1";

const isBrowser = () => typeof window !== "undefined";

export function listResumes(): ResumeDocument[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ResumeDocument[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      : [];
  } catch {
    return [];
  }
}

function writeAll(items: ResumeDocument[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("resumeforge:changed"));
}

export function getResume(id: string): ResumeDocument | undefined {
  return listResumes().find((r) => r.id === id);
}

export function createResume(opts: {
  mode: ResumeMode;
  name?: string;
  templateId?: TemplateId;
  data?: ResumeDocument["data"];
}): ResumeDocument {
  const now = new Date().toISOString();
  const doc: ResumeDocument = {
    id: uid(),
    name: opts.name?.trim() || (opts.mode === "fresher" ? "Fresher Resume" : "Professional Resume"),
    mode: opts.mode,
    templateId: opts.templateId ?? "modern",
    createdAt: now,
    updatedAt: now,
    data: opts.data ?? emptyResumeData(),
  };
  writeAll([doc, ...listResumes()]);
  return doc;
}

export function saveResume(doc: ResumeDocument) {
  const next = { ...doc, updatedAt: new Date().toISOString() };
  const all = listResumes();
  const idx = all.findIndex((r) => r.id === doc.id);
  if (idx === -1) all.unshift(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

export function duplicateResume(id: string): ResumeDocument | undefined {
  const source = getResume(id);
  if (!source) return undefined;
  const now = new Date().toISOString();
  const copy: ResumeDocument = {
    ...structuredClone(source),
    id: uid(),
    name: `${source.name} (copy)`,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([copy, ...listResumes()]);
  return copy;
}

export function deleteResume(id: string) {
  writeAll(listResumes().filter((r) => r.id !== id));
}

export function subscribe(listener: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener("resumeforge:changed", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("resumeforge:changed", listener);
    window.removeEventListener("storage", listener);
  };
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}
