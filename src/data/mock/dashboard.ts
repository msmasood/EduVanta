import type {
  DashboardSummary,
  SchoolDashboardData,
  StudentDashboardData,
  TeacherDashboardData,
  ParentDashboardData,
  LMSDashboardData,
  UniversityDashboardData,
} from "@/types/dashboard";

const schoolDashboard: SchoolDashboardData = {
  totalStudents: { label: "Total Students", value: 1240, trend: { direction: "up", percentage: 8.2, label: "vs last year" } },
  totalTeachers: { label: "Teachers", value: 68, trend: { direction: "up", percentage: 2.5, label: "vs last year" } },
  totalEmployees: { label: "Staff", value: 45, trend: { direction: "neutral", percentage: 0, label: "vs last year" } },
  todayAttendance: { label: "Today's Attendance", value: "91.5%", unit: "%", trend: { direction: "up", percentage: 1.2, label: "vs yesterday" } },
  monthlyRevenue: { label: "Monthly Revenue", value: 9856000, unit: "PKR", trend: { direction: "up", percentage: 5.4, label: "vs last month" } },
  pendingFees: { label: "Pending Fees", value: 325000, unit: "PKR", trend: { direction: "down", percentage: 12.0, label: "vs last month" } },
  pendingLeaves: { label: "Pending Leaves", value: 3, trend: { direction: "neutral", percentage: 0, label: "" } },
  upcomingEvents: { label: "Upcoming Events", value: 4, trend: { direction: "neutral", percentage: 0, label: "" } },
  attendanceTrend: [
    { label: "Apr", value: 92 },
    { label: "May", value: 91 },
    { label: "Jun", value: 89 },
    { label: "Jul", value: 93 },
    { label: "Aug", value: 94 },
    { label: "Sep", value: 91 },
    { label: "Oct", value: 92 },
  ],
  feeCollectionTrend: [
    { label: "Apr", value: 8900000 },
    { label: "May", value: 9100000 },
    { label: "Jun", value: 8500000 },
    { label: "Jul", value: 9200000 },
    { label: "Aug", value: 9400000 },
    { label: "Sep", value: 9350000 },
    { label: "Oct", value: 9856000 },
  ],
  studentGenderDistribution: [
    { label: "Male", value: 672, color: "#0891b2" },
    { label: "Female", value: 568, color: "#e879f9" },
  ],
  recentNotices: [
    { id: "notice-005", title: "Fee Due Reminder — October 2024", date: "2024-10-05" },
    { id: "notice-003", title: "Annual Sports Day Registration", date: "2024-10-01" },
    { id: "notice-004", title: "Staff Professional Development Day", date: "2024-10-03" },
  ],
};

const studentDashboard: StudentDashboardData = {
  attendancePercentage: { label: "Attendance", value: "90.9%", trend: { direction: "up", percentage: 2.1, label: "vs last month" } },
  subjectsEnrolled: { label: "Subjects", value: 7 },
  upcomingExams: { label: "Upcoming Exams", value: 5, trend: { direction: "neutral", percentage: 0, label: "this week" } },
  pendingFees: { label: "Pending Fees", value: 8000, unit: "PKR" },
  gpa: { label: "GPA", value: "3.6", trend: { direction: "up", percentage: 0.2, label: "vs last term" } },
  attendanceTrend: [
    { label: "Apr", value: 95 },
    { label: "May", value: 90 },
    { label: "Jun", value: 88 },
    { label: "Jul", value: 85 },
    { label: "Aug", value: 92 },
    { label: "Sep", value: 89 },
    { label: "Oct", value: 91 },
  ],
  subjectPerformance: [
    { label: "Math", value: 87 },
    { label: "English", value: 93 },
    { label: "Urdu", value: 78 },
    { label: "Science", value: 82 },
    { label: "CS", value: 91 },
    { label: "Isl.Studies", value: 88 },
    { label: "Chemistry", value: 75 },
  ],
  recentResults: [
    { subject: "Mathematics", grade: "A", percentage: 87 },
    { subject: "English", grade: "A", percentage: 93 },
    { subject: "Urdu", grade: "B+", percentage: 78 },
  ],
  upcomingSchedule: [
    { subject: "Mathematics", time: "08:00 - 08:45", room: "Room 101" },
    { subject: "English", time: "09:00 - 09:45", room: "Room 102" },
    { subject: "Science", time: "10:00 - 10:45", room: "Science Lab" },
  ],
};

const teacherDashboard: TeacherDashboardData = {
  myClasses: { label: "My Classes", value: 4 },
  myStudents: { label: "My Students", value: 142, trend: { direction: "up", percentage: 3.0, label: "vs last year" } },
  todayAttendanceMarked: { label: "Attendance Marked", value: "3/4", trend: { direction: "neutral", percentage: 0, label: "classes today" } },
  pendingLeaves: { label: "Pending Leaves", value: 0 },
  upcomingExams: { label: "Exams to Invigilate", value: 2 },
  classwiseAttendance: [
    { label: "Class 5A", value: 94 },
    { label: "Class 5B", value: 89 },
    { label: "Class 8A", value: 91 },
    { label: "Class 10A", value: 87 },
  ],
  subjectPerformance: [
    { label: "Class 5A", value: 82 },
    { label: "Class 5B", value: 76 },
    { label: "Class 8A", value: 79 },
    { label: "Class 10A", value: 85 },
  ],
  timetableToday: [
    { period: "1st", subject: "Mathematics", class: "Class 5 - A", room: "Room 101" },
    { period: "3rd", subject: "Mathematics", class: "Class 8 - A", room: "Room 201" },
    { period: "5th", subject: "Mathematics", class: "Class 5 - B", room: "Room 102" },
    { period: "7th", subject: "Mathematics", class: "Class 10 - A", room: "Room 201" },
  ],
};

const parentDashboard: ParentDashboardData = {
  childrenCount: { label: "Children", value: 1 },
  pendingFees: { label: "Pending Fees", value: 8000, unit: "PKR" },
  recentAttendance: { label: "Attendance This Month", value: "90.9%", trend: { direction: "up", percentage: 2.1, label: "vs last month" } },
  upcomingEvents: { label: "Upcoming Events", value: 2 },
  children: [
    { id: "student-001", name: "Ahmed Khan", class: "Class 5 - A", attendance: 90.9 },
  ],
  notices: [
    { id: "notice-005", title: "Fee Due Reminder — October 2024", date: "2024-10-05" },
    { id: "notice-002", title: "Mid-Term Examination Schedule", date: "2024-09-20" },
  ],
};

const lmsDashboard: LMSDashboardData = {
  totalCourses: { label: "Total Courses", value: 48, trend: { direction: "up", percentage: 12.0, label: "vs last quarter" } },
  enrolledLearners: { label: "Enrolled Learners", value: 3420, trend: { direction: "up", percentage: 15.5, label: "vs last quarter" } },
  completionRate: { label: "Completion Rate", value: "68%", trend: { direction: "up", percentage: 3.2, label: "vs last quarter" } },
  averageScore: { label: "Avg. Score", value: "74.5%", trend: { direction: "up", percentage: 1.8, label: "vs last quarter" } },
  courseCompletionTrend: [
    { label: "Jan", value: 58 },
    { label: "Feb", value: 61 },
    { label: "Mar", value: 65 },
    { label: "Apr", value: 62 },
    { label: "May", value: 67 },
    { label: "Jun", value: 71 },
    { label: "Jul", value: 68 },
  ],
  topCourses: [
    { id: "course-001", title: "Introduction to Python", enrolled: 420, completion: 82 },
    { id: "course-002", title: "English for Business", enrolled: 380, completion: 76 },
    { id: "course-003", title: "Mathematics Foundation", enrolled: 350, completion: 71 },
    { id: "course-004", title: "Digital Literacy", enrolled: 290, completion: 88 },
    { id: "course-005", title: "Islamic Studies Module", enrolled: 260, completion: 64 },
  ],
};

const universityDashboard: UniversityDashboardData = {
  totalStudents: { label: "Students", value: 8540, trend: { direction: "up", percentage: 4.5, label: "vs last year" } },
  totalFaculty: { label: "Faculty", value: 420, trend: { direction: "up", percentage: 2.0, label: "vs last year" } },
  totalDepartments: { label: "Departments", value: 18 },
  researchProjects: { label: "Active Research Projects", value: 34, trend: { direction: "up", percentage: 13.0, label: "vs last year" } },
  enrollmentTrend: [
    { label: "2019", value: 6800 },
    { label: "2020", value: 7100 },
    { label: "2021", value: 7350 },
    { label: "2022", value: 7700 },
    { label: "2023", value: 8180 },
    { label: "2024", value: 8540 },
  ],
  departmentWiseStudents: [
    { label: "Engineering", value: 1850 },
    { label: "Business", value: 1620 },
    { label: "Medicine", value: 980 },
    { label: "Computer Science", value: 1140 },
    { label: "Arts & Humanities", value: 820 },
    { label: "Social Sciences", value: 750 },
    { label: "Natural Sciences", value: 680 },
    { label: "Others", value: 700 },
  ],
  upcomingEvents: [
    { id: "univ-evt-001", title: "Convocation Ceremony 2024", date: "2024-12-15", type: "academic" },
    { id: "univ-evt-002", title: "Research Symposium", date: "2024-11-20", type: "academic" },
    { id: "univ-evt-003", title: "Sports Tournament", date: "2024-11-08", type: "sport" },
  ],
};

export const dashboardSummaries: Record<string, DashboardSummary> = {
  school: {
    persona: "school",
    schoolId: "school-001",
    generatedAt: "2024-10-06T06:00:00.000Z",
    data: schoolDashboard,
  },
  student: {
    persona: "student",
    schoolId: "school-001",
    generatedAt: "2024-10-06T06:00:00.000Z",
    data: studentDashboard,
  },
  teacher: {
    persona: "teacher",
    schoolId: "school-001",
    generatedAt: "2024-10-06T06:00:00.000Z",
    data: teacherDashboard,
  },
  parent: {
    persona: "parent",
    schoolId: "school-001",
    generatedAt: "2024-10-06T06:00:00.000Z",
    data: parentDashboard,
  },
  lms: {
    persona: "lms",
    schoolId: "school-001",
    generatedAt: "2024-10-06T06:00:00.000Z",
    data: lmsDashboard,
  },
  university: {
    persona: "university",
    schoolId: "school-001",
    generatedAt: "2024-10-06T06:00:00.000Z",
    data: universityDashboard,
  },
};
