"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckSquare, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_STATUS_OPTIONS } from "../utils/attendance-form-options";

interface AttendanceBulkActionsProps {
  selectedIds: string[];
  onBulkUpdate: (status: string, ids: string[]) => void;
  onClearSelection: () => void;
}

export function AttendanceBulkActions({
  selectedIds,
  onBulkUpdate,
  onClearSelection,
}: AttendanceBulkActionsProps) {
  const [bulkStatus, setBulkStatus] = React.useState("");

  if (selectedIds.length === 0) return null;

  function handleApply() {
    if (!bulkStatus) {
      toast.error("Please select a status to apply.");
      return;
    }
    onBulkUpdate(bulkStatus, selectedIds);
    toast.success(`Bulk updated ${selectedIds.length} record(s) to ${bulkStatus}.`);
    setBulkStatus("");
    onClearSelection();
  }

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2"
      data-testid="attendance-bulk-actions"
    >
      <CheckSquare className="size-4 text-primary" aria-hidden />
      <span className="text-sm font-medium">
        {selectedIds.length} record{selectedIds.length !== 1 ? "s" : ""} selected
      </span>

      <div className="flex items-center gap-2">
        <Select value={bulkStatus || "_none"} onValueChange={(v: string | null) => setBulkStatus(!v || v === "_none" ? "" : v)}>
          <SelectTrigger className="h-8 w-32 text-xs" data-testid="bulk-status-select">
            <SelectValue placeholder="Set status…" />
          </SelectTrigger>
          <SelectContent>
            {ATTENDANCE_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 text-xs" onClick={handleApply}>
          Apply
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="ms-auto h-8 gap-1 text-xs"
        onClick={onClearSelection}
      >
        <X className="size-3.5" />
        Deselect
      </Button>
    </div>
  );
}
