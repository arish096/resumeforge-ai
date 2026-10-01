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
  const [autoScale, setAutoScale] = useState(scale ?? 1);

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

  const effective = scale ?? (fit ? autoScale : 1);

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <div
        className={printable ? "resume-print-root" : undefined}
        style={{
          width: A4_WIDTH_PX * effective,
          height: effective === 1 ? undefined : undefined,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: A4_WIDTH_PX,
            transform: `scale(${effective})`,
            transformOrigin: "top left",
            marginBottom: effective < 1 ? `calc((${effective} - 1) * 100%)` : undefined,
          }}
        >
          <div className="resume-page shadow-page" style={{ width: A4_WIDTH_PX }}>
            <Template data={data} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  );
}
