"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable, TableSkeleton, DataTableColumnHeader, StatusBadge, ConfirmDialog } from "@/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SelectField, FormActions } from "@/components/forms";
import { TextField } from "@/components/forms";
import { leaveTypeSchema, type LeaveTypeFormValues } from "@/lib/validations/employees";
import { useLeaveTypes } from "@/hooks/queries/use-leaves";
import type { LeaveType } from "@/types/leaves";

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (lt: LeaveType) => void,
  onDelete: (id: string) => void
): ColumnDef<LeaveType>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "totalDays",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Max Days" />,
    },
    {
      accessorKey: "isPaid",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <Badge variant={row.original.isPaid ? "default" : "secondary"}>
          {row.original.isPaid ? "Paid" : "Unpaid"}
        </Badge>
      ),
    },
    {
      accessorKey: "applicableTo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Applicable To" />,
      cell: ({ row }) => row.original.applicableTo.join(", "),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Leave type form ──────────────────────────────────────────────────────────

function LeaveTypeFormDialog({
  open,
  onOpenChange,
  leaveType,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  leaveType?: LeaveType;
  onSave: () => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      name: leaveType?.name ?? "",
      totalDays: leaveType?.totalDays ?? 1,
      isPaid: leaveType?.isPaid ?? true,
      applicableTo: leaveType?.applicableTo ?? ["employee"],
    },
  });

  React.useEffect(() => {
    if (leaveType) {
      reset({
        name: leaveType.name,
        totalDays: leaveType.totalDays,
        isPaid: leaveType.isPaid,
        applicableTo: leaveType.applicableTo,
      });
    } else {
      reset({ name: "", totalDays: 1, isPaid: true, applicableTo: ["employee"] });
    }
  }, [leaveType, reset]);

  const onSubmit = async (_values: LeaveTypeFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{leaveType ? "Edit Leave Type" : "Add Leave Type"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Name" required />
          <TextField
            control={control}
            name="totalDays"
            label="Max Days"
            type="number"
            required
          />
          <SelectField
            control={control}
            name="isPaid"
            label="Type"
            options={[
              { label: "Paid", value: "true" },
              { label: "Unpaid", value: "false" },
            ]}
          />
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
            submitLabel={leaveType ? "Save Changes" : "Add Leave Type"}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LeaveTypesManager() {
  const leaveTypesQuery = useLeaveTypes();
  const types = leaveTypesQuery.data?.data ?? [];

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<LeaveType | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const handleEdit = (lt: LeaveType) => {
    setEditingType(lt);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingType(undefined);
    setFormOpen(true);
  };

  const handleSave = () => {
    toast.success(editingType ? "Leave type updated." : "Leave type created.");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Leave type deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    []
  );

  if (leaveTypesQuery.isLoading) {
    return (
      <div data-testid="leave-types-manager">
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="leave-types-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leave Types</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure leave types and entitlements.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden />
          Add Leave Type
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={types}
        defaultPageSize={10}
        emptyTitle="No leave types"
        emptyDescription="Add your first leave type using the button above."
      />

      <LeaveTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        leaveType={editingType}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Leave Type"
        description="Delete this leave type? This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
