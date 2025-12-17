"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
import ClassModal from "./components/ClassModal";
import EditClassModal from "./components/EditClassModal";
import StudentModal from "./components/StudentModal";
import EditStudentModal from "./components/EditStudentModal";
import PaymentHistoryModal from "./components/PaymentHistoryModal";
import TeacherModal from "./components/TeacherModal";
import AdminSettingsModal from "./components/AdminSettingsModal";
import FinancialSummary from "./components/FinancialSummary";
import RevenueChart from "./components/RevenueChart";
import PaymentFilters from "./components/PaymentFilters";
import PaymentsTable from "./components/PaymentsTable";
import Pagination from "./components/Pagination";
import StudentFilters from "./components/StudentFilters";
import StudentsTable from "./components/StudentsTable";
import TeacherProfile from "./components/TeacherProfile";
import QuickInfoCards from "./components/QuickInfoCards";
import WeeklySchedule from "./components/WeeklySchedule";
import ClassesSummary from "./components/ClassesSummary";
import styles from "./admin.module.css";
import {
  Teacher,
  Class,
  AdminStudent,
  ClassSchedule,
  Attendance,
} from "../types";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "classes" | "students" | "payments" | "teachers" | "access"
  >("overview");
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [students, setStudents] = useState<AdminStudent[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>([teacherData]);
  const [teacher, setTeacher] = useState<Teacher>(teacherData);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [showModal, setShowModal] = useState<
    | "class"
    | "student"
    | "payment"
    | "attendance"
    | "editClass"
    | "teacher"
    | "editStudent"
    | null
  >(null);
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
  const [adminData, setAdminData] = useState({
    name: "Administrador",
    email: "admin@espacobecker.com",
    phone: "(41) 99999-9999",
    password: "admin123",
    birthDate: "1985-05-15",
    username: "admin",
  });
  const router = useRouter();

  // Verificar se já está autenticado via sessionStorage
  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuth");
    if (isAuth === "true") {
      setIsLoggedIn(true);

      // Carregar dados do admin salvos
      const savedAdminData = sessionStorage.getItem("adminData");
      if (savedAdminData) {
        try {
          setAdminData(JSON.parse(savedAdminData));
        } catch (e) {
          console.error("Erro ao carregar dados do admin", e);
        }
      }
    }
  }, []);

  // Fechar calendário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCalendar && !target.closest(".custom-date-picker")) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Estados para formulários
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    level: "",
    maxStudents: 15,
    currentStudents: 0,
    schedule: [],
    teacher: teacher.name,
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
          alert("CEP não encontrado!");
        }
      } catch (error) {
        alert("Erro ao buscar CEP. Tente novamente.");
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

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      setIsLoggedIn(true);
    } else {
      alert(
        "Usuário ou senha incorretos.\n\nPara demonstração, use:\nUsuário: admin\nSenha: admin123"
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    router.push("/login");
  };

  const handleTeacherPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setTeacher((prev) => ({ ...prev, profileImage: imageUrl }));
        alert("Foto atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminSettings = () => {
    // Validar campos
    if (
      !adminData.name ||
      !adminData.email ||
      !adminData.username ||
      !adminData.password
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Salvar no sessionStorage
    sessionStorage.setItem("adminData", JSON.stringify(adminData));
    alert("Configurações salvas com sucesso!");
    setShowAdminSettings(false);
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
        teacher: teacherData.name,
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
        teacher: teacherData.name,
        room: "",
      });
    } else {
      alert("Por favor, preencha todos os campos obrigatórios");
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
      alert("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      setClasses(classes.filter((c) => c.id !== classId));
    }
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    setNewClass({
      name: classItem.name,
      level: classItem.level,
      maxStudents: classItem.maxStudents,
      currentStudents: classItem.currentStudents,
      schedule: classItem.schedule,
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
      alert("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        setClasses(
          classes.map((c) =>
            c.id === student.classId
              ? { ...c, currentStudents: Math.max(0, c.currentStudents - 1) }
              : c
          )
        );
      }
      setStudents(students.filter((s) => s.id !== studentId));
    }
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
      alert("Por favor, preencha todos os campos obrigatórios");
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

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <div className={styles.alunoLoginPage}>
          <div className={styles.alunoLoginContainer}>
            <div className={styles.alunoLoginHeader}>
              <h1>Área do Professor</h1>
              <p>Acesse o painel administrativo</p>
            </div>
            <form onSubmit={handleLogin} className={styles.alunoLoginForm}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.alunoLoginButton}>
                Entrar
              </button>
            </form>
            <div className={styles.alunoLoginBack}>
              <a href="/">Voltar ao site principal</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.adminPage}>
        <div className={styles.alunoContainer}>
          <div className={styles.alunoHeader}>
            <div className={styles.alunoWelcome}>
              <h1>Painel Administrativo 🎭</h1>
              <p>Bem-vindo(a), {adminData.name}</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className={styles.settingsButton}
                onClick={() => setShowAdminSettings(true)}
              >
                <i className="fas fa-cog"></i>
                Configurações
              </button>
              <button className="logout-button" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.adminTabs}>
            <button
              className={`${styles.adminTab} ${
                activeTab === "overview" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-chart-line"></i>
              Visão Geral
            </button>
            <button
              className={`${styles.adminTab} ${
                activeTab === "classes" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("classes")}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              Turmas
            </button>
            <button
              className={`${styles.adminTab} ${
                activeTab === "students" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("students")}
            >
              <i className="fas fa-user-graduate"></i>
              Alunos
            </button>
            <button
              className={`${styles.adminTab} ${
                activeTab === "payments" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("payments")}
            >
              <i className="fas fa-money-bill-wave"></i>
              Financeiro
            </button>
            <button
              className={`${styles.adminTab} ${
                activeTab === "teachers" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("teachers")}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              Professores
            </button>
            <button
              className={`${styles.adminTab} ${
                activeTab === "access" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("access")}
            >
              <i className="fas fa-shield-alt"></i>
              Acessos
            </button>
          </div>

          {/* Perfil do Professor e Cards - Layout lado a lado */}
          {activeTab === "overview" && (
            <div className={styles.overviewLayout}>
              <TeacherProfile
                teacher={teacher}
                onPhotoUpload={handleTeacherPhotoUpload}
              />
              <QuickInfoCards classes={classes} students={students} />
            </div>
          )}

          {/* Calendário Semanal */}
          {activeTab === "overview" && <WeeklySchedule classes={classes} />}

          {/* Content */}
          <div className={styles.adminContent}>
            {activeTab === "overview" && <ClassesSummary classes={classes} />}

            {activeTab === "classes" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Turmas</h2>
                  <button
                    className={styles.addButton}
                    onClick={() => setShowModal("class")}
                  >
                    <i className="fas fa-plus"></i>
                    Nova Turma
                  </button>
                </div>

                <div className={styles.classesGrid}>
                  {classes.map((classItem) => (
                    <div key={classItem.id} className={styles.classCard}>
                      <div className={styles.classCardHeader}>
                        <div>
                          <div className={styles.className}>
                            {classItem.name}
                          </div>
                          <div className={styles.classLevel}>
                            {classItem.level}
                          </div>
                        </div>
                        <div className={styles.classStudentsBadge}>
                          {classItem.currentStudents}/{classItem.maxStudents}
                        </div>
                      </div>
                      <div className={styles.classInfo}>
                        <div className={styles.classInfoItem}>
                          <i className="fas fa-door-open"></i>
                          {classItem.room}
                        </div>
                        {classItem.schedule.map((sch, idx) => (
                          <div key={idx} className={styles.classInfoItem}>
                            <i className="fas fa-calendar"></i>
                            {sch.day} - {sch.startTime} às {sch.endTime}
                          </div>
                        ))}
                      </div>
                      <div className={styles.classActions}>
                        <button
                          className={styles.classActionBtn}
                          onClick={() => handleEditClass(classItem)}
                        >
                          <i className="fas fa-edit"></i> Editar
                        </button>
                        <button
                          className={`${styles.classActionBtn} ${
                            expandedClassId === classItem.id
                              ? styles.active
                              : ""
                          }`}
                          onClick={() => toggleClassAttendance(classItem.id)}
                        >
                          <i className="fas fa-clipboard-check"></i> Presenças
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Container de Controle de Presenças */}
                {expandedClassId && (
                  <div className={styles.attendanceSection}>
                    {(() => {
                      const selectedClassItem = classes.find(
                        (c) => c.id === expandedClassId
                      );
                      if (!selectedClassItem) return null;

                      return (
                        <>
                          <div className={styles.attendanceSectionHeader}>
                            <h3>
                              <i className="fas fa-clipboard-check"></i>{" "}
                              Controle de Presença - {selectedClassItem.name}
                            </h3>
                            <button
                              className={styles.closeAttendanceBtn}
                              onClick={() => setExpandedClassId(null)}
                            >
                              <i className="fas fa-times"></i> Fechar
                            </button>
                          </div>

                          {/* Seletor de Data */}
                          <div className={styles.attendanceControls}>
                            <label>
                              <i className="fas fa-calendar-day"></i> Data da
                              Aula
                            </label>
                            <input
                              type="date"
                              className={styles.formInput}
                              value={classAttendanceDate}
                              onChange={(e) =>
                                setClassAttendanceDate(e.target.value)
                              }
                            />
                          </div>

                          {/* Resumo de Presença */}
                          <div className={styles.attendanceSummary}>
                            <div
                              className={`${styles.attendanceStat} ${styles.present}`}
                            >
                              <i className="fas fa-check-circle"></i>
                              <div>
                                <div className={styles.statValue}>
                                  {
                                    getAttendanceStatsForClass(
                                      selectedClassItem.id,
                                      classAttendanceDate
                                    ).present
                                  }
                                </div>
                                <div className={styles.statLabel}>
                                  Presentes
                                </div>
                              </div>
                            </div>
                            <div
                              className={`${styles.attendanceStat} ${styles.absent}`}
                            >
                              <i className="fas fa-times-circle"></i>
                              <div>
                                <div className={styles.statValue}>
                                  {
                                    getAttendanceStatsForClass(
                                      selectedClassItem.id,
                                      classAttendanceDate
                                    ).absent
                                  }
                                </div>
                                <div className={styles.statLabel}>Ausentes</div>
                              </div>
                            </div>
                            <div
                              className={`${styles.attendanceStat} ${styles.late}`}
                            >
                              <i className="fas fa-clock"></i>
                              <div>
                                <div className={styles.statValue}>
                                  {
                                    getAttendanceStatsForClass(
                                      selectedClassItem.id,
                                      classAttendanceDate
                                    ).late
                                  }
                                </div>
                                <div className={styles.statLabel}>
                                  Atrasados
                                </div>
                              </div>
                            </div>
                            <div
                              className={`${styles.attendanceStat} ${styles.total}`}
                            >
                              <i className="fas fa-users"></i>
                              <div>
                                <div className={styles.statValue}>
                                  {
                                    getAttendanceStatsForClass(
                                      selectedClassItem.id,
                                      classAttendanceDate
                                    ).total
                                  }
                                </div>
                                <div className={styles.statLabel}>
                                  Total de Alunos
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lista de Alunos para Marcar Presença */}
                          <div className={styles.attendanceList}>
                            <h3>Marcar Presença</h3>
                            <div className={styles.studentsTableContainer}>
                              <table className={styles.studentsTable}>
                                <thead>
                                  <tr>
                                    <th>Foto</th>
                                    <th>Nome</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {students
                                    .filter(
                                      (s) => s.classId === selectedClassItem.id
                                    )
                                    .map((student) => {
                                      const attendance =
                                        getStudentAttendanceForClassDate(
                                          student.id,
                                          selectedClassItem.id,
                                          classAttendanceDate
                                        );
                                      return (
                                        <tr key={student.id}>
                                          <td>
                                            {student.profileImage ? (
                                              <Image
                                                src={student.profileImage}
                                                alt={student.name}
                                                width={40}
                                                height={40}
                                                className={styles.studentAvatar}
                                              />
                                            ) : (
                                              <div
                                                className={
                                                  styles.avatarIconPlaceholder
                                                }
                                              >
                                                <i className="fas fa-user-circle"></i>
                                              </div>
                                            )}
                                          </td>
                                          <td>{student.name}</td>
                                          <td>
                                            {attendance ? (
                                              <span
                                                className={`${
                                                  styles.attendanceBadge
                                                } ${styles[attendance.status]}`}
                                              >
                                                {attendance.status ===
                                                  "present" && "Presente"}
                                                {attendance.status ===
                                                  "absent" && "Ausente"}
                                                {attendance.status === "late" &&
                                                  "Atrasado"}
                                              </span>
                                            ) : (
                                              <span
                                                className={`${styles.attendanceBadge} ${styles.pending}`}
                                              >
                                                Não marcado
                                              </span>
                                            )}
                                          </td>
                                          <td>
                                            <div
                                              style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                              }}
                                            >
                                              <button
                                                className={`${styles.attendanceBtn} ${styles.present}`}
                                                onClick={() =>
                                                  handleMarkClassAttendance(
                                                    student.id,
                                                    selectedClassItem.id,
                                                    "present"
                                                  )
                                                }
                                                disabled={!!attendance}
                                                title="Marcar como Presente"
                                              >
                                                <i className="fas fa-check"></i>
                                              </button>
                                              <button
                                                className={`${styles.attendanceBtn} ${styles.late}`}
                                                onClick={() =>
                                                  handleMarkClassAttendance(
                                                    student.id,
                                                    selectedClassItem.id,
                                                    "late"
                                                  )
                                                }
                                                disabled={!!attendance}
                                                title="Marcar como Atrasado"
                                              >
                                                <i className="fas fa-clock"></i>
                                              </button>
                                              <button
                                                className={`${styles.attendanceBtn} ${styles.absent}`}
                                                onClick={() =>
                                                  handleMarkClassAttendance(
                                                    student.id,
                                                    selectedClassItem.id,
                                                    "absent"
                                                  )
                                                }
                                                disabled={!!attendance}
                                                title="Marcar como Ausente"
                                              >
                                                <i className="fas fa-times"></i>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                              {students.filter(
                                (s) => s.classId === selectedClassItem.id
                              ).length === 0 && (
                                <p
                                  style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                    color: "#666",
                                  }}
                                >
                                  Nenhum aluno cadastrado nesta turma ainda.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Histórico de Presença */}
                          <div className={styles.attendanceHistory}>
                            <h3>Histórico de Presenças</h3>
                            <div className={styles.studentsTableContainer}>
                              <table className={styles.studentsTable}>
                                <thead>
                                  <tr>
                                    <th>Data</th>
                                    <th>Aluno</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attendances
                                    .filter(
                                      (att) =>
                                        att.classId === selectedClassItem.id
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.date).getTime() -
                                        new Date(a.date).getTime()
                                    )
                                    .map((att) => (
                                      <tr key={att.id}>
                                        <td>
                                          {new Date(
                                            att.date
                                          ).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td>{att.studentName}</td>
                                        <td>
                                          <span
                                            className={`${
                                              styles.attendanceBadge
                                            } ${styles[att.status]}`}
                                          >
                                            {att.status === "present" &&
                                              "Presente"}
                                            {att.status === "absent" &&
                                              "Ausente"}
                                            {att.status === "late" &&
                                              "Atrasado"}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              {attendances.filter(
                                (att) => att.classId === selectedClassItem.id
                              ).length === 0 && (
                                <p
                                  style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                    color: "#666",
                                  }}
                                >
                                  Nenhuma presença registrada para esta turma
                                  ainda.
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Alunos</h2>
                  <button
                    className={styles.addButton}
                    onClick={() => setShowModal("student")}
                  >
                    <i className="fas fa-user-plus"></i>
                    Novo Aluno
                  </button>
                </div>

                {/* Filtros */}
                <StudentFilters
                  filters={studentFilters}
                  onFiltersChange={setStudentFilters}
                  classes={classes}
                />

                <StudentsTable
                  students={students}
                  filters={studentFilters}
                  currentPage={studentsPage}
                  itemsPerPage={studentsPerPage}
                  onEditStudent={handleEditStudent}
                  onDeleteStudent={handleDeleteStudent}
                />

                {/* Paginação */}
                <Pagination
                  currentPage={studentsPage}
                  totalItems={
                    students.filter((student) => {
                      if (
                        studentFilters.name &&
                        !student.name
                          .toLowerCase()
                          .includes(studentFilters.name.toLowerCase())
                      )
                        return false;
                      if (
                        studentFilters.class &&
                        student.class !== studentFilters.class
                      )
                        return false;
                      if (
                        studentFilters.status &&
                        student.status !== studentFilters.status
                      )
                        return false;
                      return true;
                    }).length
                  }
                  itemsPerPage={studentsPerPage}
                  onPageChange={setStudentsPage}
                  onItemsPerPageChange={setStudentsPerPage}
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
                    classes={classes}
                  />

                  <PaymentsTable
                    students={students}
                    filters={paymentFilters}
                    currentPage={paymentsPage}
                    itemsPerPage={paymentsPerPage}
                    onSelectStudent={(student) => {
                      setSelectedStudent(student);
                      setShowModal("payment");
                    }}
                  />

                  {/* Paginação */}
                  <Pagination
                    currentPage={paymentsPage}
                    totalItems={students.length}
                    itemsPerPage={paymentsPerPage}
                    onPageChange={setPaymentsPage}
                    onItemsPerPageChange={setPaymentsPerPage}
                  />
                </div>
              </div>
            )}

            {activeTab === "teachers" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gerenciar Professores</h2>
                  <button
                    className={styles.addButton}
                    onClick={() => setShowModal("teacher")}
                  >
                    <i className="fas fa-user-plus"></i>
                    Novo Professor
                  </button>
                </div>

                <div className={styles.classesGrid}>
                  {teachers.map((teacherItem) => (
                    <div key={teacherItem.id} className={styles.classCard}>
                      <div className={styles.classHeader}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          {teacherItem.profileImage ? (
                            <Image
                              src={teacherItem.profileImage}
                              alt={teacherItem.name}
                              width={60}
                              height={60}
                              style={{ borderRadius: "50%" }}
                            />
                          ) : (
                            <div
                              className={styles.avatarIconPlaceholder}
                              style={{
                                width: "60px",
                                height: "60px",
                                fontSize: "60px",
                              }}
                            >
                              <i className="fas fa-user-circle"></i>
                            </div>
                          )}
                          <div>
                            <h3>{teacherItem.name}</h3>
                            <span className={styles.classLevel}>
                              {teacherItem.specialty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.classInfo}>
                        <div className={styles.infoRow}>
                          <i className="fas fa-envelope"></i>
                          <span>{teacherItem.email}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <i className="fas fa-phone"></i>
                          <span>{teacherItem.phone}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <i className="fas fa-calendar"></i>
                          <span>Desde {teacherItem.startDate}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <i className="fas fa-chalkboard"></i>
                          <span>{teacherItem.classes.length} turma(s)</span>
                        </div>
                      </div>

                      <div className={styles.classActions}>
                        <button className={styles.actionButton}>
                          <i className="fas fa-edit"></i>
                          Editar
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.danger}`}
                          onClick={() => {
                            if (
                              confirm(
                                `Tem certeza que deseja excluir o professor ${teacherItem.name}?`
                              )
                            ) {
                              setTeachers(
                                teachers.filter((t) => t.id !== teacherItem.id)
                              );
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "access" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Controle de Acessos</h2>
                </div>

                <p style={{ color: "#666", marginBottom: "2rem" }}>
                  Configure as permissões de acesso para cada tipo de usuário.
                  Defina quais módulos cada perfil pode visualizar e editar.
                </p>

                {/* Administrador */}
                <div className={styles.accessTypeCard}>
                  <div className={styles.accessTypeHeader}>
                    <h3>
                      <i className="fas fa-user-shield"></i>
                      Administrador
                    </h3>
                    <span
                      className={`${styles.accessTypeBadge} ${styles.admin}`}
                    >
                      Acesso Total
                    </span>
                  </div>

                  <div className={styles.permissionsGrid}>
                    {/* Módulo Visão Geral */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-chart-line"></i>
                        <h4>Visão Geral</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Turmas */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-users"></i>
                        <h4>Turmas</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Alunos */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-user-graduate"></i>
                        <h4>Alunos</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Financeiro */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-money-bill-wave"></i>
                        <h4>Financeiro</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Professores */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-chalkboard-teacher"></i>
                        <h4>Professores</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professor */}
                <div className={styles.accessTypeCard}>
                  <div className={styles.accessTypeHeader}>
                    <h3>
                      <i className="fas fa-chalkboard-teacher"></i>
                      Professor
                    </h3>
                    <span
                      className={`${styles.accessTypeBadge} ${styles.teacher}`}
                    >
                      Acesso Limitado
                    </span>
                  </div>

                  <div className={styles.permissionsGrid}>
                    {/* Módulo Visão Geral */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-chart-line"></i>
                        <h4>Visão Geral</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Turmas */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-users"></i>
                        <h4>Turmas</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Alunos */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-user-graduate"></i>
                        <h4>Alunos</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Financeiro */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-money-bill-wave"></i>
                        <h4>Financeiro</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Módulo Professores */}
                    <div className={styles.permissionModule}>
                      <div className={styles.moduleHeader}>
                        <i className="fas fa-chalkboard-teacher"></i>
                        <h4>Professores</h4>
                      </div>
                      <div className={styles.permissionOptions}>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-eye"></i>
                            Visualizar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                        <div className={styles.permissionOption}>
                          <div className={styles.permissionLabel}>
                            <i className="fas fa-edit"></i>
                            Editar
                          </div>
                          <label className={styles.permissionToggle}>
                            <input type="checkbox" />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                    As alterações nas permissões são aplicadas imediatamente.
                    Configure cuidadosamente o acesso de cada perfil para
                    garantir a segurança do sistema.
                  </p>
                </div>
              </div>
            )}
          </div>
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

        {/* Modal Novo Aluno */}
        <StudentModal
          isOpen={showModal === "student"}
          onClose={() => setShowModal(null)}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          addressData={addressData}
          setAddressData={setAddressData}
          loadingCep={loadingCep}
          onCepSearch={handleCepSearch}
          classes={classes}
          onCreateStudent={handleCreateStudent}
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

        {/* Modal Novo Professor */}
        <TeacherModal
          isOpen={showModal === "teacher"}
          onClose={() => setShowModal(null)}
          teacherData={newStudent}
          setTeacherData={setNewStudent}
          addressData={addressData}
          setAddressData={setAddressData}
          loadingCep={loadingCep}
          onCepSearch={handleCepSearch}
          onSave={() => {
            alert("Funcionalidade de cadastro de professor será implementada");
            setShowModal(null);
          }}
        />

        {/* Modal de Configurações do Admin */}
        <AdminSettingsModal
          isOpen={showAdminSettings}
          onClose={() => setShowAdminSettings(false)}
          adminData={adminData}
          setAdminData={setAdminData}
          onSave={handleSaveAdminSettings}
        />
      </div>
    </>
  );
}
