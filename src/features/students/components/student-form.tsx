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
  studentFormSchema,
  type StudentFormValues,
} from "@/lib/validations/students";
import {
  GENDER_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
} from "../utils/student-form-options";
import type { SelectOption } from "@/types/common";

// ─── Props ────────────────────────────────────────────────────────────────────

interface StudentFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<StudentFormValues>;
  classOptions?: SelectOption[];
  sectionOptions?: SelectOption[];
  categoryOptions?: SelectOption[];
  guardianOptions?: SelectOption[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StudentForm({
  mode,
  defaultValues,
  classOptions = [],
  sectionOptions = [],
  categoryOptions = [],
  guardianOptions = [],
}: StudentFormProps) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      admissionNumber: "",
      rollNumber: "",
      gender: undefined,
      dateOfBirth: "",
      email: "",
      phone: "",
      addressLine1: "",
      city: "",
      classId: "",
      sectionId: "",
      categoryId: "",
      admissionDate: "",
      academicYearId: "",
      status: "active",
      guardianId: "",
      fatherName: "",
      motherName: "",
      guardianPhone: "",
      guardianEmail: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (_data: StudentFormValues) => {
    // Simulate async save
    await new Promise((r) => setTimeout(r, 400));
    if (mode === "create") {
      toast.success("Student created successfully.");
      router.push("/students");
    } else {
      toast.success("Student updated successfully.");
    }
  };

  const onCancel = () => router.push("/students");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        <FormErrorSummary errors={errors} />

        {/* Personal Information */}
        <FormSection
          title="Personal Information"
          description="Student's personal and contact details."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="firstName"
              label="First Name"
              placeholder="First name"
              required
            />
            <TextField
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Last name"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={control}
              name="gender"
              label="Gender"
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              required
            />
            <DatePickerField
              control={control}
              name="dateOfBirth"
              label="Date of Birth"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={control}
              name="bloodGroup"
              label="Blood Group"
              options={BLOOD_GROUP_OPTIONS}
              placeholder="Select blood group"
            />
            <TextField
              control={control}
              name="nationality"
              label="Nationality"
              placeholder="e.g. Pakistani"
            />
          </div>
          <FileUploadField
            control={control}
            name="profileImage"
            label="Profile Image"
            accept="image/*"
          />
        </FormSection>

        {/* Contact Details */}
        <FormSection title="Contact Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="email"
              label="Email"
              type="email"
              placeholder="student@example.com"
            />
            <PhoneField
              control={control}
              name="phone"
              label="Phone"
              placeholder="+92-300-0000000"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="addressLine1"
              label="Address"
              placeholder="Street address"
            />
            <TextField
              control={control}
              name="city"
              label="City"
              placeholder="City"
            />
          </div>
        </FormSection>

        {/* Academic Information */}
        <FormSection
          title="Academic Information"
          description="Class, section, category, and status."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="admissionNumber"
              label="Admission Number"
              placeholder="AN2024001"
              required
            />
            <TextField
              control={control}
              name="rollNumber"
              label="Roll Number"
              placeholder="01"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={control}
              name="classId"
              label="Class"
              options={classOptions}
              placeholder="Select class"
              required
            />
            <SelectField
              control={control}
              name="sectionId"
              label="Section"
              options={sectionOptions}
              placeholder="Select section"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={control}
              name="categoryId"
              label="Category"
              options={categoryOptions}
              placeholder="Select category"
            />
            <SelectField
              control={control}
              name="status"
              label="Status"
              options={STUDENT_STATUS_OPTIONS}
              placeholder="Select status"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DatePickerField
              control={control}
              name="admissionDate"
              label="Admission Date"
              required
            />
          </div>
        </FormSection>

        {/* Guardian Information */}
        <FormSection
          title="Guardian / Parent Information"
          description="Guardian contact details for this student."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={control}
              name="guardianId"
              label="Link Guardian"
              options={guardianOptions}
              placeholder="Select guardian"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              control={control}
              name="fatherName"
              label="Father Name"
              placeholder="Father's full name"
            />
            <TextField
              control={control}
              name="motherName"
              label="Mother Name"
              placeholder="Mother's full name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PhoneField
              control={control}
              name="guardianPhone"
              label="Guardian Phone"
              placeholder="+92-300-0000000"
            />
            <TextField
              control={control}
              name="guardianEmail"
              label="Guardian Email"
              type="email"
              placeholder="guardian@example.com"
            />
          </div>
        </FormSection>

        <FormActions
          isLoading={isSubmitting}
          onCancel={onCancel}
          submitLabel={mode === "create" ? "Add Student" : "Save Changes"}
        />
      </div>
    </form>
  );
}
