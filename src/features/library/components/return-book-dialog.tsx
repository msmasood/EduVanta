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
import { returnBookFormSchema, type ReturnBookFormValues } from "@/lib/validations/library";
import { CONDITION_OPTIONS } from "../utils/library-form-options";
import type { IssueReturnRow } from "../utils/library-mappers";

interface ReturnBookDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  issue?: IssueReturnRow;
  issueOptions: { label: string; value: string }[];
  onSave: (values: ReturnBookFormValues) => void;
}

const today = new Date().toISOString().slice(0, 10);

export function ReturnBookDialog({
  open,
  onOpenChange,
  issue,
  issueOptions,
  onSave,
}: ReturnBookDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<ReturnBookFormValues>({
    resolver: zodResolver(returnBookFormSchema),
    defaultValues: {
      issueId: issue?.id ?? "",
      returnDate: today,
      condition: "good",
      fineAmount: issue?.fine ?? undefined,
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        issueId: issue?.id ?? "",
        returnDate: today,
        condition: "good",
        fineAmount: issue?.fine && issue.fine > 0 ? issue.fine : undefined,
        notes: "",
      });
    }
  }, [open, issue, reset]);

  const onSubmit = async (values: ReturnBookFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      onSave(values);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="return-book-dialog">
        <DialogHeader>
          <DialogTitle>Return Book</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="return-book-form"
          noValidate
        >
          <SelectField
            control={control}
            name="issueId"
            label="Issue Record"
            options={issueOptions}
            placeholder="Select an issue record"
            required
            disabled={!!issue}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              control={control}
              name="returnDate"
              label="Return Date"
              type="date"
              required
            />
            <SelectField
              control={control}
              name="condition"
              label="Condition"
              options={[...CONDITION_OPTIONS]}
              required
            />
          </div>
          <TextField
            control={control}
            name="fineAmount"
            label="Fine Amount"
            type="number"
            placeholder="0"
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
            submitLabel="Return Book"
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
