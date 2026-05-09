"use client";

import * as React from "react";
import { EventStatusBadge } from "./communication-badges";
import type { EventRow } from "../utils/communication-mappers";

interface EventListProps {
  events: EventRow[];
  onView: (event: EventRow) => void;
  onEdit: (event: EventRow) => void;
  onDelete: (id: string) => void;
}

export function EventList({ events, onView, onEdit, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center" data-testid="event-list-empty">
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="event-list">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
          data-testid="event-list-item"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">{event.title}</h3>
              <EventStatusBadge status={event.status} />
            </div>
            <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
              <span className="capitalize">{event.eventType}</span>
              <span>{event.startDate} – {event.endDate}</span>
              {event.location !== "—" && <span>{event.location}</span>}
            </div>
          </div>
          <div className="flex gap-2 ms-3 shrink-0">
            <button className="text-xs text-primary hover:underline" onClick={() => onView(event)}>
              View
            </button>
            <button className="text-xs text-primary hover:underline" onClick={() => onEdit(event)}>
              Edit
            </button>
            <button className="text-xs text-destructive hover:underline" onClick={() => onDelete(event.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
