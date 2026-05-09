"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useUserRoles, useRoles } from "@/hooks/queries/use-settings";
import { mapUserRolesToRows, type UserRoleRow } from "../utils/settings-mappers";
import { buildUserRoleColumns, USER_ROLE_FILTER_CONFIGS } from "./assign-role-columns";
import { AssignRoleDialog } from "./assign-role-dialog";
import type { AssignRoleValues } from "@/lib/validations/settings";

export function AssignRolesManager() {
  const userRolesQuery = useUserRoles();
  const rolesQuery = useRoles();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editAssignment, setEditAssignment] = React.useState<UserRoleRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const rawUserRoles = userRolesQuery.data?.data ?? [];
  const rawRoles = rolesQuery.data?.data ?? [];
  const rows = React.useMemo(() => mapUserRolesToRows(rawUserRoles), [rawUserRoles]);

  const handleEdit = (row: UserRoleRow) => {
    setEditAssignment(row);
    setEditOpen(true);
  };

  const handleSave = (_values: AssignRoleValues, isEdit: boolean) => {
    toast.success(isEdit ? "Role assignment updated. (Mock)" : "Role assigned. (Mock)");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Role assignment removed. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildUserRoleColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (userRolesQuery.isLoading || rolesQuery.isLoading) {
    return (
      <div data-testid="assign-roles-manager">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="assign-roles-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Assign Roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assign roles to staff, teachers, and other users.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="assign-role-btn"
        >
          <Plus className="size-4" aria-hidden />
          Assign Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={USER_ROLE_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No role assignments found"
        emptyDescription="Assign a role to a user using the button above."
      />

      <AssignRoleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        roles={rawRoles}
        onSave={handleSave}
      />

      <AssignRoleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        assignment={editAssignment}
        roles={rawRoles}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Remove Role Assignment"
        description="Are you sure you want to remove this role assignment? The user will lose their associated access."
        onConfirm={handleDelete}
      />
    </div>
  );
}
