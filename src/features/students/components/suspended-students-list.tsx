"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, UserCheck } from "lucide-react";
import { toast } from "sonner";

import {
  DataTable,
  AvatarCell,
  DataTableColumnHeader,
  ConfirmDialog,
  EmptyTableState,
} from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { StudentTableRow } from "../utils/student-mappers";
import { formatDate } from "@/lib/dates";

interface SuspendedStudentsListProps {
  rows: StudentTableRow[];
}

export function SuspendedStudentsList({ rows }: SuspendedStudentsListProps) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const router = useRouter();
  const [reactivateTarget, setReactivateTarget] =
    React.useState<StudentTableRow | null>(null);

  const columns: ColumnDef<StudentTableRow>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.fullName}
          subtitle={row.original.admissionNumber}
          avatarUrl={row.original.profileImageUrl}
        />
      ),
    },
    {
      accessorKey: "rollNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Roll No." />
      ),
    },
    {
      accessorKey: "className",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
    },
    {
      accessorKey: "sectionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Section" />
      ),
    },
    {
      accessorKey: "admissionDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Admission Date" />
      ),
      cell: ({ row }) => formatDate(row.original.admissionDate),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Row actions"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/students/${row.original.id}`)
              }
            >
              <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setReactivateTarget(row.original)}
            >
              <UserCheck className="me-2 size-4 text-muted-foreground" aria-hidden />
              Reactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (rows.length === 0) {
    return (
      <EmptyTableState
        title="No suspended students"
        description="There are currently no suspended students."
      />
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        defaultPageSize={10}
        emptyTitle="No suspended students"
        emptyDescription="There are currently no suspended students."
      />

      <ConfirmDialog
        open={!!reactivateTarget}
        onOpenChange={(open) => !open && setReactivateTarget(null)}
        title="Reactivate Student"
        description={`Reactivate ${reactivateTarget?.fullName}?`}
        onConfirm={() => {
          toast.success(`${reactivateTarget?.fullName} reactivated (mock).`);
          setReactivateTarget(null);
        }}
      />
    </>
  );
}
