"use client";

import { GraduationCap, Calendar, Tag, Hash } from "lucide-react";
import type { Student } from "@/types/student";
import { StatusBadge } from "@/components/data-table";
import { studentStatusToVariant } from "../utils/student-mappers";
import { formatDate } from "@/lib/dates";

interface StudentAcademicCardProps {
  student: Student;
  className_?: string;
  sectionName?: string;
  categoryName?: string;
}

export function StudentAcademicCard({
  student,
  className_,
  sectionName,
  categoryName,
}: StudentAcademicCardProps) {
  const rows = [
    { icon: Hash, label: "Admission No.", value: student.admissionNumber },
    { icon: Hash, label: "Roll Number", value: student.rollNumber },
    { icon: GraduationCap, label: "Class", value: className_ ?? student.classId },
    { icon: GraduationCap, label: "Section", value: sectionName ?? student.sectionId },
    { icon: Tag, label: "Category", value: categoryName ?? student.categoryId },
    {
      icon: Calendar,
      label: "Admission Date",
      value: student.admissionDate ? formatDate(student.admissionDate) : "—",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Academic Information</h3>
        <StatusBadge
          status={studentStatusToVariant(student.status)}
          label={student.status}
        />
      </div>
      <dl className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            <div>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
