import { useEffect, useRef, useState } from "react";
import { getTemplate } from "./templates/registry";
import type { ResumeData, ResumeMode, TemplateId } from "@/lib/resume/types";

interface Props {
  data: ResumeData;
  mode: ResumeMode;
  templateId: TemplateId;
  /** Fit the A4 page to the available width. */
  fit?: boolean;
  /** Fixed scale (used for thumbnails). */
  scale?: number;
  /** Marks this node as the one the browser print pipeline should output. */
  printable?: boolean;
  className?: string;
}

const A4_WIDTH_PX = 794; // 210mm at 96dpi

export function ResumePreview({
  data,
  mode,
  templateId,
  fit = false,
  scale,
  printable = false,
  className = "",
}: Props) {
  const Template = getTemplate(templateId).component;
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(scale ?? 1);
  const [pageHeight, setPageHeight] = useState(1123);

  const effective = scale ?? (fit ? autoScale : 1);

  useEffect(() => {
    if (!fit || scale) return;
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setAutoScale(Math.min(1, el.clientWidth / A4_WIDTH_PX));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit, scale]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const update = () => setPageHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data, templateId]);

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <div
        className={printable ? "resume-print-root" : undefined}
        style={{
          width: A4_WIDTH_PX * effective,
          height: pageHeight * effective,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          ref={pageRef}
          className="resume-page shadow-page"
          style={{
            width: A4_WIDTH_PX,
            transform: `scale(${effective})`,
            transformOrigin: "top left",
          }}
        >
          <Template data={data} mode={mode} />
        </div>
      </div>
    </div>
  );
}
