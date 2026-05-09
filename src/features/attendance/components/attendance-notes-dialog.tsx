"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextareaField, FormActions } from "@/components/forms";
import { attendanceNotesSchema, type AttendanceNotesValues } from "@/lib/validations/attendance";

interface AttendanceNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordId: string;
  entityName: string;
  date: string;
  currentNotes?: string;
}

export function AttendanceNotesDialog({
  open,
  onOpenChange,
  recordId,
  entityName,
  date,
  currentNotes = "",
}: AttendanceNotesDialogProps) {
  const { control, handleSubmit, reset } = useForm<AttendanceNotesValues>({
    resolver: zodResolver(attendanceNotesSchema),
    defaultValues: { recordId, notes: currentNotes },
  });

  React.useEffect(() => {
    if (open) {
      reset({ recordId, notes: currentNotes });
    }
  }, [open, recordId, currentNotes, reset]);

  function onSubmit(_values: AttendanceNotesValues) {
    toast.success(`Notes saved for ${entityName} on ${date}.`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="attendance-notes-dialog">
        <DialogHeader>
          <DialogTitle>Attendance Notes</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add or update notes for {entityName} on {date}.
          </p>
          <TextareaField
            control={control}
            name="notes"
            label="Notes"
            placeholder="Add any relevant notes…"
            rows={4}
          />
          <FormActions
            isLoading={false}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
