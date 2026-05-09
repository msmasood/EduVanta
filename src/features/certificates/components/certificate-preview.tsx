"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CertificatePrintLayout } from "./certificate-print-layout";
import type { CertificatePreviewData } from "../utils/certificate-mappers";

interface CertificatePreviewProps {
  preview: CertificatePreviewData | null;
}

export function CertificatePreview({ preview }: CertificatePreviewProps) {
  if (!preview) {
    return (
      <Card data-testid="certificate-preview">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <FileText className="size-8 text-muted-foreground" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground" data-testid="certificate-preview-empty">
              No preview generated
            </p>
            <p className="text-sm text-muted-foreground">
              Select a template and student, then click Generate Preview.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="certificate-preview">
      <CardContent className="p-4">
        <CertificatePrintLayout data={preview} />
      </CardContent>
    </Card>
  );
}
