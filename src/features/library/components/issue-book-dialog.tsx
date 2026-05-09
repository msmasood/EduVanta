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
import { issueBookFormSchema, type IssueBookFormValues } from "@/lib/validations/library";
import type { Book } from "@/types/library";
import type { MemberRow } from "../utils/library-mappers";

interface IssueBookDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  books: Book[];
  members: MemberRow[];
  prefillBookId?: string;
  onSave: (values: IssueBookFormValues) => void;
}

const today = new Date().toISOString().slice(0, 10);
const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export function IssueBookDialog({
  open,
  onOpenChange,
  books,
  members,
  prefillBookId,
  onSave,
}: IssueBookDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const bookOptions = books
    .filter((b) => b.availableCopies > 0)
    .map((b) => ({ label: `${b.title} (${b.availableCopies} avail.)`, value: b.id }));

  const memberOptions = members
    .filter((m) => m.status === "active")
    .map((m) => ({ label: `${m.memberName} — ${m.membershipNumber}`, value: m.id }));

  const { control, handleSubmit, reset } = useForm<IssueBookFormValues>({
    resolver: zodResolver(issueBookFormSchema),
    defaultValues: {
      bookId: prefillBookId ?? "",
      memberId: "",
      issueDate: today,
      dueDate: twoWeeksOut,
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        bookId: prefillBookId ?? "",
        memberId: "",
        issueDate: today,
        dueDate: twoWeeksOut,
        notes: "",
      });
    }
  }, [open, prefillBookId, reset]);

  const onSubmit = async (values: IssueBookFormValues) => {
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
      <DialogContent className="max-w-lg" data-testid="issue-book-dialog">
        <DialogHeader>
          <DialogTitle>Issue Book</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="issue-book-form"
          noValidate
        >
          <SelectField
            control={control}
            name="bookId"
            label="Book"
            options={bookOptions}
            placeholder="Select a book"
            required
          />
          <SelectField
            control={control}
            name="memberId"
            label="Member"
            options={memberOptions}
            placeholder="Select a member"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              control={control}
              name="issueDate"
              label="Issue Date"
              type="date"
              required
            />
            <TextField
              control={control}
              name="dueDate"
              label="Due Date"
              type="date"
              required
            />
          </div>
          <TextareaField
            control={control}
            name="notes"
            label="Notes"
            placeholder="Optional notes"
            rows={2}
          />
          <FormActions
            isLoading={isLoading}
            submitLabel="Issue Book"
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
