import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/builder/fields";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — ResumeForge AI" },
      { name: "description", content: "Sign in to save your resumes to the cloud and open them on any device." },
      { property: "og:title", content: "Sign In — ResumeForge AI" },
      { property: "og:description", content: "Save resumes securely and access them anywhere." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
      if (error) toast.error(error.message);
      else setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setBusy(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="surface-card p-7">
          <h1 className="font-display text-2xl font-semibold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your resumes are saved to your account and available on any device.</p>
          {sent ? (
            <p className="mt-6 rounded-lg bg-primary-soft p-4 text-sm">Check your inbox to confirm your email, then come back and sign in.</p>
          ) : (
            <>
              <Button variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
              <form onSubmit={submit} className="space-y-4">
                <Field id="au-email" label="Email" type="email" value={email} onChange={setEmail} />
                <Field id="au-pass" label="Password" type="password" value={password} onChange={setPassword} hint={mode === "up" ? "At least 6 characters" : undefined} />
                <Button type="submit" className="w-full" disabled={busy || !email || password.length < 6}>
                  {busy && <Loader2 className="size-4 animate-spin" />} {mode === "in" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </>
          )}
          <button type="button" className="mt-5 text-sm text-brand hover:underline" onClick={() => { setMode(mode === "in" ? "up" : "in"); setSent(false); }}>
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
