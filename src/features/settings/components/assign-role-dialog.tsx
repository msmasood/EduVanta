"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextField, SelectField, FormActions } from "@/components/forms";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { assignRoleSchema, type AssignRoleValues } from "@/lib/validations/settings";
import { ENTITY_TYPE_OPTIONS } from "../utils/settings-form-options";
import type { UserRoleRow } from "../utils/settings-mappers";
import type { Role } from "@/types/settings";

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignment?: UserRoleRow;
  roles: Role[];
  onSave: (values: AssignRoleValues, isEdit: boolean) => void;
}

const DEFAULT_VALUES: AssignRoleValues = {
  userId: "",
  roleId: "",
  entityType: "employee",
  isActive: true,
};

export function AssignRoleDialog({
  open,
  onOpenChange,
  assignment,
  roles,
  onSave,
}: AssignRoleDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!assignment;

  const roleOptions = roles
    .filter((r) => r.isActive)
    .map((r) => ({ label: r.name, value: r.id }));

  const { control, handleSubmit, reset, watch, setValue } = useForm<AssignRoleValues>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) {
      if (assignment) {
        reset({
          userId: assignment.userId,
          roleId: assignment.roleId,
          entityType: assignment.entityType as AssignRoleValues["entityType"],
          isActive: assignment.isActive,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [open, assignment, reset]);

  const isActive = watch("isActive");

  const onSubmit = async (values: AssignRoleValues) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      onSave(values, isEdit);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="assign-role-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role Assignment" : "Assign Role"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="assign-role-form"
          noValidate
        >
          <SelectField
            control={control}
            name="entityType"
            label="User Type"
            options={[...ENTITY_TYPE_OPTIONS]}
            required
          />

          <TextField
            control={control}
            name="userId"
            label="User ID"
            placeholder="e.g. emp-001 or teacher-001"
            required
          />

          <SelectField
            control={control}
            name="roleId"
            label="Role"
            options={roleOptions}
            placeholder="Select a role"
            required
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="assign-active" className="text-sm font-medium">
                Active
              </Label>
              <p className="text-xs text-muted-foreground">Enable this role assignment.</p>
            </div>
            <Switch
              id="assign-active"
              checked={isActive}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
          </div>

          <FormActions
            isLoading={isLoading}
            submitLabel={isEdit ? "Save Changes" : "Assign Role"}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
