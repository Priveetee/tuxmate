"use client";

import { renderTooltipContent } from "@/lib/tooltip-markdown";

interface TooltipProps {
  tooltip: {
    text: string;
    x: number;
    y: number;
    width?: number;
    key?: number;
  } | null;
  onEnter: () => void;
  onLeave: () => void;
}

export function Tooltip({ tooltip, onEnter, onLeave }: TooltipProps) {
  if (!tooltip) return null;

  return (
    <div
      key={tooltip.key}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="fixed px-3 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs rounded-lg shadow-xl border border-[var(--border-secondary)] max-w-[320px] leading-relaxed"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: "translate(-50%, -100%)",
        zIndex: 99999,
        animation: "tooltipSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {renderTooltipContent(tooltip.text)}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg-tertiary)] border-r border-b border-[var(--border-secondary)] rotate-45"
        style={{ bottom: "-7px" }}
      />
    </div>
  );
}
