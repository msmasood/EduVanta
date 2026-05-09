"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ChartContainerProps {
  /** Height in pixels. Defaults to 240. */
  height?: number;
  className?: string;
  children: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChartContainer({ height = 240, className, children }: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
