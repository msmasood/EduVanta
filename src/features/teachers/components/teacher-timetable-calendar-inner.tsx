"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { CalendarEvent } from "../utils/teacher-mappers";

interface TeacherTimetableCalendarInnerProps {
  events: CalendarEvent[];
  locale?: string;
}

export default function TeacherTimetableCalendarInner({
  events,
  locale = "en",
}: TeacherTimetableCalendarInnerProps) {
  const direction = locale === "ar" || locale === "ur" ? "rtl" : "ltr";

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin]}
      initialView="timeGridWeek"
      direction={direction}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,dayGridMonth",
      }}
      events={events}
      height="auto"
      allDaySlot={false}
      slotMinTime="07:00:00"
      slotMaxTime="16:00:00"
      eventContent={(arg) => {
        const { subject, class: cls, room } = arg.event.extendedProps as {
          subject: string;
          class: string;
          room: string;
        };
        return (
          <div className="overflow-hidden p-0.5 text-xs leading-tight">
            <div className="font-semibold">{subject}</div>
            <div className="opacity-80">{cls}</div>
            {room && <div className="opacity-60">{room}</div>}
          </div>
        );
      }}
    />
  );
}
