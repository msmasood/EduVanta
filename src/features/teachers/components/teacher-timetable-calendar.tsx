"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { CalendarEvent } from "../utils/teacher-mappers";
import { TableSkeleton } from "@/components/data-table";

// Dynamically import FullCalendar with ssr: false to avoid SSR crash
const FullCalendarWrapper = dynamic(
  () => import("./teacher-timetable-calendar-inner"),
  { ssr: false, loading: () => <TableSkeleton columns={7} rows={8} /> }
);

interface TeacherTimetableCalendarProps {
  events: CalendarEvent[];
  locale?: string;
}

export function TeacherTimetableCalendar({
  events,
  locale = "en",
}: TeacherTimetableCalendarProps) {
  return (
    <div
      className="min-h-[400px] overflow-x-auto rounded-xl border bg-card p-4 shadow-sm"
      data-testid="timetable-calendar"
    >
      <FullCalendarWrapper events={events} locale={locale} />
    </div>
  );
}
