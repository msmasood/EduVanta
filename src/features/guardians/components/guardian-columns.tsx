"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, UserX, UserCheck, Trash2, MoreHorizontal } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import type { GuardianTableRow } from "../utils/guardian-mappers";

// ─── Per-row actions cell ─────────────────────────────────────────────────────

function GuardianRowActions({
  row,
  locale,
  onDelete,
}: {
  row: GuardianTableRow;
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
        <DropdownMenuItem onClick={() => router.push(`/guardians/${row.id}`)}>        
          <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/guardians/${row.id}/edit`)}>        
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

// ─── Column definitions ───────────────────────────────────────────────────────

export function useGuardianColumns(
  onDelete: (id: string) => void
): ColumnDef<GuardianTableRow>[] {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Guardian" />,
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.fullName}
          subtitle={row.original.email || row.original.phone}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "relationLabel",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Relationship" />,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.relationLabel}</span>
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.original.relation === filterValue;
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.phone || "—"}</span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.email || "—"}</span>
      ),
    },
    {
      accessorKey: "linkedStudentCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Students" />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="tabular-nums">
          {row.original.linkedStudentCount}
        </Badge>
      ),
    },
    {
      accessorKey: "portalAccess",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Portal" />,
      cell: ({ row }) => (
        <Badge
          variant={row.original.portalAccess ? "default" : "outline"}
          className="text-xs"
        >
          {row.original.portalAccess ? "Enabled" : "Disabled"}
        </Badge>
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return String(row.original.portalAccess) === filterValue;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge status={row.original.statusVariant} label={row.original.status} />
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.original.status === filterValue;
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <GuardianRowActions row={row.original} locale={locale} onDelete={onDelete} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

// ─── Filter configs ───────────────────────────────────────────────────────────

export const GUARDIAN_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    columnId: "relationLabel",
    title: "Relationship",
    options: [
      { value: "father", label: "Father" },
      { value: "mother", label: "Mother" },
      { value: "brother", label: "Brother" },
      { value: "sister", label: "Sister" },
      { value: "uncle", label: "Uncle" },
      { value: "aunt", label: "Aunt" },
      { value: "grandparent", label: "Grandparent" },
      { value: "legal-guardian", label: "Legal Guardian" },
      { value: "other", label: "Other" },
    ],
  },
];
