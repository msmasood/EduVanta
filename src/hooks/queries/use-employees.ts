"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getEmployees,
  getEmployeeById,
  getDepartments,
  getDesignations,
  getPayrollRecords,
  getEmployeePayroll,
} from "@/services/mock/employees.service";
import type { QueryParams } from "@/types/common";

export function useEmployees(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.employees.list(params),
    queryFn: () => getEmployees(params),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.employees.departments(),
    queryFn: () => getDepartments(),
  });
}

export function useDesignations(departmentId?: string) {
  return useQuery({
    queryKey: queryKeys.employees.designations(departmentId),
    queryFn: () => getDesignations(departmentId),
  });
}

export function usePayrollRecords(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.employees.payroll(params),
    queryFn: () => getPayrollRecords(params),
  });
}

export function useEmployeePayroll(employeeId: string) {
  return useQuery({
    queryKey: queryKeys.employees.employeePayroll(employeeId),
    queryFn: () => getEmployeePayroll(employeeId),
    enabled: !!employeeId,
  });
}
