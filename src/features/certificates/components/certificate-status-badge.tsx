"use client";

import * as React from "react";
import { StatusBadge } from "@/components/data-table/status-badge";
import { certificateStatusToVariant, certificateStatusLabel } from "../utils/certificate-mappers";
import type { CertificateStatus } from "@/types/certificates";

interface CertificateStatusBadgeProps {
  status: CertificateStatus | string;
}

export function CertificateStatusBadge({ status }: CertificateStatusBadgeProps) {
  return (
    <StatusBadge
      status={certificateStatusToVariant(status)}
      label={certificateStatusLabel(status)}
    />
  );
}
