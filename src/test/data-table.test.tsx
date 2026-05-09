import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { StatusBadge } from "@/components/data-table/status-badge";
import { AvatarCell } from "@/components/data-table/avatar-cell";

// ─── Mock next-intl ───────────────────────────────────────────────────────────

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// ─── Test data ────────────────────────────────────────────────────────────────

interface TestRow {
  id: string;
  name: string;
  status: string;
}

const TEST_DATA: TestRow[] = [
  { id: "1", name: "Alice", status: "active" },
  { id: "2", name: "Bob", status: "pending" },
  { id: "3", name: "Charlie", status: "suspended" },
];

const COLUMNS: ColumnDef<TestRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

// ─── DataTable tests ──────────────────────────────────────────────────────────

describe("DataTable", () => {
  it("renders all data rows", () => {
    render(<DataTable columns={COLUMNS} data={TEST_DATA} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<DataTable columns={COLUMNS} data={TEST_DATA} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders empty state when data is empty", () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={[]}
        emptyTitle="Nothing here"
      />
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders loading skeleton when isLoading is true", () => {
    render(
      <DataTable columns={COLUMNS} data={[]} isLoading />
    );
    expect(
      document.querySelector("[aria-busy='true']")
    ).toBeTruthy();
  });

  it("renders search input in toolbar", () => {
    render(<DataTable columns={COLUMNS} data={TEST_DATA} />);
    // Toolbar should have a search input
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });
});

// ─── StatusBadge tests ────────────────────────────────────────────────────────

describe("StatusBadge", () => {
  it("renders active status", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<StatusBadge status="active" label="Enrolled" />);
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
  });

  it("renders unknown status as neutral", () => {
    const { container } = render(<StatusBadge status="unknown-xyz" />);
    const badge = container.querySelector("[data-slot='status-badge']") ??
      container.querySelector("[data-status='unknown-xyz']");
    expect(badge).toBeTruthy();
  });

  it("has data-status attribute", () => {
    const { container } = render(<StatusBadge status="pending" />);
    const badge = container.querySelector("[data-status='pending']");
    expect(badge).toBeTruthy();
  });
});

// ─── AvatarCell tests ─────────────────────────────────────────────────────────

describe("AvatarCell", () => {
  it("renders the name", () => {
    render(<AvatarCell name="Ahmed Ali" />);
    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    render(<AvatarCell name="Ahmed Ali" subtitle="Class 10A" />);
    expect(screen.getByText("Class 10A")).toBeInTheDocument();
  });

  it("renders initials fallback (AA for Ahmed Ali)", () => {
    render(<AvatarCell name="Ahmed Ali" />);
    expect(screen.getByText("AA")).toBeInTheDocument();
  });

  it("renders ? fallback for empty name", () => {
    render(<AvatarCell name="" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
