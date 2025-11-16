
import { Role, User, Course, Grade, Assignment, AttendanceRecord, Fee } from './types';
import { HomeIcon, AssignmentIcon, GradeIcon, AttendanceIcon, FeeIcon, SchoolIcon, AIToolsIcon, LogoutIcon } from './components/Icons';

export const MOCK_USERS: Record<Role, User> = {
  [Role.Student]: {
    id: 'student1',
    name: 'Abdi Farah',
    role: Role.Student,
    avatarUrl: 'https://picsum.photos/seed/student/200',
  },
  [Role.Parent]: {
    id: 'parent1',
    name: 'Aisha Ahmed',
    role: Role.Parent,
    avatarUrl: 'https://picsum.photos/seed/parent/200',
    child: { id: 'student1', name: 'Abdi Farah' },
  },
  [Role.Teacher]: {
    id: 'teacher1',
    name: 'Mr. Hassan',
    role: Role.Teacher,
    avatarUrl: 'https://picsum.photos/seed/teacher/200',
  },
  [Role.Admin]: {
    id: 'admin1',
    name: 'Mrs. Ali',
    role: Role.Admin,
    avatarUrl: 'https://picsum.photos/seed/admin/200',
  },
};

export const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Mathematics', teacher: 'Mr. Hassan', schedule: 'Mon, Wed 10:00 AM' },
  { id: 'c2', name: 'Science', teacher: 'Ms. Jama', schedule: 'Tue, Thu 11:00 AM' },
  { id: 'c3', name: 'Somali', teacher: 'Mr. Omar', schedule: 'Mon, Fri 9:00 AM' },
  { id: 'c4', name: 'English', teacher: 'Ms. Davis', schedule: 'Tue, Thu 1:00 PM' },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', courseId: 'c1', title: 'Algebra Homework 1', dueDate: '2024-08-15', submitted: true },
  { id: 'a2', courseId: 'c2', title: 'Biology Lab Report', dueDate: '2024-08-18', submitted: false },
  { id: 'a3', courseId: 'c3', title: 'Gabay Analysis', dueDate: '2024-08-20', submitted: false },
];

export const MOCK_GRADES: Grade[] = [
  { id: 'g1', courseId: 'c1', assignmentTitle: 'Algebra Homework 1', score: 92, maxScore: 100 },
  { id: 'g2', courseId: 'c2', assignmentTitle: 'Physics Midterm', score: 85, maxScore: 100 },
  { id: 'g3', courseId: 'c3', assignmentTitle: 'Maahmaahyo Quiz', score: 95, maxScore: 100 },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { date: '2024-08-01', status: 'Present' },
    { date: '2024-08-02', status: 'Present' },
    { date: '2024-08-03', status: 'Absent' },
    { date: '2024-08-04', status: 'Present' },
    { date: '2024-08-05', status: 'Late' },
];

export const MOCK_FEES: Fee[] = [
    { id: 'f1', description: 'Term 1 Tuition Fee', amount: 500, dueDate: '2024-08-01', status: 'Paid'},
    { id: 'f2', description: 'Library Fee', amount: 25, dueDate: '2024-08-15', status: 'Paid'},
    { id: 'f3', description: 'Term 2 Tuition Fee', amount: 500, dueDate: '2024-10-01', status: 'Unpaid'},
];


export const NAV_LINKS = {
    [Role.Student]: [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'assignments', label: 'Assignments', icon: AssignmentIcon },
        { id: 'grades', label: 'Grades', icon: GradeIcon },
        { id: 'attendance', label: 'Attendance', icon: AttendanceIcon },
    ],
    [Role.Parent]: [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'grades', label: 'Grades', icon: GradeIcon },
        { id: 'attendance', label: 'Attendance', icon: AttendanceIcon },
        { id: 'fees', label: 'Fees', icon: FeeIcon },
    ],
    [Role.Teacher]: [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'assignments', label: 'Manage Assignments', icon: AssignmentIcon },
        { id: 'grades', label: 'Enter Grades', icon: GradeIcon },
        { id: 'attendance', label: 'Take Attendance', icon: AttendanceIcon },
    ],
    [Role.Admin]: [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'assignments', label: 'All Assignments', icon: AssignmentIcon },
        { id: 'grades', label: 'All Grades', icon: GradeIcon },
        { id: 'attendance', label: 'Attendance Records', icon: AttendanceIcon },
        { id: 'fees', label: 'Fee Management', icon: FeeIcon },
    ],
};

export const COMMON_NAV_LINKS = [
    { id: 'ai-tools', label: 'AI Tools', icon: AIToolsIcon },
    { id: 'profile', label: 'School Profile', icon: SchoolIcon },
];

export const LOGOUT_LINK = { id: 'logout', label: 'Logout', icon: LogoutIcon };
