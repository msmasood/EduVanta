/**
 * Guardians component tests — Phase 12
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { GuardianStatusCards } from "@/features/guardians/components/guardian-status-summary";
import { GuardianInfoCard } from "@/features/guardians/components/guardian-info-card";
import { GuardianContactCard } from "@/features/guardians/components/guardian-contact-card";
import { GuardianProfileHeader } from "@/features/guardians/components/guardian-profile-header";
import { GuardianLinkedStudentsCard } from "@/features/guardians/components/guardian-linked-students-card";
import type { Guardian } from "@/types/guardian";
import type { GuardianStatusSummary } from "@/features/guardians/utils/guardian-mappers";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockGuardian: Guardian = {
  id: "guardian-001",
  schoolId: "school-001",
  firstName: "Tariq",
  lastName: "Khan",
  relation: "father",
  occupation: "Engineer",
  nationalId: "12345-6789012-3",
  contact: {
    email: "tariq@example.com",
    phone: "+923001234567",
    alternatePhone: "+9221-3456789",
  },
  address: {
    line1: "123 Main St",
    city: "Karachi",
    country: "Pakistan",
  },
  studentIds: ["stu-001", "stu-002"],
  status: "active",
  isEmergencyContact: true,
  portalAccess: true,
  audit: {
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "admin",
    updatedBy: "admin",
  },
};

const mockSummary: GuardianStatusSummary = {
  total: 12,
  active: 9,
  emergencyContacts: 4,
  portalAccess: 5,
};

// ─── GuardianStatusCards ──────────────────────────────────────────────────────

describe("GuardianStatusCards", () => {
  it("renders all 4 summary cards", () => {
    render(<GuardianStatusCards summary={mockSummary} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders card labels", () => {
    render(<GuardianStatusCards summary={mockSummary} />);
    expect(screen.getByText("Total Guardians")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Emergency Contacts")).toBeInTheDocument();
    expect(screen.getByText("Portal Access")).toBeInTheDocument();
  });
});

// ─── GuardianInfoCard ─────────────────────────────────────────────────────────

describe("GuardianInfoCard", () => {
  it("renders personal details", () => {
    render(<GuardianInfoCard guardian={mockGuardian} />);
    expect(screen.getByText("Tariq Khan")).toBeInTheDocument();
    expect(screen.getByText("Father")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("12345-6789012-3")).toBeInTheDocument();
  });

  it("shows Personal Information heading", () => {
    render(<GuardianInfoCard guardian={mockGuardian} />);
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });
});

// ─── GuardianContactCard ──────────────────────────────────────────────────────

describe("GuardianContactCard", () => {
  it("renders contact info", () => {
    render(<GuardianContactCard guardian={mockGuardian} />);
    expect(screen.getByText("tariq@example.com")).toBeInTheDocument();
    expect(screen.getByText("+923001234567")).toBeInTheDocument();
  });

  it("renders address info", () => {
    render(<GuardianContactCard guardian={mockGuardian} />);
    expect(screen.getByText("123 Main St, Karachi, Pakistan")).toBeInTheDocument();
  });

  it("shows Contact Information heading", () => {
    render(<GuardianContactCard guardian={mockGuardian} />);
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
  });
});

// ─── GuardianProfileHeader ────────────────────────────────────────────────────

describe("GuardianProfileHeader", () => {
  it("renders guardian name", () => {
    render(<GuardianProfileHeader guardian={mockGuardian} locale="en" />);
    expect(screen.getByText("Tariq Khan")).toBeInTheDocument();
  });

  it("renders relation label", () => {
    render(<GuardianProfileHeader guardian={mockGuardian} locale="en" />);
    expect(screen.getByText(/Father/)).toBeInTheDocument();
  });

  it("renders emergency contact badge when applicable", () => {
    render(<GuardianProfileHeader guardian={mockGuardian} locale="en" />);
    expect(screen.getByText("Emergency Contact")).toBeInTheDocument();
  });

  it("renders portal access badge when enabled", () => {
    render(<GuardianProfileHeader guardian={mockGuardian} locale="en" />);
    expect(screen.getByText("Portal Access")).toBeInTheDocument();
  });

  it("renders edit button link", () => {
    render(<GuardianProfileHeader guardian={mockGuardian} locale="en" />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("has correct data-testid", () => {
    render(<GuardianProfileHeader guardian={mockGuardian} locale="en" />);
    expect(screen.getByTestId("guardian-profile-header")).toBeInTheDocument();
  });
});

// ─── GuardianLinkedStudentsCard ───────────────────────────────────────────────

describe("GuardianLinkedStudentsCard", () => {
  it("shows empty state when no students", () => {
    render(<GuardianLinkedStudentsCard linkedStudents={[]} locale="en" />);
    expect(screen.getByText("No Linked Students")).toBeInTheDocument();
  });

  it("renders linked students", () => {
    const students = [
      {
        studentId: "stu-001",
        fullName: "Amir Khan",
        admissionNumber: "STU001",
        className: "Class 5",
        sectionName: "A",
        status: "active",
        relation: "father" as const,
        isPrimary: true,
      },
    ];
    render(<GuardianLinkedStudentsCard linkedStudents={students} locale="en" />);
    expect(screen.getByText("Amir Khan")).toBeInTheDocument();
    expect(screen.getByText("STU001 · Class 5 / A")).toBeInTheDocument();
  });
});
