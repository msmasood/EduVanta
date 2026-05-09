"use client";

import * as React from "react";

import { StatusBadge } from "@/components/data-table";
import { mapAttendanceStatusToVariant, getAttendanceStatusLabel } from "../utils/attendance-mappers";

interface AttendanceStatusBadgeProps {
  status: string;
  label?: string;
}

export function AttendanceStatusBadge({ status, label }: AttendanceStatusBadgeProps) {
  const variant = mapAttendanceStatusToVariant(status);
  const displayLabel = label ?? getAttendanceStatusLabel(status);
  return <StatusBadge status={variant} label={displayLabel} />;
}
