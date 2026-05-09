"use client";

import * as React from "react";
import type { Student } from "@/types/student";
import type { Guardian } from "@/types/guardian";
import type { AttendanceSummary } from "@/types/attendance";
import type { ClassLevel, Section } from "@/types/academic";
import type { StudentCategory } from "@/types/student";

import { StudentInfoCard } from "./student-info-card";
import { StudentAcademicCard } from "./student-academic-card";
import { StudentGuardianCard } from "./student-guardian-card";
import { StudentAttendanceGrid } from "./student-attendance-grid";
import { cn } from "@/lib/utils";

type TabId = "overview" | "academic" | "guardian" | "attendance";

interface StudentProfileTabsProps {
  student: Student;
  guardian?: Guardian | null;
  attendanceSummary?: AttendanceSummary | null;
  classLevel?: ClassLevel | null;
  section?: Section | null;
  category?: StudentCategory | null;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "academic", label: "Academic" },
  { id: "guardian", label: "Guardian" },
  { id: "attendance", label: "Attendance" },
];

export function StudentProfileTabs({
  student,
  guardian,
  attendanceSummary,
  classLevel,
  section,
  category,
}: StudentProfileTabsProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");

  return (
    <div className="space-y-4">
      {/* Tab nav */}
      <div
        className="flex gap-1 overflow-x-auto rounded-lg border bg-muted/50 p-1"
        role="tablist"
        aria-label="Student profile sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "min-w-max rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <StudentInfoCard student={student} />
          <StudentAcademicCard
            student={student}
            className_={classLevel?.name}
            sectionName={section?.name}
            categoryName={category?.name}
          />
        </div>
      )}
      {activeTab === "academic" && (
        <StudentAcademicCard
          student={student}
          className_={classLevel?.name}
          sectionName={section?.name}
          categoryName={category?.name}
        />
      )}
      {activeTab === "guardian" && (
        <StudentGuardianCard guardian={guardian} />
      )}
      {activeTab === "attendance" && (
        <StudentAttendanceGrid summary={attendanceSummary} />
      )}
    </div>
  );
}
