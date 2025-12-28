import { useState, useRef, useCallback } from "react";

interface Tooltip {
  text: string;
  x: number;
  y: number;
  width: number;
  key: number;
}

export function useDelayedTooltip(delay = 600) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    width: number;
    key: number;
  } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringTooltip = useRef(false);
  const keyRef = useRef(0);

  const show = useCallback(
    (text: string, e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      keyRef.current += 1;
      const newTooltip = {
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 12,
        width: rect.width,
        key: keyRef.current,
      };
      if (timerRef.current) clearTimeout(timerRef.current);
      setTooltip(null);
      timerRef.current = setTimeout(() => setTooltip(newTooltip), delay);
    },
    [delay],
  );

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isHoveringTooltip.current) {
        setTooltip(null);
      }
    }, 100);
  }, []);

  const onTooltipEnter = useCallback(() => {
    isHoveringTooltip.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onTooltipLeave = useCallback(() => {
    isHoveringTooltip.current = false;
    setTooltip(null);
  }, []);

  return { tooltip, show, hide, onTooltipEnter, onTooltipLeave };
}
