"use client";

import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  /** Accessible label for the trigger. Only used when using built-in trigger. */
  triggerLabel?: string;
  /** If provided, renders a trigger button internally. If absent, use controlled `open` prop. */
  trigger?: React.ReactNode;
  /** Loading state — disables the confirm button while the action is pending. */
  isLoading?: boolean;
}

/**
 * ConfirmDialog — destructive confirmation dialog using AlertDialog primitives.
 * Can be used in controlled mode (open + onOpenChange) or with an inline trigger.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  trigger,
  isLoading = false,
}: ConfirmDialogProps) {
  const t = useTranslations("table");

  const resolvedTitle = title ?? t("confirmDelete");
  const resolvedDescription =
    description ?? "This action cannot be undone.";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
      )}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 className="text-destructive" aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {resolvedDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
