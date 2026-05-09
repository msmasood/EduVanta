"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Called when the user confirms the export */
  onConfirm: () => void;
  /** Number of rows that will be exported — shown in the dialog description */
  rowCount?: number;
  /** Optional inline trigger */
  trigger?: React.ReactNode;
}

/**
 * ExportDialog — CSV export confirmation dialog.
 * Shows how many rows will be exported and asks for confirmation.
 */
export function ExportDialog({
  open,
  onOpenChange,
  onConfirm,
  rowCount,
  trigger,
}: ExportDialogProps) {
  const t = useTranslations("table");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={false} className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="size-4 text-primary" aria-hidden />
            {t("exportCsv")}
          </DialogTitle>
          <DialogDescription>
            {rowCount !== undefined
              ? `${rowCount} rows will be exported as a CSV file.`
              : t("confirmExport")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange?.(false);
            }}
          >
            {t("export")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
