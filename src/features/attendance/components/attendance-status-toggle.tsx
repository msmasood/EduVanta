"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import { ATTENDANCE_STATUS_OPTIONS } from "../utils/attendance-form-options";

interface AttendanceStatusToggleProps {
  recordId: string;
  currentStatus: string;
  entityName: string;
  onStatusChange?: (recordId: string, newStatus: string) => void;
  disabled?: boolean;
}

export function AttendanceStatusToggle({
  recordId,
  currentStatus,
  entityName,
  onStatusChange,
  disabled = false,
}: AttendanceStatusToggleProps) {
  const [optimisticStatus, setOptimisticStatus] = React.useState(currentStatus);

  function handleChange(newStatus: string | null) {
    if (!newStatus) return;
    setOptimisticStatus(newStatus);
    onStatusChange?.(recordId, newStatus);
    toast.success(`Updated ${entityName} status to ${newStatus}.`);
  }

  return (
    <div
      className="flex items-center gap-2"
      data-testid="attendance-status-toggle"
    >
      <AttendanceStatusBadge status={optimisticStatus} />
      <Select
        value={optimisticStatus}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-7 w-28 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ATTENDANCE_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
