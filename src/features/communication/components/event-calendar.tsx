"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { EventRow } from "../utils/communication-mappers";

// FullCalendar must be dynamically imported (browser-only)
const FullCalendarComponent = dynamic(
  () =>
    Promise.all([
      import("@fullcalendar/react"),
      import("@fullcalendar/daygrid"),
    ]).then(([{ default: FullCalendar }, { default: dayGridPlugin }]) => {
      function CalendarInner({
        events,
        direction,
        onEventClick,
      }: {
        events: EventRow[];
        direction: "ltr" | "rtl";
        onEventClick: (id: string) => void;
      }) {
        const fcEvents = events.map((e) => ({
          id: e.id,
          title: e.title,
          start: e.startDateRaw,
          end: e.endDateRaw,
          allDay: e.isAllDay,
        }));
        return (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={fcEvents}
            direction={direction}
            eventClick={(info) => onEventClick(info.event.id)}
            height="auto"
          />
        );
      }
      return CalendarInner;
    }),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" /> }
);

interface EventCalendarProps {
  events: EventRow[];
  direction?: "ltr" | "rtl";
  onEventClick: (id: string) => void;
}

export function EventCalendar({ events, direction = "ltr", onEventClick }: EventCalendarProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm" data-testid="event-calendar">
      <FullCalendarComponent
        events={events}
        direction={direction}
        onEventClick={onEventClick}
      />
    </div>
  );
}
