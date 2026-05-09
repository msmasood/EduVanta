"use client";

import * as React from "react";
import type { Teacher, TeacherSubjectAssignment } from "@/types/teacher";
import type { AttendanceSummary } from "@/types/attendance";
import type { ClassLevel, Section, Subject } from "@/types/academic";
import type { Department } from "@/types/employee";

import { TeacherInfoCard } from "./teacher-info-card";
import { TeacherAcademicCard } from "./teacher-academic-card";
import { TeacherContactCard } from "./teacher-contact-card";
import { TeacherClassesCard } from "./teacher-classes-card";
import { TeacherAttendanceGrid } from "./teacher-attendance-grid";
import { cn } from "@/lib/utils";

type TabId = "overview" | "academic" | "classes" | "attendance";

interface TeacherProfileTabsProps {
  teacher: Teacher;
  assignments?: TeacherSubjectAssignment[];
  attendanceSummary?: AttendanceSummary | null;
  department?: Department | null;
  classes?: ClassLevel[];
  sections?: Section[];
  subjects?: Subject[];
}

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "academic", label: "Academic" },
  { id: "classes", label: "Classes" },
  { id: "attendance", label: "Attendance" },
];

export function TeacherProfileTabs({
  teacher,
  assignments = [],
  attendanceSummary,
  department,
  classes = [],
  sections = [],
  subjects = [],
}: TeacherProfileTabsProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");

  const subjectNames = teacher.subjects
    .map((sid) => subjects.find((s) => s.id === sid)?.name ?? sid);

  return (
    <div className="space-y-4">
      {/* Tab nav */}
      <div
        className="flex gap-1 overflow-x-auto rounded-lg border bg-muted/50 p-1"
        role="tablist"
        aria-label="Teacher profile sections"
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
          <TeacherInfoCard teacher={teacher} />
          <TeacherContactCard teacher={teacher} />
        </div>
      )}

      {activeTab === "academic" && (
        <TeacherAcademicCard
          teacher={teacher}
          departmentName={department?.name}
          subjectNames={subjectNames}
        />
      )}

      {activeTab === "classes" && (
        <TeacherClassesCard
          assignments={assignments}
          classes={classes}
          sections={sections}
          subjects={subjects}
        />
      )}

      {activeTab === "attendance" && (
        <TeacherAttendanceGrid summary={attendanceSummary} />
      )}
    </div>
  );
}
