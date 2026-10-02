import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getTemplate } from "./templates/registry";
import type { ResumeData, ResumeMode, TemplateId } from "@/lib/resume/types";

/**
 * Renders a full-size A4 copy of the resume directly under <body>.
 * It sits offscreen on screen and becomes the only printed content,
 * which gives a vector, selectable-text PDF via the browser's print dialog.
 */
export function PrintableResume({
  data,
  mode,
  templateId,
}: {
  data: ResumeData;
  mode: ResumeMode;
  templateId: TemplateId;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const Template = getTemplate(templateId).component;
  return createPortal(
    <div className="resume-print-host" aria-hidden="true">
      <div className="resume-page" style={{ width: "210mm" }}>
        <Template data={data} mode={mode} />
      </div>
    </div>,
    document.body,
  );
}
