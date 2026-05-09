"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCurrencySettings } from "@/hooks/queries/use-settings";
import { mapCurrenciesToRows, type CurrencyRow } from "../utils/settings-mappers";
import { buildCurrencyColumns, CURRENCY_FILTER_CONFIGS } from "./currency-columns";
import { CurrencyFormDialog } from "./currency-form-dialog";
import type { CurrencyFormValues } from "@/lib/validations/settings";

export function CurrenciesManager() {
  const query = useCurrencySettings();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editCurrency, setEditCurrency] = React.useState<CurrencyRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);

  const rawCurrencies = query.data?.data ?? [];
  const rows = React.useMemo(() => mapCurrenciesToRows(rawCurrencies), [rawCurrencies]);

  const handleEdit = (row: CurrencyRow) => {
    setEditCurrency(row);
    setEditOpen(true);
  };

  const handleSave = (_values: CurrencyFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Currency updated. (Mock)" : "Currency added. (Mock)");
  };

  const columns = React.useMemo(
    () => buildCurrencyColumns(handleEdit),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (query.isLoading) {
    return (
      <div data-testid="currencies-manager">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="currencies-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Currencies</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage supported currencies and exchange rates.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="add-currency-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Currency
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={CURRENCY_FILTER_CONFIGS}
        defaultPageSize={15}
        emptyTitle="No currencies configured"
        emptyDescription="Add a currency using the button above."
      />

      <CurrencyFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
      />

      <CurrencyFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        currency={editCurrency}
        onSave={handleSave}
      />
    </div>
  );
}
