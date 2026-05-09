"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/queries/use-library";
import { mapBooksToRows, type BookRow } from "../utils/library-mappers";
import { computeBookStats } from "../utils/library-calculations";
import { buildBookColumns, BOOK_FILTER_CONFIGS } from "./book-columns";
import { BookFormDialog } from "./book-form-dialog";
import { BookSummaryCards } from "./library-summary-cards";
import type { BookFormValues } from "@/lib/validations/library";

export function BooksManager() {
  const booksQuery = useBooks();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editBook, setEditBook] = React.useState<BookRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const rawBooks = booksQuery.data?.data ?? [];

  const rows = React.useMemo(() => mapBooksToRows(rawBooks), [rawBooks]);

  const stats = React.useMemo(() => computeBookStats(rawBooks), [rawBooks]);

  const handleEdit = (row: BookRow) => {
    setEditBook(row);
    setEditOpen(true);
  };

  const handleSave = (_values: BookFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Book updated. (Mock)" : "Book added. (Mock)");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Book deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildBookColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (booksQuery.isLoading) {
    return (
      <div data-testid="books-manager">
        <TableSkeleton columns={8} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="books-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Books</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the library book catalogue, copies, and shelf locations.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="add-book-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Book
        </Button>
      </div>

      <BookSummaryCards stats={stats} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={BOOK_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No books found"
        emptyDescription="Add your first book using the button above."
      />

      {/* Add Dialog */}
      <BookFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
      />

      {/* Edit Dialog */}
      <BookFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        book={editBook}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Book"
        description="Are you sure you want to delete this book? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
