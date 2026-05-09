"use client";

import { MessageThreadItem } from "./message-thread-item";
import type { ThreadRow } from "../utils/communication-mappers";

interface MessageThreadListProps {
  threads: ThreadRow[];
  activeThreadId?: string;
  onSelectThread: (id: string) => void;
}

export function MessageThreadList({ threads, activeThreadId, onSelectThread }: MessageThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="p-4 text-center" data-testid="thread-list-empty">
        <p className="text-sm text-muted-foreground">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2" data-testid="message-thread-list">
      {threads.map((thread) => (
        <MessageThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onClick={() => onSelectThread(thread.id)}
        />
      ))}
    </div>
  );
}
