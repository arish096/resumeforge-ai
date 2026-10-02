import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ResumeForge AI" },
      { name: "description", content: "Get in touch with the ResumeForge AI team." },
      { property: "og:title", content: "Contact — ResumeForge AI" },
      { property: "og:description", content: "Questions, feedback or partnership ideas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    const subject = encodeURIComponent(`ResumeForge AI — message from ${r.data.name}`);
    const body = encodeURIComponent(`${r.data.message}\n\nReply to: ${r.data.email}`);
    window.location.href = `mailto:hello@resumeforge.ai?subject=${subject}&body=${body}`;
    toast.success("Opening your email app…");
  };

  return (
    <PageShell>
      <PageIntro title="Contact us" text="Questions, feedback or ideas — we read every message." />
      <form onSubmit={submit} noValidate className="mx-auto max-w-xl space-y-5 px-4 py-12 sm:px-6">
        {(["name", "email"] as const).map((f) => (
          <div key={f} className="space-y-1.5">
            <Label htmlFor={f} className="capitalize">{f}</Label>
            <Input id={f} type={f === "email" ? "email" : "text"} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            {errors[f] && <p className="text-sm text-destructive">{errors[f]}</p>}
          </div>
        ))}
        <div className="space-y-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
        </div>
        <Button type="submit">Send message</Button>
      </form>
    </PageShell>
  );
}
