"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Printer } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader, ActionMenu } from "@/components/data-table";
import { CertificateStatusBadge } from "./certificate-status-badge";
import type { CertificateRecordRow } from "../utils/certificate-mappers";
import type { FilterConfig } from "@/components/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const CERTIFICATE_RECORD_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Issued", value: "issued" },
      { label: "Draft", value: "draft" },
      { label: "Revoked", value: "revoked" },
      { label: "Expired", value: "expired" },
    ],
  },
  {
    columnId: "templateType",
    title: "Template",
    options: [
      { label: "Bonafide", value: "bonafide" },
      { label: "Transfer", value: "transfer" },
      { label: "Character", value: "character" },
      { label: "Completion", value: "completion" },
      { label: "Attendance", value: "attendance" },
      { label: "Achievement", value: "achievement" },
      { label: "Exam Result", value: "examResult" },
    ],
  },
];

// ─── Column builder ───────────────────────────────────────────────────────────

export function buildCertificateRecordColumns(
  onLoad: (row: CertificateRecordRow) => void,
  onDelete: (id: string) => void
): ColumnDef<CertificateRecordRow>[] {
  return [
    {
      accessorKey: "certificateNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Certificate ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.certificateNumber}</span>
      ),
    },
    {
      accessorKey: "templateName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Template" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.templateName}</span>
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
      cell: ({ row }) => (
        <div className="min-w-[140px]">
          <p className="text-sm font-medium">{row.original.studentName}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {row.original.admissionNumber}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "className",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }) => <span className="text-sm">{row.original.className}</span>,
    },
    {
      accessorKey: "issueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Issue Date" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.issueDate}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <CertificateStatusBadge status={row.original.status} />,
      filterFn: (row, columnId, value: string[]) =>
        value.length === 0 || value.includes(row.getValue(columnId)),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <ActionMenu
          onView={() => onLoad(row.original)}
          onDelete={() => onDelete(row.original.id)}
          extraItems={
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="me-2 size-4 text-muted-foreground" aria-hidden />
                Print
              </DropdownMenuItem>
            </>
          }
        />
      ),
      enableSorting: false,
    },
  ];
}
