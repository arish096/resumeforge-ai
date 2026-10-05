import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/templates", label: "Templates" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/ats-analyzer", label: "ATS Analyzer" },
] as const;

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="band-gradient flex size-8 items-center justify-center rounded-lg text-primary-foreground">
        <FileText className="size-4" />
      </span>
      <span className="font-display text-base font-semibold tracking-tight">ResumeForge AI</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/dashboard">My Resumes</Link></Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign In</Link></Button>
          )}
          <Button asChild size="sm">
            <Link to="/builder">Get Started</Link>
          </Button>
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); void signOut(); }}>Sign Out</Button>
              ) : (
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
              )}
              <Button asChild className="flex-1">
                <Link to="/builder" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
