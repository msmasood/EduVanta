"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/data-table";
import type { LinkedStudentRow } from "../utils/guardian-mappers";
import { studentStatusToVariant } from "@/features/students/utils/student-mappers";
import type { StudentStatus } from "@/types/student";

interface GuardianStudentLinksTableProps {
  linkedStudents: LinkedStudentRow[];
  locale?: string;
}

export function GuardianStudentLinksTable({
  linkedStudents,
  locale = "en",
}: GuardianStudentLinksTableProps) {
  if (linkedStudents.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No linked students.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-start font-medium text-muted-foreground">
              Student
            </th>
            <th className="px-4 py-3 text-start font-medium text-muted-foreground">
              Admission No.
            </th>
            <th className="px-4 py-3 text-start font-medium text-muted-foreground">
              Class / Section
            </th>
            <th className="px-4 py-3 text-start font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-start font-medium text-muted-foreground">
              Primary
            </th>
            <th className="px-4 py-3 text-start font-medium text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {linkedStudents.map((student) => {
            const statusVariant = studentStatusToVariant(student.status as StudentStatus);
            return (
              <tr key={student.studentId} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{student.fullName}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {student.admissionNumber}
                </td>
                <td className="px-4 py-3">
                  {student.className}
                  {student.sectionName ? ` / ${student.sectionName}` : ""}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={statusVariant} label={student.status} />
                </td>
                <td className="px-4 py-3">
                  {student.isPrimary ? (
                    <Badge variant="outline" className="text-xs">
                      Primary
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/students/${student.studentId}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" aria-hidden />
                    View Student
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
