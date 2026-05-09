"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MessageRow } from "../utils/communication-mappers";

interface MessageConversationProps {
  messages: MessageRow[];
  currentUserId: string;
}

export function MessageConversation({ messages, currentUserId }: MessageConversationProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8" data-testid="conversation-empty">
        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" data-testid="message-conversation">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex",
            msg.senderId === currentUserId ? "justify-end" : "justify-start"
          )}
          data-testid="message-bubble"
        >
          <div
            className={cn(
              "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
              msg.senderId === currentUserId
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p>{msg.body}</p>
            <p className="mt-1 text-[10px] opacity-70">{msg.sentAt}</p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
