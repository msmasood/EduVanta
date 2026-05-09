"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectField, FormActions } from "@/components/forms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { currencyFormSchema, type CurrencyFormValues } from "@/lib/validations/settings";
import { CURRENCY_OPTIONS } from "../utils/settings-form-options";
import type { CurrencyRow } from "../utils/settings-mappers";

// Schema without exchangeRate (handled separately as local state)
const partialSchema = currencyFormSchema.omit({ exchangeRate: true });
type PartialValues = z.infer<typeof partialSchema>;

interface CurrencyFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currency?: CurrencyRow;
  onSave: (values: CurrencyFormValues, isEdit: boolean) => void;
}

const DEFAULT_PARTIAL: PartialValues = {
  code: "USD",
  isDefault: false,
  isEnabled: true,
};

export function CurrencyFormDialog({
  open,
  onOpenChange,
  currency,
  onSave,
}: CurrencyFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [rateStr, setRateStr] = React.useState("1");
  const [rateError, setRateError] = React.useState<string | null>(null);
  const isEdit = !!currency;

  const { control, handleSubmit, reset, watch, setValue } = useForm<PartialValues>({
    resolver: zodResolver(partialSchema),
    defaultValues: DEFAULT_PARTIAL,
  });

  React.useEffect(() => {
    if (open) {
      if (currency) {
        reset({ code: currency.code, isDefault: currency.isDefault, isEnabled: currency.isEnabled });
        setRateStr(String(currency.exchangeRate));
      } else {
        reset(DEFAULT_PARTIAL);
        setRateStr("1");
      }
      setRateError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isEnabled = watch("isEnabled");
  const isDefault = watch("isDefault");

  const onSubmit = async (values: PartialValues) => {
    const rate = parseFloat(rateStr);
    if (isNaN(rate) || rate < 0.0001) {
      setRateError("Exchange rate must be greater than zero.");
      return;
    }
    setRateError(null);
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      onSave({ ...values, exchangeRate: rate }, isEdit);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="currency-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Currency" : "Add Currency"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="currency-form"
          noValidate
        >
          <SelectField
            control={control}
            name="code"
            label="Currency"
            options={CURRENCY_OPTIONS}
            required
            disabled={isEdit}
          />

          <div className="space-y-1.5">
            <Label htmlFor="exchange-rate">
              Exchange Rate (vs USD)
              <span className="text-destructive ms-0.5" aria-hidden>*</span>
            </Label>
            <Input
              id="exchange-rate"
              type="number"
              step="0.0001"
              min="0.0001"
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              placeholder="1.0000"
            />
            {rateError && <p className="text-sm text-destructive">{rateError}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="curr-enabled" className="text-sm font-medium">
                Enabled
              </Label>
              <p className="text-xs text-muted-foreground">Make this currency available for transactions.</p>
            </div>
            <Switch
              id="curr-enabled"
              checked={isEnabled}
              onCheckedChange={(v) => setValue("isEnabled", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="curr-default" className="text-sm font-medium">
                Set as Default
              </Label>
              <p className="text-xs text-muted-foreground">Use this currency as the system default.</p>
            </div>
            <Switch
              id="curr-default"
              checked={isDefault}
              onCheckedChange={(v) => setValue("isDefault", v)}
            />
          </div>

          <FormActions
            isLoading={isLoading}
            submitLabel={isEdit ? "Save Changes" : "Add Currency"}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

