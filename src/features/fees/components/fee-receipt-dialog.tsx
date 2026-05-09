"use client";

import { Printer, Download } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FeeStatusBadge } from "./fee-status-badge";
import type { FeeInvoiceRow } from "../utils/fee-mappers";

interface FeeReceiptDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice?: FeeInvoiceRow;
}

/**
 * FeeReceiptDialog — view-only receipt/payslip modal.
 * Print and Download are mock actions (Sonner toast).
 * All monetary values use formatCurrency — no hardcoded symbols.
 */
export function FeeReceiptDialog({
  open,
  onOpenChange,
  invoice,
}: FeeReceiptDialogProps) {
  if (!invoice) return null;

  const locale = "en";
  const currency = invoice.currency as CurrencyCode;
  const fmt = (amount: number) => formatCurrency(amount, currency, locale);

  const handlePrint = () => {
    toast.success("Print job sent. (Mock — no actual print)");
  };

  const handleDownload = () => {
    toast.success("Receipt downloaded. (Mock — no actual file)");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" data-testid="fee-receipt-dialog">
        <DialogHeader>
          <DialogTitle>Fee Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Invoice header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base">{invoice.invoiceNumber}</span>
              <FeeStatusBadge status={invoice.status} />
            </div>
            <p className="text-muted-foreground">Due: {invoice.dueDate}</p>
            {invoice.paidDate && (
              <p className="text-muted-foreground">Paid: {invoice.paidDate}</p>
            )}
          </div>

          <Separator />

          {/* Student */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Student
            </p>
            <p className="font-medium">{invoice.studentName}</p>
            <p className="text-muted-foreground">{invoice.admissionNumber}</p>
          </div>

          <Separator />

          {/* Fee details */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Fee Details
            </p>
            <div className="flex justify-between">
              <span>{invoice.feeTypeName}</span>
              <span className="tabular-nums">{fmt(invoice.amount)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span className="tabular-nums">- {fmt(invoice.discountAmount)}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span>Net Payable</span>
              <span className="tabular-nums">{fmt(invoice.netAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Paid Amount</span>
              <span className="tabular-nums">{fmt(invoice.paidAmount)}</span>
            </div>
            {invoice.balance > 0 && (
              <div className="flex justify-between text-destructive font-semibold">
                <span>Balance Due</span>
                <span className="tabular-nums">{fmt(invoice.balance)}</span>
              </div>
            )}
          </div>

          {/* Mock notice */}
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            This is a demo receipt. No real financial transaction was processed.
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={handlePrint}
            >
              <Printer className="size-3.5" aria-hidden />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={handleDownload}
            >
              <Download className="size-3.5" aria-hidden />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
