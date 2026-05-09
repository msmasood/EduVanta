"use client";

import { cn } from "@/lib/utils";
import type { ThreadRow } from "../utils/communication-mappers";

interface MessageThreadItemProps {
  thread: ThreadRow;
  isActive: boolean;
  onClick: () => void;
}

export function MessageThreadItem({ thread, isActive, onClick }: MessageThreadItemProps) {
  return (
    <button
      className={cn(
        "w-full rounded-lg px-3 py-3 text-start transition-colors hover:bg-muted/60",
        isActive && "bg-muted"
      )}
      onClick={onClick}
      data-testid="message-thread-item"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm line-clamp-1">{thread.subject}</p>
        {thread.unreadCount > 0 && (
          <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {thread.unreadCount}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
        {thread.participants.join(", ")}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{thread.lastMessageAt}</p>
    </button>
  );
}
