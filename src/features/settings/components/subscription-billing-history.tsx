"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/data-table";
import { formatCurrency } from "@/lib/currency";
import { billingStatusToVariant, billingStatusLabel, type BillingRow } from "../utils/settings-mappers";

interface SubscriptionBillingHistoryProps {
  rows: BillingRow[];
}

export function SubscriptionBillingHistory({ rows }: SubscriptionBillingHistoryProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No billing history available.</p>
    );
  }

  return (
    <div className="overflow-x-auto" data-testid="subscription-billing-history">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium text-muted-foreground">Invoice</th>
            <th className="py-2 pr-4 font-medium text-muted-foreground">Plan</th>
            <th className="py-2 pr-4 font-medium text-muted-foreground">Amount</th>
            <th className="py-2 pr-4 font-medium text-muted-foreground">Date</th>
            <th className="py-2 pr-4 font-medium text-muted-foreground">Status</th>
            <th className="py-2 font-medium text-muted-foreground">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="py-2.5 pr-4 font-mono">{row.invoiceNumber}</td>
              <td className="py-2.5 pr-4">
                <span className="font-medium">{row.planName}</span>
                <span className="ml-1.5 text-xs text-muted-foreground">({row.billingCycle})</span>
              </td>
              <td className="py-2.5 pr-4 tabular-nums">
                {row.amount === 0 ? "Free" : formatCurrency(row.amount, row.currency as import("@/lib/currency").CurrencyCode)}
              </td>
              <td className="py-2.5 pr-4 text-muted-foreground">{row.formattedDate}</td>
              <td className="py-2.5 pr-4">
                <StatusBadge
                  status={billingStatusToVariant(row.status)}
                  label={billingStatusLabel(row.status)}
                />
              </td>
              <td className="py-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => {}}
                  aria-label={`Download invoice ${row.invoiceNumber}`}
                >
                  <Download className="size-3" aria-hidden />
                  PDF
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
