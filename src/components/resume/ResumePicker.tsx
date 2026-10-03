import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listResumes } from "@/lib/resume/storage";
import type { ResumeDocument } from "@/lib/resume/types";

export function useSavedResumes() {
  const [items, setItems] = useState<ResumeDocument[]>([]);
  useEffect(() => setItems(listResumes()), []);
  return items;
}

export function ResumePicker({ items, value, onChange, allowPaste = false }: { items: ResumeDocument[]; value: string; onChange: (v: string) => void; allowPaste?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>Resume</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder="Choose a saved resume" /></SelectTrigger>
        <SelectContent>
          {allowPaste && <SelectItem value="__paste">Paste resume text instead</SelectItem>}
          {items.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
