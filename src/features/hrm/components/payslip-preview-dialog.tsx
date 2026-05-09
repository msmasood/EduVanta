"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PayrollTableRow } from "../utils/hrm-mappers";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  record: PayrollTableRow | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function PayslipPreviewDialog({ open, onOpenChange, record }: Props) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Payslip — {record.period}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <p className="font-semibold">{record.employeeName}</p>
            <p className="text-sm text-muted-foreground">{record.employeeCode}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Earnings
            </p>
            <Row label="Basic Salary" value={record.basicSalaryFormatted} />
            <Row label="Allowances" value={record.allowancesFormatted} />
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Deductions
            </p>
            <Row label="Deductions" value={record.deductionsFormatted} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Net Pay</span>
            <span className="text-lg font-bold">{record.netSalaryFormatted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              variant={
                record.status === "paid"
                  ? "default"
                  : record.status === "processed"
                  ? "secondary"
                  : "outline"
              }
            >
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
