"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import ClassModal from "./components/ClassModal";
import EditClassModal from "./components/EditClassModal";
import EditStudentModal from "./components/EditStudentModal";
import PaymentHistoryModal from "./components/PaymentHistoryModal";
import AdminSettingsModal from "./components/AdminSettingsModal";
import FinancialSummary from "./components/FinancialSummary";
import RevenueChart from "./components/RevenueChart";
import PaymentFilters from "./components/PaymentFilters";
import PaymentsTable from "./components/PaymentsTable";
import Pagination from "./components/Pagination";
import StudentFilters from "./components/StudentFilters";
import TeacherFilters from "./components/TeacherFilters";
import StudentsTable from "./components/StudentsTable";
import TeachersTable from "./components/TeachersTable";
import TeacherProfile from "./components/TeacherProfile";
import AdminProfile from "./components/AdminProfile";
import EventsManagement from "./components/EventsManagement";
import PlansManagement from "./components/PlansManagement";
import QuickInfoCards from "./components/QuickInfoCards";
import WeeklySchedule from "./components/WeeklySchedule";
import BirthdayCard from "./components/BirthdayCard";
import ClassManagementModal from "./components/ClassManagementModal";
import UserModal from "./components/UserModal";
import UsersTable from "./components/UsersTable";
import RolesTable from "./components/RolesTable";
import AttendanceModal from "./components/AttendanceModal";
import ToastContainer from "../components/ToastContainer";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../hooks/useToast";
import {
  removeMask,
  maskCPF,
  maskRG,
  maskPhone,
  maskCEP,
} from "../utils/masks";
import apiService from "@/lib/api";
import { Role, NewRole, Module } from "../types/role";
import styles from "./admin.module.css";
import {
  Teacher,
  Class,
  AdminStudent,
  ClassSchedule,
  Attendance,
  ClassData,
  ClassFormData,
  UserData,
  UserFormData,
  Payment,
} from "../types";

// Mapa para traduzir dias da semana de inglês para português
const DAY_OF_WEEK_MAP: Record<string, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

// Função helper para traduzir dia da semana
const translateDayOfWeek = (day: string): string => {
  return DAY_OF_WEEK_MAP[day.toLowerCase()] || day;
};

// Função helper para formatar horário (remover segundos)
const formatTime = (time: string): string => {
  if (!time) return "";
  // Se o horário vier como HH:MM:SS, retorna apenas HH:MM
  const parts = time.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return time;
};

// Dados mockados
const teacherData: Teacher = {
  id: "prof001",
  name: "Fernanda Becker",
  email: "fernanda@espacobecker.com",
  phone: "(41) 98765-4321",
  specialty: "Ballet Clássico e Jazz",
  profileImage: "",
  classes: ["ballet-int", "jazz-ini", "danca-ventre"],
  startDate: "15/01/2015",
};

const initialClasses: Class[] = [
  {
    id: "ballet-int",
    name: "Ballet Intermediário",
    level: "Intermediário",
    maxStudents: 15,
    currentStudents: 8,
    schedule: [
      {
        day: "Segunda-feira",
        startTime: "19:00",
        endTime: "20:30",
        room: "Sala 1",
      },
      {
        day: "Quarta-feira",
        startTime: "19:00",
        endTime: "20:30",
        room: "Sala 1",
      },
    ],
    teacher: "Fernanda Becker",
    room: "Sala 1 - Principal",
  },
  {
    id: "jazz-ini",
    name: "Jazz Iniciante",
    level: "Iniciante",
    maxStudents: 20,
    currentStudents: 8,
    schedule: [
      {
        day: "Terça-feira",
        startTime: "18:00",
        endTime: "19:30",
        room: "Sala 2",
      },
      {
        day: "Quinta-feira",
        startTime: "18:00",
        endTime: "19:30",
        room: "Sala 2",
      },
    ],
    teacher: "Fernanda Becker",
    room: "Sala 2 - Espelho",
  },
  {
    id: "danca-ventre",
    name: "Dança do Ventre",
    level: "Todos os níveis",
    maxStudents: 12,
    currentStudents: 5,
    schedule: [
      {
        day: "Sexta-feira",
        startTime: "20:00",
        endTime: "21:30",
        room: "Sala 1",
      },
    ],
    teacher: "Fernanda Becker",
    room: "Sala 1 - Principal",
  },
];

const initialStudents: AdminStudent[] = [
  {
    id: "12345",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "(41) 98765-4321",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "15/03/2023",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "03/12/2024",
      },
    ],
  },
  {
    id: "12346",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(41) 97654-3210",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "20/04/2023",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12347",
    name: "João Oliveira",
    email: "joao.oliveira@email.com",
    phone: "(41) 96543-2109",
    class: "Dança do Ventre",
    classId: "danca-ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "10/05/2023",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 250,00",
        dueDate: "05/12/2024",
        paidDate: "01/12/2024",
      },
    ],
  },
  {
    id: "12348",
    name: "Beatriz Costa",
    email: "beatriz.costa@email.com",
    phone: "(41) 98888-1111",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "12/01/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "04/12/2024",
      },
    ],
  },
  {
    id: "12349",
    name: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    phone: "(41) 98777-2222",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "08/02/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12350",
    name: "Daniela Lima",
    email: "daniela.lima@email.com",
    phone: "(41) 98666-3333",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "22/03/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "02/12/2024",
      },
    ],
  },
  {
    id: "12351",
    name: "Eduardo Ferreira",
    email: "eduardo.ferreira@email.com",
    phone: "(41) 98555-4444",
    class: "Dança do Ventre",
    classId: "danca-ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "15/04/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 250,00",
        dueDate: "05/12/2024",
        paidDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12352",
    name: "Fernanda Rocha",
    email: "fernanda.rocha@email.com",
    phone: "(41) 98444-5555",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "10/05/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12353",
    name: "Gabriel Alves",
    email: "gabriel.alves@email.com",
    phone: "(41) 98333-6666",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "18/06/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "03/12/2024",
      },
    ],
  },
  {
    id: "12354",
    name: "Helena Martins",
    email: "helena.martins@email.com",
    phone: "(41) 98222-7777",
    class: "Dança do Ventre",
    classId: "danca-ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "25/07/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 250,00",
        dueDate: "05/12/2024",
        paidDate: "01/12/2024",
      },
    ],
  },
  {
    id: "12355",
    name: "Igor Souza",
    email: "igor.souza@email.com",
    phone: "(41) 98111-8888",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "05/08/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12356",
    name: "Juliana Barros",
    email: "juliana.barros@email.com",
    phone: "(41) 98000-9999",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "12/09/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "04/12/2024",
      },
    ],
  },
  {
    id: "12357",
    name: "Karen Ribeiro",
    email: "karen.ribeiro@email.com",
    phone: "(41) 97999-0000",
    class: "Dança do Ventre",
    classId: "danca-ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "20/09/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 250,00",
        dueDate: "05/12/2024",
        paidDate: "02/12/2024",
      },
    ],
  },
  {
    id: "12358",
    name: "Lucas Cardoso",
    email: "lucas.cardoso@email.com",
    phone: "(41) 97888-1111",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "01/10/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12359",
    name: "Marina Pereira",
    email: "marina.pereira@email.com",
    phone: "(41) 97777-2222",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "15/10/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "03/12/2024",
      },
    ],
  },
  {
    id: "12360",
    name: "Nicolas Teixeira",
    email: "nicolas.teixeira@email.com",
    phone: "(41) 97666-3333",
    class: "Dança do Ventre",
    classId: "danca-ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "22/10/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 250,00",
        dueDate: "05/12/2024",
        paidDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12361",
    name: "Olivia Nunes",
    email: "olivia.nunes@email.com",
    phone: "(41) 97555-4444",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "05/11/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12362",
    name: "Pedro Castro",
    email: "pedro.castro@email.com",
    phone: "(41) 97444-5555",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "12/11/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
        paidDate: "04/12/2024",
      },
    ],
  },
  {
    id: "12363",
    name: "Rafaela Gomes",
    email: "rafaela.gomes@email.com",
    phone: "(41) 97333-6666",
    class: "Dança do Ventre",
    classId: "danca-ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "20/11/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "paid",
        amount: "R$ 250,00",
        dueDate: "05/12/2024",
        paidDate: "01/12/2024",
      },
    ],
  },
  {
    id: "12364",
    name: "Sofia Azevedo",
    email: "sofia.azevedo@email.com",
    phone: "(41) 97222-7777",
    class: "Jazz Iniciante",
    classId: "jazz-ini",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "25/11/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 320,00",
        dueDate: "05/12/2024",
      },
    ],
  },
  {
    id: "12365",
    name: "Thiago Moreira",
    email: "thiago.moreira@email.com",
    phone: "(41) 97111-8888",
    class: "Ballet Intermediário",
    classId: "ballet-int",
    status: "Inativo",
    profileImage: "",
    enrollmentDate: "01/12/2024",
    schedule: [],
    payments: [
      {
        month: "Dezembro 2024",
        status: "pending",
        amount: "R$ 280,00",
        dueDate: "05/12/2024",
      },
    ],
  },
];

export default function AdminPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasModuleAccess = useAuthStore((state) => state.hasModuleAccess);
  const toast = useToast();

  // Mapeamento de abas para nomes de módulos
  const TAB_MODULE_MAP = {
    overview: "overview",
    classes: "classes",
    students: "students",
    teachers: "teachers",
    users: "users",
    payments: "payments",
    plans: "plans",
    events: "events",
    access: "access",
  };

  // Função para verificar se uma aba deve ser exibida
  const shouldShowTab = (tabName: keyof typeof TAB_MODULE_MAP) => {
    const moduleName = TAB_MODULE_MAP[tabName];
    return hasModuleAccess(moduleName, "read");
  };

  // Função para verificar se pode escrever em um módulo
  const canWriteModule = (tabName: keyof typeof TAB_MODULE_MAP) => {
    const moduleName = TAB_MODULE_MAP[tabName];
    return hasModuleAccess(moduleName, "write");
  };

  // Obter primeira aba disponível para o usuário
  const getFirstAvailableTab = () => {
    const tabs: Array<keyof typeof TAB_MODULE_MAP> = [
      "overview",
      "classes",
      "students",
      "teachers",
      "users",
      "payments",
      "plans",
      "events",
      "access",
    ];
    const firstAvailable = tabs.find((tab) => shouldShowTab(tab));
    return firstAvailable || "overview";
  };

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "classes"
    | "students"
    | "teachers"
    | "users"
    | "payments"
    | "plans"
    | "events"
    | "access"
  >(getFirstAvailableTab());
  const [classes, setClasses] = useState<Class[]>([]);
  const [realClasses, setRealClasses] = useState<ClassData[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingRealClass, setEditingRealClass] = useState<
    ClassData | undefined
  >(undefined);
  const [allTeachers, setAllTeachers] = useState<UserData[]>([]);
  const [allPlans, setAllPlans] = useState<
    {
      id: number;
      name: string;
      type: string;
      price: number;
      active: boolean;
    }[]
  >([]);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Estados para gerenciamento de roles
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [roleToast, setRoleToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [roleFormData, setRoleFormData] = useState<NewRole>({
    name: "",
    description: "",
    permissions: [],
  });
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [showModal, setShowModal] = useState<
    "class" | "payment" | "attendance" | "editClass" | "editStudent" | null
  >(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(
    null
  );
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsPerPage, setPaymentsPerPage] = useState(10);
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<{
    id: number;
    name: string;
    students?: Array<{
      id: number;
      name: string;
      email: string;
      profileImage?: string;
    }>;
  } | null>(null);
  const [classAttendanceDate, setClassAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(
    null
  );
  const [paymentFilters, setPaymentFilters] = useState({
    name: "",
    class: "",
    status: "",
    month: "",
  });
  const [studentFilters, setStudentFilters] = useState({
    name: "",
    class: "",
    status: "",
    id: "",
  });
  const [teacherFilters, setTeacherFilters] = useState({
    name: "",
  });
  const [adminData, setAdminData] = useState({
    name: user?.name || "Administrador",
    email: user?.email || "admin@espacobecker.com",
    phone: user?.phone || "",
    password: "",
    birthDate: user?.birthDate ? user.birthDate.split("T")[0] : "",
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Estados para formulários
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    level: "",
    maxStudents: 15,
    currentStudents: 0,
    schedule: [],
    teacher: teacher?.name || "",
    room: "",
  });

  const [newStudent, setNewStudent] = useState<Partial<AdminStudent>>({
    name: "",
    email: "",
    phone: "",
    classId: "",
    status: "Ativo",
    enrollmentDate: new Date().toLocaleDateString("pt-BR"),
    profileImage: "",
    birthDate: "",
    address: "",
    cpf: "",
    rg: "",
    hasDisability: false,
    disabilityDescription: "",
    takesMedication: false,
    medicationDescription: "",
    paymentMethods: [],
    guardian: "",
  });

  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);

  // Estados para gerenciamento de usuários
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Estados para modais de confirmação de exclusão
  const [showDeleteClassConfirm, setShowDeleteClassConfirm] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);
  const [classToDeleteStudentCount, setClassToDeleteStudentCount] = useState(0);
  const [showDeleteOldClassConfirm, setShowDeleteOldClassConfirm] =
    useState(false);
  const [oldClassToDelete, setOldClassToDelete] = useState<string | null>(null);
  const [showDeleteStudentConfirm, setShowDeleteStudentConfirm] =
    useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [showDeleteRoleConfirm, setShowDeleteRoleConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  const [userData, setUserData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    rg: "",
    guardian: "",
    role: "",
    classId: "",
    hasDisability: false,
    disabilityDescription: "",
    takesMedication: false,
    medicationDescription: "",
    paymentMethods: [],
  });

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setAddressData({
            ...addressData,
            cep: cep,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          });
        } else {
          toast.error(
            "CEP não encontrado. Verifique o número e tente novamente."
          );
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP. Tente novamente.");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const [scheduleInput, setScheduleInput] = useState<ClassSchedule>({
    day: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  const handleTeacherPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("A imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setTeacher((prev) => {
          if (!prev) return prev;
          return { ...prev, profileImage: imageUrl };
        });
        toast.success("Foto atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminSettings = () => {
    // Validar campos
    if (!adminData.name || !adminData.email || !adminData.password) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      toast.warning("Por favor, insira um email válido.");
      return;
    }

    // Salvar no sessionStorage
    sessionStorage.setItem("adminData", JSON.stringify(adminData));
    toast.success("Configurações salvas com sucesso!");
    setShowAdminSettings(false);
  };

  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Atualizar user no auth store
        if (user) {
          useAuthStore.getState().setUser({
            ...user,
            profileImage: imageUrl,
          });
        }
        toast.success("Foto atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSchedule = () => {
    if (
      scheduleInput.day &&
      scheduleInput.startTime &&
      scheduleInput.endTime &&
      scheduleInput.room
    ) {
      setNewClass({
        ...newClass,
        schedule: [...(newClass.schedule || []), scheduleInput],
      });
      setScheduleInput({ day: "", startTime: "", endTime: "", room: "" });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedule = [...(newClass.schedule || [])];
    updatedSchedule.splice(index, 1);
    setNewClass({ ...newClass, schedule: updatedSchedule });
  };

  const handleCreateClass = () => {
    if (newClass.name && newClass.level && newClass.room) {
      const classToAdd: Class = {
        id: `class-${Date.now()}`,
        name: newClass.name!,
        level: newClass.level!,
        maxStudents: newClass.maxStudents || 15,
        currentStudents: 0,
        schedule: newClass.schedule || [],
        teacher: teacher?.name || "Sem professor",
        room: newClass.room!,
      };
      setClasses([...classes, classToAdd]);
      setShowModal(null);
      setNewClass({
        name: "",
        level: "",
        maxStudents: 15,
        currentStudents: 0,
        schedule: [],
        teacher: teacher?.name || "",
        room: "",
      });
    } else {
      toast.warning("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleCreateStudent = () => {
    if (
      newStudent.name &&
      newStudent.email &&
      newStudent.phone &&
      newStudent.classId &&
      newStudent.birthDate &&
      newStudent.cpf &&
      newStudent.rg &&
      addressData.cep &&
      addressData.street &&
      addressData.number &&
      addressData.neighborhood &&
      addressData.city &&
      addressData.state
    ) {
      const selectedClass = classes.find((c) => c.id === newStudent.classId);

      // Concatenar endereço completo
      const fullAddress = `${addressData.street}, ${addressData.number}${
        addressData.complement ? ", " + addressData.complement : ""
      }, ${addressData.neighborhood}, ${addressData.city} - ${
        addressData.state
      }, CEP: ${addressData.cep}`;

      // Remover máscaras antes de enviar ao backend
      const cleanData = {
        ...newStudent,
        phone: removeMask(newStudent.phone!),
        cpf: removeMask(newStudent.cpf!),
        rg: removeMask(newStudent.rg!),
        address: {
          ...addressData,
          zip_code: removeMask(addressData.cep),
        },
      };

      const studentToAdd: AdminStudent = {
        id: `student-${Date.now()}`,
        name: newStudent.name!,
        email: newStudent.email!,
        phone: newStudent.phone!,
        class: selectedClass?.name || "",
        classId: newStudent.classId!,
        status: "Ativo",
        profileImage: "",
        enrollmentDate:
          newStudent.enrollmentDate || new Date().toLocaleDateString("pt-BR"),
        schedule: [],
        payments: [],
        birthDate: newStudent.birthDate,
        address: fullAddress,
        cpf: newStudent.cpf,
        rg: newStudent.rg,
        hasDisability: newStudent.hasDisability,
        disabilityDescription: newStudent.disabilityDescription,
        takesMedication: newStudent.takesMedication,
        medicationDescription: newStudent.medicationDescription,
        paymentMethods: newStudent.paymentMethods || [],
        guardian: newStudent.guardian,
      };
      setStudents([...students, studentToAdd]);

      // Atualizar contador de alunos na turma
      setClasses(
        classes.map((c) =>
          c.id === newStudent.classId
            ? { ...c, currentStudents: c.currentStudents + 1 }
            : c
        )
      );

      setShowModal(null);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        classId: "",
        status: "Ativo",
        enrollmentDate: new Date().toLocaleDateString("pt-BR"),
        profileImage: "",
        birthDate: "",
        address: "",
        cpf: "",
        rg: "",
        hasDisability: false,
        disabilityDescription: "",
        takesMedication: false,
        medicationDescription: "",
        paymentMethods: [],
        guardian: "",
      });
      setAddressData({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    } else {
      toast.warning("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleDeleteOldClass = (classId: string) => {
    setOldClassToDelete(classId);
    setShowDeleteOldClassConfirm(true);
  };

  const confirmDeleteOldClass = () => {
    if (!oldClassToDelete) return;
    setClasses(classes.filter((c) => c.id !== oldClassToDelete));
    toast.success("Turma excluída com sucesso!");
    setShowDeleteOldClassConfirm(false);
    setOldClassToDelete(null);
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    // Formatar os horários para remover os segundos (HH:MM:SS -> HH:MM)
    const formattedSchedule = classItem.schedule.map((sch) => ({
      ...sch,
      startTime: formatTime(sch.startTime),
      endTime: formatTime(sch.endTime),
    }));
    setNewClass({
      name: classItem.name,
      level: classItem.level,
      maxStudents: classItem.maxStudents,
      currentStudents: classItem.currentStudents,
      schedule: formattedSchedule,
      teacher: classItem.teacher,
      room: classItem.room,
    });
    setShowModal("editClass");
  };

  const handleUpdateClass = () => {
    if (!editingClass) return;

    if (newClass.name && newClass.level && newClass.room) {
      const updatedClass: Class = {
        ...editingClass,
        name: newClass.name!,
        level: newClass.level!,
        maxStudents: newClass.maxStudents || 15,
        schedule: newClass.schedule || [],
        room: newClass.room!,
      };

      setClasses(
        classes.map((c) => (c.id === editingClass.id ? updatedClass : c))
      );

      setShowModal(null);
      setEditingClass(null);
      setNewClass({
        name: "",
        level: "",
        maxStudents: 15,
        currentStudents: 0,
        schedule: [],
        teacher: teacherData.name,
        room: "",
      });
    } else {
      toast.warning("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentToDelete(studentId);
    setShowDeleteStudentConfirm(true);
  };

  const confirmDeleteStudent = () => {
    if (!studentToDelete) return;

    const student = students.find((s) => s.id === studentToDelete);
    if (student) {
      setClasses(
        classes.map((c) =>
          c.id === student.classId
            ? { ...c, currentStudents: Math.max(0, c.currentStudents - 1) }
            : c
        )
      );
    }
    setStudents(students.filter((s) => s.id !== studentToDelete));
    toast.success("Aluno excluído com sucesso!");
    setShowDeleteStudentConfirm(false);
    setStudentToDelete(null);
  };

  const handleEditStudent = (student: AdminStudent) => {
    setEditingStudent(student);

    // Parse do endereço
    const addressParts = student.address?.split(", ") || [];
    const cepMatch = student.address?.match(/CEP: ([\d-]+)/);

    setNewStudent({
      name: student.name,
      email: student.email,
      phone: student.phone,
      classId: student.classId,
      status: student.status,
      enrollmentDate: student.enrollmentDate,
      profileImage: student.profileImage,
      birthDate: student.birthDate,
      address: student.address,
      cpf: student.cpf,
      rg: student.rg,
      hasDisability: student.hasDisability,
      disabilityDescription: student.disabilityDescription,
      takesMedication: student.takesMedication,
      medicationDescription: student.medicationDescription,
      paymentMethods: student.paymentMethods || [],
      guardian: student.guardian,
    });

    if (addressParts.length > 0) {
      setAddressData({
        street: addressParts[0] || "",
        number: addressParts[1] || "",
        complement: addressParts.length > 5 ? addressParts[2] : "",
        neighborhood: addressParts[addressParts.length > 5 ? 3 : 2] || "",
        city:
          addressParts[addressParts.length > 5 ? 4 : 3]?.split(" - ")[0] || "",
        state:
          addressParts[addressParts.length > 5 ? 4 : 3]?.split(" - ")[1] || "",
        cep: cepMatch ? cepMatch[1] : "",
      });
    }

    setShowModal("editStudent");
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;

    if (
      newStudent.name &&
      newStudent.email &&
      newStudent.phone &&
      newStudent.classId &&
      newStudent.birthDate &&
      newStudent.cpf &&
      newStudent.rg &&
      addressData.cep &&
      addressData.street &&
      addressData.number &&
      addressData.neighborhood &&
      addressData.city &&
      addressData.state
    ) {
      const selectedClass = classes.find((c) => c.id === newStudent.classId);
      const fullAddress = `${addressData.street}, ${addressData.number}${
        addressData.complement ? ", " + addressData.complement : ""
      }, ${addressData.neighborhood}, ${addressData.city} - ${
        addressData.state
      }, CEP: ${addressData.cep}`;

      const updatedStudent: AdminStudent = {
        ...editingStudent,
        name: newStudent.name!,
        email: newStudent.email!,
        phone: newStudent.phone!,
        class: selectedClass?.name || "",
        classId: newStudent.classId!,
        birthDate: newStudent.birthDate,
        address: fullAddress,
        cpf: newStudent.cpf,
        rg: newStudent.rg,
        hasDisability: newStudent.hasDisability,
        disabilityDescription: newStudent.disabilityDescription,
        takesMedication: newStudent.takesMedication,
        medicationDescription: newStudent.medicationDescription,
        paymentMethods: newStudent.paymentMethods || [],
        guardian: newStudent.guardian,
      };

      // Se mudou de turma, atualizar contadores
      if (editingStudent.classId !== newStudent.classId) {
        setClasses(
          classes.map((c) => {
            if (c.id === editingStudent.classId) {
              return {
                ...c,
                currentStudents: Math.max(0, c.currentStudents - 1),
              };
            }
            if (c.id === newStudent.classId) {
              return { ...c, currentStudents: c.currentStudents + 1 };
            }
            return c;
          })
        );
      }

      setStudents(
        students.map((s) => (s.id === editingStudent.id ? updatedStudent : s))
      );

      setShowModal(null);
      setEditingStudent(null);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        classId: "",
        status: "Ativo",
        enrollmentDate: new Date().toLocaleDateString("pt-BR"),
        profileImage: "",
        birthDate: "",
        address: "",
        cpf: "",
        rg: "",
        hasDisability: false,
        disabilityDescription: "",
        takesMedication: false,
        medicationDescription: "",
        paymentMethods: [],
        guardian: "",
      });
      setAddressData({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    } else {
      toast.warning("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleMarkAttendance = (
    studentId: string,
    status: "present" | "absent" | "late"
  ) => {
    if (!selectedClass) return;

    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const attendanceId = `att-${Date.now()}-${studentId}`;
    const newAttendance: Attendance = {
      id: attendanceId,
      studentId: studentId,
      studentName: student.name,
      classId: selectedClass.id,
      className: selectedClass.name,
      date: selectedDate,
      status: status,
    };

    setAttendances([...attendances, newAttendance]);
  };

  const getStudentAttendanceForDate = (studentId: string, date: string) => {
    return attendances.find(
      (att) =>
        att.studentId === studentId &&
        att.date === date &&
        att.classId === selectedClass?.id
    );
  };

  const getAttendanceStats = () => {
    const classStudents = students.filter(
      (s) => s.classId === selectedClass?.id
    );
    const today = new Date().toISOString().split("T")[0];
    const todayAttendances = attendances.filter(
      (att) => att.date === today && att.classId === selectedClass?.id
    );

    return {
      total: classStudents.length,
      present: todayAttendances.filter((att) => att.status === "present")
        .length,
      absent: todayAttendances.filter((att) => att.status === "absent").length,
      late: todayAttendances.filter((att) => att.status === "late").length,
    };
  };

  const getAttendanceStatsForClass = (classId: string, date: string) => {
    const classStudents = students.filter((s) => s.classId === classId);
    const dateAttendances = attendances.filter(
      (att) => att.date === date && att.classId === classId
    );

    return {
      total: classStudents.length,
      present: dateAttendances.filter((att) => att.status === "present").length,
      absent: dateAttendances.filter((att) => att.status === "absent").length,
      late: dateAttendances.filter((att) => att.status === "late").length,
    };
  };

  const getStudentAttendanceForClassDate = (
    studentId: string,
    classId: string,
    date: string
  ) => {
    return attendances.find(
      (att) =>
        att.studentId === studentId &&
        att.date === date &&
        att.classId === classId
    );
  };

  const handleMarkClassAttendance = (
    studentId: string,
    classId: string,
    status: "present" | "absent" | "late"
  ) => {
    const student = students.find((s) => s.id === studentId);
    const classItem = classes.find((c) => c.id === classId);
    if (!student || !classItem) return;

    const attendanceId = `att-${Date.now()}-${studentId}`;
    const newAttendance: Attendance = {
      id: attendanceId,
      studentId: studentId,
      studentName: student.name,
      classId: classId,
      className: classItem.name,
      date: classAttendanceDate,
      status: status,
    };

    setAttendances([...attendances, newAttendance]);
  };

  const toggleClassAttendance = (classId: string) => {
    if (expandedClassId === classId) {
      setExpandedClassId(null);
    } else {
      setExpandedClassId(classId);
      setClassAttendanceDate(new Date().toISOString().split("T")[0]);
    }
  };

  // ========== FUNÇÕES DE GERENCIAMENTO DE ROLES ==========

  // Funções para gerenciar turmas reais
  const fetchRealClasses = async () => {
    if (!token) return;

    try {
      setIsLoadingClasses(true);
      const response = await apiService.getClasses(token);
      setRealClasses(response.data as ClassData[]);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchTeachers = async () => {
    if (!token) return;

    try {
      const response = await apiService.getAllUsers(token);
      // Filtrar apenas professores (roleId === 2)
      const teachersData = response.data.filter((u) => u.roleId === 2);
      setAllTeachers(teachersData);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    }
  };

  const fetchPlans = async () => {
    if (!token) return;

    try {
      const response = (await apiService.getPlans(token)) as {
        data?: {
          id: number;
          name: string;
          type: string;
          price: number;
          active: boolean;
        }[];
      };
      setAllPlans(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
    }
  };

  const handleOpenClassModal = (classData?: ClassData) => {
    setEditingRealClass(classData);
    setShowClassModal(true);
  };

  const handleSaveClass = async (formData: ClassFormData) => {
    if (!token) return;

    try {
      if (editingRealClass) {
        // Atualizar turma existente
        await apiService.updateClass(editingRealClass.id, formData, token);
      } else {
        // Criar nova turma
        await apiService.createClass(formData, token);
      }

      // Recarregar lista de turmas
      await fetchRealClasses();
      setShowClassModal(false);
      setEditingRealClass(undefined);
    } catch (error) {
      toast.error("Erro ao salvar turma. Por favor, tente novamente.");
    }
  };

  const handleDeleteClass = async (classId: number) => {
    // Buscar a turma para verificar se tem alunos
    const classToRemove = realClasses.find((c) => c.id === classId);
    setClassToDeleteStudentCount(classToRemove?.studentCount || 0);
    setClassToDelete(classId);
    setShowDeleteClassConfirm(true);
  };

  const confirmDeleteClass = async () => {
    if (!token || !classToDelete) return;

    try {
      await apiService.deleteClass(classToDelete, token);
      await fetchRealClasses();
      toast.success("Turma excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir turma. Por favor, tente novamente.");
    } finally {
      setShowDeleteClassConfirm(false);
      setClassToDelete(null);
      setClassToDeleteStudentCount(0);
    }
  };

  // ========== FUNÇÕES DE GERENCIAMENTO DE USUÁRIOS ==========

  const fetchAllUsers = async () => {
    if (!token) {
      setIsLoadingUsers(false);
      return;
    }

    try {
      setIsLoadingUsers(true);
      const response = await apiService.getAllUsers(token);
      setAllUsers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar usuários. Por favor, tente novamente.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCreateUser = async () => {
    if (!token) return;

    // Validar campos obrigatórios
    if (
      !userData.name ||
      !userData.email ||
      !userData.phone ||
      !userData.birthDate ||
      !userData.cpf ||
      !userData.rg ||
      !userData.role ||
      !addressData.cep ||
      !addressData.street ||
      !addressData.number ||
      !addressData.neighborhood ||
      !addressData.city ||
      !addressData.state
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Validar campos específicos para alunos
    if (userData.role === "aluno") {
      if (
        !userData.classId ||
        !userData.paymentMethods ||
        userData.paymentMethods.length === 0
      ) {
        toast.error(
          "Para alunos, é necessário selecionar uma turma e ao menos um método de pagamento"
        );
        return;
      }
    }

    try {
      setIsSavingUser(true);

      // Mapear role para roleId
      const roleIdMap: { [key: string]: number } = {
        admin: 1,
        professor: 2,
        aluno: 3,
      };

      const roleId = roleIdMap[userData.role];

      // Preparar dados do endereço
      const address = {
        zip_code: removeMask(addressData.cep),
        street: addressData.street,
        number: addressData.number,
        complement: addressData.complement || undefined,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
      };

      if (editingUser) {
        // Atualizar usuário existente
        const updatePayload = {
          name: userData.name,
          email: userData.email,
          phone: removeMask(userData.phone),
          birth_date: userData.birthDate,
          cpf: removeMask(userData.cpf),
          rg: removeMask(userData.rg),
          role_id: roleId,
          guardian_id: userData.guardian ? parseInt(userData.guardian) : null,
          has_disability: userData.hasDisability,
          disability_description: userData.hasDisability
            ? userData.disabilityDescription
            : null,
          takes_medication: userData.takesMedication,
          medication_description: userData.takesMedication
            ? userData.medicationDescription
            : null,
          allowed_payment_methods: userData.paymentMethods,
          address,
          class_id: userData.classId ? parseInt(userData.classId) : undefined,
        };

        await apiService.updateUser(editingUser.id, updatePayload, token);

        // Se for aluno e tiver alterado o plano ou desconto, atualizar o grupo
        if (roleId === 3 && editingUser.groupId) {
          try {
            const groupUpdateData: any = {};

            if (userData.planId) {
              groupUpdateData.planId = parseInt(userData.planId);
            }

            // Adicionar dados de desconto
            groupUpdateData.discountType = userData.discountType || "none";
            groupUpdateData.discountPercentage = userData.discountPercentage
              ? parseFloat(userData.discountPercentage)
              : 0;
            groupUpdateData.discountValue = userData.discountValue
              ? parseFloat(userData.discountValue)
              : 0;

            await apiService.updateGroup(
              editingUser.groupId,
              groupUpdateData,
              token
            );
          } catch (error) {
            console.error("Erro ao atualizar plano/desconto do grupo:", error);
          }
        }

        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        // Preparar dados do usuário para registro pelo admin
        // A senha será gerada automaticamente e enviada por email
        const userPayload = {
          name: userData.name,
          email: userData.email,
          phone: removeMask(userData.phone),
          birth_date: userData.birthDate,
          cpf: removeMask(userData.cpf),
          rg: removeMask(userData.rg),
          role: roleId,
          guardian: userData.guardian || undefined,
          guardian_id: userData.guardian
            ? parseInt(userData.guardian)
            : undefined,
          allowed_payment_methods: userData.paymentMethods,
          has_disability: userData.hasDisability,
          disability_description: userData.hasDisability
            ? userData.disabilityDescription
            : undefined,
          takes_medication: userData.takesMedication,
          medication_description: userData.takesMedication
            ? userData.medicationDescription
            : undefined,
          address,
          class_id: userData.classId ? parseInt(userData.classId) : undefined,
          plan_id: userData.planId ? parseInt(userData.planId) : undefined,
          // Dados de desconto para o grupo
          discount_type: userData.discountType || "none",
          discount_percentage: userData.discountPercentage
            ? parseFloat(userData.discountPercentage)
            : 0,
          discount_value: userData.discountValue
            ? parseFloat(userData.discountValue)
            : 0,
          // Opção de cobrança proporcional para matrícula no meio do mês
          proportional_payment_option:
            userData.proportionalPaymentOption || "immediate",
        };

        await apiService.adminRegister(userPayload, token);

        toast.success(
          "Usuário criado com sucesso! Um email com as credenciais de acesso foi enviado."
        );
      }

      setShowUserModal(false);
      setEditingUser(null);

      // Resetar formulário
      setUserData({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        cpf: "",
        rg: "",
        guardian: "",
        role: "",
        classId: "",
        planId: "",
        hasDisability: false,
        disabilityDescription: "",
        takesMedication: false,
        medicationDescription: "",
        paymentMethods: [],
        discountType: "none",
        discountPercentage: "",
        discountValue: "",
        proportionalPaymentOption: "immediate",
      });
      setAddressData({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });

      // Recarregar lista de usuários
      await fetchAllUsers();

      // Se for aluno ou professor, recarregar também as respectivas listas
      if (userData.role === "aluno") {
        await fetchStudents();
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        (editingUser
          ? "Erro ao atualizar usuário."
          : "Erro ao criar usuário.") + " Por favor, tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleEditUser = async (user: UserData) => {
    setEditingUser(user);

    // Garantir que os planos estão carregados
    if (allPlans.length === 0) {
      await fetchPlans();
    }

    // Preencher formulário com dados do usuário
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "professor",
      3: "aluno",
    };

    // Buscar plano do grupo se o usuário for aluno
    let userPlanId = "";
    if (user.roleId === 3 && user.groupId && token) {
      try {
        const groupResponse = (await apiService.getGroupById(
          user.groupId,
          token
        )) as {
          data?: { planId?: number | null };
        };
        if (
          groupResponse.data?.planId !== undefined &&
          groupResponse.data?.planId !== null
        ) {
          userPlanId = groupResponse.data.planId.toString();
        }
      } catch (error) {
        console.error("Erro ao buscar plano do grupo:", error);
      }
    }

    setUserData({
      name: user.name,
      email: user.email,
      phone: maskPhone(user.phone || ""),
      birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
      cpf: maskCPF(user.cpf || ""),
      rg: maskRG(user.rg || ""),
      guardian: user.guardianId ? user.guardianId.toString() : "",
      role: roleMap[user.roleId] || "",
      classId:
        user.classIds && user.classIds.length > 0
          ? user.classIds[0].toString()
          : "",
      planId: userPlanId,
      hasDisability: user.hasDisability || false,
      disabilityDescription: user.disabilityDescription || "",
      takesMedication: user.takesMedication || false,
      medicationDescription: user.medicationDescription || "",
      paymentMethods: user.paymentMethods || [],
    });

    if (user.address) {
      setAddressData({
        cep: maskCEP(user.address.cep || ""),
        street: user.address.street || "",
        number: user.address.number || "",
        complement: user.address.complement || "",
        neighborhood: user.address.neighborhood || "",
        city: user.address.city || "",
        state: user.address.state || "",
      });
    } else {
      // Limpar dados de endereço se não houver
      setAddressData({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    }

    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!token || !userToDelete) return;

    try {
      await apiService.deleteUser(userToDelete, token);
      toast.success("Usuário excluído com sucesso!");

      setShowDeleteConfirm(false);
      setUserToDelete(null);

      // Recarregar lista de usuários
      await fetchAllUsers();

      // Recarregar também a lista de alunos se necessário
      await fetchStudents();
      await fetchTeachers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário. Por favor, tente novamente.");
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  // ========== FUNÇÕES DE GERENCIAMENTO DE ROLES ==========

  // Definir aba inicial baseada nas permissões do usuário
  useEffect(() => {
    if (user?.permissions) {
      const firstTab = getFirstAvailableTab();
      setActiveTab(firstTab);
    }
  }, [user?.permissions]);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchRealClasses();
      fetchStudents();
      fetchAllUsers(); // Para aniversariantes
    } else if (activeTab === "access") {
      fetchModules();
      fetchRoles();
    } else if (activeTab === "students") {
      fetchStudents();
    } else if (activeTab === "teachers") {
      fetchTeachers();
    } else if (activeTab === "classes") {
      fetchRealClasses();
      fetchTeachers();
    } else if (activeTab === "users") {
      fetchAllUsers();
      fetchRealClasses(); // Carregar turmas para o modal de cadastro de usuário
      fetchPlans(); // Carregar planos para o modal de cadastro de usuário
    }
  }, [activeTab]);

  useEffect(() => {
    // Buscar dados do admin ao carregar
    fetchAdminData();
  }, [user?.id, token]);

  const fetchStudents = async () => {
    if (!token) {
      setIsLoadingStudents(false);
      return;
    }

    try {
      setIsLoadingStudents(true);
      const response = await apiService.getAllUsers(token);

      // Buscar turmas para fazer o mapeamento
      let classesData: ClassData[] = [];
      try {
        const classesResponse = await apiService.getClasses(token);
        classesData = classesResponse.data as ClassData[];
      } catch {
        console.error("Erro ao carregar turmas para mapeamento");
      }

      // Filtrar apenas estudantes e converter para formato AdminStudent
      const studentsData = await Promise.all(
        response.data
          .filter((u) => u.roleId === 3)
          .map(async (u) => {
            // Buscar nome da turma baseado no classIds
            let className = "";
            if (u.classIds && u.classIds.length > 0) {
              const studentClass = classesData.find(
                (c) => c.id === u.classIds![0]
              );
              className = studentClass?.name || "";
            }

            // Buscar pagamentos do aluno
            let payments: Payment[] = [];
            try {
              const paymentsResponse = await apiService.get<{ data: any[] }>(
                `/tuitions/student/${u.id}`,
                token
              );
              if (paymentsResponse.data) {
                payments = paymentsResponse.data.map((p) => ({
                  month: formatReferenceMonth(p.reference_month),
                  status: p.status === "paid" ? "paid" : "pending",
                  amount: `R$ ${Number(p.amount).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`,
                  dueDate: new Date(p.due_date).toLocaleDateString("pt-BR"),
                  paidDate: p.payment_date
                    ? new Date(p.payment_date).toLocaleDateString("pt-BR")
                    : undefined,
                }));
              }
            } catch {
              // Se não encontrar pagamentos, deixa vazio
            }

            return {
              id: u.id.toString(),
              name: u.name,
              email: u.email,
              phone: u.phone,
              class: className,
              classId: u.classIds?.[0]?.toString() || "",
              status: "Ativo",
              profileImage: "",
              enrollmentDate: new Date(u.createdAt).toLocaleDateString("pt-BR"),
              schedule: [],
              payments,
            };
          })
      );

      setStudents(studentsData);
    } catch (error: any) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Função auxiliar para formatar o mês de referência
  const formatReferenceMonth = (referenceMonth: string): string => {
    const [year, month] = referenceMonth.split("-");
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const fetchAdminData = async () => {
    if (!user?.id || !token) return;

    try {
      setIsLoadingAdmin(true);
      const response = await apiService.getUserById(user.id, token);

      setAdminData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        password: "",
        birthDate: response.data.birthDate
          ? response.data.birthDate.split("T")[0]
          : "",
      });

      // Se for professor, popular dados do teacher
      if (user.roleId === 2) {
        setTeacher({
          id: response.data.id.toString(),
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          specialty: "Professor(a)",
          profileImage: "",
          classes: [],
          startDate: response.data.createdAt
            ? new Date(response.data.createdAt).toLocaleDateString("pt-BR")
            : new Date().toLocaleDateString("pt-BR"),
        });
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados do admin:", error);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const fetchModules = async () => {
    if (!token) {
      setIsLoadingModules(false);
      return;
    }

    try {
      setIsLoadingModules(true);
      const response = await apiService.getModules(token);
      setModules(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar módulos:", error);
      showRoleToast(error.message || "Erro ao carregar módulos", "error");
    } finally {
      setIsLoadingModules(false);
    }
  };

  const fetchRoles = async () => {
    if (!token) {
      setIsLoadingRoles(false);
      return;
    }

    try {
      setIsLoadingRoles(true);
      const response = await apiService.getRoles(token);
      setRoles(response.data);
    } catch (error: any) {
      console.error("Erro ao carregar roles:", error);
      showRoleToast(error.message || "Erro ao carregar roles", "error");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const showRoleToast = (message: string, type: "success" | "error") => {
    setRoleToast({ show: true, message, type });
    setTimeout(() => {
      setRoleToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleOpenRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleFormData({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions.map((p) => ({
          moduleId: p.moduleId,
          canRead: p.canRead,
          canWrite: p.canWrite,
        })),
      });
    } else {
      setEditingRole(null);
      // Inicializar com todos os módulos sem permissões
      setRoleFormData({
        name: "",
        description: "",
        permissions: modules.map((m) => ({
          moduleId: m.id,
          canRead: false,
          canWrite: false,
        })),
      });
    }
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setEditingRole(null);
    setRoleFormData({
      name: "",
      description: "",
      permissions: [],
    });
  };

  const handleSaveRole = async () => {
    if (!roleFormData.name.trim()) {
      showRoleToast("Nome da função é obrigatório", "error");
      return;
    }

    if (!token) {
      showRoleToast("Token de autenticação não encontrado", "error");
      return;
    }

    try {
      setIsSavingRole(true);
      const apiData = {
        name: roleFormData.name,
        description: roleFormData.description,
        permissions: roleFormData.permissions,
      };

      if (editingRole) {
        await apiService.updateRole(editingRole.id, apiData, token);
        showRoleToast("Função atualizada com sucesso!", "success");
      } else {
        await apiService.createRole(apiData, token);
        showRoleToast("Função criada com sucesso!", "success");
      }

      handleCloseRoleModal();
      await fetchRoles();
    } catch (error: any) {
      console.error("Erro ao salvar função:", error);
      showRoleToast(error.message || "Erro ao salvar função", "error");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    setRoleToDelete(roleId);
    setShowDeleteRoleConfirm(true);
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    if (!token) {
      showRoleToast("Token de autenticação não encontrado", "error");
      setShowDeleteRoleConfirm(false);
      setRoleToDelete(null);
      return;
    }

    try {
      await apiService.deleteRole(roleToDelete, token);
      await fetchRoles();
      showRoleToast("Função excluída com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao deletar função:", error);
      showRoleToast(error.message || "Erro ao deletar função", "error");
    } finally {
      setShowDeleteRoleConfirm(false);
      setRoleToDelete(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[1, 2]}>
      <Header />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <div className={styles.adminPage}>
        <div className={styles.alunoContainer}>
          <div className={styles.alunoHeader}>
            <div className={styles.alunoWelcome}>
              <h1>Painel Administrativo 🎭</h1>
              <p>Bem-vindo(a), {adminData.name}</p>
            </div>
            <div className={styles.headerButtons}>
              <button
                className={styles.settingsButton}
                onClick={() => setShowAdminSettings(true)}
              >
                <i className="fas fa-cog"></i>
                Configurações
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.adminTabs}>
            {shouldShowTab("overview") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "overview" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="fas fa-chart-line"></i>
                Visão Geral
              </button>
            )}
            {shouldShowTab("classes") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "classes" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("classes")}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                Turmas
              </button>
            )}
            {shouldShowTab("students") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "students" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("students")}
              >
                <i className="fas fa-user-graduate"></i>
                Alunos
              </button>
            )}
            {shouldShowTab("teachers") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "teachers" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("teachers")}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                Professores
              </button>
            )}
            {shouldShowTab("users") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "users" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <i className="fas fa-users"></i>
                Usuários
              </button>
            )}
            {shouldShowTab("payments") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "payments" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("payments")}
              >
                <i className="fas fa-money-bill-wave"></i>
                Financeiro
              </button>
            )}
            {shouldShowTab("plans") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "plans" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("plans")}
              >
                <i className="fas fa-clipboard-list"></i>
                Planos
              </button>
            )}
            {shouldShowTab("events") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "events" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("events")}
              >
                <i className="fas fa-calendar-alt"></i>
                Eventos
              </button>
            )}
            {shouldShowTab("access") && (
              <button
                className={`${styles.adminTab} ${
                  activeTab === "access" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("access")}
              >
                <i className="fas fa-shield-alt"></i>
                Acessos
              </button>
            )}
          </div>

          {/* Perfil do Usuário e Cards - Layout lado a lado */}
          {activeTab === "overview" && (
            <div className={styles.overviewLayout}>
              {user?.roleId === 1 ? (
                <AdminProfile
                  user={user}
                  onPhotoUpload={handleAdminPhotoUpload}
                />
              ) : (
                teacher && (
                  <TeacherProfile
                    teacher={teacher}
                    onPhotoUpload={handleTeacherPhotoUpload}
                  />
                )
              )}
              <QuickInfoCards classes={realClasses} students={students} />
            </div>
          )}

          {/* Calendário Semanal */}
          {activeTab === "overview" && <WeeklySchedule classes={realClasses} />}

          {/* Aniversariantes do Mês */}
          {activeTab === "overview" && (
            <BirthdayCard
              users={allUsers.map((u) => ({
                id: u.id,
                name: u.name,
                birthDate: u.birthDate || "",
                role:
                  u.roleId === 1
                    ? "admin"
                    : u.roleId === 2
                    ? "professor"
                    : "aluno",
                profileImage: "",
              }))}
            />
          )}

          {/* Content */}
          <div className={styles.adminContent}>
            {activeTab === "classes" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Turmas</h2>
                  {canWriteModule("classes") && (
                    <button
                      className={styles.addButton}
                      onClick={() => handleOpenClassModal()}
                    >
                      <i className="fas fa-plus"></i>
                      Nova Turma
                    </button>
                  )}
                </div>

                {isLoadingClasses ? (
                  <div className={styles.loadingContainer}>
                    <p>Carregando turmas...</p>
                  </div>
                ) : realClasses.length === 0 ? (
                  <div className={styles.emptyState}>
                    <i className="fas fa-chalkboard-teacher"></i>
                    <p>Nenhuma turma cadastrada</p>
                  </div>
                ) : (
                  <div className={styles.classesGrid}>
                    {realClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className={`${styles.classCard} ${styles.clickable}`}
                        onClick={() => {
                          setSelectedClassForAttendance({
                            id: classItem.id,
                            name: classItem.name,
                            students: classItem.students?.map((s) => ({
                              id: s.id,
                              name: s.name,
                              email: s.email,
                            })),
                          });
                          setShowAttendanceModal(true);
                        }}
                      >
                        <div className={styles.classCardHeader}>
                          <div>
                            <div className={styles.className}>
                              {classItem.name}
                            </div>
                          </div>
                          <div className={styles.classStudentsBadge}>
                            {classItem.studentCount || 0}/
                            {classItem.maxStudents}
                          </div>
                        </div>
                        <div className={styles.classInfo}>
                          <div className={styles.classInfoItem}>
                            <i className="fas fa-door-open"></i>
                            {classItem.room?.name || "Sem sala"}
                          </div>
                          <div className={styles.classInfoItem}>
                            <i className="fas fa-calendar"></i>
                            {translateDayOfWeek(classItem.dayOfWeek)} -{" "}
                            {formatTime(classItem.startTime)} às{" "}
                            {formatTime(classItem.endTime)}
                          </div>
                          {classItem.teacher?.name && (
                            <div className={styles.classInfoItem}>
                              <i className="fas fa-chalkboard-teacher"></i>
                              {classItem.teacher.name}
                            </div>
                          )}
                        </div>
                        <div className={styles.classCardFooter}>
                          <span className={styles.clickHint}>
                            <i className="fas fa-clipboard-check"></i>
                            Clique para controle de presença
                          </span>
                          {canWriteModule("classes") && (
                            <div
                              className={styles.classActions}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className={styles.classActionBtn}
                                onClick={() => handleOpenClassModal(classItem)}
                              >
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button
                                className={`${styles.classActionBtn} ${styles.deleteBtn}`}
                                onClick={() => handleDeleteClass(classItem.id)}
                              >
                                <i className="fas fa-trash"></i> Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Alunos</h2>
                </div>

                {/* Filtros */}
                <StudentFilters
                  filters={studentFilters}
                  onFiltersChange={setStudentFilters}
                  classes={realClasses}
                />

                <StudentsTable
                  students={students.filter((s) => {
                    const matchesName = s.name
                      .toLowerCase()
                      .includes(studentFilters.name.toLowerCase());
                    const matchesClass =
                      !studentFilters.class || s.class === studentFilters.class;
                    const matchesStatus =
                      !studentFilters.status ||
                      s.status === studentFilters.status;
                    return matchesName && matchesClass && matchesStatus;
                  })}
                />
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gestão Financeira</h2>
                </div>

                {/* Resumo Financeiro */}
                <FinancialSummary students={students} />

                {/* Gráfico de Receita Mensal */}
                <RevenueChart />

                {/* Lista de Alunos e Status de Pagamento */}
                <div className={styles.paymentsSection}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h3>Status de Pagamentos por Aluno</h3>
                  </div>

                  {/* Filtros */}
                  <PaymentFilters
                    filters={paymentFilters}
                    onFiltersChange={setPaymentFilters}
                    classes={realClasses}
                  />

                  <PaymentsTable
                    students={students}
                    filters={paymentFilters}
                    onSelectStudent={(student) => {
                      setSelectedStudent(student);
                      setShowModal("payment");
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === "teachers" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Professores</h2>
                </div>

                {/* Filtros */}
                <TeacherFilters
                  filters={teacherFilters}
                  onFiltersChange={setTeacherFilters}
                />

                {isLoadingStudents ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p>Carregando professores...</p>
                  </div>
                ) : (
                  <TeachersTable
                    teachers={allTeachers.filter((t) => {
                      const matchesName = t.name
                        .toLowerCase()
                        .includes(teacherFilters.name.toLowerCase());
                      return matchesName;
                    })}
                  />
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Usuários</h2>
                  {canWriteModule("users") && (
                    <button
                      className={styles.addButton}
                      onClick={() => {
                        setEditingUser(null);
                        setUserData({
                          name: "",
                          email: "",
                          phone: "",
                          birthDate: "",
                          cpf: "",
                          rg: "",
                          guardian: "",
                          role: "",
                          classId: "",
                          planId: "",
                          hasDisability: false,
                          disabilityDescription: "",
                          takesMedication: false,
                          medicationDescription: "",
                          paymentMethods: [],
                        });
                        setAddressData({
                          cep: "",
                          street: "",
                          number: "",
                          complement: "",
                          neighborhood: "",
                          city: "",
                          state: "",
                        });
                        setShowUserModal(true);
                      }}
                    >
                      <i className="fas fa-user-plus"></i>
                      Novo Usuário
                    </button>
                  )}
                </div>

                {isLoadingUsers ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "#666",
                    }}
                  >
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ fontSize: "2rem", marginBottom: "1rem" }}
                    ></i>
                    <p>Carregando usuários...</p>
                  </div>
                ) : (
                  <UsersTable
                    users={allUsers.map((u) => ({
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      phone: u.phone,
                      cpf: u.cpf,
                      role:
                        u.roleId === 1
                          ? "admin"
                          : u.roleId === 2
                          ? "professor"
                          : "aluno",
                      createdAt: u.createdAt.toString(),
                    }))}
                    onEditUser={(user) => {
                      const fullUser = allUsers.find((u) => u.id === user.id);
                      if (fullUser) {
                        handleEditUser(fullUser);
                      }
                    }}
                    onDeleteUser={handleDeleteUser}
                    canWrite={canWriteModule("users")}
                  />
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Eventos</h2>
                  {canWriteModule("events") && (
                    <button
                      className={styles.addButton}
                      onClick={() => setShowEventModal(true)}
                    >
                      <i className="fas fa-plus"></i>
                      Novo Evento
                    </button>
                  )}
                </div>
                <EventsManagement
                  token={token || ""}
                  canWrite={canWriteModule("events")}
                  showAddModal={showEventModal}
                  onCloseAddModal={() => setShowEventModal(false)}
                />
              </div>
            )}

            {activeTab === "plans" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Planos</h2>
                  {canWriteModule("plans") && (
                    <button
                      className={styles.addButton}
                      onClick={() => setShowPlanModal(true)}
                    >
                      <i className="fas fa-plus"></i>
                      Novo Plano
                    </button>
                  )}
                </div>
                <PlansManagement
                  token={token || ""}
                  canWrite={canWriteModule("plans")}
                  showAddModal={showPlanModal}
                  onCloseAddModal={() => setShowPlanModal(false)}
                />
              </div>
            )}

            {activeTab === "access" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciamento de Funções</h2>
                  {canWriteModule("access") && (
                    <button
                      className={styles.addButton}
                      onClick={() => handleOpenRoleModal()}
                    >
                      <i className="fas fa-plus"></i>
                      Nova Função
                    </button>
                  )}
                </div>

                <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                  Gerencie as funções e permissões do sistema. Defina quem pode
                  ler e editar informações.
                </p>

                {isLoadingRoles ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "#666",
                    }}
                  >
                    <h3>Carregando funções...</h3>
                  </div>
                ) : (
                  <RolesTable
                    roles={roles}
                    onEditRole={handleOpenRoleModal}
                    onDeleteRole={handleDeleteRole}
                    canWrite={canWriteModule("access")}
                  />
                )}

                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.5rem",
                    background: "#fff5f8",
                    borderRadius: "12px",
                    border: "2px solid #e91e63",
                  }}
                >
                  <h4
                    style={{
                      color: "#e91e63",
                      marginBottom: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <i className="fas fa-info-circle"></i>
                    Informação
                  </h4>
                  <p style={{ color: "#666", margin: 0, lineHeight: "1.6" }}>
                    As funções definem os níveis de acesso no sistema de forma
                    granular. Configure permissões específicas por módulo (Visão
                    Geral, Turmas, Alunos, Financeiro, Professores, Acessos)
                    para cada função. Você pode criar funções personalizadas
                    como "Financeiro" com acesso apenas ao módulo de pagamentos,
                    ou "Recepção" com acesso a alunos e turmas.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal de Criar/Editar Role */}
          {showRoleModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "1rem",
              }}
              onClick={handleCloseRoleModal}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "2rem",
                  maxWidth: "500px",
                  width: "100%",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h3 style={{ margin: 0, color: "#333" }}>
                    {editingRole ? "Editar Função" : "Nova Função"}
                  </h3>
                  <button
                    onClick={handleCloseRoleModal}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "2rem",
                      cursor: "pointer",
                      color: "#999",
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    Nome da Função *
                  </label>
                  <input
                    type="text"
                    value={roleFormData.name}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Ex: Administrador, Professor, Aluno"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#e91e63")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    Descrição
                  </label>
                  <textarea
                    value={roleFormData.description || ""}
                    onChange={(e) =>
                      setRoleFormData({
                        ...roleFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Breve descrição da função (opcional)"
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      transition: "border-color 0.2s",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#e91e63")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.75rem",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    Permissões por Módulo
                  </label>
                  {isLoadingModules ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "1rem",
                        color: "#666",
                      }}
                    >
                      Carregando módulos...
                    </div>
                  ) : modules.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "1rem",
                        color: "#999",
                      }}
                    >
                      Nenhum módulo disponível
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "0.5rem",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      {modules.map((module) => {
                        const permission = roleFormData.permissions.find(
                          (p) => p.moduleId === module.id
                        ) || {
                          moduleId: module.id,
                          canRead: false,
                          canWrite: false,
                        };

                        return (
                          <div
                            key={module.id}
                            style={{
                              padding: "0.75rem",
                              background: "white",
                              borderRadius: "6px",
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#333",
                                marginBottom: "0.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {module.icon && (
                                <i className={`fas ${module.icon}`}></i>
                              )}
                              {module.displayName}
                            </div>
                            {module.description && (
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#666",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                {module.description}
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                gap: "1rem",
                                marginTop: "0.5rem",
                              }}
                            >
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={permission.canRead}
                                  onChange={(e) => {
                                    const newPermissions =
                                      roleFormData.permissions.filter(
                                        (p) => p.moduleId !== module.id
                                      );
                                    newPermissions.push({
                                      moduleId: module.id,
                                      canRead: e.target.checked,
                                      canWrite: permission.canWrite,
                                    });
                                    setRoleFormData({
                                      ...roleFormData,
                                      permissions: newPermissions,
                                    });
                                  }}
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ color: "#555" }}>Ler</span>
                              </label>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={permission.canWrite}
                                  onChange={(e) => {
                                    const newPermissions =
                                      roleFormData.permissions.filter(
                                        (p) => p.moduleId !== module.id
                                      );
                                    newPermissions.push({
                                      moduleId: module.id,
                                      canRead: permission.canRead,
                                      canWrite: e.target.checked,
                                    });
                                    setRoleFormData({
                                      ...roleFormData,
                                      permissions: newPermissions,
                                    });
                                  }}
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ color: "#555" }}>Editar</span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "flex-end",
                    marginTop: "2rem",
                  }}
                >
                  <button
                    onClick={handleCloseRoleModal}
                    disabled={isSavingRole}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      background: "white",
                      color: "#666",
                      fontWeight: 500,
                      cursor: isSavingRole ? "not-allowed" : "pointer",
                      opacity: isSavingRole ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSavingRole) {
                        e.currentTarget.style.background = "#f5f5f5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveRole}
                    disabled={isSavingRole}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #e91e63 0%, #c2185b 100%)",
                      color: "white",
                      fontWeight: 600,
                      cursor: isSavingRole ? "not-allowed" : "pointer",
                      opacity: isSavingRole ? 0.7 : 1,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSavingRole) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(233, 30, 99, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isSavingRole
                      ? "Salvando..."
                      : editingRole
                      ? "Atualizar"
                      : "Criar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast de notificação */}
          {roleToast.show && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                padding: "16px 24px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                animation: "slideIn 0.3s ease-out",
                zIndex: 1000,
                minWidth: "300px",
                borderLeft: `4px solid ${
                  roleToast.type === "success" ? "#4caf50" : "#f44336"
                }`,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  fontWeight: "bold",
                  fontSize: "14px",
                  background:
                    roleToast.type === "success" ? "#e8f5e9" : "#ffebee",
                  color: roleToast.type === "success" ? "#4caf50" : "#f44336",
                }}
              >
                {roleToast.type === "success" ? "✓" : "✗"}
              </span>
              <span
                style={{
                  flex: 1,
                  color: "#333",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {roleToast.message}
              </span>
            </div>
          )}
        </div>

        {/* Modal Histórico de Pagamentos */}
        <PaymentHistoryModal
          isOpen={showModal === "payment"}
          onClose={() => {
            setShowModal(null);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />

        {/* Modal Nova Turma */}
        <ClassModal
          isOpen={showModal === "class"}
          onClose={() => setShowModal(null)}
          newClass={newClass}
          setNewClass={setNewClass}
          scheduleInput={scheduleInput}
          setScheduleInput={setScheduleInput}
          onAddSchedule={handleAddSchedule}
          onRemoveSchedule={handleRemoveSchedule}
          onCreateClass={handleCreateClass}
        />

        {/* Modal Editar Turma */}
        <EditClassModal
          isOpen={showModal === "editClass" && editingClass !== null}
          onClose={() => {
            setShowModal(null);
            setEditingClass(null);
          }}
          newClass={newClass}
          setNewClass={setNewClass}
          scheduleInput={scheduleInput}
          setScheduleInput={setScheduleInput}
          onAddSchedule={handleAddSchedule}
          onRemoveSchedule={handleRemoveSchedule}
          onUpdateClass={handleUpdateClass}
        />

        {/* Modal de Gerenciamento de Turmas */}
        <ClassManagementModal
          isOpen={showClassModal}
          onClose={() => {
            setShowClassModal(false);
            setEditingRealClass(undefined);
          }}
          onSave={handleSaveClass}
          classData={editingRealClass}
          teachers={allTeachers}
        />

        {/* Modal Editar Aluno */}
        <EditStudentModal
          isOpen={showModal === "editStudent"}
          onClose={() => setShowModal(null)}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          addressData={addressData}
          setAddressData={setAddressData}
          loadingCep={loadingCep}
          onCepSearch={handleCepSearch}
          classes={classes}
          onUpdateStudent={handleUpdateStudent}
        />

        {/* Modal de Configurações do Admin */}
        <AdminSettingsModal
          isOpen={showAdminSettings}
          onClose={() => setShowAdminSettings(false)}
          adminData={adminData}
          setAdminData={setAdminData}
          onSave={handleSaveAdminSettings}
        />

        {/* Modal de Usuários */}
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          userData={userData}
          setUserData={setUserData}
          addressData={addressData}
          setAddressData={setAddressData}
          loadingCep={loadingCep}
          onCepSearch={handleCepSearch}
          classes={realClasses}
          plans={allPlans}
          onSave={handleCreateUser}
          isEditing={!!editingUser}
          allStudents={allUsers
            .filter((u) => u.roleId === 3)
            .map((u) => ({
              id: String(u.id),
              name: u.name,
              groupId: u.groupId,
            }))}
          isSaving={isSavingUser}
          onGetGroupDiscount={async (groupId: number) => {
            if (!token) return null;
            try {
              const response = (await apiService.getGroupById(
                groupId,
                token
              )) as {
                data?: {
                  planId?: number;
                  discountType?: "percentage" | "value" | "none";
                  discountPercentage?: number;
                  discountValue?: number;
                };
              };
              if (response.data) {
                return {
                  planId: response.data.planId,
                  discountType: response.data.discountType,
                  discountPercentage: response.data.discountPercentage,
                  discountValue: response.data.discountValue,
                };
              }
              return null;
            } catch (error) {
              console.error("Erro ao buscar desconto do grupo:", error);
              return null;
            }
          }}
        />

        {/* Modal de Confirmação de Exclusão de Usuário */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDeleteUser}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }}
          danger={true}
        />

        {/* Modal de Confirmação de Exclusão de Turma (Real) */}
        <ConfirmModal
          isOpen={showDeleteClassConfirm}
          title="Confirmar Exclusão"
          message={
            classToDeleteStudentCount > 0
              ? `⚠️ ATENÇÃO: Esta turma possui ${classToDeleteStudentCount} aluno${
                  classToDeleteStudentCount > 1 ? "s" : ""
                } vinculado${
                  classToDeleteStudentCount > 1 ? "s" : ""
                }. Ao excluir a turma, todos os alunos ficarão sem turma associada.\n\nTem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
          }
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDeleteClass}
          onCancel={() => {
            setShowDeleteClassConfirm(false);
            setClassToDelete(null);
            setClassToDeleteStudentCount(0);
          }}
          danger={true}
        />

        {/* Modal de Confirmação de Exclusão de Turma (Mock) */}
        <ConfirmModal
          isOpen={showDeleteOldClassConfirm}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDeleteOldClass}
          onCancel={() => {
            setShowDeleteOldClassConfirm(false);
            setOldClassToDelete(null);
          }}
          danger={true}
        />

        {/* Modal de Confirmação de Exclusão de Aluno */}
        <ConfirmModal
          isOpen={showDeleteStudentConfirm}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDeleteStudent}
          onCancel={() => {
            setShowDeleteStudentConfirm(false);
            setStudentToDelete(null);
          }}
          danger={true}
        />

        {/* Modal de Confirmação de Exclusão de Função/Role */}
        <ConfirmModal
          isOpen={showDeleteRoleConfirm}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir esta função? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDeleteRole}
          onCancel={() => {
            setShowDeleteRoleConfirm(false);
            setRoleToDelete(null);
          }}
          danger={true}
        />

        {/* Modal de Presença */}
        {showAttendanceModal && selectedClassForAttendance && (
          <AttendanceModal
            isOpen={showAttendanceModal}
            onClose={() => {
              setShowAttendanceModal(false);
              setSelectedClassForAttendance(null);
            }}
            classData={selectedClassForAttendance}
            token={token || ""}
            onSuccess={() => toast.success("Presenças salvas com sucesso!")}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
