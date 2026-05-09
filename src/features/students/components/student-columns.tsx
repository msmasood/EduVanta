"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, UserX, UserCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  AvatarCell,
  DataTableColumnHeader,
  StatusBadge,
  ConfirmDialog,
  type FilterConfig,
} from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { StudentTableRow } from "../utils/student-mappers";

// ─── Per-row actions cell ─────────────────────────────────────────────────────

function StudentRowActions({
  row,
  locale,
  onDelete,
}: {
  row: StudentTableRow;
  locale: string;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Row actions"
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => router.push(`/${locale}/students/${row.id}`)}>
          <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${locale}/students/${row.id}/edit`)}>
          <Pencil className="me-2 size-4 text-muted-foreground" aria-hidden />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          {row.status === "suspended" ? (
            <>
              <UserCheck className="me-2 size-4 text-muted-foreground" aria-hidden />
              Activate
            </>
          ) : (
            <>
              <UserX className="me-2 size-4 text-muted-foreground" aria-hidden />
              Suspend
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(row.id)}
        >
          <Trash2 className="me-2 size-4" aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Column definitions factory ───────────────────────────────────────────────

export function useStudentColumns(
  onDelete: (id: string) => void
): ColumnDef<StudentTableRow>[] {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return [
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
      filterFn: (row, _columnId, filterValue: string) => {
        const q = filterValue.toLowerCase();
        return (
          row.original.fullName.toLowerCase().includes(q) ||
          row.original.admissionNumber.toLowerCase().includes(q)
        );
      },
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
      accessorKey: "guardianName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Guardian" />
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.statusVariant}
          label={row.original.status}
        />
      ),
      filterFn: (row, _columnId, filterValue: string[]) =>
        filterValue.includes(row.original.status),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <StudentRowActions
          row={row.original}
          locale={locale}
          onDelete={onDelete}
        />
      ),
    },
  ];
}

export const STUDENT_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Suspended", value: "suspended" },
      { label: "Graduated", value: "graduated" },
      { label: "Transferred", value: "transferred" },
    ],
  },
];
