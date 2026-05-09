"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
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
import type { EmployeeTableRow } from "../utils/employee-mappers";

// ─── Row actions ──────────────────────────────────────────────────────────────

function EmployeeRowActions({
  row,
  locale,
  onDelete,
}: {
  row: EmployeeTableRow;
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
        <DropdownMenuItem onClick={() => router.push(`/${locale}/employees/${row.id}`)}>
          <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${locale}/employees/${row.id}/edit`)}>
          <Pencil className="me-2 size-4 text-muted-foreground" aria-hidden />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(row.id)}
        >
          <Trash2 className="me-2 size-4" aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

export function useEmployeeColumns(
  onDelete: (id: string) => void
): ColumnDef<EmployeeTableRow>[] {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.fullName}
          subtitle={row.original.employeeCode}
          avatarUrl={row.original.profileImageUrl}
        />
      ),
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    },
    {
      accessorKey: "designationName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Designation" />,
    },
    {
      accessorKey: "employmentTypeLabel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    },
    {
      accessorKey: "joiningDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joining Date" />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge status={row.original.statusVariant} label={row.original.status} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <EmployeeRowActions row={row.original} locale={locale} onDelete={onDelete} />
      ),
    },
  ];
}

// ─── Filter configs ───────────────────────────────────────────────────────────

export const EMPLOYEE_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "On Leave", value: "on-leave" },
      { label: "Terminated", value: "terminated" },
    ],
  },
  {
    columnId: "employmentTypeLabel",
    title: "Employment Type",
    options: [
      { label: "Full Time", value: "Full Time" },
      { label: "Part Time", value: "Part Time" },
      { label: "Contract", value: "Contract" },
      { label: "Intern", value: "Intern" },
    ],
  },
];
