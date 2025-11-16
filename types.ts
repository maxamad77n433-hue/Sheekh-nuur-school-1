
export enum Role {
  Student = 'Student',
  Parent = 'Parent',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl: string;
  child?: {
    id: string;
    name: string;
  };
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  submitted: boolean;
}

export interface Grade {
  id: string;
  courseId: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface Fee {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Unpaid';
}

export interface ChatMessage {
    sender: 'user' | 'model';
    text: string;
}
