"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/data-table";
import { TextField, TextareaField, FormErrorSummary } from "@/components/forms";
import { studentCategorySchema, type StudentCategoryFormValues } from "@/lib/validations/students";
import type { StudentCategory } from "@/types/student";
import { buildCategoryStudentCounts } from "../utils/student-mappers";
import type { Student } from "@/types/student";

interface StudentCategoryManagerProps {
  categories: StudentCategory[];
  students: Student[];
}

function CategoryForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: Partial<StudentCategoryFormValues>;
  onSave: (values: StudentCategoryFormValues) => void;
  onCancel: () => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentCategoryFormValues>({
    resolver: zodResolver(studentCategorySchema),
    defaultValues: { name: "", description: "", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <div className="space-y-4 pt-2">
        <FormErrorSummary errors={errors} />
        <TextField
          control={control}
          name="name"
          label="Category Name"
          placeholder="e.g. Scholarship"
          required
        />
        <TextareaField
          control={control}
          name="description"
          label="Description"
          placeholder="Brief description of this category"
        />
      </div>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function StudentCategoryManager({
  categories: initialCategories,
  students,
}: StudentCategoryManagerProps) {
  const [categories, setCategories] =
    React.useState<StudentCategory[]>(initialCategories);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<StudentCategory | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = React.useState<StudentCategory | null>(
    null
  );

  const studentCounts = React.useMemo(
    () => buildCategoryStudentCounts(categories, students),
    [categories, students]
  );

  const openAdd = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (cat: StudentCategory) => {
    setEditTarget(cat);
    setDialogOpen(true);
  };

  const handleSave = (values: StudentCategoryFormValues) => {
    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? {
                ...c,
                name: values.name,
                description: values.description,
                audit: { ...c.audit, updatedAt: new Date().toISOString() },
              }
            : c
        )
      );
      toast.success("Category updated.");
    } else {
      const newCat: StudentCategory = {
        id: `cat-${Date.now()}`,
        schoolId: "school-001",
        name: values.name,
        description: values.description,
        audit: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success("Category created.");
    }
    setDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success("Category deleted.");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4" data-testid="category-manager">
      {/* Table */}
      <div className="overflow-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-start font-medium">Category Name</th>
              <th className="px-4 py-3 text-start font-medium">Description</th>
              <th className="px-4 py-3 text-start font-medium">Students</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {cat.description ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {studentCounts.get(cat.id) ?? 0}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit category"
                        onClick={() => openEdit(cat)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete category"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add button */}
      <Button variant="outline" onClick={openAdd} data-testid="add-category-btn">
        <Plus className="me-2 size-4" aria-hidden />
        Add Category
      </Button>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editTarget
                ? "Update category details."
                : "Create a new student category."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            defaultValues={
              editTarget
                ? { name: editTarget.name, description: editTarget.description }
                : undefined
            }
            onSave={handleSave}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Category"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
