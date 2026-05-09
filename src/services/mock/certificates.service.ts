import type { ApiResponse } from "@/types/common";
import type { CertificateTemplate, CertificateRecord } from "@/types/certificates";
import { certificateTemplates, certificateRecords } from "@/data/mock/certificates";
import { withMockDelay } from "./delay";
import { createMockResponse } from "./helpers";

export async function getCertificateTemplates(ms = 250): Promise<ApiResponse<CertificateTemplate[]>> {
  return withMockDelay(createMockResponse(certificateTemplates), ms);
}

export async function getCertificateRecords(ms = 250): Promise<ApiResponse<CertificateRecord[]>> {
  return withMockDelay(createMockResponse(certificateRecords), ms);
}

export async function getStudentCertificates(studentId: string, ms = 250): Promise<ApiResponse<CertificateRecord[]>> {
  const records = certificateRecords.filter((r) => r.studentId === studentId);
  return withMockDelay(createMockResponse(records), ms);
}
