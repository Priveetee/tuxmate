"use client";

import { ChevronRight } from "lucide-react";

interface CategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  isFocused: boolean;
  onToggle: () => void;
  selectedCount: number;
  onFocus?: () => void;
}

export function CategoryHeader({
  category,
  isExpanded,
  isFocused,
  onToggle,
  selectedCount,
  onFocus,
}: CategoryHeaderProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onFocus?.();
        onToggle();
      }}
      tabIndex={-1}
      className={`category-header w-full flex items-center gap-2 text-[11px] font-semibold text-[var(--text-muted)]
        hover:text-[var(--text-secondary)] uppercase tracking-widest mb-2 pb-1.5
        border-b border-[var(--border-primary)] transition-colors duration-150 px-0.5 outline-none
        ${isFocused ? "bg-[var(--bg-focus)] text-[var(--text-secondary)]" : ""}`}
      style={{ transition: "color 0.5s, border-color 0.5s" }}
    >
      <ChevronRight
        className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
      />
      <span className="flex-1 text-left">{category}</span>
      {selectedCount > 0 && (
        <span
          className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] w-5 h-5 rounded-full flex items-center justify-center font-medium"
          style={{ transition: "background-color 0.5s, color 0.5s" }}
        >
          {selectedCount}
        </span>
      )}
    </button>
  );
}
