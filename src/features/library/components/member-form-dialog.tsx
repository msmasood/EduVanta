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
import { TextField, SelectField, TextareaField, FormActions } from "@/components/forms";
import { libraryMemberFormSchema, type LibraryMemberFormValues } from "@/lib/validations/library";
import { MEMBER_TYPE_OPTIONS, MEMBER_STATUS_OPTIONS } from "../utils/library-form-options";
import type { MemberRow } from "../utils/library-mappers";

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  member?: MemberRow;
  onSave: (values: LibraryMemberFormValues, isEdit: boolean) => void;
}

const today = new Date().toISOString().slice(0, 10);

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
  onSave,
}: MemberFormDialogProps) {
  const isEdit = !!member;
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<LibraryMemberFormValues>({
    resolver: zodResolver(libraryMemberFormSchema),
    defaultValues: {
      memberType: "student",
      linkedEntityId: "",
      membershipNumber: "",
      joinedDate: today,
      maxBooksAllowed: 3,
      status: "active",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (member) {
        reset({
          memberType: member.memberType as "student" | "teacher" | "employee",
          linkedEntityId: "",
          membershipNumber: member.membershipNumber,
          joinedDate: member.joinedDateRaw ?? today,
          maxBooksAllowed: 3,
          status: member.status as "active" | "inactive",
          notes: "",
        });
      } else {
        reset({
          memberType: "student",
          linkedEntityId: "",
          membershipNumber: "",
          joinedDate: today,
          maxBooksAllowed: 3,
          status: "active",
          notes: "",
        });
      }
    }
  }, [open, member, reset]);

  const onSubmit = async (values: LibraryMemberFormValues) => {
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
      <DialogContent className="max-w-lg" data-testid="member-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Member" : "Add Member"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="member-form"
          noValidate
        >
          <SelectField
            control={control}
            name="memberType"
            label="Member Type"
            options={[...MEMBER_TYPE_OPTIONS]}
            required
          />
          <TextField
            control={control}
            name="linkedEntityId"
            label="Linked Entity ID"
            placeholder="e.g. student-001"
            required
          />
          <TextField
            control={control}
            name="membershipNumber"
            label="Membership Number"
            placeholder="e.g. LIB-S-001"
            required
          />
          <TextField
            control={control}
            name="joinedDate"
            label="Joined Date"
            type="date"
            required
          />
          <TextField
            control={control}
            name="maxBooksAllowed"
            label="Max Books Allowed"
            type="number"
            placeholder="3"
            required
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={[...MEMBER_STATUS_OPTIONS]}
            required
          />
          <TextareaField
            control={control}
            name="notes"
            label="Notes"
            placeholder="Optional notes"
            rows={2}
          />
          <FormActions
            isLoading={isLoading}
            submitLabel={isEdit ? "Save Changes" : "Add Member"}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
