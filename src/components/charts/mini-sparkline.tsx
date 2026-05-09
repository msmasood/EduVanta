"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getChartColor } from "@/lib/dashboard";
import type { ChartDataPoint } from "@/types/dashboard";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface MiniSparklineProps {
  data: ChartDataPoint[];
  /** Chart color index (0–4). Defaults to 0. */
  colorIndex?: number;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MiniSparkline({
  data,
  colorIndex = 0,
  width = 80,
  height = 36,
  showTooltip = false,
}: MiniSparklineProps) {
  const color = getChartColor(colorIndex);

  return (
    <div style={{ width, height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: 10,
              }}
              itemStyle={{ color: "var(--popover-foreground)" }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
