"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GuardianForm } from "@/features/guardians";
import { useStudents } from "@/hooks/queries/use-students";
import type { SelectOption } from "@/types/common";

export default function AddGuardianPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const studentsQuery = useStudents();

  const studentOptions: SelectOption[] = React.useMemo(() => {
    const students = studentsQuery.data?.data ?? [];
    return students.map((s) => ({
      value: s.id,
      label: `${s.firstName} ${s.lastName} (${s.admissionNumber})`,
    }));
  }, [studentsQuery.data]);

  return (
    <div className="space-y-6" data-testid="add-guardian-page">
      {/* Back link + header */}
      <div>
        <Link
          href={`/${locale}/guardians`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Guardians
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Add New Guardian</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below to add a new guardian profile.
        </p>
      </div>

      {/* Form */}
      <GuardianForm
        mode="create"
        studentOptions={studentOptions}
      />
    </div>
  );
}
