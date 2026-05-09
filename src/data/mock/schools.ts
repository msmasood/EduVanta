import type { School, SchoolProfile, SchoolSettings } from "@/types/user";
import type { AcademicYear } from "@/types/academic";

export const schools: School[] = [
  {
    id: "school-001",
    name: "Al-Noor International School",
    slug: "al-noor-intl",
    type: "school",
    logo: "/logos/al-noor.svg",
    address: {
      line1: "Block 5, Clifton",
      city: "Karachi",
      state: "Sindh",
      postalCode: "75600",
      country: "PK",
    },
    contact: {
      email: "info@alnoor.edu.pk",
      phone: "+92-21-1234567",
    },
    defaultLocale: "ur",
    defaultCurrency: "PKR",
    status: "active",
    audit: {
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    },
  },
  {
    id: "school-002",
    name: "Emirates Academy",
    slug: "emirates-academy",
    type: "school",
    logo: "/logos/emirates-academy.svg",
    address: {
      line1: "Al Wasl Road",
      city: "Dubai",
      country: "AE",
    },
    contact: {
      email: "info@emiratesacademy.ae",
      phone: "+971-4-1234567",
    },
    defaultLocale: "ar",
    defaultCurrency: "AED",
    status: "active",
    audit: {
      createdAt: "2022-09-01T00:00:00.000Z",
      updatedAt: "2024-05-15T00:00:00.000Z",
    },
  },
];

export const schoolProfiles: SchoolProfile[] = [
  {
    ...schools[0],
    totalStudents: 1240,
    totalTeachers: 68,
    totalEmployees: 45,
    activeSessions: 12,
  },
  {
    ...schools[1],
    totalStudents: 890,
    totalTeachers: 52,
    totalEmployees: 38,
    activeSessions: 8,
  },
];

export const schoolSettings: SchoolSettings[] = [
  {
    schoolId: "school-001",
    allowSelfRegistration: false,
    enableSMSNotifications: true,
    enableEmailNotifications: true,
    academicYearStart: "2024-04-01",
    academicYearEnd: "2025-03-31",
    defaultTimezone: "Asia/Karachi",
    audit: {
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2024-04-01T00:00:00.000Z",
    },
  },
];

export const academicYears: AcademicYear[] = [
  {
    id: "ay-001",
    schoolId: "school-001",
    name: "2024-2025",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    isCurrent: true,
    audit: {
      createdAt: "2024-01-10T00:00:00.000Z",
      updatedAt: "2024-03-25T00:00:00.000Z",
    },
  },
  {
    id: "ay-002",
    schoolId: "school-001",
    name: "2023-2024",
    startDate: "2023-04-01",
    endDate: "2024-03-31",
    isCurrent: false,
    audit: {
      createdAt: "2023-01-10T00:00:00.000Z",
      updatedAt: "2024-03-31T00:00:00.000Z",
    },
  },
  {
    id: "ay-003",
    schoolId: "school-002",
    name: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-06-30",
    isCurrent: true,
    audit: {
      createdAt: "2024-06-01T00:00:00.000Z",
      updatedAt: "2024-06-01T00:00:00.000Z",
    },
  },
];
