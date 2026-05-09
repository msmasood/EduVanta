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
import { TextField, FormActions } from "@/components/forms";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { roleFormSchema, type RoleFormValues } from "@/lib/validations/settings";
import type { RoleRow } from "../utils/settings-mappers";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role?: RoleRow;
  onSave: (values: RoleFormValues, isEdit: boolean) => void;
}

const DEFAULT_VALUES: RoleFormValues = {
  name: "",
  description: "",
  isActive: true,
};

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSave,
}: RoleFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!role;

  const { control, handleSubmit, reset, watch, setValue } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) {
      if (role) {
        reset({
          name: role.name,
          description: role.description,
          isActive: role.isActive,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [open, role, reset]);

  const isActive = watch("isActive");

  const onSubmit = async (values: RoleFormValues) => {
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
      <DialogContent data-testid="role-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Add Role"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="role-form"
          noValidate
        >
          <TextField
            control={control}
            name="name"
            label="Role Name"
            placeholder="e.g. Librarian"
            required
          />

          <TextField
            control={control}
            name="description"
            label="Description"
            placeholder="Brief description of this role"
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="role-active" className="text-sm font-medium">
                Active
              </Label>
              <p className="text-xs text-muted-foreground">Enable this role for assignment.</p>
            </div>
            <Switch
              id="role-active"
              checked={isActive}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
          </div>

          <FormActions
            isLoading={isLoading}
            submitLabel={isEdit ? "Save Changes" : "Create Role"}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
