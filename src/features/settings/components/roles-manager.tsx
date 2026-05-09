"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRoles } from "@/hooks/queries/use-settings";
import { mapRolesToRows, type RoleRow } from "../utils/settings-mappers";
import { buildRoleColumns, ROLE_FILTER_CONFIGS } from "./role-columns";
import { RoleFormDialog } from "./role-form-dialog";
import { RolePermissionMatrix } from "./role-permission-matrix";
import type { RoleFormValues } from "@/lib/validations/settings";
import type { Role } from "@/types/settings";

export function RolesManager() {
  const query = useRoles();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editRole, setEditRole] = React.useState<RoleRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [viewRole, setViewRole] = React.useState<Role | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const rawRoles: Role[] = query.data?.data ?? [];
  const rows = React.useMemo(() => mapRolesToRows(rawRoles), [rawRoles]);

  const handleEdit = (row: RoleRow) => {
    setEditRole(row);
    setEditOpen(true);
  };

  const handleView = (row: RoleRow) => {
    const role = rawRoles.find((r) => r.id === row.id);
    if (role) {
      setViewRole(role);
      setViewOpen(true);
    }
  };

  const handleSave = (_values: RoleFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Role updated. (Mock)" : "Role created. (Mock)");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Role deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildRoleColumns(handleEdit, (id) => setDeleteId(id), handleView),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (query.isLoading) {
    return (
      <div data-testid="roles-manager">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="roles-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define roles and their module-level access permissions.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="add-role-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={ROLE_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No roles found"
        emptyDescription="Create a role using the button above."
      />

      {/* Add Role Dialog */}
      <RoleFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
      />

      {/* Edit Role Dialog */}
      <RoleFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        role={editRole}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Role"
        description="Are you sure you want to delete this role? Users with this role will lose their access."
        onConfirm={handleDelete}
      />

      {/* Permissions Sheet */}
      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {viewRole?.name} — Permissions
            </SheetTitle>
          </SheetHeader>
          {viewRole && (
            <div className="mt-6">
              <p className="mb-4 text-sm text-muted-foreground">{viewRole.description}</p>
              <RolePermissionMatrix permissions={viewRole.permissions} readOnly />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
