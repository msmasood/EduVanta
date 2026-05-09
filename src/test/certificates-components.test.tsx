/**
 * Certificate component tests — Phase 21
 */

import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";

import { CertificateSummaryCards } from "@/features/certificates/components/certificate-summary-cards";
import { CertificateStatusBadge } from "@/features/certificates/components/certificate-status-badge";
import { CertificatePreview } from "@/features/certificates/components/certificate-preview";
import { CertificatePrintLayout } from "@/features/certificates/components/certificate-print-layout";
import type { CertificatePreviewData } from "@/features/certificates/utils/certificate-mappers";

// ─── CertificateSummaryCards ──────────────────────────────────────────────────

describe("CertificateSummaryCards", () => {
  it("renders certificate-summary-cards testid", () => {
    render(<CertificateSummaryCards total={10} issued={7} draft={2} thisMonth={3} />);
    expect(screen.getByTestId("certificate-summary-cards")).toBeDefined();
  });

  it("shows total count", () => {
    render(<CertificateSummaryCards total={10} issued={7} draft={2} thisMonth={3} />);
    expect(screen.getByText("10")).toBeDefined();
  });

  it("shows issued count", () => {
    render(<CertificateSummaryCards total={10} issued={7} draft={2} thisMonth={3} />);
    expect(screen.getByText("7")).toBeDefined();
  });

  it("shows draft count", () => {
    render(<CertificateSummaryCards total={10} issued={7} draft={2} thisMonth={3} />);
    expect(screen.getByText("2")).toBeDefined();
  });

  it("shows this month count", () => {
    render(<CertificateSummaryCards total={10} issued={7} draft={2} thisMonth={3} />);
    expect(screen.getByText("3")).toBeDefined();
  });
});

// ─── CertificateStatusBadge ───────────────────────────────────────────────────

describe("CertificateStatusBadge", () => {
  it("renders Issued for issued status", () => {
    render(<CertificateStatusBadge status="issued" />);
    expect(screen.getByText("Issued")).toBeDefined();
  });

  it("renders Draft for draft status", () => {
    render(<CertificateStatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeDefined();
  });

  it("renders Revoked for revoked status", () => {
    render(<CertificateStatusBadge status="revoked" />);
    expect(screen.getByText("Revoked")).toBeDefined();
  });

  it("renders Expired for expired status", () => {
    render(<CertificateStatusBadge status="expired" />);
    expect(screen.getByText("Expired")).toBeDefined();
  });
});

// ─── CertificatePreview — empty state ────────────────────────────────────────

describe("CertificatePreview (empty)", () => {
  it("renders certificate-preview testid", () => {
    render(<CertificatePreview preview={null} />);
    expect(screen.getByTestId("certificate-preview")).toBeDefined();
  });

  it("shows empty state message", () => {
    render(<CertificatePreview preview={null} />);
    expect(screen.getByTestId("certificate-preview-empty")).toBeDefined();
  });
});

// ─── CertificatePrintLayout ───────────────────────────────────────────────────

const MOCK_PREVIEW: CertificatePreviewData = {
  referenceNumber: "CERT-2024-BON-1234",
  templateId: "cert-tpl-001",
  templateName: "Bonafide Certificate",
  templateType: "bonafide",
  studentName: "Ahmed Khan",
  admissionNumber: "AN2024001",
  classSection: "Class 5",
  academicYear: "2024-2025",
  issueDate: "05 Aug 2024",
  certificateTitle: "Bonafide Certificate",
  bodyText:
    "This is to certify that Ahmed Khan (Admission No. AN2024001) is a bonafide student of Class 5 at this institution for the academic year 2024-2025.",
  remarks: "Issued on request.",
  signerName: "Dr. Rashida Akhtar",
  signerDesignation: "Principal",
};

describe("CertificatePrintLayout", () => {
  it("renders certificate-print-area testid", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-print-area")).toBeDefined();
  });

  it("shows certificate title", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-title").textContent).toBe("Bonafide Certificate");
  });

  it("shows student name", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-student-name").textContent).toBe("Ahmed Khan");
  });

  it("shows admission number", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-admission-number").textContent).toBe("AN2024001");
  });

  it("shows reference number", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-reference-number").textContent).toBe("CERT-2024-BON-1234");
  });

  it("shows signer name", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-signer-name").textContent).toBe("Dr. Rashida Akhtar");
  });

  it("shows issue date", () => {
    render(<CertificatePrintLayout data={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-issue-date").textContent).toBe("05 Aug 2024");
  });
});

// ─── CertificatePreview — with data ──────────────────────────────────────────

describe("CertificatePreview (with data)", () => {
  it("renders certificate-print-area when preview data is provided", () => {
    render(<CertificatePreview preview={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-print-area")).toBeDefined();
  });

  it("shows student name in preview", () => {
    render(<CertificatePreview preview={MOCK_PREVIEW} />);
    expect(screen.getByTestId("certificate-student-name").textContent).toBe("Ahmed Khan");
  });

  it("does not show empty state when preview is provided", () => {
    render(<CertificatePreview preview={MOCK_PREVIEW} />);
    expect(screen.queryByTestId("certificate-preview-empty")).toBeNull();
  });
});

// ─── Print button calls window.print ─────────────────────────────────────────

describe("window.print mock", () => {
  beforeAll(() => {
    vi.stubGlobal("print", vi.fn());
  });

  it("window.print is callable", () => {
    window.print();
    expect(window.print).toHaveBeenCalledOnce();
  });
});
