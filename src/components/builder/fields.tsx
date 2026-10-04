import { useState, type ReactNode } from "react";
import { Loader2, Plus, Sparkles, Trash2, AlertCircle, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AISuggestion } from "@/lib/resume/ai";

export function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 4,
  hint,
  error,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string | undefined;
  error?: string | undefined;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
      )}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function StepHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {text && <p className="mt-1 max-w-xl text-sm text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function EntryCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold">{title}</p>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} aria-label={`Remove ${title}`}>
          <Trash2 className="size-4" /> Remove
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="w-full border-dashed">
      <Plus className="size-4" /> {label}
    </Button>
  );
}

export function EmptyState({ icon, title, text, children }: { icon: ReactNode; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted px-6 py-10 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon}
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

/**
 * "Improve with AI" control. Runs the request, shows the suggestion for review,
 * and only applies it when the user accepts — never silently overwrites.
 */
export function AiImprove({
  label = "Improve with AI",
  disabled,
  run,
  onAccept,
}: {
  label?: string;
  disabled?: boolean;
  run: () => Promise<AISuggestion>;
  onAccept: (text: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const go = async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await run());
    } catch {
      setError("The assistant couldn't respond. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:col-span-2">
      <Button type="button" variant="secondary" size="sm" onClick={go} disabled={disabled || loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "Improving…" : label}
      </Button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      {result && (
        <div className="mt-3 rounded-lg border border-brand/30 bg-primary-soft/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Suggested wording</p>
          {result.text ? (
            <p className="mt-2 whitespace-pre-line text-sm">{result.text}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Nothing to rewrite yet.</p>
          )}
          {result.notes.map((n) => (
            <p key={n} className="mt-2 text-xs text-muted-foreground">{n}</p>
          ))}
          {result.missing.length > 0 && (
            <div className="mt-3 rounded-md bg-surface p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <AlertCircle className="size-3.5 text-warning" /> Information only you can add
              </p>
              <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground">
                {result.missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            {result.text && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onAccept(result.text);
                  setResult(null);
                }}
              >
                <Check className="size-4" /> Use this
              </Button>
            )}
            <Button type="button" size="sm" variant="ghost" onClick={() => setResult(null)}>
              <X className="size-4" /> Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
