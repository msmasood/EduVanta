"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextField, SelectField, TextareaField, FormActions } from "@/components/forms";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { eventFormSchema, type EventFormValues } from "@/lib/validations/communication";
import {
  EVENT_TYPE_OPTIONS,
  EVENT_STATUS_OPTIONS,
  NOTICE_AUDIENCE_OPTIONS,
} from "../utils/communication-form-options";
import type { EventRow } from "../utils/communication-mappers";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event?: EventRow;
  onSave: (values: EventFormValues, isEdit: boolean) => void;
}

const DEFAULT_VALUES: EventFormValues = {
  title: "",
  eventType: "academic",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "",
  audience: ["all"],
  description: "",
  status: "upcoming",
};

export function EventFormDialog({ open, onOpenChange, event, onSave }: EventFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!event;

  const { control, handleSubmit, reset } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) {
      if (event) {
        reset({
          title: event.title,
          eventType: event.eventType as EventFormValues["eventType"],
          startDate: event.startDateRaw,
          endDate: event.endDateRaw,
          location: event.location === "—" ? "" : event.location,
          audience: event.audience as EventFormValues["audience"],
          description: event.description,
          status: event.status,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [open, event, reset]);

  const onSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave(values, isEdit);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="event-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField control={control} name="title" label="Title" placeholder="Event title" required />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              control={control}
              name="eventType"
              label="Event Type"
              options={EVENT_TYPE_OPTIONS}
              placeholder="Select type"
              required
            />
            <SelectField
              control={control}
              name="status"
              label="Status"
              options={EVENT_STATUS_OPTIONS}
              placeholder="Select status"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField control={control} name="startDate" label="Start Date" placeholder="YYYY-MM-DD" required />
            <TextField control={control} name="endDate" label="End Date" placeholder="YYYY-MM-DD (optional)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField control={control} name="startTime" label="Start Time" placeholder="HH:MM (optional)" />
            <TextField control={control} name="endTime" label="End Time" placeholder="HH:MM (optional)" />
          </div>
          <TextField control={control} name="location" label="Location" placeholder="Venue (optional)" />
          <TextareaField control={control} name="description" label="Description" placeholder="Event details..." />
          <div>
            <Label className="text-sm font-medium">Audience</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              <Controller
                control={control}
                name="audience"
                render={({ field }) => (
                  <>
                    {NOTICE_AUDIENCE_OPTIONS.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(opt.value as EventFormValues["audience"][number])}
                          onCheckedChange={(checked) => {
                            const current = field.value ?? [];
                            if (checked) {
                              field.onChange([...current, opt.value]);
                            } else {
                              field.onChange(current.filter((v) => v !== opt.value));
                            }
                          }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
