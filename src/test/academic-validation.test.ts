import { describe, it, expect } from "vitest";
import {
  classFormSchema,
  classroomFormSchema,
  sectionFormSchema,
  subjectFormSchema,
} from "@/lib/validations/academic";

// ─── classFormSchema ──────────────────────────────────────────────────────────

describe("classFormSchema", () => {
  const valid = { name: "Class 1", code: "CL-01", status: "active" as const };

  it("accepts valid class", () => {
    expect(classFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(classFormSchema.safeParse({ ...valid, name: "C" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(classFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(classFormSchema.safeParse({ ...valid, status: "deleted" }).success).toBe(false);
  });

  it("accepts optional fields", () => {
    expect(
      classFormSchema.safeParse({
        ...valid,
        order: 1,
        capacity: 120,
        description: "Primary class",
      }).success
    ).toBe(true);
  });
});

// ─── classroomFormSchema ──────────────────────────────────────────────────────

describe("classroomFormSchema", () => {
  const valid = {
    name: "Room 101",
    code: "R101",
    type: "classroom" as const,
    capacity: 40,
    status: "active" as const,
  };

  it("accepts valid classroom", () => {
    expect(classroomFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(classroomFormSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(classroomFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects invalid type", () => {
    expect(classroomFormSchema.safeParse({ ...valid, type: "office" }).success).toBe(false);
  });

  it("accepts lab type", () => {
    expect(classroomFormSchema.safeParse({ ...valid, type: "lab" }).success).toBe(true);
  });

  it("rejects capacity below 1", () => {
    expect(classroomFormSchema.safeParse({ ...valid, capacity: 0 }).success).toBe(false);
  });

  it("accepts optional building and floor", () => {
    expect(
      classroomFormSchema.safeParse({ ...valid, building: "Block A", floor: "2" }).success
    ).toBe(true);
  });
});

// ─── sectionFormSchema ────────────────────────────────────────────────────────

describe("sectionFormSchema", () => {
  const valid = {
    name: "A",
    code: "1-A",
    classId: "class-001",
    capacity: 35,
    status: "active" as const,
  };

  it("accepts valid section", () => {
    expect(sectionFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(sectionFormSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(sectionFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects empty classId", () => {
    expect(sectionFormSchema.safeParse({ ...valid, classId: "" }).success).toBe(false);
  });

  it("rejects capacity below 1", () => {
    expect(sectionFormSchema.safeParse({ ...valid, capacity: 0 }).success).toBe(false);
  });

  it("accepts optional classroomId and teacherId", () => {
    expect(
      sectionFormSchema.safeParse({
        ...valid,
        classroomId: "room-001",
        teacherId: "teacher-001",
      }).success
    ).toBe(true);
  });
});

// ─── subjectFormSchema ────────────────────────────────────────────────────────

describe("subjectFormSchema", () => {
  const valid = {
    name: "Mathematics",
    code: "MATH",
    type: "theory" as const,
    status: "active" as const,
  };

  it("accepts valid subject", () => {
    expect(subjectFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(subjectFormSchema.safeParse({ ...valid, name: "M" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(subjectFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects invalid type", () => {
    expect(subjectFormSchema.safeParse({ ...valid, type: "exam" }).success).toBe(false);
  });

  it("accepts elective type", () => {
    expect(subjectFormSchema.safeParse({ ...valid, type: "elective" }).success).toBe(true);
  });

  it("accepts optional creditHours", () => {
    expect(subjectFormSchema.safeParse({ ...valid, creditHours: 3 }).success).toBe(true);
  });
});
