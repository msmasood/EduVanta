"use client";

import type { Teacher } from "@/types/teacher";
import { formatDate } from "@/lib/dates";
import { Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase } from "lucide-react";

interface TeacherInfoCardProps {
  teacher: Teacher;
}

export function TeacherInfoCard({ teacher }: TeacherInfoCardProps) {
  const rows = [
    {
      icon: Mail,
      label: "Email",
      value: teacher.contact?.email ?? "—",
    },
    {
      icon: Phone,
      label: "Phone",
      value: teacher.contact?.phone ?? "—",
    },
    {
      icon: MapPin,
      label: "Address",
      value: [teacher.address?.line1, teacher.address?.city]
        .filter(Boolean)
        .join(", ") || "—",
    },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: teacher.dateOfBirth ? formatDate(teacher.dateOfBirth) : "—",
    },
    {
      icon: Calendar,
      label: "Joining Date",
      value: teacher.joiningDate ? formatDate(teacher.joiningDate) : "—",
    },
    {
      icon: GraduationCap,
      label: "Qualification",
      value: teacher.qualification || "—",
    },
    {
      icon: Briefcase,
      label: "Experience",
      value:
        teacher.experience !== undefined
          ? `${teacher.experience} year${teacher.experience !== 1 ? "s" : ""}`
          : "—",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">Personal Information</h3>
      <ul className="space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <li key={row.label} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="text-sm font-medium break-all">{row.value}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
