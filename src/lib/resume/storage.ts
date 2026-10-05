import { supabase } from "@/integrations/supabase/client";
import { emptyResumeData, uid, type ResumeDocument, type ResumeMode, type TemplateId } from "./types";

/**
 * Local persistence layer. Kept behind a small API so it can be swapped for a
 * cloud database later without touching UI code.
 */
const KEY = "resumeforge.resumes.v1";

const isBrowser = () => typeof window !== "undefined";

/* ---------- Cloud sync (active only while signed in) ---------- */
let cloudUser: string | null = null;

function pushDoc(doc: ResumeDocument) {
  if (!cloudUser) return;
  void supabase
    .from("resumes")
    .upsert({ id: doc.id, user_id: cloudUser, doc: doc as never, updated_at: doc.updatedAt })
    .then(({ error }) => error && console.error("Cloud save failed", error));
}
function removeDoc(id: string) {
  if (!cloudUser) return;
  void supabase.from("resumes").delete().eq("id", id).then(({ error }) => error && console.error(error));
}

/** Called when the session changes. Merges cloud + local resumes (newest wins). */
export async function setCloudUser(userId: string | null) {
  cloudUser = userId;
  if (!userId || !isBrowser()) return;
  const { data, error } = await supabase.from("resumes").select("doc");
  if (error) return console.error(error);
  const remote = new Map((data ?? []).map((r) => [(r.doc as unknown as ResumeDocument).id, r.doc as unknown as ResumeDocument]));
  const merged = new Map(remote);
  for (const local of listResumes()) {
    const r = remote.get(local.id);
    if (!r || r.updatedAt < local.updatedAt) {
      merged.set(local.id, local);
      pushDoc(local);
    }
  }
  writeAll([...merged.values()]);
}

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
  pushDoc(doc);
  return doc;
}

export function saveResume(doc: ResumeDocument) {
  const next = { ...doc, updatedAt: new Date().toISOString() };
  const all = listResumes();
  const idx = all.findIndex((r) => r.id === doc.id);
  if (idx === -1) all.unshift(next);
  else all[idx] = next;
  writeAll(all);
  pushDoc(next);
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
  pushDoc(copy);
  return copy;
}

export function deleteResume(id: string) {
  writeAll(listResumes().filter((r) => r.id !== id));
  removeDoc(id);
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
