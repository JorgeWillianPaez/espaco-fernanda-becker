export interface EventPhoto {
  id: number;
  eventId: number;
  url: string;
  caption?: string;
  displayOrder: number;
  createdAt: Date;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  status: "past" | "open" | "upcoming";
  image: string;
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
  className?: string;
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

// ========== TURMAS (CLASSES) ==========

export interface ClassData {
  id: number;
  name: string;
  roomId?: number | null;
  room?: {
    id: number;
    name: string;
  } | null;
  startTime: string;
  endTime: string;
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  teacherId?: number | null;
  maxStudents: number;
  active: boolean;
  teacher?: {
    id: number;
    name: string;
    email: string;
  } | null;
  teacherName?: string; // Helper para acessar direto
  students?: Array<{
    id: number;
    name: string;
    email: string;
    enrolledAt: Date | null;
  }>;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassFormData {
  name: string;
  roomId?: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  teacherId?: number;
  maxStudents?: number;
  active?: boolean;
}

// ========== USER DATA ==========

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // Vem como string ISO do JSON
  cpf: string;
  rg: string;
  roleId: number;
  groupId?: number;
  addressId?: number;
  guardianId?: number;
  guardian?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  takesMedication?: boolean;
  medicationDescription?: string;
  paymentMethods?: string[];
  classIds?: number[]; // IDs das turmas em que o aluno está matriculado
  address?: {
    id?: number;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  createdAt: string; // Vem como string ISO do JSON
}

export interface UserFormData {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  cpf?: string;
  rg?: string;
  guardian?: string;
  role?: string;
  classId?: string;
  planId?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  takesMedication?: boolean;
  medicationDescription?: string;
  paymentMethods?: string[];
  discountType?: "percentage" | "value" | "none";
  discountPercentage?: string;
  discountValue?: string;
  proportionalPaymentOption?: "immediate" | "next_month";
  financialResponsibleType?: "self" | "existing" | "new";
  financialResponsibleId?: string;
  financialResponsibleName?: string;
  financialResponsibleEmail?: string;
  financialResponsiblePhone?: string;
  financialResponsibleBirthDate?: string;
  financialResponsibleCpf?: string;
}
