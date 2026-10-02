import type { ReactNode } from "react";
import { PageIntro, PageShell } from "./PageShell";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <PageShell>
      <PageIntro title={title} text={intro} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-relaxed text-muted-foreground sm:px-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
        {children}
      </div>
    </PageShell>
  );
}
