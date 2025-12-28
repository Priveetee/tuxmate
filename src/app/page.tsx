"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { X } from "lucide-react";
import { GlobalStyles } from "@/components/GlobalStyles";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { HowItWorks } from "@/components/help/HowItWorks";
import { GitHubLink } from "@/components/nav/GitHubLink";
import { ContributeLink } from "@/components/nav/ContributeLink";
import { DistroSelector } from "@/components/distro/DistroSelector";
import { CategorySection } from "@/components/app/CategorySection";
import { CommandFooter } from "@/components/footer/CommandFooter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDelayedTooltip } from "@/hooks/useDelayedTooltip";
import { useLinuxInit } from "@/hooks/useLinuxInit";
import {
  distros,
  categories,
  getAppsByCategory,
  type Category,
} from "@/lib/data";
import gsap from "gsap";

interface NavItem {
  type: "category" | "app";
  id: string;
  category: Category;
}

export default function Home() {
  const {
    tooltip,
    show: showTooltip,
    hide: hideTooltip,
    onTooltipEnter,
    onTooltipLeave,
  } = useDelayedTooltip(600);
  const {
    selectedDistro,
    selectedApps,
    setSelectedDistro,
    toggleApp,
    clearAll,
    isAppAvailable,
    generatedCommand,
    selectedCount,
    hasYayInstalled,
    setHasYayInstalled,
    hasAurPackages,
    aurPackageNames,
    aurAppNames,
  } = useLinuxInit();

  const allCategoriesWithApps = useMemo(
    () =>
      categories
        .map((cat) => ({ category: cat, apps: getAppsByCategory(cat) }))
        .filter((c) => c.apps.length > 0),
    [],
  );
  const columns = useMemo(() => {
    const cols: Array<typeof allCategoriesWithApps> = [[], [], [], [], []];
    const heights = [0, 0, 0, 0, 0];
    allCategoriesWithApps.forEach((catData) => {
      const minIdx = heights.indexOf(Math.min(...heights));
      cols[minIdx].push(catData);
      heights[minIdx] += catData.apps.length + 2;
    });
    return cols;
  }, [allCategoriesWithApps]);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(categories),
  );
  const toggleCategoryExpanded = useCallback((cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }, []);

  const navItems = useMemo(() => {
    const items: NavItem[][] = [];
    columns.forEach((colCategories) => {
      const colItems: NavItem[] = [];
      colCategories.forEach(({ category, apps: catApps }) => {
        colItems.push({ type: "category", id: category, category });
        if (expandedCategories.has(category))
          catApps.forEach((app) =>
            colItems.push({ type: "app", id: app.id, category }),
          );
      });
      items.push(colItems);
    });
    return items;
  }, [columns, expandedCategories]);

  const [focusPos, setFocusPos] = useState<{ col: number; row: number } | null>(
    null,
  );
  const clearFocus = useCallback(() => setFocusPos(null), []);
  const focusedItem = useMemo(() => {
    if (!focusPos) return null;
    return navItems[focusPos.col]?.[focusPos.row] || null;
  }, [navItems, focusPos]);

  const setFocusByItem = useCallback(
    (type: "category" | "app", id: string) => {
      for (let col = 0; col < navItems.length; col++) {
        const colItems = navItems[col];
        for (let row = 0; row < colItems.length; row++) {
          if (colItems[row].type === type && colItems[row].id === id) {
            setFocusPos({ col, row });
            return;
          }
        }
      }
    },
    [navItems],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      const key = e.key;
      if (key === " ") {
        e.preventDefault();
        if (focusPos) {
          const item = navItems[focusPos.col]?.[focusPos.row];
          if (item?.type === "category") toggleCategoryExpanded(item.id);
          else if (item?.type === "app") toggleApp(item.id);
        }
        return;
      }
      if (
        ![
          "ArrowDown",
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          "j",
          "k",
          "h",
          "l",
          "Escape",
        ].includes(key)
      )
        return;
      e.preventDefault();
      if (key === "Escape") {
        setFocusPos(null);
        return;
      }
      setFocusPos((prev) => {
        if (!prev) return { col: 0, row: 0 };
        let { col, row } = prev;
        const currentCol = navItems[col] || [];
        if (key === "ArrowDown" || key === "j")
          row = Math.min(row + 1, currentCol.length - 1);
        else if (key === "ArrowUp" || key === "k") row = Math.max(row - 1, 0);
        else if (key === "ArrowRight" || key === "l") {
          if (col < navItems.length - 1) {
            col++;
            row = Math.min(row, (navItems[col]?.length || 1) - 1);
          }
        } else if (key === "ArrowLeft" || key === "h") {
          if (col > 0) {
            col--;
            row = Math.min(row, (navItems[col]?.length || 1) - 1);
          }
        }
        return { col, row };
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navItems, focusPos, toggleCategoryExpanded, toggleApp]);

  const headerRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const header = headerRef.current;
    const title = header.querySelector(".header-animate");
    const controls = header.querySelector(".header-controls");

    gsap.to(title, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.8,
      ease: "power2.out",
      delay: 0.1,
      onComplete: () => {
        if (title) gsap.set(title, { clipPath: "none" });
      },
    });

    gsap.to(controls, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.3,
    });
  }, []);

  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative"
      style={{ transition: "background-color 0.5s, color 0.5s" }}
      onClick={clearFocus}
    >
      <GlobalStyles />
      <Tooltip
        tooltip={tooltip}
        onEnter={onTooltipEnter}
        onLeave={onTooltipLeave}
      />

      <header
        ref={headerRef}
        className="pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 relative"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="header-animate">
              <div className="flex items-start gap-4">
                <img
                  src="/tuxmate.png"
                  alt="TuxMate Logo"
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-contain shrink-0"
                />
                <div className="flex flex-col justify-center">
                  <h1
                    className="text-xl sm:text-2xl font-bold tracking-tight"
                    style={{ transition: "color 0.5s" }}
                  >
                    TuxMate
                  </h1>
                  <p
                    className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest"
                    style={{ transition: "color 0.5s" }}
                  >
                    The Linux Bulk App Installer.
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p
                      className="text-xs text-[var(--text-muted)]"
                      style={{ transition: "color 0.5s" }}
                    >
                      Select apps •{" "}
                      <span className="hidden sm:inline">
                        Arrow keys + Space
                      </span>
                    </p>
                    <span className="text-[var(--text-muted)] opacity-30">
                      |
                    </span>
                    <HowItWorks />
                  </div>
                </div>
              </div>
            </div>
            <div className="header-controls flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <GitHubLink />
                <ContributeLink />
                {selectedCount > 0 && (
                  <>
                    <span className="text-[var(--text-muted)] opacity-30 hidden sm:inline">
                      ·
                    </span>
                    <button
                      onClick={clearAll}
                      className="group flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-rose-500 transition-all duration-300"
                    >
                      <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                      <span className="hidden sm:inline relative">
                        Clear ({selectedCount})
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-400 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[var(--border-primary)]">
                <ThemeToggle />
                <DistroSelector
                  selectedDistro={selectedDistro}
                  onSelect={setSelectedDistro}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 pb-24 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-8">
            {columns.map((columnCategories, colIdx) => {
              let globalIdx = 0;
              for (let c = 0; c < colIdx; c++) {
                globalIdx += columns[c].length;
              }
              return (
                <div key={colIdx}>
                  {columnCategories.map(
                    ({ category, apps: categoryApps }, catIdx) => (
                      <CategorySection
                        key={category}
                        category={category}
                        categoryApps={categoryApps}
                        selectedApps={selectedApps}
                        isAppAvailable={isAppAvailable}
                        selectedDistro={selectedDistro}
                        toggleApp={toggleApp}
                        isExpanded={expandedCategories.has(category)}
                        onToggleExpanded={() =>
                          toggleCategoryExpanded(category)
                        }
                        focusedId={focusedItem?.id}
                        focusedType={focusedItem?.type}
                        onTooltipEnter={showTooltip}
                        onTooltipLeave={hideTooltip}
                        categoryIndex={globalIdx + catIdx}
                        onCategoryFocus={() =>
                          setFocusByItem("category", category)
                        }
                        onAppFocus={(appId) => setFocusByItem("app", appId)}
                      />
                    ),
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <CommandFooter
        command={generatedCommand}
        selectedCount={selectedCount}
        selectedDistro={selectedDistro}
        selectedApps={selectedApps}
        hasAurPackages={hasAurPackages}
        aurAppNames={aurAppNames}
        hasYayInstalled={hasYayInstalled}
        setHasYayInstalled={setHasYayInstalled}
      />
    </div>
  );
}
