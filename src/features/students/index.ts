// Student feature barrel exports

export { StudentList } from "./components/student-list";
export { StudentForm } from "./components/student-form";
export { StudentStatusCards } from "./components/student-status-summary";
export { StudentProfileHeader } from "./components/student-profile-header";
export { StudentProfileTabs } from "./components/student-profile-tabs";
export { StudentInfoCard } from "./components/student-info-card";
export { StudentAcademicCard } from "./components/student-academic-card";
export { StudentGuardianCard } from "./components/student-guardian-card";
export { StudentAttendanceGrid } from "./components/student-attendance-grid";
export { StudentCategoryManager } from "./components/student-category-manager";
export { SuspendedStudentsList } from "./components/suspended-students-list";
export { useStudentColumns, STUDENT_FILTER_CONFIGS } from "./components/student-columns";

// Utils
export {
  mapStudentsToRows,
  buildStudentStatusSummary,
  filterSuspendedStudents,
  countAttendanceStatuses,
  buildCategoryStudentCounts,
  studentStatusToVariant,
} from "./utils/student-mappers";
export {
  GENDER_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  ATTENDANCE_STATUS_OPTIONS,
} from "./utils/student-form-options";
