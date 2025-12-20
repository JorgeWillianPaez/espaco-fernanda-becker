import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  activeStudents: number;
  inactiveStudents: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // Vem como string ISO do JSON
  cpf: string;
  rg: string;
  groupId?: number;
  addressId?: number;
  createdAt: string; // Vem como string ISO do JSON
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  groups: number[];
  createdAt: string; // Vem como string ISO do JSON
}

interface Group {
  id: number;
  name: string;
  schedule: string;
  maxStudents: number;
  currentStudents: number;
  teacherId?: number;
}

interface Payment {
  id: number;
  userId: number;
  planId: number;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  status: "pending" | "paid" | "overdue" | "cancelled";
  createdAt: Date;
}

interface AdminState {
  stats: AdminStats | null;
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  payments: Payment[];
  isLoading: boolean;

  // Actions
  setStats: (stats: AdminStats | null) => void;
  setStudents: (students: Student[]) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setGroups: (groups: Group[]) => void;
  setPayments: (payments: Payment[]) => void;
  setIsLoading: (loading: boolean) => void;

  // CRUD operations
  addStudent: (student: Student) => void;
  updateStudent: (id: number, student: Partial<Student>) => void;
  removeStudent: (id: number) => void;

  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: number, teacher: Partial<Teacher>) => void;
  removeTeacher: (id: number) => void;

  addGroup: (group: Group) => void;
  updateGroup: (id: number, group: Partial<Group>) => void;
  removeGroup: (id: number) => void;

  // Computed
  getStudentById: (id: number) => Student | undefined;
  getTeacherById: (id: number) => Teacher | undefined;
  getGroupById: (id: number) => Group | undefined;
  getStudentsByGroup: (groupId: number) => Student[];
  getPaymentsByStudent: (studentId: number) => Payment[];

  // Clear
  clearAdminData: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      stats: null,
      students: [],
      teachers: [],
      groups: [],
      payments: [],
      isLoading: false,

      setStats: (stats: AdminStats | null) => set({ stats }),

      setStudents: (students: Student[]) => set({ students }),

      setTeachers: (teachers: Teacher[]) => set({ teachers }),

      setGroups: (groups: Group[]) => set({ groups }),

      setPayments: (payments: Payment[]) => set({ payments }),

      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      addStudent: (student: Student) => {
        set((state) => ({
          students: [...state.students, student],
        }));
      },

      updateStudent: (id: number, updatedStudent: Partial<Student>) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updatedStudent } : s
          ),
        }));
      },

      removeStudent: (id: number) => {
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        }));
      },

      addTeacher: (teacher: Teacher) => {
        set((state) => ({
          teachers: [...state.teachers, teacher],
        }));
      },

      updateTeacher: (id: number, updatedTeacher: Partial<Teacher>) => {
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? { ...t, ...updatedTeacher } : t
          ),
        }));
      },

      removeTeacher: (id: number) => {
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        }));
      },

      addGroup: (group: Group) => {
        set((state) => ({
          groups: [...state.groups, group],
        }));
      },

      updateGroup: (id: number, updatedGroup: Partial<Group>) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updatedGroup } : g
          ),
        }));
      },

      removeGroup: (id: number) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        }));
      },

      getStudentById: (id: number) => {
        const state = get();
        return state.students.find((s) => s.id === id);
      },

      getTeacherById: (id: number) => {
        const state = get();
        return state.teachers.find((t) => t.id === id);
      },

      getGroupById: (id: number) => {
        const state = get();
        return state.groups.find((g) => g.id === id);
      },

      getStudentsByGroup: (groupId: number) => {
        const state = get();
        return state.students.filter((s) => s.groupId === groupId);
      },

      getPaymentsByStudent: (studentId: number) => {
        const state = get();
        return state.payments.filter((p) => p.userId === studentId);
      },

      clearAdminData: () => {
        set({
          stats: null,
          students: [],
          teachers: [],
          groups: [],
          payments: [],
          isLoading: false,
        });
      },
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        stats: state.stats,
        students: state.students,
        teachers: state.teachers,
        groups: state.groups,
        payments: state.payments,
      }),
    }
  )
);
