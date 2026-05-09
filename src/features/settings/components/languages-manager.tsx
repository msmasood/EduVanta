"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useLanguageSettings } from "@/hooks/queries/use-settings";
import { mapLanguagesToRows, type LanguageRow } from "../utils/settings-mappers";
import { buildLanguageColumns, LANGUAGE_FILTER_CONFIGS } from "./language-columns";
import { LanguageFormDialog } from "./language-form-dialog";
import type { LanguageFormValues } from "@/lib/validations/settings";

export function LanguagesManager() {
  const query = useLanguageSettings();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editLang, setEditLang] = React.useState<LanguageRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);

  const rawLanguages = query.data?.data ?? [];
  const rows = React.useMemo(() => mapLanguagesToRows(rawLanguages), [rawLanguages]);

  const handleEdit = (row: LanguageRow) => {
    setEditLang(row);
    setEditOpen(true);
  };

  const handleSave = (_values: LanguageFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Language updated. (Mock)" : "Language added. (Mock)");
  };

  const columns = React.useMemo(
    () => buildLanguageColumns(handleEdit),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (query.isLoading) {
    return (
      <div data-testid="languages-manager">
        <TableSkeleton columns={5} rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="languages-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Languages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the supported interface languages for your school.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="add-language-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Language
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={LANGUAGE_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No languages configured"
        emptyDescription="Add a language using the button above."
      />

      <LanguageFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
      />

      <LanguageFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        language={editLang}
        onSave={handleSave}
      />
    </div>
  );
}
