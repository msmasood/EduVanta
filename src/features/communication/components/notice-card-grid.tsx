"use client";

import * as React from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoticePriorityBadge, NoticeAudienceBadge } from "./communication-badges";
import type { NoticeRow } from "../utils/communication-mappers";

interface NoticeCardGridProps {
  notices: NoticeRow[];
  onEdit: (notice: NoticeRow) => void;
  onDelete: (id: string) => void;
}

export function NoticeCardGrid({ notices, onEdit, onDelete }: NoticeCardGridProps) {
  if (notices.length === 0) {
    return (
      <div className="py-12 text-center" data-testid="notice-card-grid-empty">
        <p className="text-muted-foreground">No notices found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="notice-card-grid">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface NoticeCardProps {
  notice: NoticeRow;
  onEdit: (notice: NoticeRow) => void;
  onDelete: (id: string) => void;
}

function NoticeCard({ notice, onEdit, onDelete }: NoticeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        notice.isPinned && "border-amber-300 dark:border-amber-700"
      )}
      data-testid="notice-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {notice.isPinned && (
            <Pin className="size-3.5 shrink-0 text-amber-500" aria-label="Pinned" />
          )}
          <h3 className="font-semibold text-sm leading-tight truncate">{notice.title}</h3>
        </div>
        <NoticePriorityBadge priority={notice.priority} />
      </div>
      <p className="text-xs text-muted-foreground line-clamp-3">{notice.body}</p>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <NoticeAudienceBadge audience={notice.audience} />
        <span className="text-xs text-muted-foreground">{notice.publishedAt}</span>
      </div>
      <div className="flex gap-2 pt-1 border-t">
        <button
          className="text-xs text-primary hover:underline"
          onClick={() => onEdit(notice)}
        >
          Edit
        </button>
        <button
          className="text-xs text-destructive hover:underline"
          onClick={() => onDelete(notice.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
