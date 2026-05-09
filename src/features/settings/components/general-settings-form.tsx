"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { TextField, SelectField, FormActions } from "@/components/forms";
import { generalSettingsSchema, type GeneralSettingsValues } from "@/lib/validations/settings";
import { LOCALE_OPTIONS, CURRENCY_OPTIONS, TIMEZONE_OPTIONS } from "../utils/settings-form-options";
import type { GeneralSettings } from "@/types/settings";

interface GeneralSettingsFormProps {
  settings: GeneralSettings;
}

export function GeneralSettingsForm({ settings }: GeneralSettingsFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      schoolName: settings.schoolName,
      schoolCode: settings.schoolCode,
      schoolEmail: settings.schoolEmail,
      schoolPhone: settings.schoolPhone,
      schoolAddress: settings.schoolAddress,
      schoolWebsite: settings.schoolWebsite,
      defaultLocale: settings.defaultLocale,
      defaultCurrency: settings.defaultCurrency,
      academicYearStart: settings.academicYearStart,
      academicYearEnd: settings.academicYearEnd,
      timezone: settings.timezone,
    },
  });

  const onSubmit = async (values: GeneralSettingsValues) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      void values;
      toast.success("General settings saved. (Mock)");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    toast.info("Changes discarded.");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      data-testid="general-settings-form"
      noValidate
    >
      {/* School information */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          School Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="schoolName"
            label="School Name"
            placeholder="e.g. EduVanta International School"
            required
          />
          <TextField
            control={control}
            name="schoolCode"
            label="School Code"
            placeholder="e.g. EVS-001"
            required
          />
          <TextField
            control={control}
            name="schoolEmail"
            label="School Email"
            type="email"
            placeholder="admin@school.edu"
            required
          />
          <TextField
            control={control}
            name="schoolPhone"
            label="Phone"
            placeholder="+1 (555) 234-5678"
          />
          <div className="sm:col-span-2">
            <TextField
              control={control}
              name="schoolAddress"
              label="Address"
              placeholder="123 Education Lane, City, Country"
            />
          </div>
          <div className="sm:col-span-2">
            <TextField
              control={control}
              name="schoolWebsite"
              label="Website"
              placeholder="https://school.edu"
            />
          </div>
        </div>
      </div>

      {/* Regional settings */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            control={control}
            name="defaultLocale"
            label="Default Language"
            options={[...LOCALE_OPTIONS]}
            required
          />
          <SelectField
            control={control}
            name="defaultCurrency"
            label="Default Currency"
            options={CURRENCY_OPTIONS}
            required
          />
          <SelectField
            control={control}
            name="timezone"
            label="Timezone"
            options={[...TIMEZONE_OPTIONS]}
            required
          />
        </div>
      </div>

      {/* Academic year */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Academic Year
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="academicYearStart"
            label="Academic Year Start"
            type="date"
            required
          />
          <TextField
            control={control}
            name="academicYearEnd"
            label="Academic Year End"
            type="date"
            required
          />
        </div>
      </div>

      <FormActions
        isLoading={isLoading}
        submitLabel="Save Settings"
        showReset
        resetLabel="Discard Changes"
        onReset={handleReset}
        showCancel={false}
      />
    </form>
  );
}
