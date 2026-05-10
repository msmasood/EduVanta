"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

import {
  FormSection,
  TextField,
  SelectField,
  PhoneField,
  FileUploadField,
  SwitchField,
  FormActions,
  FormErrorSummary,
} from "@/components/forms";
import {
  GUARDIAN_RELATION_OPTIONS,
  GUARDIAN_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
} from "../utils/guardian-form-options";
import {
  guardianFormSchema,
  type GuardianFormValues,
} from "@/lib/validations/guardians";
import type { SelectOption } from "@/types/common";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuardianFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<GuardianFormValues>;
  studentOptions?: SelectOption[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GuardianForm({
  mode,
  defaultValues,
  studentOptions = [],
}: GuardianFormProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      relation: undefined,
      occupation: "",
      nationalId: "",
      email: "",
      phone: "",
      alternatePhone: "",
      addressLine1: "",
      city: "",
      country: "",
      isEmergencyContact: false,
      portalAccess: false,
      status: "active",
      linkedStudentIds: [],
      primaryStudentId: "",
      ...defaultValues,
    },
  });

  const linkedStudentIds = watch("linkedStudentIds") ?? [];

  const onSubmit = async (_values: GuardianFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (mode === "create") {
      toast.success("Guardian created successfully.");
      router.push("/guardians");
    } else {
      toast.success("Guardian updated successfully.");
    }
  };

  const onCancel = () => {
    if (mode === "edit") {
      router.back();
    } else {
      router.push("/guardians");
    }
  };

  const toggleStudent = (studentId: string) => {
    const current = linkedStudentIds;
    if (current.includes(studentId)) {
      setValue("linkedStudentIds", current.filter((id) => id !== studentId));
    } else {
      setValue("linkedStudentIds", [...current, studentId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <FormErrorSummary errors={errors} />

      {/* Personal Information */}
      <FormSection title="Personal Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
          />
          <TextField
            control={control}
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            control={control}
            name="relation"
            label="Relationship"
            options={GUARDIAN_RELATION_OPTIONS}
            placeholder="Select relationship"
            required
          />
          <TextField
            control={control}
            name="occupation"
            label="Occupation"
            placeholder="e.g. Engineer, Doctor"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="nationalId"
            label="National ID"
            placeholder="Optional national ID"
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={GUARDIAN_STATUS_OPTIONS}
            placeholder="Select status"
            required
          />
        </div>
        <FileUploadField
          control={control}
          name="profileImage"
          label="Profile Image"
          accept="image/*"
        />
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Contact Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="email"
            label="Email Address"
            placeholder="guardian@email.com"
            type="email"
            required
          />
          <PhoneField
            control={control}
            name="phone"
            label="Phone"
            placeholder="+92-300-1234567"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneField
            control={control}
            name="alternatePhone"
            label="Alternate Phone"
            placeholder="+92-21-3456789"
          />
          <TextField
            control={control}
            name="city"
            label="City"
            placeholder="City"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="addressLine1"
            label="Address"
            placeholder="Street address"
          />
          <SelectField
            control={control}
            name="country"
            label="Country"
            options={COUNTRY_OPTIONS}
            placeholder="Select country"
          />
        </div>
      </FormSection>

      {/* Emergency & Access */}
      <FormSection title="Emergency Contact & Portal Access">
        <div className="grid gap-4 sm:grid-cols-2">
          <SwitchField
            control={control}
            name="isEmergencyContact"
            label="Mark as Emergency Contact"
            description="This guardian will be contacted first in emergencies."
          />
          <SwitchField
            control={control}
            name="portalAccess"
            label="Enable Portal Access"
            description="Allow this guardian to access the parent portal."
          />
        </div>
      </FormSection>

      {/* Linked Students */}
      {studentOptions.length > 0 && (
        <FormSection title="Linked Students">
          <p className="mb-3 text-sm text-muted-foreground">
            Select students to link to this guardian.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {studentOptions.map((opt) => {
              const isLinked = linkedStudentIds.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <Checkbox
                    checked={isLinked}
                    onCheckedChange={() => toggleStudent(opt.value)}
                    aria-label={`Link ${opt.label}`}
                  />
                  <span className="text-sm">{opt.label}</span>
                  {isLinked && (
                    <Badge variant="secondary" className="ms-auto text-xs">
                      Linked
                    </Badge>
                  )}
                </label>
              );
            })}
          </div>
        </FormSection>
      )}

      <FormActions
        isLoading={isSubmitting}
        submitLabel={mode === "create" ? "Add Guardian" : "Save Changes"}
        onCancel={onCancel}
        showCancel
      />
    </form>
  );
}
