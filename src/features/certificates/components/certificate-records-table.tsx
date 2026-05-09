"use client";

import * as React from "react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCertificateRecordColumns, CERTIFICATE_RECORD_FILTER_CONFIGS } from "./certificate-record-columns";
import type { CertificateRecordRow } from "../utils/certificate-mappers";

interface CertificateRecordsTableProps {
  rows: CertificateRecordRow[];
  isLoading?: boolean;
  onLoad: (row: CertificateRecordRow) => void;
}

export function CertificateRecordsTable({
  rows,
  isLoading = false,
  onLoad,
}: CertificateRecordsTableProps) {
  const [localRows, setLocalRows] = React.useState<CertificateRecordRow[]>(rows);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalRows(rows);
  }, [rows]);

  const handleDelete = (id: string) => {
    setLocalRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Certificate record deleted. (Mock)");
  };

  const columns = React.useMemo(
    () => buildCertificateRecordColumns(onLoad, handleDelete),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onLoad]
  );

  if (isLoading) {
    return (
      <Card data-testid="certificate-records-table">
        <CardContent className="p-4">
          <TableSkeleton columns={7} rows={5} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="certificate-records-table">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Certificate History</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={localRows}
          filterConfigs={CERTIFICATE_RECORD_FILTER_CONFIGS}
        />
      </CardContent>
    </Card>
  );
}
