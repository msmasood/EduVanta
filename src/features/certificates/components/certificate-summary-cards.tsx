"use client";

import * as React from "react";
import { FileText, Award, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CertificateSummaryStats } from "../utils/certificate-mappers";

type CertificateSummaryCardsProps = CertificateSummaryStats;

export function CertificateSummaryCards({
  total,
  issued,
  draft,
  thisMonth,
}: CertificateSummaryCardsProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      data-testid="certificate-summary-cards"
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="size-4 text-primary" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-semibold">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle2 className="size-4 text-success" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Issued</p>
              <p className="text-xl font-semibold">{issued}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Clock className="size-4 text-warning-foreground" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Draft</p>
              <p className="text-xl font-semibold">{draft}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-info/10 p-2">
              <Award className="size-4 text-info" aria-hidden />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-xl font-semibold">{thisMonth}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
