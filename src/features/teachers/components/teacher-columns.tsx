"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, UserCheck, UserX, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import {
  AvatarCell,
  DataTableColumnHeader,
  StatusBadge,
  type FilterConfig,
} from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeacherTableRow } from "../utils/teacher-mappers";

// ─── Row actions ──────────────────────────────────────────────────────────────

function TeacherRowActions({
  row,
  locale,
  onDelete,
}: {
  row: TeacherTableRow;
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
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => router.push(`/teachers/${row.id}`)}>        
          <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/teachers/${row.id}/edit`)}>        
          <Pencil className="me-2 size-4 text-muted-foreground" aria-hidden />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          {row.status === "inactive" ? (
            <>
              <UserCheck className="me-2 size-4 text-muted-foreground" aria-hidden />
              Activate
            </>
          ) : (
            <>
              <UserX className="me-2 size-4 text-muted-foreground" aria-hidden />
              Deactivate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.id)}>
          <Trash2 className="me-2 size-4" aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

export function useTeacherColumns(
  onDelete: (id: string) => void
): ColumnDef<TeacherTableRow>[] {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teacher" />
      ),
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.fullName}
          subtitle={row.original.employeeCode}
          avatarUrl={row.original.profileImageUrl}
        />
      ),
      filterFn: (row, _columnId, filterValue: string) => {
        const q = filterValue.toLowerCase();
        return (
          row.original.fullName.toLowerCase().includes(q) ||
          row.original.employeeCode.toLowerCase().includes(q) ||
          row.original.email.toLowerCase().includes(q)
        );
      },
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "subjectNames",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subjects" />
      ),
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[160px]">
          {row.original.subjectNames.join(", ") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "qualification",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Qualification" />
      ),
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[140px]">{row.original.qualification}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
    },
    {
      accessorKey: "joiningDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Joining Date" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.joiningDate}</span>
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
      filterFn: (row, _columnId, filterValue: string) =>
        row.original.status === filterValue,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TeacherRowActions
          row={row.original}
          locale={locale}
          onDelete={onDelete}
        />
      ),
    },
  ];
}

// ─── Filter configs ───────────────────────────────────────────────────────────

export const TEACHER_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "On Leave", value: "on-leave" },
    ],
  },
];
