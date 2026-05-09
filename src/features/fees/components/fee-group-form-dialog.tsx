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
import { TextField, TextareaField, SelectField, FormActions } from "@/components/forms";
import { feeGroupFormSchema, type FeeGroupFormValues } from "@/lib/validations/fees";
import { FEE_STATUS_OPTIONS } from "../utils/fee-form-options";
import type { FeeGroup } from "@/types/fees";

interface FeeGroupFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  group?: FeeGroup;
  onSave: (values: FeeGroupFormValues, isEdit: boolean) => void;
}

/**
 * FeeGroupFormDialog — create or edit a fee group.
 * Note: existing FeeGroup mock type does not include code/status fields;
 * those are form-only and will default for existing groups.
 */
export function FeeGroupFormDialog({
  open,
  onOpenChange,
  group,
  onSave,
}: FeeGroupFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<FeeGroupFormValues>({
    resolver: zodResolver(feeGroupFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        code: "",
        description: group.description ?? "",
        status: "active",
      });
    } else {
      reset({ name: "", code: "", description: "", status: "active" });
    }
  }, [group, reset, open]);

  const onSubmit = async (values: FeeGroupFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!group);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{group ? "Edit Fee Group" : "Add Fee Group"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 pt-2"
        >
          <TextField control={control} name="name" label="Group Name" required />
          <TextField control={control} name="code" label="Code" required placeholder="e.g. TUITION" />
          <TextareaField control={control} name="description" label="Description" />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={FEE_STATUS_OPTIONS}
            required
          />
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
