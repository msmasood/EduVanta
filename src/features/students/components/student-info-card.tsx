"use client";

import { User, Mail, Phone, MapPin, Heart, Flag } from "lucide-react";
import type { Student } from "@/types/student";
import { formatDate } from "@/lib/dates";

interface StudentInfoCardProps {
  student: Student;
}

export function StudentInfoCard({ student }: StudentInfoCardProps) {
  const rows: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: User, label: "Gender", value: student.gender ?? "—" },
    {
      icon: User,
      label: "Date of Birth",
      value: student.dateOfBirth ? formatDate(student.dateOfBirth) : "—",
    },
    {
      icon: Heart,
      label: "Blood Group",
      value: student.bloodGroup ?? "—",
    },
    {
      icon: Mail,
      label: "Email",
      value: student.contact?.email ?? "—",
    },
    {
      icon: Phone,
      label: "Phone",
      value: student.contact?.phone ?? "—",
    },
    {
      icon: MapPin,
      label: "Address",
      value: student.address
        ? [student.address.line1, student.address.city, student.address.country]
            .filter(Boolean)
            .join(", ")
        : "—",
    },
    {
      icon: Flag,
      label: "Nationality",
      value: student.nationality ?? "—",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">Personal Information</h3>
      <dl className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            <div>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium capitalize">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
