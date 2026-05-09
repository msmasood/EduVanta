"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TableSkeleton } from "@/components/data-table";
import { GuardianForm } from "@/features/guardians";
import { useGuardian } from "@/hooks/queries/use-guardians";
import { useStudents } from "@/hooks/queries/use-students";
import type { GuardianFormValues } from "@/lib/validations/guardians";
import type { SelectOption } from "@/types/common";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function EditGuardianPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { locale, id } = resolvedParams;

  const guardianQuery = useGuardian(id);
  const studentsQuery = useStudents();

  const studentOptions: SelectOption[] = React.useMemo(() => {
    const students = studentsQuery.data?.data ?? [];
    return students.map((s) => ({
      value: s.id,
      label: `${s.firstName} ${s.lastName} (${s.admissionNumber})`,
    }));
  }, [studentsQuery.data]);

  const defaultValues = React.useMemo((): Partial<GuardianFormValues> | undefined => {
    const g = guardianQuery.data?.data;
    if (!g) return undefined;
    return {
      firstName: g.firstName,
      lastName: g.lastName,
      relation: g.relation,
      occupation: g.occupation ?? "",
      nationalId: g.nationalId ?? "",
      email: g.contact.email ?? "",
      phone: g.contact.phone ?? "",
      alternatePhone: g.contact.alternatePhone ?? "",
      addressLine1: g.address?.line1 ?? "",
      city: g.address?.city ?? "",
      country: g.address?.country ?? "",
      status: g.status ?? "active",
      isEmergencyContact: g.isEmergencyContact ?? false,
      portalAccess: g.portalAccess ?? false,
      linkedStudentIds: g.studentIds ?? [],
      primaryStudentId: g.studentIds?.[0] ?? "",
    };
  }, [guardianQuery.data]);

  const isLoading = guardianQuery.isLoading || studentsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="edit-guardian-page">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <TableSkeleton columns={2} rows={6} />
      </div>
    );
  }

  const guardian = guardianQuery.data?.data;

  if (!guardian) {
    return (
      <div className="py-12 text-center" data-testid="edit-guardian-page">
        <p className="text-muted-foreground">Guardian not found.</p>
        <Link
          href={`/${locale}/guardians`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Guardians
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="edit-guardian-page">
      {/* Back link + header */}
      <div>
        <Link
          href={`/${locale}/guardians/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to {guardian.firstName} {guardian.lastName}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">
          Edit Guardian — {guardian.firstName} {guardian.lastName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update guardian profile details below.
        </p>
      </div>

      {/* Form */}
      <GuardianForm
        mode="edit"
        defaultValues={defaultValues}
        studentOptions={studentOptions}
      />
    </div>
  );
}
