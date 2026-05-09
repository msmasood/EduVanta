import { z } from "zod";

// ─── Employee form schema ────────────────────────────────────────────────────

export const employeeFormSchema = z.object({
  firstName: z.string().min(2, { error: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { error: "Last name must be at least 2 characters." }),
  employeeCode: z.string().min(1, { error: "Employee code is required." }),
  gender: z.enum(["male", "female", "other"] as const, { error: "Gender is required." }),
  dateOfBirth: z.string().min(1, { error: "Date of birth is required." }),
  departmentId: z.string().min(1, { error: "Department is required." }),
  designationId: z.string().min(1, { error: "Designation is required." }),
  employmentType: z.enum(["full-time", "part-time", "contract", "intern"] as const, {
    error: "Employment type is required.",
  }),
  status: z.enum(["active", "inactive", "on-leave", "terminated"] as const, {
    error: "Status is required.",
  }),
  joiningDate: z.string().min(1, { error: "Joining date is required." }),
  qualification: z.string().min(1, { error: "Qualification is required." }),
  workEmail: z
    .string()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Please enter a valid email address.",
    }),
  phone: z
    .string()
    .refine((v) => v === "" || v.length >= 7, { message: "Phone must be at least 7 characters." }),
  baseSalary: z.number().min(0, { error: "Salary must be zero or greater." }),
  currency: z.string().min(1, { error: "Currency is required." }),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// ─── Leave request schema ────────────────────────────────────────────────────

export const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, { error: "Employee is required." }),
  leaveTypeId: z.string().min(1, { error: "Leave type is required." }),
  startDate: z.string().min(1, { error: "Start date is required." }),
  endDate: z.string().min(1, { error: "End date is required." }),
  reason: z.string().min(5, { error: "Reason must be at least 5 characters." }),
});

export type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;

// ─── Leave type schema ───────────────────────────────────────────────────────

export const leaveTypeSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  totalDays: z.number().min(1, { error: "Must allow at least 1 day." }),
  isPaid: z.boolean(),
  applicableTo: z
    .array(z.enum(["student", "teacher", "employee"] as const))
    .min(1, { error: "Select at least one applicable group." }),
});

export type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>;
