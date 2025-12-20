import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
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

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // Vem como string ISO do JSON
  groupId?: number;
}

interface TeacherState {
  teacher: Teacher | null;
  groups: Group[];
  students: Student[];
  isLoading: boolean;

  // Actions
  setTeacher: (teacher: Teacher | null) => void;
  setGroups: (groups: Group[]) => void;
  setStudents: (students: Student[]) => void;
  setIsLoading: (loading: boolean) => void;

  // Computed
  getMyGroups: () => Group[];
  getStudentsByGroup: (groupId: number) => Student[];
  getTotalStudents: () => number;

  // Clear
  clearTeacherData: () => void;
}

export const useTeacherStore = create<TeacherState>()(
  persist(
    (set, get) => ({
      teacher: null,
      groups: [],
      students: [],
      isLoading: false,

      setTeacher: (teacher: Teacher | null) => set({ teacher }),

      setGroups: (groups: Group[]) => set({ groups }),

      setStudents: (students: Student[]) => set({ students }),

      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      getMyGroups: () => {
        const state = get();
        if (!state.teacher) return [];
        return state.groups.filter((g) => g.teacherId === state.teacher?.id);
      },

      getStudentsByGroup: (groupId: number) => {
        const state = get();
        return state.students.filter((s) => s.groupId === groupId);
      },

      getTotalStudents: () => {
        const state = get();
        return state.students.length;
      },

      clearTeacherData: () => {
        set({
          teacher: null,
          groups: [],
          students: [],
          isLoading: false,
        });
      },
    }),
    {
      name: "teacher-storage",
      partialize: (state) => ({
        teacher: state.teacher,
        groups: state.groups,
        students: state.students,
      }),
    }
  )
);
