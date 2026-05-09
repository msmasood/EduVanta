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
import {
  TextField,
  SelectField,
  TextareaField,
  FormActions,
} from "@/components/forms";
import { bookFormSchema, type BookFormValues } from "@/lib/validations/library";
import {
  BOOK_CATEGORY_OPTIONS,
  LANGUAGE_OPTIONS,
  BOOK_STATUS_OPTIONS,
} from "../utils/library-form-options";
import type { BookRow } from "../utils/library-mappers";

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  book?: BookRow;
  onSave: (values: BookFormValues, isEdit: boolean) => void;
}

const DEFAULT_VALUES: BookFormValues = {
  title: "",
  isbn: "",
  author: "",
  publisher: "",
  category: "",
  language: "English",
  edition: "",
  publishedYear: undefined,
  totalCopies: 1,
  availableCopies: 1,
  shelfLocation: "",
  description: "",
  status: "active",
};

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  onSave,
}: BookFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!book;

  const { control, handleSubmit, reset } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) {
      if (book) {
        reset({
          title: book.title,
          isbn: book.isbn === "—" ? "" : book.isbn,
          author: book.author,
          publisher: book.publisher ?? "",
          category: book.category === "—" ? "" : book.category,
          language: book.language,
          edition: book.edition ?? "",
          publishedYear: book.publishYear,
          totalCopies: book.totalCopies,
          availableCopies: book.availableCopies,
          shelfLocation: book.shelfLocation === "—" ? "" : book.shelfLocation,
          description: "",
          status: (book.status as "active" | "inactive") ?? "active",
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [open, book, reset]);

  const onSubmit = async (values: BookFormValues) => {
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
      <DialogContent className="max-w-2xl" data-testid="book-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Book" : "Add Book"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto max-h-[70vh] py-1 px-0.5"
          data-testid="book-form"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="title"
              label="Title"
              placeholder="Book title"
              required
            />
            <TextField
              control={control}
              name="author"
              label="Author"
              placeholder="Author name"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="isbn"
              label="ISBN"
              placeholder="978-..."
              required
            />
            <TextField
              control={control}
              name="publisher"
              label="Publisher"
              placeholder="Publisher name"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              control={control}
              name="category"
              label="Category"
              options={[...BOOK_CATEGORY_OPTIONS]}
              placeholder="Select category"
              required
            />
            <SelectField
              control={control}
              name="language"
              label="Language"
              options={[...LANGUAGE_OPTIONS]}
              placeholder="Select language"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField
              control={control}
              name="totalCopies"
              label="Total Copies"
              type="number"
              placeholder="0"
              required
            />
            <TextField
              control={control}
              name="availableCopies"
              label="Available Copies"
              type="number"
              placeholder="0"
              required
            />
            <TextField
              control={control}
              name="shelfLocation"
              label="Shelf / Rack"
              placeholder="A-01"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="edition"
              label="Edition"
              placeholder="e.g., 2nd"
            />
            <SelectField
              control={control}
              name="status"
              label="Status"
              options={[...BOOK_STATUS_OPTIONS]}
              required
            />
          </div>
          <TextareaField
            control={control}
            name="description"
            label="Description"
            placeholder="Optional description"
            rows={3}
          />
          <FormActions
            isLoading={isLoading}
            submitLabel={isEdit ? "Save Changes" : "Add Book"}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
