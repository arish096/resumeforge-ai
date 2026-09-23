/**
 * PDF export.
 *
 * We print the live A4 resume node through the browser's own print pipeline
 * (print stylesheet in src/styles.css). That keeps text selectable and vector
 * based — no screenshots, no extra dependencies.
 */
export function exportResumePdf(documentTitle: string) {
  if (typeof window === "undefined") return;
  const previous = window.document.title;
  window.document.title = documentTitle.replace(/[^\w\s-]/g, "").trim() || "Resume";
  const restore = () => {
    window.document.title = previous;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.requestAnimationFrame(() => window.print());
  window.setTimeout(restore, 4000);
}
