"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventStatusBadge } from "./communication-badges";
import type { EventRow } from "../utils/communication-mappers";

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event?: EventRow;
}

export function EventDetailDialog({ open, onOpenChange, event }: EventDetailDialogProps) {
  if (!event) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="event-detail-dialog">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <EventStatusBadge status={event.status} />
            <span className="text-muted-foreground capitalize">{event.eventType}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="font-medium">{event.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="font-medium">{event.endDate}</p>
            </div>
          </div>
          {event.location !== "—" && (
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">{event.location}</p>
            </div>
          )}
          {event.description && (
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p>{event.description}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Audience</p>
            <p className="capitalize">{event.audience.join(", ")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
