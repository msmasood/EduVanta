"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CertificatePreviewData } from "../utils/certificate-mappers";

interface CertificatePrintLayoutProps {
  data: CertificatePreviewData;
  className?: string;
}

/**
 * CertificatePrintLayout — A4-proportioned certificate card with decorative border.
 * Renders polished in both screen and print media.
 * Use data-testid="certificate-print-area" for print scoping.
 */
export function CertificatePrintLayout({
  data,
  className,
}: CertificatePrintLayoutProps) {
  return (
    <div
      className={cn(
        // A4-proportioned card with decorative double border
        "relative mx-auto w-full max-w-[700px] overflow-hidden",
        "rounded-lg border-4 border-primary/40 bg-white text-gray-900",
        "shadow-xl print:shadow-none print:border-primary/60",
        className
      )}
      data-testid="certificate-print-area"
      style={{ aspectRatio: "1 / 1.414" }}
    >
      {/* ── Outer decorative border inset ── */}
      <div className="absolute inset-3 rounded border-2 border-primary/20 pointer-events-none" />

      {/* ── Corner ornaments (CSS only) ── */}
      <div className="absolute top-5 start-5 size-8 border-t-4 border-s-4 border-primary/40 rounded-ss" />
      <div className="absolute top-5 end-5 size-8 border-t-4 border-e-4 border-primary/40 rounded-se" />
      <div className="absolute bottom-5 start-5 size-8 border-b-4 border-s-4 border-primary/40 rounded-es" />
      <div className="absolute bottom-5 end-5 size-8 border-b-4 border-e-4 border-primary/40 rounded-ee" />

      {/* ── Watermark ── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] select-none"
        aria-hidden
      >
        <span className="rotate-[-30deg] text-[80px] font-black uppercase tracking-widest text-gray-800">
          EduVanta
        </span>
      </div>

      {/* ── Content ── */}
      <div className="relative flex h-full flex-col items-center justify-between px-12 py-10 text-center">
        {/* Header */}
        <div className="w-full space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            EduVanta School
          </p>
          <h1
            className="text-2xl font-bold tracking-wide text-gray-900"
            data-testid="certificate-title"
          >
            {data.certificateTitle}
          </h1>
          <div className="mx-auto mt-1 h-0.5 w-24 rounded-full bg-primary/40" />
        </div>

        {/* Body */}
        <div className="w-full space-y-5 text-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            This is to certify that
          </p>

          <div className="space-y-1">
            <p
              className="text-2xl font-semibold text-gray-900"
              data-testid="certificate-student-name"
            >
              {data.studentName}
            </p>
            <p className="text-xs text-gray-500">
              Admission No.{" "}
              <span className="font-medium text-gray-700" data-testid="certificate-admission-number">
                {data.admissionNumber}
              </span>
            </p>
          </div>

          <p className="mx-auto max-w-[480px] leading-relaxed text-gray-700" data-testid="certificate-body">
            {data.bodyText}
          </p>

          {data.remarks && (
            <p className="mx-auto max-w-[480px] text-xs italic text-gray-500">
              {data.remarks}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="w-full space-y-4">
          {/* Meta row */}
          <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-500">
            <span>
              <span className="font-medium text-gray-700">Class: </span>
              {data.classSection}
            </span>
            <span>
              <span className="font-medium text-gray-700">Academic Year: </span>
              {data.academicYear}
            </span>
            <span>
              <span className="font-medium text-gray-700">Date: </span>
              <span data-testid="certificate-issue-date">{data.issueDate}</span>
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Signer + reference */}
          <div className="flex items-end justify-between text-left">
            <div className="space-y-0.5">
              <div className="h-px w-32 bg-gray-400" />
              <p className="text-sm font-semibold text-gray-800" data-testid="certificate-signer-name">
                {data.signerName}
              </p>
              <p className="text-xs text-gray-500">{data.signerDesignation}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Reference No.</p>
              <p
                className="font-mono text-xs font-medium text-gray-600"
                data-testid="certificate-reference-number"
              >
                {data.referenceNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
