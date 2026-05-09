"use client";

import * as React from "react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { useTransactions } from "@/hooks/queries/use-finance";
import { mapTransactionsToRows, type TransactionRow } from "../utils/finance-mappers";
import { computeTransactionSummary } from "../utils/finance-calculations";
import { buildTransactionColumns } from "./transaction-columns";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { TransactionSummaryCards } from "./finance-summary-cards";

export function TransactionsManager() {
  const transactionsQuery = useTransactions();
  const [viewingTransaction, setViewingTransaction] = React.useState<
    TransactionRow | undefined
  >();
  const [detailOpen, setDetailOpen] = React.useState(false);

  const transactionsRaw = transactionsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapTransactionsToRows(transactionsRaw),
    [transactionsRaw]
  );

  const summary = React.useMemo(
    () => computeTransactionSummary(transactionsRaw),
    [transactionsRaw]
  );

  const handleView = (row: TransactionRow) => {
    setViewingTransaction(row);
    setDetailOpen(true);
  };

  const columns = React.useMemo(
    () => buildTransactionColumns(handleView),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (transactionsQuery.isLoading) {
    return (
      <div data-testid="transactions-manager">
        <TableSkeleton columns={7} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="transactions-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete ledger of all financial transactions.
          </p>
        </div>
      </div>

      <TransactionSummaryCards summary={summary} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={[
          {
            columnId: "type",
            title: "Type",
            options: [
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
              { label: "Fee Payment", value: "fee-payment" },
              { label: "Salary", value: "salary" },
              { label: "Refund", value: "refund" },
            ],
          },
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Completed", value: "completed" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />

      <TransactionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        transaction={viewingTransaction}
      />
    </div>
  );
}
