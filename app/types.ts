export interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  status: "past" | "open" | "upcoming";
  image: string;
  photos: string[];
  price?: string;
}

export interface Payment {
  month: string;
  status: "paid" | "pending";
  amount: string;
  dueDate: string;
  paidDate?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Student {
  name: string;
  email: string;
  phone: string;
  class: string;
  status: string;
  profileImage: string;
  enrollmentDate: string;
  schedule: ClassSchedule[];
  payments: Payment[];
  attendances?: Attendance[];
  birthDate?: string;
  address?: string;
  cpf?: string;
  rg?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  takesMedication?: boolean;
  medicationDescription?: string;
  paymentMethods?: string[];
  guardian?: string;
}

export interface StudentsData {
  [key: string]: Student;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  maxStudents: number;
  currentStudents: number;
  schedule: ClassSchedule[];
  teacher: string;
  room: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  profileImage: string;
  classes: string[];
  startDate: string;
}

export interface AdminStudent extends Student {
  id: string;
  classId: string;
}
