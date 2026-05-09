import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface NoticeCardProps {
  title: string;
  body?: string;
  audience?: string;
  date?: string;
  isPinned?: boolean;
  locale?: string;
  className?: string;
  onClick?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NoticeCard({
  title,
  body,
  audience,
  date,
  isPinned = false,
  locale = "en",
  className,
  onClick,
}: NoticeCardProps) {
  const formattedDate = date ? formatDate(date, locale) : null;

  return (
    <Card
      className={cn(
        "cursor-pointer gap-2 py-3 transition-shadow hover:shadow-md",
        isPinned && "ring-primary/30",
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
          {isPinned && (
            <Badge variant="default" className="shrink-0 text-[10px]">
              Pinned
            </Badge>
          )}
        </div>

        {body && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{body}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {audience && <span className="truncate">{audience}</span>}
          {audience && formattedDate && <span aria-hidden="true">·</span>}
          {formattedDate && <time dateTime={date}>{formattedDate}</time>}
        </div>
      </CardContent>
    </Card>
  );
}
