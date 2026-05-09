"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getCertificateTemplates,
  getCertificateRecords,
  getStudentCertificates,
} from "@/services/mock/certificates.service";

export function useCertificateTemplates() {
  return useQuery({
    queryKey: queryKeys.certificates.templates(),
    queryFn: () => getCertificateTemplates(),
  });
}

export function useCertificateRecords() {
  return useQuery({
    queryKey: queryKeys.certificates.records(),
    queryFn: () => getCertificateRecords(),
  });
}

export function useStudentCertificates(studentId: string) {
  return useQuery({
    queryKey: queryKeys.certificates.student(studentId),
    queryFn: () => getStudentCertificates(studentId),
    enabled: !!studentId,
  });
}
