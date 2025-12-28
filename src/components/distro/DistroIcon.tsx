"use client";

import { useState } from "react";

interface DistroIconProps {
  url: string;
  name: string;
  size?: number;
}

export function DistroIcon({ url, name, size = 20 }: DistroIconProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold">
        {name[0]}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  );
}
