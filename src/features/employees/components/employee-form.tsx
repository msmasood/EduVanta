"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import {
  FormSection,
  TextField,
  SelectField,
  DatePickerField,
  PhoneField,
  CurrencyField,
  FormActions,
  FormErrorSummary,
} from "@/components/forms";
import { employeeFormSchema, type EmployeeFormValues } from "@/lib/validations/employees";
import { EMPLOYMENT_TYPE_OPTIONS, EMPLOYEE_STATUS_OPTIONS, GENDER_OPTIONS } from "../utils/employee-form-options";
import type { Employee, Department, Designation } from "@/types/employee";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  employee?: Employee;
  departments: Department[];
  designations: Designation[];
  mode: "create" | "edit";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toOption(items: { id: string; name: string }[]) {
  return items.map((i) => ({ label: i.name, value: i.id }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmployeeForm({ employee, departments, designations, mode }: Props) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      employeeCode: employee?.employeeCode ?? "",
      gender: employee?.gender ?? "male",
      dateOfBirth: employee?.dateOfBirth ?? "",
      departmentId: employee?.departmentId ?? "",
      designationId: employee?.designationId ?? "",
      employmentType: employee?.employmentType ?? "full-time",
      status: employee?.status ?? "active",
      joiningDate: employee?.joiningDate ?? "",
      qualification: employee?.qualification ?? "",
      workEmail: employee?.contact?.email ?? "",
      phone: employee?.contact?.phone ?? "",
      baseSalary: employee?.basicSalary?.amount ?? 0,
      currency: employee?.basicSalary?.currency ?? "PKR",
      addressLine1: employee?.address?.line1 ?? "",
      city: employee?.address?.city ?? "",
      country: employee?.address?.country ?? "",
    },
  });

  const selectedDeptId = watch("departmentId");
  const filteredDesignations = selectedDeptId
    ? designations.filter((d) => d.departmentId === selectedDeptId)
    : designations;

  const onSubmit = async (values: EmployeeFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    toast.success(
      mode === "create" ? "Employee created successfully." : "Employee updated successfully."
    );
    router.push(`/${locale}/employees`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <FormErrorSummary errors={errors} />

      <FormSection title="Personal Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={control} name="firstName" label="First Name" required />
          <TextField control={control} name="lastName" label="Last Name" required />
          <SelectField
            control={control}
            name="gender"
            label="Gender"
            options={[...GENDER_OPTIONS]}
            required
          />
          <DatePickerField control={control} name="dateOfBirth" label="Date of Birth" />
          <TextField control={control} name="qualification" label="Qualification" required />
        </div>
      </FormSection>

      <FormSection title="Job Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={control} name="employeeCode" label="Employee Code" required />
          <SelectField
            control={control}
            name="departmentId"
            label="Department"
            options={toOption(departments)}
            required
          />
          <SelectField
            control={control}
            name="designationId"
            label="Designation"
            options={toOption(filteredDesignations)}
            required
          />
          <SelectField
            control={control}
            name="employmentType"
            label="Employment Type"
            options={[...EMPLOYMENT_TYPE_OPTIONS]}
            required
          />
          <DatePickerField control={control} name="joiningDate" label="Joining Date" required />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={[...EMPLOYEE_STATUS_OPTIONS]}
            required
          />
        </div>
      </FormSection>

      <FormSection title="Contact Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={control} name="workEmail" label="Work Email" type="email" />
          <PhoneField control={control} name="phone" label="Phone" />
          <TextField control={control} name="addressLine1" label="Address" />
          <TextField control={control} name="city" label="City" />
          <TextField control={control} name="country" label="Country" />
        </div>
      </FormSection>

      <FormSection title="Payroll">
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyField control={control} amountName="baseSalary" currencyName="currency" label="Basic Salary" />
        </div>
      </FormSection>

      <FormActions
        isLoading={isLoading}
        showCancel
        onCancel={() => router.push(`/${locale}/employees`)}
        submitLabel={mode === "create" ? "Add Employee" : "Save Changes"}
      />
    </form>
  );
}
