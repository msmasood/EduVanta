"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/data-table";
import { getRowInitials } from "@/lib/table";
import type { Teacher } from "@/types/teacher";
import { teacherStatusToVariant } from "../utils/teacher-mappers";

interface TeacherProfileHeaderProps {
  teacher: Teacher;
  departmentName?: string;
}

export function TeacherProfileHeader({
  teacher,
  departmentName,
}: TeacherProfileHeaderProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const initials = getRowInitials(`${teacher.firstName} ${teacher.lastName}`);

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      data-testid="teacher-profile-header"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {teacher.profileImageUrl ? (
          <Image
            src={teacher.profileImageUrl}
            alt={`${teacher.firstName} ${teacher.lastName}`}
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
            {teacher.firstName} {teacher.lastName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {teacher.employeeCode}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={teacherStatusToVariant(teacher.status)}
              label={teacher.status}
            />
            {(departmentName || teacher.designation) && (
              <span className="text-xs text-muted-foreground">
                {[teacher.designation, departmentName].filter(Boolean).join(" · ")}
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
          router.push(`/${locale}/teachers/${teacher.id}/edit`)
        }
      >
        <Pencil className="me-1.5 size-4" aria-hidden />
        Edit
      </Button>
    </div>
  );
}
