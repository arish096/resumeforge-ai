import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {footer && <SiteFooter />}
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="hero-gradient border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
        {text && <p className="mt-3 max-w-2xl text-muted-foreground">{text}</p>}
      </div>
    </section>
  );
}
