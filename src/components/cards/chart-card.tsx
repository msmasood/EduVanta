import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ChartCardProps {
  title: string;
  description?: string;
  /** Slot for a button/link in the top-right */
  action?: React.ReactNode;
  /** Slot for content below the chart */
  footer?: React.ReactNode;
  /** Controlled height for the chart area in pixels. Defaults to 240. */
  height?: number;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChartCard({
  title,
  description,
  action,
  footer,
  height = 240,
  loading = false,
  empty = false,
  emptyMessage = "No data available",
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader className="border-b [.border-b]:pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent
        className="overflow-hidden"
        style={{ minHeight: height }}
      >
        {loading ? (
          <div className="flex flex-col gap-2 pt-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton style={{ height: height - 32 }} className="rounded-lg" />
          </div>
        ) : empty ? (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height }}
            role="status"
            aria-label={emptyMessage}
          >
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </CardContent>

      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
