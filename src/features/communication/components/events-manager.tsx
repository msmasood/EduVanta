"use client";

import * as React from "react";
import { Plus, LayoutList, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCalendarEvents } from "@/hooks/queries/use-communication";
import { mapEventsToRows, type EventRow } from "../utils/communication-mappers";
import { computeEventStats } from "../utils/communication-calculations";
import { EventFormDialog } from "./event-form-dialog";
import { EventDetailDialog } from "./event-detail-dialog";
import { EventSummaryCards } from "./communication-summary-cards";
import { EventCalendar } from "./event-calendar";
import { EventList } from "./event-list";
import type { EventFormValues } from "@/lib/validations/communication";

type ViewMode = "calendar" | "list";

interface EventsManagerProps {
  direction?: "ltr" | "rtl";
}

export function EventsManager({ direction = "ltr" }: EventsManagerProps) {
  const eventsQuery = useCalendarEvents();
  const [view, setView] = React.useState<ViewMode>("list");
  const [localEvents, setLocalEvents] = React.useState<EventRow[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editEvent, setEditEvent] = React.useState<EventRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewEvent, setViewEvent] = React.useState<EventRow | undefined>();
  const [viewOpen, setViewOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const rawEvents = eventsQuery.data?.data ?? [];

  React.useEffect(() => {
    if (!eventsQuery.isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalEvents(mapEventsToRows(rawEvents));
    }
  }, [eventsQuery.isLoading, rawEvents]);

  const stats = React.useMemo(() => computeEventStats(rawEvents), [rawEvents]);

  const handleView = (event: EventRow) => {
    setViewEvent(event);
    setViewOpen(true);
  };

  const handleCalendarEventClick = (id: string) => {
    const event = localEvents.find((e) => e.id === id);
    if (event) handleView(event);
  };

  const handleEdit = (event: EventRow) => {
    setEditEvent(event);
    setEditOpen(true);
  };

  const handleSave = (_values: EventFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Event updated. (Mock)" : "Event added. (Mock)");
    if (!isEdit) {
      const newRow: EventRow = {
        id: `evt-${Date.now()}`,
        title: _values.title,
        eventType: _values.eventType,
        startDate: _values.startDate,
        endDate: _values.endDate ?? _values.startDate,
        startDateRaw: _values.startDate,
        endDateRaw: _values.endDate ?? _values.startDate,
        location: _values.location ?? "—",
        audience: _values.audience,
        description: _values.description ?? "",
        status: _values.status,
        isAllDay: !_values.startTime,
      };
      setLocalEvents((prev) => [newRow, ...prev]);
    } else if (editEvent) {
      setLocalEvents((prev) =>
        prev.map((e) =>
          e.id === editEvent.id
            ? {
                ...e,
                title: _values.title,
                eventType: _values.eventType,
                startDate: _values.startDate,
                endDate: _values.endDate ?? _values.startDate,
                startDateRaw: _values.startDate,
                endDateRaw: _values.endDate ?? _values.startDate,
                location: _values.location ?? "—",
                audience: _values.audience,
                description: _values.description ?? "",
                status: _values.status,
              }
            : e
        )
      );
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      setLocalEvents((prev) => prev.filter((e) => e.id !== deleteId));
      toast.success("Event deleted. (Mock)");
      setDeleteId(null);
    }
  };

  if (eventsQuery.isLoading) {
    return (
      <div data-testid="events-manager">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="events-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage school events, holidays, and activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setView("list")}
            data-testid="events-list-btn"
          >
            <LayoutList className="size-4" aria-hidden />
            List
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setView("calendar")}
            data-testid="events-calendar-btn"
          >
            <CalendarDays className="size-4" aria-hidden />
            Calendar
          </Button>
          <Button
            onClick={() => setAddOpen(true)}
            size="sm"
            className="gap-1.5"
            data-testid="add-event-btn"
          >
            <Plus className="size-4" aria-hidden />
            Add Event
          </Button>
        </div>
      </div>

      <EventSummaryCards stats={stats} />

      {view === "calendar" ? (
        <EventCalendar
          events={localEvents}
          direction={direction}
          onEventClick={handleCalendarEventClick}
        />
      ) : (
        <EventList
          events={localEvents}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <EventFormDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleSave} />

      <EventFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        event={editEvent}
        onSave={handleSave}
      />

      <EventDetailDialog open={viewOpen} onOpenChange={setViewOpen} event={viewEvent} />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
