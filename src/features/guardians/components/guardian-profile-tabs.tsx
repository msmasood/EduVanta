"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Guardian } from "@/types/guardian";
import type { LinkedStudentRow } from "../utils/guardian-mappers";
import { GuardianInfoCard } from "./guardian-info-card";
import { GuardianContactCard } from "./guardian-contact-card";
import { GuardianAccessCard } from "./guardian-access-card";
import { GuardianLinkedStudentsCard } from "./guardian-linked-students-card";
import { GuardianStudentLinksTable } from "./guardian-student-links-table";

interface GuardianProfileTabsProps {
  guardian: Guardian;
  linkedStudents: LinkedStudentRow[];
  locale?: string;
}

export function GuardianProfileTabs({
  guardian,
  linkedStudents,
  locale = "en",
}: GuardianProfileTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4 flex flex-wrap gap-1 h-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="students">
          Linked Students
          {linkedStudents.length > 0 && (
            <span className="ms-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">
              {linkedStudents.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview">
        <div className="grid gap-4 sm:grid-cols-2">
          <GuardianInfoCard guardian={guardian} />
          <GuardianContactCard guardian={guardian} />
        </div>
      </TabsContent>

      {/* Contact */}
      <TabsContent value="contact">
        <GuardianContactCard guardian={guardian} />
      </TabsContent>

      {/* Linked Students */}
      <TabsContent value="students">
        <div className="space-y-4" data-testid="linked-students-section">
          <GuardianLinkedStudentsCard linkedStudents={linkedStudents} locale={locale} />
          {linkedStudents.length > 0 && (
            <GuardianStudentLinksTable linkedStudents={linkedStudents} locale={locale} />
          )}
        </div>
      </TabsContent>

      {/* Access */}
      <TabsContent value="access">
        <GuardianAccessCard guardian={guardian} />
      </TabsContent>
    </Tabs>
  );
}
