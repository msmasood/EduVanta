import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";

// ─── Props ───────────────────────────────────────────────────────────────────

export type EventType =
  | "exam"
  | "holiday"
  | "meeting"
  | "sports"
  | "cultural"
  | "academic"
  | "other";

const eventTypeBadgeVariant: Record<EventType, "default" | "secondary" | "destructive" | "outline"> = {
  exam: "destructive",
  holiday: "secondary",
  meeting: "outline",
  sports: "default",
  cultural: "default",
  academic: "default",
  other: "secondary",
};

export interface EventCardProps {
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType?: EventType;
  locale?: string;
  className?: string;
  onClick?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EventCard({
  title,
  startDate,
  endDate,
  location,
  eventType = "other",
  locale = "en",
  className,
  onClick,
}: EventCardProps) {
  const formattedStart = formatDate(startDate, locale);
  const formattedEnd = endDate && endDate !== startDate ? formatDate(endDate, locale) : null;
  const badgeVariant = eventTypeBadgeVariant[eventType];

  return (
    <Card
      className={cn(
        "gap-2 py-3 transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{title}</p>
          <Badge variant={badgeVariant} className="shrink-0 capitalize text-[10px]">
            {eventType}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <time dateTime={startDate}>{formattedStart}</time>
          {formattedEnd && (
            <>
              <span aria-hidden="true">–</span>
              <time dateTime={endDate}>{formattedEnd}</time>
            </>
          )}
          {location && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{location}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
