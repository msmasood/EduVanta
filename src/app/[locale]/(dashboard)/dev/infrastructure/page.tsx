"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ColumnDef } from "@tanstack/react-table";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable, type FilterConfig } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { StatusBadge } from "@/components/data-table/status-badge";
import { AvatarCell } from "@/components/data-table/avatar-cell";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { FormSection } from "@/components/forms/form-section";
import { TextField } from "@/components/forms/text-field";
import { SelectField } from "@/components/forms/select-field";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { FormActions } from "@/components/forms/form-actions";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Demo data ───────────────────────────────────────────────────────────────

interface DemoRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: StatusVariant;
}

const DEMO_DATA: DemoRow[] = [
  { id: "1", name: "Ahmed Al-Rashidi", email: "ahmed@school.edu", role: "Teacher", status: "active" },
  { id: "2", name: "Sara Johnson", email: "sara@school.edu", role: "Student", status: "pending" },
  { id: "3", name: "Mohammed Al-Farsi", email: "mfarsi@school.edu", role: "Admin", status: "active" },
  { id: "4", name: "Priya Sharma", email: "priya@school.edu", role: "Student", status: "suspended" },
  { id: "5", name: "Emily Chen", email: "emily@school.edu", role: "Teacher", status: "inactive" },
];

const COLUMNS: ColumnDef<DemoRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <AvatarCell name={row.original.name} subtitle={row.original.email} />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue(columnId)),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    ),
  },
];

const FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Suspended", value: "suspended" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

// ─── Demo form schema ─────────────────────────────────────────────────────────

const demoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  active: z.boolean().optional(),
});

type DemoFormValues = z.infer<typeof demoSchema>;

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" },
  { value: "guardian", label: "Guardian" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function DemoForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: { fullName: "", email: "", role: "", active: false },
  });

  const onSubmit = (data: DemoFormValues) => {
    // Demo: no-op (for E2E testing form validation)
    void data;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection
        title="Demo Form"
        description="Infrastructure demo — validates form fields for E2E testing."
      >
        <FormErrorSummary errors={errors} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="fullName"
            label="Full Name"
            placeholder="Enter full name"
            required
          />
          <TextField
            control={control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            required
          />
        </div>
        <SelectField
          control={control}
          name="role"
          label="Role"
          options={ROLE_OPTIONS}
          placeholder="Select a role"
          required
        />
        <CheckboxField
          control={control}
          name="active"
          label="Mark as active"
          description="Check this to set the record active on creation"
        />
        <FormActions isLoading={isSubmitting} />
      </FormSection>
    </form>
  );
}

export default function InfrastructurePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 p-6" data-testid="infrastructure-page">
        <div>
          <h1 className="text-2xl font-semibold">Infrastructure Dev Route</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Phase 9 — Data Table &amp; Form Infrastructure smoke test. Not linked
            from sidebar navigation.
          </p>
        </div>

        {/* DataTable demo */}
        <section aria-label="DataTable demo">
          <h2 className="mb-3 text-lg font-medium">DataTable</h2>
          <DataTable
            columns={COLUMNS}
            data={DEMO_DATA}
            filterConfigs={FILTER_CONFIGS}
            selectable
            defaultPageSize={5}
            emptyTitle="No demo rows"
          />
        </section>

        {/* Form demo */}
        <section aria-label="Form demo">
          <h2 className="mb-3 text-lg font-medium">Form Fields</h2>
          <DemoForm />
        </section>
      </div>
    </DashboardLayout>
  );
}
