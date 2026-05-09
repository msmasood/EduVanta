"use client";

import { BookOpen } from "lucide-react";
import type { TeacherSubjectAssignment } from "@/types/teacher";
import type { ClassLevel, Section, Subject } from "@/types/academic";

interface TeacherClassesCardProps {
  assignments: TeacherSubjectAssignment[];
  classes: ClassLevel[];
  sections: Section[];
  subjects: Subject[];
}

export function TeacherClassesCard({
  assignments,
  classes,
  sections,
  subjects,
}: TeacherClassesCardProps) {
  const classMap = new Map(classes.map((c) => [c.id, c.name]));
  const sectionMap = new Map(sections.map((s) => [s.id, s.name]));
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  if (assignments.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Classes & Assignments</h3>
        <p className="text-sm text-muted-foreground">No class assignments found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">Classes & Assignments</h3>
      <div className="space-y-2">
        {assignments.map((a) => {
          const className = classMap.get(a.classId) ?? a.classId;
          const sectionName = sectionMap.get(a.sectionId) ?? a.sectionId;
          const subjectName = subjectMap.get(a.subjectId) ?? a.subjectId;
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
            >
              <BookOpen className="size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{subjectName}</p>
                <p className="text-xs text-muted-foreground">
                  {className} — Section {sectionName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
