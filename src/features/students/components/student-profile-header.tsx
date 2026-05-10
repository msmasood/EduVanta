"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/data-table";
import { getRowInitials } from "@/lib/table";
import type { Student } from "@/types/student";
import { studentStatusToVariant } from "../utils/student-mappers";

interface StudentProfileHeaderProps {
  student: Student;
  sectionName?: string;
  className_?: string;
}

export function StudentProfileHeader({
  student,
  className_,
  sectionName,
}: StudentProfileHeaderProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const initials = getRowInitials(`${student.firstName} ${student.lastName}`);

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      data-testid="student-profile-header"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {student.profileImageUrl ? (
          <Image
            src={student.profileImageUrl}
            alt={`${student.firstName} ${student.lastName}`}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {initials}
          </div>
        )}
        {/* Info */}
        <div>
          <h1 className="text-xl font-semibold">
            {student.firstName} {student.lastName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {student.admissionNumber}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={studentStatusToVariant(student.status)}
              label={student.status}
            />
            {(className_ || sectionName) && (
              <span className="text-xs text-muted-foreground">
                {[className_, sectionName].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Actions */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          router.push(`/students/${student.id}/edit`)
        }
      >
        <Pencil className="me-1.5 size-4" aria-hidden />
        Edit
      </Button>
    </div>
  );
}
