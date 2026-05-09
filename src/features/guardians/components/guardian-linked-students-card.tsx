"use client";

import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/data-table";
import type { LinkedStudentRow } from "../utils/guardian-mappers";
import { studentStatusToVariant } from "@/features/students/utils/student-mappers";
import type { StudentStatus } from "@/types/student";

interface GuardianLinkedStudentsCardProps {
  linkedStudents: LinkedStudentRow[];
  locale?: string;
}

export function GuardianLinkedStudentsCard({
  linkedStudents,
  locale = "en",
}: GuardianLinkedStudentsCardProps) {
  if (linkedStudents.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <GraduationCap className="mx-auto mb-3 size-10 text-muted-foreground/40" aria-hidden />
        <p className="text-sm font-medium">No Linked Students</p>
        <p className="mt-1 text-xs text-muted-foreground">
          No students have been linked to this guardian yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">
        Linked Students
        <Badge variant="secondary" className="ms-2">
          {linkedStudents.length}
        </Badge>
      </h3>
      <ul className="space-y-3">
        {linkedStudents.map((student) => {
          const statusVariant = studentStatusToVariant(student.status as StudentStatus);
          return (
            <li
              key={student.studentId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {student.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{student.fullName}</span>
                    {student.isPrimary && (
                      <Badge variant="outline" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {student.admissionNumber} · {student.className}
                    {student.sectionName ? ` / ${student.sectionName}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={statusVariant} label={student.status} />
                <Link
                  href={`/${locale}/students/${student.studentId}`}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={`View ${student.fullName}`}
                >
                  <ExternalLink className="size-3" aria-hidden />
                  View
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
