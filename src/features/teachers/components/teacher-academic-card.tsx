"use client";

import { BookOpen, Building2, User } from "lucide-react";
import type { Teacher } from "@/types/teacher";

interface TeacherAcademicCardProps {
  teacher: Teacher;
  departmentName?: string;
  subjectNames?: string[];
}

export function TeacherAcademicCard({
  teacher,
  departmentName,
  subjectNames = [],
}: TeacherAcademicCardProps) {
  const rows = [
    { icon: Building2, label: "Department", value: departmentName ?? "—" },
    { icon: User, label: "Designation", value: teacher.designation || "—" },
    {
      icon: BookOpen,
      label: "Subjects",
      value: subjectNames.length > 0 ? subjectNames.join(", ") : "—",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">Academic Information</h3>
      <ul className="space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <li key={row.label} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="text-sm font-medium">{row.value}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
