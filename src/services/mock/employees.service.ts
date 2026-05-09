import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Employee, Department, Designation, PayrollRecord } from "@/types/employee";
import { employees, departments, designations, payrollRecords } from "@/data/mock/employees";
import { withMockDelay } from "./delay";
import { applyQueryParams, createPaginatedResponse, getById, createMockResponse, createErrorResponse } from "./helpers";

const SEARCH_FIELDS: (keyof Employee)[] = ["firstName", "lastName", "employeeCode"];

export async function getEmployees(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Employee>> {
  const filtered = applyQueryParams(employees, params, SEARCH_FIELDS);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getEmployeeById(id: string, ms = 250): Promise<ApiResponse<Employee>> {
  const emp = getById(employees, id);
  if (!emp) return withMockDelay(createErrorResponse<Employee>(`Employee '${id}' not found`), ms);
  return withMockDelay(createMockResponse(emp), ms);
}

export async function getDepartments(ms = 250): Promise<ApiResponse<Department[]>> {
  return withMockDelay(createMockResponse(departments), ms);
}

export async function getDesignations(departmentId?: string, ms = 250): Promise<ApiResponse<Designation[]>> {
  const filtered = departmentId
    ? designations.filter((d) => d.departmentId === departmentId)
    : designations;
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getPayrollRecords(params?: QueryParams, ms = 250): Promise<PaginatedResponse<PayrollRecord>> {
  let filtered = [...payrollRecords];
  if (params?.status) filtered = filtered.filter((p) => p.status === params.status);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getEmployeePayroll(employeeId: string, ms = 250): Promise<ApiResponse<PayrollRecord[]>> {
  const records = payrollRecords.filter((r) => r.employeeId === employeeId);
  return withMockDelay(createMockResponse(records), ms);
}
