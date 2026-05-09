"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TableSkeleton } from "@/components/data-table";
import { GuardianProfileHeader, GuardianProfileTabs, mapLinkedStudentsToRows } from "@/features/guardians";
import { useGuardian, useGuardianLinks } from "@/hooks/queries/use-guardians";
import { useStudents } from "@/hooks/queries/use-students";
import { useClasses, useSections } from "@/hooks/queries/use-academic";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function GuardianDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { locale, id } = resolvedParams;

  const guardianQuery = useGuardian(id);
  const linksQuery = useGuardianLinks(id);
  const studentsQuery = useStudents();
  const classesQuery = useClasses();
  const sectionsQuery = useSections();

  const isLoading =
    guardianQuery.isLoading ||
    linksQuery.isLoading ||
    studentsQuery.isLoading ||
    classesQuery.isLoading ||
    sectionsQuery.isLoading;

  const linkedStudents = React.useMemo(() => {
    if (
      !linksQuery.data?.data ||
      !studentsQuery.data?.data ||
      !classesQuery.data?.data ||
      !sectionsQuery.data?.data
    ) {
      return [];
    }
    return mapLinkedStudentsToRows(
      linksQuery.data.data,
      studentsQuery.data.data,
      classesQuery.data.data,
      sectionsQuery.data.data
    );
  }, [linksQuery.data, studentsQuery.data, classesQuery.data, sectionsQuery.data]);

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="guardian-detail-page">
        <div className="h-32 animate-pulse rounded-xl border bg-muted" />
        <TableSkeleton columns={4} rows={4} />
      </div>
    );
  }

  const guardian = guardianQuery.data?.data;

  if (!guardian) {
    return (
      <div className="py-12 text-center" data-testid="guardian-detail-page">
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
    <div className="space-y-6" data-testid="guardian-detail-page">
      {/* Back link */}
      <Link
        href={`/${locale}/guardians`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Guardians
      </Link>

      {/* Profile header */}
      <GuardianProfileHeader guardian={guardian} locale={locale} />

      {/* Tabs */}
      <GuardianProfileTabs
        guardian={guardian}
        linkedStudents={linkedStudents}
        locale={locale}
      />
    </div>
  );
}
