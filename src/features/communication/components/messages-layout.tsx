"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { TableSkeleton } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextField, FormActions } from "@/components/forms";
import { useUserThreads, useThreadMessages } from "@/hooks/queries/use-communication";
import { mapThreadsToRows, mapMessagesToRows, type ThreadRow, type MessageRow } from "../utils/communication-mappers";
import { computeThreadStats } from "../utils/communication-calculations";
import { MessageThreadList } from "./message-thread-list";
import { MessageConversation } from "./message-conversation";
import { MessageComposer } from "./message-composer";
import { MessageSummaryCards } from "./communication-summary-cards";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageFormSchema, type MessageFormValues } from "@/lib/validations/communication";

const CURRENT_USER = "teacher-001";

export function MessagesLayout() {
  const threadsQuery = useUserThreads(CURRENT_USER);
  const [localThreads, setLocalThreads] = React.useState<ThreadRow[]>([]);
  const [activeThreadId, setActiveThreadId] = React.useState<string | undefined>();
  const [localMessages, setLocalMessages] = React.useState<MessageRow[]>([]);
  const [composeOpen, setComposeOpen] = React.useState(false);

  const messagesQuery = useThreadMessages(activeThreadId ?? "");

  const rawThreads = threadsQuery.data?.data ?? [];

  React.useEffect(() => {
    if (!threadsQuery.isLoading) {
      const rows = mapThreadsToRows(rawThreads);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalThreads(rows);
      if (!activeThreadId && rows.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveThreadId(rows[0].id);
      }
    }
  }, [threadsQuery.isLoading, rawThreads, activeThreadId]);

  React.useEffect(() => {
    if (!messagesQuery.isLoading && activeThreadId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMessages(mapMessagesToRows(messagesQuery.data?.data ?? [], CURRENT_USER));
    }
  }, [messagesQuery.isLoading, messagesQuery.data, activeThreadId]);

  const stats = React.useMemo(() => computeThreadStats(rawThreads), [rawThreads]);

  const handleSendMessage = (body: string) => {
    const newMsg: MessageRow = {
      id: `msg-${Date.now()}`,
      threadId: activeThreadId ?? "",
      senderId: CURRENT_USER,
      body,
      sentAt: new Date().toLocaleDateString(),
      sentAtRaw: new Date().toISOString(),
      isRead: true,
      isMine: true,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setLocalThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId ? { ...t, lastMessageAt: newMsg.sentAt } : t
      )
    );
  };

  const { control, handleSubmit, reset } = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { recipientIds: [], body: "" },
  });

  const onComposeSend = (_values: MessageFormValues) => {
    toast.success("Message sent. (Mock)");
    reset();
    setComposeOpen(false);
  };

  const activeThread = localThreads.find((t) => t.id === activeThreadId);

  if (threadsQuery.isLoading) {
    return (
      <div data-testid="messages-layout">
        <TableSkeleton columns={3} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="messages-layout">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send and receive messages with staff, teachers, and guardians.
          </p>
        </div>
        <Button
          onClick={() => setComposeOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="compose-btn"
        >
          <Plus className="size-4" aria-hidden />
          Compose
        </Button>
      </div>

      <MessageSummaryCards stats={stats} />

      {/* Split panel */}
      <div className="flex min-h-[500px] overflow-hidden rounded-xl border bg-card shadow-sm flex-col sm:flex-row">
        {/* Thread list */}
        <div className="w-full sm:w-72 sm:shrink-0 border-b sm:border-b-0 sm:border-e overflow-y-auto">
          <div className="p-3 border-b">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Conversations
            </p>
          </div>
          <MessageThreadList
            threads={localThreads}
            activeThreadId={activeThreadId}
            onSelectThread={setActiveThreadId}
          />
        </div>

        {/* Conversation area */}
        <div className="flex flex-1 flex-col min-h-[300px]">
          {activeThread ? (
            <>
              <div className="border-b p-3">
                <p className="font-medium text-sm">{activeThread.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {activeThread.participants.join(", ")}
                </p>
              </div>
              <MessageConversation
                messages={localMessages}
                currentUserId={CURRENT_USER}
              />
              <MessageComposer onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center" data-testid="no-thread-selected">
              <p className="text-muted-foreground text-sm">Select a conversation to view messages.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-md" data-testid="compose-dialog">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onComposeSend)} className="space-y-4">
            <TextField
              control={control}
              name="recipientIds.0"
              label="Recipient ID"
              placeholder="e.g. teacher-001"
              required
            />
            <TextField
              control={control}
              name="subject"
              label="Subject"
              placeholder="Message subject (optional)"
            />
            <TextField
              control={control}
              name="body"
              label="Message"
              placeholder="Type your message..."
              required
            />
            <FormActions isLoading={false} showCancel onCancel={() => setComposeOpen(false)} />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
