import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  cpf: string;
  rg: string;
  groupId?: number;
  addressId?: number;
  createdAt: Date;
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

interface Group {
  id: number;
  name: string;
  schedule: string;
  maxStudents: number;
  currentStudents: number;
}

interface StudentState {
  student: Student | null;
  payments: Payment[];
  group: Group | null;
  isLoading: boolean;

  // Actions
  setStudent: (student: Student | null) => void;
  setPayments: (payments: Payment[]) => void;
  setGroup: (group: Group | null) => void;
  setIsLoading: (loading: boolean) => void;

  // Computed
  getPendingPayments: () => Payment[];
  getOverduePayments: () => Payment[];
  getTotalDebt: () => number;

  // Clear
  clearStudentData: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      student: null,
      payments: [],
      group: null,
      isLoading: false,

      setStudent: (student: Student | null) => set({ student }),

      setPayments: (payments: Payment[]) => set({ payments }),

      setGroup: (group: Group | null) => set({ group }),

      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      getPendingPayments: () => {
        const state = get();
        return state.payments.filter((p) => p.status === "pending");
      },

      getOverduePayments: () => {
        const state = get();
        return state.payments.filter((p) => p.status === "overdue");
      },

      getTotalDebt: () => {
        const state = get();
        return state.payments
          .filter((p) => p.status === "pending" || p.status === "overdue")
          .reduce((total, payment) => total + payment.amount, 0);
      },

      clearStudentData: () => {
        set({
          student: null,
          payments: [],
          group: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "student-storage",
      partialize: (state) => ({
        student: state.student,
        payments: state.payments,
        group: state.group,
      }),
    }
  )
);
