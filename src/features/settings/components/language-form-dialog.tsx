"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectField, FormActions } from "@/components/forms";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { languageFormSchema, type LanguageFormValues } from "@/lib/validations/settings";
import { LOCALE_OPTIONS } from "../utils/settings-form-options";
import type { LanguageRow } from "../utils/settings-mappers";

interface LanguageFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  language?: LanguageRow;
  onSave: (values: LanguageFormValues, isEdit: boolean) => void;
}

const DEFAULT_VALUES: LanguageFormValues = {
  locale: "en",
  isDefault: false,
  isEnabled: true,
};

export function LanguageFormDialog({
  open,
  onOpenChange,
  language,
  onSave,
}: LanguageFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!language;

  const { control, handleSubmit, reset, watch, setValue } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) {
      if (language) {
        reset({
          locale: language.locale as "en" | "ar" | "ur",
          isDefault: language.isDefault,
          isEnabled: language.isEnabled,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [open, language, reset]);

  const isEnabled = watch("isEnabled");
  const isDefault = watch("isDefault");

  const onSubmit = async (values: LanguageFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      onSave(values, isEdit);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="language-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Language" : "Add Language"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
          data-testid="language-form"
          noValidate
        >
          <SelectField
            control={control}
            name="locale"
            label="Language"
            options={[...LOCALE_OPTIONS]}
            required
            disabled={isEdit}
          />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="lang-enabled" className="text-sm font-medium">
                Enabled
              </Label>
              <p className="text-xs text-muted-foreground">Make this language available to users.</p>
            </div>
            <Switch
              id="lang-enabled"
              checked={isEnabled}
              onCheckedChange={(v) => setValue("isEnabled", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="lang-default" className="text-sm font-medium">
                Set as Default
              </Label>
              <p className="text-xs text-muted-foreground">Use this language as the system default.</p>
            </div>
            <Switch
              id="lang-default"
              checked={isDefault}
              onCheckedChange={(v) => setValue("isDefault", v)}
            />
          </div>

          <FormActions
            isLoading={isLoading}
            submitLabel={isEdit ? "Save Changes" : "Add Language"}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
