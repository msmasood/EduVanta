// Teachers feature barrel exports

export { TeacherList } from "./components/teacher-list";
export { TeacherForm } from "./components/teacher-form";
export { TeacherStatusCards } from "./components/teacher-status-summary";
export { TeacherProfileHeader } from "./components/teacher-profile-header";
export { TeacherProfileTabs } from "./components/teacher-profile-tabs";
export { TeacherInfoCard } from "./components/teacher-info-card";
export { TeacherAcademicCard } from "./components/teacher-academic-card";
export { TeacherContactCard } from "./components/teacher-contact-card";
export { TeacherClassesCard } from "./components/teacher-classes-card";
export { TeacherAttendanceGrid } from "./components/teacher-attendance-grid";
export { TeacherAttendanceList } from "./components/teacher-attendance-list";
export { TeacherTimetable } from "./components/teacher-timetable";
export { TeacherTimetableCalendar } from "./components/teacher-timetable-calendar";
export { useTeacherColumns, TEACHER_FILTER_CONFIGS } from "./components/teacher-columns";

// Utils
export {
  mapTeachersToRows,
  buildTeacherStatusSummary,
  countTeacherAttendanceStatuses,
  mapTimetableEntriesToRows,
  mapTimetableToCalendarEvents,
  teacherStatusToVariant,
} from "./utils/teacher-mappers";
export {
  GENDER_OPTIONS,
  TEACHER_STATUS_OPTIONS,
  ATTENDANCE_STATUS_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
} from "./utils/teacher-form-options";
