"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_STATUS_OPTIONS } from "../utils/attendance-form-options";

export type AttendanceEntityType = "student" | "teacher" | "employee";

export interface AttendanceFilters {
  search: string;
  status: string;
  date: string;
  departmentId: string;
  classId: string;
}

interface AttendanceFilterBarProps {
  entityType: AttendanceEntityType;
  filters: AttendanceFilters;
  onFiltersChange: (filters: AttendanceFilters) => void;
  departmentOptions?: { label: string; value: string }[];
  classOptions?: { label: string; value: string }[];
}

const EMPTY_FILTERS: AttendanceFilters = {
  search: "",
  status: "",
  date: "",
  departmentId: "",
  classId: "",
};

export function AttendanceFilterBar({
  entityType,
  filters,
  onFiltersChange,
  departmentOptions = [],
  classOptions = [],
}: AttendanceFilterBarProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  function handleReset() {
    onFiltersChange(EMPTY_FILTERS);
  }

  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      data-testid="attendance-filter-bar"
    >
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          className="ps-9"
          placeholder={
            entityType === "student"
              ? "Search student…"
              : entityType === "teacher"
                ? "Search teacher…"
                : "Search employee…"
          }
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          data-testid="attendance-search-input"
        />
      </div>

      {/* Date */}
      <Input
        type="date"
        className="w-auto"
        value={filters.date}
        onChange={(e) => onFiltersChange({ ...filters, date: e.target.value })}
        data-testid="attendance-date-input"
      />

      {/* Status */}
      <Select
        value={filters.status || "_all"}
        onValueChange={(v: string | null) =>
          onFiltersChange({ ...filters, status: !v || v === "_all" ? "" : v })
        }
      >
        <SelectTrigger className="w-36" data-testid="attendance-status-filter">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">All statuses</SelectItem>
          {ATTENDANCE_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Department (teachers / employees) */}
      {(entityType === "teacher" || entityType === "employee") &&
        departmentOptions.length > 0 && (
          <Select
            value={filters.departmentId || "_all"}
            onValueChange={(v: string | null) =>
              onFiltersChange({ ...filters, departmentId: !v || v === "_all" ? "" : v })
            }
          >
            <SelectTrigger className="w-44" data-testid="attendance-dept-filter">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All departments</SelectItem>
              {departmentOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

      {/* Class (students) */}
      {entityType === "student" && classOptions.length > 0 && (
        <Select
          value={filters.classId || "_all"}
          onValueChange={(v: string | null) =>
            onFiltersChange({ ...filters, classId: !v || v === "_all" ? "" : v })
          }
        >
          <SelectTrigger className="w-36" data-testid="attendance-class-filter">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All classes</SelectItem>
            {classOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
