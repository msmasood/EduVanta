"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MessageComposerProps {
  onSend: (body: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [body, setBody] = React.useState("");

  const handleSend = () => {
    if (!body.trim()) return;
    onSend(body.trim());
    setBody("");
    toast.success("Message sent. (Mock)");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t p-3" data-testid="message-composer">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send)"
        className="min-h-[60px] resize-none"
        disabled={disabled}
        data-testid="message-composer-input"
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={disabled || !body.trim()}
        className="shrink-0"
        data-testid="message-send-btn"
      >
        <Send className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
