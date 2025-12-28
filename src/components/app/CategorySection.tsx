"use client";

import { useRef, useLayoutEffect } from "react";
import { CategoryHeader } from "./CategoryHeader";
import { AppItem } from "./AppItem";
import { analytics } from "@/lib/analytics";
import gsap from "gsap";
import type { AppData, DistroId } from "@/lib/data";

interface CategorySectionProps {
  category: string;
  categoryApps: AppData[];
  selectedApps: Set<string>;
  isAppAvailable: (id: string) => boolean;
  selectedDistro: DistroId;
  toggleApp: (id: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  focusedId: string | undefined;
  focusedType: "category" | "app" | undefined;
  onTooltipEnter: (text: string, e: React.MouseEvent) => void;
  onTooltipLeave: () => void;
  categoryIndex: number;
  onCategoryFocus?: () => void;
  onAppFocus?: (appId: string) => void;
}

export function CategorySection({
  category,
  categoryApps,
  selectedApps,
  isAppAvailable,
  selectedDistro,
  toggleApp,
  isExpanded,
  onToggleExpanded,
  focusedId,
  focusedType,
  onTooltipEnter,
  onTooltipLeave,
  categoryIndex,
  onCategoryFocus,
  onAppFocus,
}: CategorySectionProps) {
  const selectedInCategory = categoryApps.filter((a) =>
    selectedApps.has(a.id),
  ).length;
  const isCategoryFocused =
    focusedType === "category" && focusedId === category;
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const section = sectionRef.current;
    const header = section.querySelector(".category-header");
    const items = section.querySelectorAll(".app-item");

    gsap.set(header, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(items, { y: -20, opacity: 0 });

    const delay = categoryIndex * 0.08;

    gsap.to(header, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.6,
      ease: "power2.out",
      delay: delay + 0.2,
    });

    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.03,
      ease: "power2.out",
      delay: delay + 0.4,
    });
  }, [categoryIndex]);

  return (
    <div ref={sectionRef} className="mb-5 category-section">
      <CategoryHeader
        category={category}
        isExpanded={isExpanded}
        isFocused={isCategoryFocused}
        onToggle={() => {
          const willExpand = !isExpanded;
          onToggleExpanded();
          if (willExpand) {
            analytics.categoryExpanded(category);
          } else {
            analytics.categoryCollapsed(category);
          }
        }}
        selectedCount={selectedInCategory}
        onFocus={onCategoryFocus}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {categoryApps.map((app) => (
          <AppItem
            key={app.id}
            app={app}
            isSelected={selectedApps.has(app.id)}
            isAvailable={isAppAvailable(app.id)}
            isFocused={focusedType === "app" && focusedId === app.id}
            selectedDistro={selectedDistro}
            onToggle={() => toggleApp(app.id)}
            onTooltipEnter={onTooltipEnter}
            onTooltipLeave={onTooltipLeave}
            onFocus={() => onAppFocus?.(app.id)}
          />
        ))}
      </div>
    </div>
  );
}
