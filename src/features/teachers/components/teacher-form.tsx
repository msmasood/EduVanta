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
  DatePickerField,
  PhoneField,
  FileUploadField,
  TextareaField,
  FormActions,
  FormErrorSummary,
} from "@/components/forms";
import {
  teacherFormSchema,
  type TeacherFormValues,
} from "@/lib/validations/teachers";
import {
  GENDER_OPTIONS,
  TEACHER_STATUS_OPTIONS,
} from "../utils/teacher-form-options";
import type { SelectOption } from "@/types/common";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TeacherFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<TeacherFormValues>;
  departmentOptions?: SelectOption[];
  subjectOptions?: SelectOption[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TeacherForm({
  mode,
  defaultValues,
  departmentOptions = [],
}: TeacherFormProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      teacherCode: "",
      gender: undefined,
      dateOfBirth: "",
      departmentId: "",
      designation: "",
      qualification: "",
      experienceYears: undefined,
      joiningDate: "",
      employmentStatus: "active",
      subjectsAssigned: [],
      email: "",
      phone: "",
      alternatePhone: "",
      addressLine1: "",
      city: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      notes: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (_data: TeacherFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (mode === "create") {
      toast.success("Teacher created successfully.");
      router.push("/teachers");
    } else {
      toast.success("Teacher updated successfully.");
    }
  };

  const onCancel = () => router.push("/teachers");

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
          <TextField
            control={control}
            name="teacherCode"
            label="Teacher Code"
            placeholder="e.g. TCH-2024-001"
            required
          />
          <SelectField
            control={control}
            name="gender"
            label="Gender"
            options={GENDER_OPTIONS}
            placeholder="Select gender"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <DatePickerField
            control={control}
            name="dateOfBirth"
            label="Date of Birth"
          />
          <FileUploadField
            control={control}
            name="profileImage"
            label="Profile Image"
            accept="image/*"
          />
        </div>
      </FormSection>

      {/* Professional Information */}
      <FormSection title="Professional Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            control={control}
            name="departmentId"
            label="Department"
            options={departmentOptions}
            placeholder="Select department"
            required
          />
          <TextField
            control={control}
            name="designation"
            label="Designation"
            placeholder="e.g. Senior Teacher"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="qualification"
            label="Qualification"
            placeholder="e.g. M.Sc Mathematics"
            required
          />
          <TextField
            control={control}
            name="experienceYears"
            label="Years of Experience"
            placeholder="e.g. 5"
            type="number"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <DatePickerField
            control={control}
            name="joiningDate"
            label="Joining Date"
            required
          />
          <SelectField
            control={control}
            name="employmentStatus"
            label="Employment Status"
            options={TEACHER_STATUS_OPTIONS}
            placeholder="Select status"
            required
          />
        </div>
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Contact Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="email"
            label="Email"
            placeholder="teacher@school.edu"
            type="email"
            required
          />
          <PhoneField
            control={control}
            name="phone"
            label="Phone"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneField
            control={control}
            name="alternatePhone"
            label="Alternate Phone"
          />
          <TextField
            control={control}
            name="city"
            label="City"
            placeholder="Enter city"
          />
        </div>
        <TextField
          control={control}
          name="addressLine1"
          label="Address"
          placeholder="Street address"
        />
      </FormSection>

      {/* Emergency Contact */}
      <FormSection title="Emergency Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Full name"
          />
          <PhoneField
            control={control}
            name="emergencyContactPhone"
            label="Emergency Contact Phone"
          />
        </div>
        <TextareaField
          control={control}
          name="notes"
          label="Notes"
          placeholder="Additional notes"
          rows={3}
        />
      </FormSection>

      <FormActions
        isLoading={isSubmitting}
        submitLabel={mode === "create" ? "Add Teacher" : "Save Changes"}
        onCancel={onCancel}
        showCancel
      />
    </form>
  );
}
