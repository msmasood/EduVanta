"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import {
  DataTable,
  TableSkeleton,
  ConfirmDialog,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useFeeInvoices, useFeeGroups, useFeeTypes } from "@/hooks/queries/use-fees";
import { useStudents } from "@/hooks/queries/use-students";
import {
  mapInvoicesToRows,
  computeInvoiceSummary,
  type FeeInvoiceRow,
} from "../utils/fee-mappers";
import { FeeSummaryCards } from "./fee-summary-cards";
import { FeePaymentDialog } from "./fee-payment-dialog";
import { FeeReceiptDialog } from "./fee-receipt-dialog";
import {
  buildFeeInvoiceColumns,
  invoiceFilterConfigs,
} from "./fee-invoice-columns";
import type { FeePaymentFormValues } from "@/lib/validations/fees";

/**
 * FeeCollectionManager — main manager for the Fees Collection page.
 * Uses Phase 6 mock data via TanStack Query hooks.
 * All CRUD actions are mock-only (Sonner toasts).
 */
export function FeeCollectionManager() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";

  const invoicesQuery = useFeeInvoices();
  const studentsQuery = useStudents();
  const feeTypesQuery = useFeeTypes();
  const feeGroupsQuery = useFeeGroups();

  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [activeInvoice, setActiveInvoice] = React.useState<FeeInvoiceRow | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const invoices = invoicesQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  const feeTypes = feeTypesQuery.data?.data ?? [];
  const feeGroups = feeGroupsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapInvoicesToRows(invoices, students, feeTypes, feeGroups),
    [invoices, students, feeTypes, feeGroups]
  );

  const summary = React.useMemo(() => computeInvoiceSummary(invoices), [invoices]);

  const handleCollect = (row: FeeInvoiceRow) => {
    setActiveInvoice(row);
    setPaymentOpen(true);
  };

  const handleReceipt = (row: FeeInvoiceRow) => {
    setActiveInvoice(row);
    setReceiptOpen(true);
  };

  const handlePaymentSave = (_values: FeePaymentFormValues) => {
    toast.success("Payment collected successfully. (Mock)");
    setPaymentOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Invoice deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildFeeInvoiceColumns(handleCollect, handleReceipt, (id) => setDeleteId(id), locale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  const isLoading =
    invoicesQuery.isLoading ||
    studentsQuery.isLoading ||
    feeTypesQuery.isLoading ||
    feeGroupsQuery.isLoading;

  if (isLoading) {
    return (
      <div data-testid="fee-collection-manager">
        <TableSkeleton columns={8} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="fee-collection-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fees Collection</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Collect, track and manage all student fee invoices.
          </p>
        </div>
        <Button
          onClick={() => toast.info("Export coming soon.")}
          variant="outline"
          size="sm"
          className="gap-1.5"
          data-testid="export-invoices-btn"
        >
          Export
        </Button>
      </div>

      <FeeSummaryCards summary={summary} locale={locale} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={invoiceFilterConfigs}
        defaultPageSize={10}
        emptyTitle="No invoices found"
        emptyDescription="Fee invoices will appear here once created."
      />

      <FeePaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        invoice={activeInvoice}
        onSave={handlePaymentSave}
      />

      <FeeReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        invoice={activeInvoice}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
