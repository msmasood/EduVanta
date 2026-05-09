"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FinanceAmountCell } from "./finance-amount-cell";
import { FinanceStatusBadge } from "./finance-status-badge";
import { FinanceTypeBadge } from "./finance-type-badge";
import { paymentMethodLabel } from "../utils/finance-mappers";
import type { TransactionRow } from "../utils/finance-mappers";

interface TransactionDetailDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  transaction?: TransactionRow;
  locale?: string;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

export function TransactionDetailDialog({
  open,
  onOpenChange,
  transaction,
  locale = "en",
}: TransactionDetailDialogProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="transaction-detail-dialog">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <DetailRow label="Transaction ID">
            <span className="font-mono text-xs">{transaction.id}</span>
          </DetailRow>
          <DetailRow label="Type">
            <FinanceTypeBadge type={transaction.type} />
          </DetailRow>
          <DetailRow label="Description">{transaction.description}</DetailRow>
          <DetailRow label="Amount">
            <FinanceAmountCell
              amount={transaction.amount}
              currency={transaction.currency}
              locale={locale}
            />
          </DetailRow>
          <DetailRow label="Payment Method">
            {transaction.paymentMethodLabel || paymentMethodLabel(transaction.paymentMethod) || "—"}
          </DetailRow>
          <DetailRow label="Date">{transaction.date}</DetailRow>
          <DetailRow label="Reference">
            <span className="font-mono text-xs">{transaction.referenceNumber}</span>
          </DetailRow>
          <DetailRow label="Reference Type">{transaction.referenceType}</DetailRow>
          <DetailRow label="Status">
            <FinanceStatusBadge status={transaction.status} type="transaction" />
          </DetailRow>
        </div>
      </DialogContent>
    </Dialog>
  );
}
