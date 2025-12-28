"use client";

import { Check } from "lucide-react";
import { AppIcon } from "./AppIcon";
import type { AppData, DistroId } from "@/lib/data";
import { distros } from "@/lib/data";
import { analytics } from "@/lib/analytics";

interface AppItemProps {
  app: AppData;
  isSelected: boolean;
  isAvailable: boolean;
  isFocused: boolean;
  selectedDistro: DistroId;
  onToggle: () => void;
  onTooltipEnter: (text: string, e: React.MouseEvent) => void;
  onTooltipLeave: () => void;
  onFocus?: () => void;
}

export function AppItem({
  app,
  isSelected,
  isAvailable,
  isFocused,
  selectedDistro,
  onToggle,
  onTooltipEnter,
  onTooltipLeave,
  onFocus,
}: AppItemProps) {
  const getUnavailableText = () => {
    if (app.unavailableReason) return app.unavailableReason;
    const distroName = distros.find((d) => d.id === selectedDistro)?.name || "";
    return `Not available in ${distroName} repos`;
  };

  return (
    <div
      className={`app-item w-full flex items-center gap-2.5 py-1.5 px-2 rounded-md outline-none transition-all duration-150
        ${isFocused ? "bg-[var(--bg-focus)]" : ""}
        ${!isAvailable ? "opacity-40 grayscale-[30%]" : "hover:bg-[var(--bg-hover)] cursor-pointer"}`}
      style={{ transition: "background-color 0.15s, color 0.5s" }}
      onClick={(e) => {
        e.stopPropagation();
        onFocus?.();
        if (isAvailable) {
          const willBeSelected = !isSelected;
          onToggle();
          const distroName =
            distros.find((d) => d.id === selectedDistro)?.name ||
            selectedDistro;
          if (willBeSelected) {
            analytics.appSelected(app.name, app.category, distroName);
          } else {
            analytics.appDeselected(app.name, app.category, distroName);
          }
        }
      }}
      onMouseEnter={(e) => {
        if (isAvailable) onTooltipEnter(app.description, e);
      }}
      onMouseLeave={() => {
        if (isAvailable) onTooltipLeave();
      }}
    >
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150
        ${isSelected ? "bg-[var(--text-secondary)] border-[var(--text-secondary)]" : "border-[var(--border-secondary)]"} ${!isAvailable ? "border-dashed" : ""}`}
      >
        {isSelected && (
          <Check
            className="w-2.5 h-2.5 text-[var(--bg-primary)]"
            strokeWidth={3}
          />
        )}
      </div>
      <AppIcon url={app.iconUrl} name={app.name} />
      <span
        className={`text-sm flex-1 ${!isAvailable ? "text-[var(--text-muted)]" : isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
        style={{
          transition: "color 0.5s",
          textRendering: "geometricPrecision",
          WebkitFontSmoothing: "antialiased",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {app.name}
      </span>
      {!isAvailable && (
        <div
          className="relative group flex-shrink-0 cursor-help"
          onMouseEnter={(e) => {
            e.stopPropagation();
            onTooltipEnter(getUnavailableText(), e);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onTooltipLeave();
          }}
        >
          <svg
            className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all duration-300 hover:rotate-[360deg] hover:scale-110"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.518 0-10-4.482-10-10s4.482-10 10-10 10 4.482 10 10-4.482 10-10 10zm-1-16h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
      )}
    </div>
  );
}
