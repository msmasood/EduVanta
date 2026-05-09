"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { exportRowsToCsv } from "@/lib/export";
import { mapGuardiansToRows, buildGuardianStatusSummary } from "../utils/guardian-mappers";
import { useGuardianColumns, GUARDIAN_FILTER_CONFIGS } from "./guardian-columns";
import { GuardianStatusCards } from "./guardian-status-summary";
import { useGuardians } from "@/hooks/queries/use-guardians";
import type { CsvColumn } from "@/lib/export";

// ─── CSV columns ──────────────────────────────────────────────────────────────

const CSV_COLUMNS: CsvColumn[] = [
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "relationLabel", header: "Relationship" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "linkedStudentCount", header: "Linked Students" },
  { accessorKey: "portalAccess", header: "Portal Access" },
  { accessorKey: "status", header: "Status" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function GuardianList() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const guardiansQuery = useGuardians();

  const rows = React.useMemo(() => {
    const guardians = guardiansQuery.data?.data ?? [];
    return mapGuardiansToRows(guardians);
  }, [guardiansQuery.data]);

  const summary = React.useMemo(
    () => buildGuardianStatusSummary(guardiansQuery.data?.data ?? []),
    [guardiansQuery.data]
  );

  const handleDelete = React.useCallback((id: string) => {
    toast.success(`Guardian ${id} deleted (mock).`);
  }, []);

  const columns = useGuardianColumns(handleDelete);

  if (guardiansQuery.isLoading) {
    return (
      <div className="space-y-6" data-testid="guardian-list">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border bg-muted" />
          ))}
        </div>
        <TableSkeleton columns={8} rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="guardian-list">
      {/* Summary cards */}
      <GuardianStatusCards summary={summary} />

      {/* Page header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Guardians</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage parent and guardian profiles, contacts, and student links.
          </p>
        </div>
        <Link
          href={`/${locale}/guardians/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <UserPlus className="size-4" aria-hidden />
          Add Guardian
        </Link>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={GUARDIAN_FILTER_CONFIGS}
        showExport
        onExport={() =>
          exportRowsToCsv(
            rows as unknown as Record<string, unknown>[],
            CSV_COLUMNS,
            "guardians-export.csv"
          )
        }
        emptyTitle="No guardians found"
        emptyDescription="Add your first guardian using the button above."
      />
    </div>
  );
}
