import { z } from "zod";

// ─── Department schema ───────────────────────────────────────────────────────

export const departmentSchema = z.object({
  name: z.string().min(2, { error: "Department name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Department code is required." }),
  description: z.string().optional(),
  headEmployeeId: z.string().optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

// ─── Designation schema ──────────────────────────────────────────────────────

export const designationSchema = z.object({
  title: z.string().min(2, { error: "Title must be at least 2 characters." }),
  code: z.string().min(1, { error: "Designation code is required." }),
  departmentId: z.string().optional(),
  level: z.number().min(1).optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type DesignationFormValues = z.infer<typeof designationSchema>;

// ─── Payroll filter schema ───────────────────────────────────────────────────

export const payrollFilterSchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2000).optional(),
  status: z.enum(["draft", "processed", "paid"] as const).optional(),
  employeeId: z.string().optional(),
});

export type PayrollFilterValues = z.infer<typeof payrollFilterSchema>;
