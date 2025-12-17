"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
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
              <div className={styles.teacherProfileSection}>
                <div className={styles.avatarWrapper}>
                  <div
                    className={styles.profileImageContainer}
                    onClick={() =>
                      document.getElementById("teacher-photo-upload")?.click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {teacher.profileImage ? (
                      <Image
                        src={teacher.profileImage}
                        alt={teacher.name}
                        fill
                        className={styles.profileImage}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.profileIconPlaceholder}>
                        <i className="fas fa-user-circle"></i>
                      </div>
                    )}
                    <input
                      id="teacher-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleTeacherPhotoUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div
                    className={styles.cameraIconBadge}
                    onClick={() =>
                      document.getElementById("teacher-photo-upload")?.click()
                    }
                  >
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <h2 className={styles.profileName}>{teacher.name}</h2>
                <p className={styles.profileClass}>{teacher.specialty}</p>
                <div className={styles.profileDetails}>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-envelope"></i>
                    <span>{teacher.email}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-phone"></i>
                    <span>{teacher.phone}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-calendar"></i>
                    <span>Desde {teacher.startDate}</span>
                  </div>
                </div>
              </div>

              {/* Cards de Informação */}
              <div className={styles.quickInfo}>
                <div className={styles.infoCard}>
                  <i className="fas fa-chalkboard-teacher"></i>
                  <div>
                    <div className={styles.infoValue}>{classes.length}</div>
                    <div className={styles.infoLabel}>Turmas Ativas</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <i className="fas fa-user-graduate"></i>
                  <div>
                    <div className={styles.infoValue}>{students.length}</div>
                    <div className={styles.infoLabel}>Alunos Matriculados</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <i className="fas fa-clock"></i>
                  <div>
                    <div className={styles.infoValue}>
                      {classes.reduce((acc, c) => acc + c.schedule.length, 0)}
                    </div>
                    <div className={styles.infoLabel}>Aulas por Semana</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <i className="fas fa-users"></i>
                  <div>
                    <div className={styles.infoValue}>
                      {Math.round(
                        classes.reduce((acc, c) => acc + c.currentStudents, 0) /
                          classes.length
                      )}
                    </div>
                    <div className={styles.infoLabel}>Média por Turma</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <div className={styles.infoValue}>
                      {
                        students.filter((s) => s.payments[0]?.status === "paid")
                          .length
                      }
                    </div>
                    <div className={styles.infoLabel}>Pagamentos em Dia</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <i className="fas fa-door-open"></i>
                  <div>
                    <div className={styles.infoValue}>
                      {classes.reduce(
                        (acc, c) => acc + (c.maxStudents - c.currentStudents),
                        0
                      )}
                    </div>
                    <div className={styles.infoLabel}>Vagas Disponíveis</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendário Semanal */}
          {activeTab === "overview" && (
            <div className={styles.weeklyScheduleSection}>
              <h3 className={styles.scheduleTitle}>
                <i className="fas fa-calendar-week"></i>
                Agenda Semanal
              </h3>
              <div className={styles.weeklyCalendar}>
                {[
                  "Segunda-feira",
                  "Terça-feira",
                  "Quarta-feira",
                  "Quinta-feira",
                  "Sexta-feira",
                  "Sábado",
                ].map((day) => {
                  const dayClasses = classes
                    .flatMap((c) =>
                      c.schedule
                        .filter((sch) => sch.day === day)
                        .map((sch) => ({
                          ...sch,
                          className: c.name,
                          classId: c.id,
                        }))
                    )
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  return (
                    <div key={day} className={styles.calendarDay}>
                      <div className={styles.calendarDayHeader}>
                        <div className={styles.dayName}>
                          {day.split("-")[0]}
                        </div>
                        {dayClasses.length > 0 && (
                          <div className={styles.dayCount}>
                            {dayClasses.length}{" "}
                            {dayClasses.length === 1 ? "aula" : "aulas"}
                          </div>
                        )}
                      </div>
                      <div className={styles.calendarDayContent}>
                        {dayClasses.length === 0 ? (
                          <div className={styles.noClasses}>Sem aulas</div>
                        ) : (
                          dayClasses.map((classItem, idx) => (
                            <div key={idx} className={styles.calendarClass}>
                              <div className={styles.classTime}>
                                <i className="fas fa-clock"></i>
                                {classItem.startTime} - {classItem.endTime}
                              </div>
                              <div className={styles.classDetails}>
                                <div className={styles.classNameCal}>
                                  {classItem.className}
                                </div>
                                <div className={styles.classRoom}>
                                  <i className="fas fa-door-open"></i>
                                  {classItem.room}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className={styles.adminContent}>
            {activeTab === "overview" && (
              <div>
                <h2 style={{ color: "#e91e63", marginBottom: "1.5rem" }}>
                  Resumo das Atividades
                </h2>
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
                        <div className={styles.classInfoItem}>
                          <i className="fas fa-clock"></i>
                          {classItem.schedule.length} aulas por semana
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Filtrar por Nome
                    </label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Digite o nome..."
                      value={studentFilters.name}
                      onChange={(e) =>
                        setStudentFilters({
                          ...studentFilters,
                          name: e.target.value,
                        })
                      }
                      style={{ padding: "0.5rem", height: "auto" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Filtrar por Turma
                    </label>
                    <select
                      className={styles.formSelect}
                      value={studentFilters.class}
                      onChange={(e) =>
                        setStudentFilters({
                          ...studentFilters,
                          class: e.target.value,
                        })
                      }
                      style={{ padding: "0.5rem", height: "auto" }}
                    >
                      <option value="">Todas as turmas</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Filtrar por Status
                    </label>
                    <select
                      className={styles.formSelect}
                      value={studentFilters.status}
                      onChange={(e) =>
                        setStudentFilters({
                          ...studentFilters,
                          status: e.target.value,
                        })
                      }
                      style={{ padding: "0.5rem", height: "auto" }}
                    >
                      <option value="">Todos os status</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <label style={{ fontSize: "0.9rem", color: "#666" }}>
                      Mostrar:
                    </label>
                    <select
                      className={styles.formSelect}
                      value={studentsPerPage}
                      onChange={(e) => {
                        setStudentsPerPage(Number(e.target.value));
                        setStudentsPage(1);
                      }}
                      style={{ width: "auto", padding: "0.5rem" }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                    </select>
                    <span style={{ fontSize: "0.9rem", color: "#666" }}>
                      por página
                    </span>
                  </div>
                </div>

                <div className={styles.studentsTableContainer}>
                  <table className={styles.studentsTable}>
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Turma</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter((student) => {
                          if (
                            studentFilters.name &&
                            !student.name
                              .toLowerCase()
                              .includes(studentFilters.name.toLowerCase())
                          ) {
                            return false;
                          }
                          if (
                            studentFilters.class &&
                            student.class !== studentFilters.class
                          ) {
                            return false;
                          }
                          if (
                            studentFilters.status &&
                            student.status !== studentFilters.status
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .slice(
                          (studentsPage - 1) * studentsPerPage,
                          studentsPage * studentsPerPage
                        )
                        .map((student) => (
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
                                <div className={styles.avatarIconPlaceholder}>
                                  <i className="fas fa-user-circle"></i>
                                </div>
                              )}
                            </td>
                            <td>{student.name}</td>
                            <td>{student.class}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td>
                              <span
                                className={`student-status-badge ${
                                  student.status === "Ativo"
                                    ? "active"
                                    : "inactive"
                                }`}
                              >
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className={styles.tableActionBtn}
                                onClick={() => handleEditStudent(student)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className={styles.tableActionBtn}
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className={styles.paginationContainer}>
                  <div className={styles.paginationInfo}>
                    Mostrando{" "}
                    {Math.min(
                      (studentsPage - 1) * studentsPerPage + 1,
                      students.filter((student) => {
                        if (
                          studentFilters.name &&
                          !student.name
                            .toLowerCase()
                            .includes(studentFilters.name.toLowerCase())
                        )
                          return false;
                        if (
                          studentFilters.id &&
                          !student.id
                            .toLowerCase()
                            .includes(studentFilters.id.toLowerCase())
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
                    )}{" "}
                    a{" "}
                    {Math.min(
                      studentsPage * studentsPerPage,
                      students.filter((student) => {
                        if (
                          studentFilters.name &&
                          !student.name
                            .toLowerCase()
                            .includes(studentFilters.name.toLowerCase())
                        )
                          return false;
                        if (
                          studentFilters.id &&
                          !student.id
                            .toLowerCase()
                            .includes(studentFilters.id.toLowerCase())
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
                    )}{" "}
                    de{" "}
                    {
                      students.filter((student) => {
                        if (
                          studentFilters.name &&
                          !student.name
                            .toLowerCase()
                            .includes(studentFilters.name.toLowerCase())
                        )
                          return false;
                        if (
                          studentFilters.id &&
                          !student.id
                            .toLowerCase()
                            .includes(studentFilters.id.toLowerCase())
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
                    }{" "}
                    alunos
                  </div>
                  <div className={styles.paginationControls}>
                    <button
                      className={styles.paginationBtn}
                      onClick={() => setStudentsPage(1)}
                      disabled={studentsPage === 1}
                    >
                      <i className="fas fa-angle-double-left"></i>
                    </button>
                    <button
                      className={styles.paginationBtn}
                      onClick={() =>
                        setStudentsPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={studentsPage === 1}
                    >
                      <i className="fas fa-angle-left"></i>
                    </button>
                    {Array.from(
                      {
                        length: Math.ceil(
                          students.filter((student) => {
                            if (
                              studentFilters.name &&
                              !student.name
                                .toLowerCase()
                                .includes(studentFilters.name.toLowerCase())
                            )
                              return false;
                            if (
                              studentFilters.id &&
                              !student.id
                                .toLowerCase()
                                .includes(studentFilters.id.toLowerCase())
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
                          }).length / studentsPerPage
                        ),
                      },
                      (_, i) => i + 1
                    )
                      .filter((page) => {
                        const totalPages = Math.ceil(
                          students.filter((student) => {
                            if (
                              studentFilters.name &&
                              !student.name
                                .toLowerCase()
                                .includes(studentFilters.name.toLowerCase())
                            )
                              return false;
                            if (
                              studentFilters.id &&
                              !student.id
                                .toLowerCase()
                                .includes(studentFilters.id.toLowerCase())
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
                          }).length / studentsPerPage
                        );
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - studentsPage) <= 1) return true;
                        return false;
                      })
                      .map((page, index, array) => {
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return [
                            <span
                              key={`ellipsis-${page}`}
                              className={styles.paginationEllipsis}
                            >
                              ...
                            </span>,
                            <button
                              key={page}
                              className={`${styles.paginationBtn} ${
                                studentsPage === page ? styles.active : ""
                              }`}
                              onClick={() => setStudentsPage(page)}
                            >
                              {page}
                            </button>,
                          ];
                        }
                        return (
                          <button
                            key={page}
                            className={`${styles.paginationBtn} ${
                              studentsPage === page ? styles.active : ""
                            }`}
                            onClick={() => setStudentsPage(page)}
                          >
                            {page}
                          </button>
                        );
                      })}
                    <button
                      className={styles.paginationBtn}
                      onClick={() =>
                        setStudentsPage((prev) =>
                          Math.min(
                            Math.ceil(
                              students.filter((student) => {
                                if (
                                  studentFilters.name &&
                                  !student.name
                                    .toLowerCase()
                                    .includes(studentFilters.name.toLowerCase())
                                )
                                  return false;
                                if (
                                  studentFilters.id &&
                                  !student.id
                                    .toLowerCase()
                                    .includes(studentFilters.id.toLowerCase())
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
                              }).length / studentsPerPage
                            ),
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        studentsPage >=
                        Math.ceil(
                          students.filter((student) => {
                            if (
                              studentFilters.name &&
                              !student.name
                                .toLowerCase()
                                .includes(studentFilters.name.toLowerCase())
                            )
                              return false;
                            if (
                              studentFilters.id &&
                              !student.id
                                .toLowerCase()
                                .includes(studentFilters.id.toLowerCase())
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
                          }).length / studentsPerPage
                        )
                      }
                    >
                      <i className="fas fa-angle-right"></i>
                    </button>
                    <button
                      className={styles.paginationBtn}
                      onClick={() =>
                        setStudentsPage(
                          Math.ceil(
                            students.filter((student) => {
                              if (
                                studentFilters.name &&
                                !student.name
                                  .toLowerCase()
                                  .includes(studentFilters.name.toLowerCase())
                              )
                                return false;
                              if (
                                studentFilters.id &&
                                !student.id
                                  .toLowerCase()
                                  .includes(studentFilters.id.toLowerCase())
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
                            }).length / studentsPerPage
                          )
                        )
                      }
                      disabled={
                        studentsPage >=
                        Math.ceil(
                          students.filter((student) => {
                            if (
                              studentFilters.name &&
                              !student.name
                                .toLowerCase()
                                .includes(studentFilters.name.toLowerCase())
                            )
                              return false;
                            if (
                              studentFilters.id &&
                              !student.id
                                .toLowerCase()
                                .includes(studentFilters.id.toLowerCase())
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
                          }).length / studentsPerPage
                        )
                      }
                    >
                      <i className="fas fa-angle-double-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <div className={styles.adminSectionHeader}>
                  <h2>Gestão Financeira</h2>
                </div>

                {/* Resumo Financeiro */}
                <div className={styles.financialSummary}>
                  <div className={`${styles.financialCard} ${styles.paid}`}>
                    <i className="fas fa-check-circle"></i>
                    <div>
                      <div className={styles.financialValue}>
                        {students.reduce(
                          (acc, s) =>
                            acc +
                            s.payments.filter((p) => p.status === "paid")
                              .length,
                          0
                        )}
                      </div>
                      <div className={styles.financialLabel}>
                        Pagamentos em Dia
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.financialCard} ${styles.pending}`}>
                    <i className="fas fa-exclamation-circle"></i>
                    <div>
                      <div className={styles.financialValue}>
                        {students.reduce(
                          (acc, s) =>
                            acc +
                            s.payments.filter((p) => p.status === "pending")
                              .length,
                          0
                        )}
                      </div>
                      <div className={styles.financialLabel}>
                        Pagamentos Pendentes
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.financialCard} ${styles.overdue}`}>
                    <i className="fas fa-times-circle"></i>
                    <div>
                      <div className={styles.financialValue}>
                        {students.reduce((acc, s) => {
                          const overduePayments = s.payments.filter((p) => {
                            if (p.status !== "pending") return false;
                            const dueDate = new Date(
                              p.dueDate.split("/").reverse().join("-")
                            );
                            return dueDate < new Date();
                          });
                          return acc + overduePayments.length;
                        }, 0)}
                      </div>
                      <div className={styles.financialLabel}>
                        Pagamentos Atrasados
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.financialCard} ${styles.total}`}>
                    <i className="fas fa-dollar-sign"></i>
                    <div>
                      <div className={styles.financialValue}>
                        R${" "}
                        {students
                          .reduce((acc, s) => {
                            const total = s.payments
                              .filter((p) => p.status === "paid")
                              .reduce(
                                (sum, p) =>
                                  sum +
                                  parseFloat(
                                    p.amount
                                      .replace("R$ ", "")
                                      .replace(",", ".")
                                  ),
                                0
                              );
                            return acc + total;
                          }, 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </div>
                      <div className={styles.financialLabel}>Receita Total</div>
                    </div>
                  </div>
                </div>

                {/* Gráfico de Receita Mensal */}
                <div className={styles.revenueChartSection}>
                  <h3>Receita Mensal - Últimos 6 Meses</h3>
                  <div className={styles.revenueChart}>
                    {[
                      { month: "Jul", value: 2800, label: "R$ 2.800" },
                      { month: "Ago", value: 3200, label: "R$ 3.200" },
                      { month: "Set", value: 2950, label: "R$ 2.950" },
                      { month: "Out", value: 3400, label: "R$ 3.400" },
                      { month: "Nov", value: 3650, label: "R$ 3.650" },
                      { month: "Dez", value: 3950, label: "R$ 3.950" },
                    ].map((data, index, array) => {
                      const maxValue = Math.max(...array.map((d) => d.value));
                      const heightPercent = (data.value / maxValue) * 100;
                      const prevValue =
                        index > 0 ? array[index - 1].value : data.value;
                      const isIncreasing = data.value > prevValue;
                      const isDecreasing = data.value < prevValue;

                      return (
                        <div
                          key={data.month}
                          className={styles.chartBarContainer}
                        >
                          <div className={styles.chartValue}>{data.label}</div>
                          <div
                            className={`${styles.chartBar} ${
                              isIncreasing
                                ? styles.increasing
                                : isDecreasing
                                ? styles.decreasing
                                : styles.stable
                            }`}
                            style={{ height: `${heightPercent}%` }}
                            title={`${data.month}: ${data.label}`}
                          ></div>
                          <div className={styles.chartLabel}>{data.month}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendColor} ${styles.increasing}`}
                      ></span>
                      <span>Crescimento</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendColor} ${styles.decreasing}`}
                      ></span>
                      <span>Queda</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendColor} ${styles.stable}`}
                      ></span>
                      <span>Estável</span>
                    </div>
                  </div>
                </div>

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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <label style={{ fontSize: "0.9rem", color: "#666" }}>
                        Mostrar:
                      </label>
                      <select
                        className={styles.formSelect}
                        value={paymentsPerPage}
                        onChange={(e) => {
                          setPaymentsPerPage(Number(e.target.value));
                          setPaymentsPage(1);
                        }}
                        style={{ width: "auto", padding: "0.5rem" }}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                      </select>
                      <span style={{ fontSize: "0.9rem", color: "#666" }}>
                        por página
                      </span>
                    </div>
                  </div>

                  {/* Filtros */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                          fontWeight: 600,
                        }}
                      >
                        Filtrar por Nome
                      </label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Digite o nome..."
                        value={paymentFilters.name}
                        onChange={(e) =>
                          setPaymentFilters({
                            ...paymentFilters,
                            name: e.target.value,
                          })
                        }
                        style={{ padding: "0.5rem", height: "auto" }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                          fontWeight: 600,
                        }}
                      >
                        Filtrar por Turma
                      </label>
                      <select
                        className={styles.formSelect}
                        value={paymentFilters.class}
                        onChange={(e) =>
                          setPaymentFilters({
                            ...paymentFilters,
                            class: e.target.value,
                          })
                        }
                        style={{ padding: "0.5rem", height: "auto" }}
                      >
                        <option value="">Todas as turmas</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                          fontWeight: 600,
                        }}
                      >
                        Filtrar por Status
                      </label>
                      <select
                        className={styles.formSelect}
                        value={paymentFilters.status}
                        onChange={(e) =>
                          setPaymentFilters({
                            ...paymentFilters,
                            status: e.target.value,
                          })
                        }
                        style={{ padding: "0.5rem", height: "auto" }}
                      >
                        <option value="">Todos os status</option>
                        <option value="paid">Pago</option>
                        <option value="pending">Pendente</option>
                        <option value="overdue">Atrasado</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                          fontWeight: 600,
                        }}
                      >
                        Filtrar por Mês
                      </label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ex: Dezembro 2024"
                        value={paymentFilters.month}
                        onChange={(e) =>
                          setPaymentFilters({
                            ...paymentFilters,
                            month: e.target.value,
                          })
                        }
                        style={{ padding: "0.5rem", height: "auto" }}
                      />
                    </div>
                  </div>

                  <div className={styles.paymentsTableContainer}>
                    <table className={styles.studentsTable}>
                      <thead>
                        <tr>
                          <th>Aluno</th>
                          <th>Turma</th>
                          <th>Mensalidade</th>
                          <th>Status Atual</th>
                          <th>Última Atualização</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students
                          .filter((student) => {
                            // Aplicar filtros
                            if (
                              paymentFilters.name &&
                              !student.name
                                .toLowerCase()
                                .includes(paymentFilters.name.toLowerCase())
                            ) {
                              return false;
                            }
                            if (
                              paymentFilters.class &&
                              student.class !== paymentFilters.class
                            ) {
                              return false;
                            }
                            if (paymentFilters.status) {
                              const currentPayment = student.payments[0];
                              if (paymentFilters.status === "overdue") {
                                if (currentPayment.status !== "pending")
                                  return false;
                                const dueDate = new Date(
                                  currentPayment.dueDate
                                    .split("/")
                                    .reverse()
                                    .join("-")
                                );
                                if (dueDate >= new Date()) return false;
                              } else if (
                                currentPayment.status !== paymentFilters.status
                              ) {
                                return false;
                              }
                            }
                            if (
                              paymentFilters.month &&
                              !student.payments[0]?.month
                                .toLowerCase()
                                .includes(paymentFilters.month.toLowerCase())
                            ) {
                              return false;
                            }
                            return true;
                          })
                          .slice(
                            (paymentsPage - 1) * paymentsPerPage,
                            paymentsPage * paymentsPerPage
                          )
                          .map((student) => {
                            const currentPayment = student.payments[0];
                            const pendingCount = student.payments.filter(
                              (p) => p.status === "pending"
                            ).length;

                            return (
                              <tr key={student.id}>
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    {student.profileImage ? (
                                      <Image
                                        src={student.profileImage}
                                        alt={student.name}
                                        width={35}
                                        height={35}
                                        className={styles.studentAvatar}
                                      />
                                    ) : (
                                      <div
                                        className={styles.avatarIconPlaceholder}
                                        style={{
                                          width: "35px",
                                          height: "35px",
                                          fontSize: "35px",
                                        }}
                                      >
                                        <i className="fas fa-user-circle"></i>
                                      </div>
                                    )}
                                    <span>{student.name}</span>
                                  </div>
                                </td>
                                <td>{student.class}</td>
                                <td>{currentPayment?.amount}</td>
                                <td>
                                  {pendingCount > 0 ? (
                                    <span
                                      className={`${styles.paymentStatusBadge} ${styles.pending}`}
                                    >
                                      {pendingCount}{" "}
                                      {pendingCount === 1 ? "mês" : "meses"}{" "}
                                      pendente{pendingCount > 1 ? "s" : ""}
                                    </span>
                                  ) : (
                                    <span
                                      className={`${styles.paymentStatusBadge} ${styles.paid}`}
                                    >
                                      Em dia
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {currentPayment?.status === "paid"
                                    ? currentPayment.paidDate
                                    : `Vence em ${currentPayment?.dueDate}`}
                                </td>
                                <td>
                                  <button
                                    className={styles.tableActionBtn}
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setShowModal("payment");
                                    }}
                                  >
                                    <i className="fas fa-eye"></i> Ver Histórico
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  <div className={styles.paginationContainer}>
                    <div className={styles.paginationInfo}>
                      Mostrando{" "}
                      {Math.min(
                        (paymentsPage - 1) * paymentsPerPage + 1,
                        students.length
                      )}{" "}
                      a{" "}
                      {Math.min(
                        paymentsPage * paymentsPerPage,
                        students.length
                      )}{" "}
                      de {students.length} alunos
                    </div>
                    <div className={styles.paginationControls}>
                      <button
                        className={styles.paginationBtn}
                        onClick={() => setPaymentsPage(1)}
                        disabled={paymentsPage === 1}
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </button>
                      <button
                        className={styles.paginationBtn}
                        onClick={() =>
                          setPaymentsPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={paymentsPage === 1}
                      >
                        <i className="fas fa-angle-left"></i>
                      </button>
                      {Array.from(
                        {
                          length: Math.ceil(students.length / paymentsPerPage),
                        },
                        (_, i) => i + 1
                      )
                        .filter((page) => {
                          const totalPages = Math.ceil(
                            students.length / paymentsPerPage
                          );
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - paymentsPage) <= 1) return true;
                          return false;
                        })
                        .map((page, index, array) => {
                          if (index > 0 && array[index - 1] !== page - 1) {
                            return [
                              <span
                                key={`ellipsis-${page}`}
                                className={styles.paginationEllipsis}
                              >
                                ...
                              </span>,
                              <button
                                key={page}
                                className={`${styles.paginationBtn} ${
                                  paymentsPage === page ? styles.active : ""
                                }`}
                                onClick={() => setPaymentsPage(page)}
                              >
                                {page}
                              </button>,
                            ];
                          }
                          return (
                            <button
                              key={page}
                              className={`${styles.paginationBtn} ${
                                paymentsPage === page ? styles.active : ""
                              }`}
                              onClick={() => setPaymentsPage(page)}
                            >
                              {page}
                            </button>
                          );
                        })}
                      <button
                        className={styles.paginationBtn}
                        onClick={() =>
                          setPaymentsPage((prev) =>
                            Math.min(
                              Math.ceil(students.length / paymentsPerPage),
                              prev + 1
                            )
                          )
                        }
                        disabled={
                          paymentsPage >=
                          Math.ceil(students.length / paymentsPerPage)
                        }
                      >
                        <i className="fas fa-angle-right"></i>
                      </button>
                      <button
                        className={styles.paginationBtn}
                        onClick={() =>
                          setPaymentsPage(
                            Math.ceil(students.length / paymentsPerPage)
                          )
                        }
                        disabled={
                          paymentsPage >=
                          Math.ceil(students.length / paymentsPerPage)
                        }
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </button>
                    </div>
                  </div>
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
        {showModal === "payment" && selectedStudent && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowModal(null);
              setSelectedStudent(null);
            }}
          >
            <div
              className={`${styles.modalContainer} ${styles.large}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Histórico de Pagamentos - {selectedStudent.name}</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowModal(null);
                    setSelectedStudent(null);
                  }}
                >
                  &times;
                </button>
              </div>

              <div className={styles.studentPaymentInfo}>
                <div className={styles.paymentInfoItem}>
                  <strong>Turma:</strong> {selectedStudent.class}
                </div>
                <div className={styles.paymentInfoItem}>
                  <strong>Data de Matrícula:</strong>{" "}
                  {selectedStudent.enrollmentDate}
                </div>
              </div>

              <div className={styles.paymentHistory}>
                <h4>Histórico de Mensalidades</h4>
                <table className={styles.paymentHistoryTable}>
                  <thead>
                    <tr>
                      <th>Mês/Ano</th>
                      <th>Valor</th>
                      <th>Vencimento</th>
                      <th>Data Pagamento</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.payments.map((payment, idx) => (
                      <tr key={idx}>
                        <td>{payment.month}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.dueDate}</td>
                        <td>{payment.paidDate || "-"}</td>
                        <td>
                          <span
                            className={`payment-status-badge ${payment.status}`}
                          >
                            {payment.status === "paid" ? "Pago" : "Pendente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => {
                    setShowModal(null);
                    setSelectedStudent(null);
                  }}
                >
                  Fechar
                </button>
                <button className={`${styles.formButton} ${styles.primary}`}>
                  <i className="fas fa-check"></i> Registrar Pagamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nova Turma */}
        {showModal === "class" && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowModal(null)}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Nova Turma</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Nome da Turma *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, name: e.target.value })
                    }
                    placeholder="Ex: Ballet Avançado"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Nível *</label>
                  <select
                    className={styles.formSelect}
                    value={newClass.level}
                    onChange={(e) =>
                      setNewClass({ ...newClass, level: e.target.value })
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Todos os níveis">Todos os níveis</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Máximo de Alunos</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={newClass.maxStudents}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        maxStudents: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Sala *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newClass.room}
                    onChange={(e) =>
                      setNewClass({ ...newClass, room: e.target.value })
                    }
                    placeholder="Ex: Sala 1 - Principal"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Horários das Aulas</label>
                  <div className={styles.scheduleInputs}>
                    <select
                      value={scheduleInput.day}
                      onChange={(e) =>
                        setScheduleInput({
                          ...scheduleInput,
                          day: e.target.value,
                        })
                      }
                    >
                      <option value="">Dia</option>
                      <option value="Segunda-feira">Segunda-feira</option>
                      <option value="Terça-feira">Terça-feira</option>
                      <option value="Quarta-feira">Quarta-feira</option>
                      <option value="Quinta-feira">Quinta-feira</option>
                      <option value="Sexta-feira">Sexta-feira</option>
                      <option value="Sábado">Sábado</option>
                    </select>
                    <input
                      type="time"
                      value={scheduleInput.startTime}
                      onChange={(e) =>
                        setScheduleInput({
                          ...scheduleInput,
                          startTime: e.target.value,
                        })
                      }
                    />
                    <input
                      type="time"
                      value={scheduleInput.endTime}
                      onChange={(e) =>
                        setScheduleInput({
                          ...scheduleInput,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    className={styles.addScheduleBtn}
                    onClick={handleAddSchedule}
                  >
                    + Adicionar Horário
                  </button>

                  {newClass.schedule && newClass.schedule.length > 0 && (
                    <div>
                      {newClass.schedule.map((sch, idx) => (
                        <div key={idx} className={styles.scheduleListItem}>
                          <span>
                            {sch.day} - {sch.startTime} às {sch.endTime} (
                            {sch.room})
                          </span>
                          <button
                            className={styles.removeScheduleBtn}
                            onClick={() => handleRemoveSchedule(idx)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => setShowModal(null)}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.formButton} ${styles.primary}`}
                  onClick={handleCreateClass}
                >
                  Criar Turma
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar Turma */}
        {showModal === "editClass" && editingClass && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setShowModal(null);
              setEditingClass(null);
            }}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Editar Turma</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowModal(null);
                    setEditingClass(null);
                  }}
                >
                  &times;
                </button>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Nome da Turma *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, name: e.target.value })
                    }
                    placeholder="Ex: Ballet Avançado"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Nível *</label>
                  <select
                    className={styles.formSelect}
                    value={newClass.level}
                    onChange={(e) =>
                      setNewClass({ ...newClass, level: e.target.value })
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Todos os níveis">Todos os níveis</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Máximo de Alunos</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={newClass.maxStudents}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        maxStudents: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Sala *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newClass.room}
                    onChange={(e) =>
                      setNewClass({ ...newClass, room: e.target.value })
                    }
                    placeholder="Ex: Sala 1 - Principal"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Horários das Aulas</label>
                  <div className={styles.scheduleInputs}>
                    <select
                      value={scheduleInput.day}
                      onChange={(e) =>
                        setScheduleInput({
                          ...scheduleInput,
                          day: e.target.value,
                        })
                      }
                    >
                      <option value="">Dia</option>
                      <option value="Segunda-feira">Segunda-feira</option>
                      <option value="Terça-feira">Terça-feira</option>
                      <option value="Quarta-feira">Quarta-feira</option>
                      <option value="Quinta-feira">Quinta-feira</option>
                      <option value="Sexta-feira">Sexta-feira</option>
                      <option value="Sábado">Sábado</option>
                    </select>
                    <input
                      type="time"
                      value={scheduleInput.startTime}
                      onChange={(e) =>
                        setScheduleInput({
                          ...scheduleInput,
                          startTime: e.target.value,
                        })
                      }
                    />
                    <input
                      type="time"
                      value={scheduleInput.endTime}
                      onChange={(e) =>
                        setScheduleInput({
                          ...scheduleInput,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    className={styles.addScheduleBtn}
                    onClick={handleAddSchedule}
                  >
                    + Adicionar Horário
                  </button>

                  {newClass.schedule && newClass.schedule.length > 0 && (
                    <div>
                      {newClass.schedule.map((sch, idx) => (
                        <div key={idx} className={styles.scheduleListItem}>
                          <span>
                            {sch.day} - {sch.startTime} às {sch.endTime}
                          </span>
                          <button
                            className={styles.removeScheduleBtn}
                            onClick={() => handleRemoveSchedule(idx)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => {
                    setShowModal(null);
                    setEditingClass(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.formButton} ${styles.primary}`}
                  onClick={handleUpdateClass}
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Novo Aluno */}
        {showModal === "student" && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowModal(null)}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Novo Aluno</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Nome Completo *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    placeholder="Nome do aluno"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>E-mail *</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Telefone *</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    placeholder="(41) 98765-4321"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Responsável</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.guardian || ""}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian: e.target.value })
                    }
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={newStudent.birthDate}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>CPF *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.cpf}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>RG *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.rg}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, rg: e.target.value })
                    }
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>CEP *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.cep}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAddressData({ ...addressData, cep: value });
                      handleCepSearch(value);
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {loadingCep && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        marginTop: "0.5rem",
                      }}
                    >
                      Buscando CEP...
                    </p>
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Rua/Avenida *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({ ...addressData, street: e.target.value })
                    }
                    placeholder="Nome da Rua"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Número *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.number}
                    onChange={(e) =>
                      setAddressData({ ...addressData, number: e.target.value })
                    }
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Complemento</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.complement}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        complement: e.target.value,
                      })
                    }
                    placeholder="Apto, Bloco, etc"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Bairro *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.neighborhood}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        neighborhood: e.target.value,
                      })
                    }
                    placeholder="Nome do Bairro"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Cidade *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData({ ...addressData, city: e.target.value })
                    }
                    placeholder="Nome da Cidade"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Estado *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({ ...addressData, state: e.target.value })
                    }
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Turma *</label>
                  <select
                    className={styles.formSelect}
                    value={newStudent.classId}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, classId: e.target.value })
                    }
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name} ({classItem.currentStudents}/
                        {classItem.maxStudents})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Possui alguma deficiência?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="hasDisability"
                        checked={newStudent.hasDisability === false}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            hasDisability: false,
                            disabilityDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="hasDisability"
                        checked={newStudent.hasDisability === true}
                        onChange={() =>
                          setNewStudent({ ...newStudent, hasDisability: true })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {newStudent.hasDisability && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newStudent.disabilityDescription}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          disabilityDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva a deficiência"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Toma algum medicamento?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="takesMedication"
                        checked={newStudent.takesMedication === false}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            takesMedication: false,
                            medicationDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="takesMedication"
                        checked={newStudent.takesMedication === true}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            takesMedication: true,
                          })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {newStudent.takesMedication && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newStudent.medicationDescription}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          medicationDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva os medicamentos"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Métodos de Pagamento Habilitados *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                      marginTop: "0.75rem",
                      padding: "1rem",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newStudent.paymentMethods?.includes("pix")}
                        onChange={(e) => {
                          const methods = newStudent.paymentMethods || [];
                          if (e.target.checked) {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: [...methods, "pix"],
                            });
                          } else {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: methods.filter(
                                (m) => m !== "pix"
                              ),
                            });
                          }
                        }}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                      <i
                        className="fas fa-qrcode"
                        style={{ color: "#e91e63" }}
                      ></i>
                      PIX
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newStudent.paymentMethods?.includes("boleto")}
                        onChange={(e) => {
                          const methods = newStudent.paymentMethods || [];
                          if (e.target.checked) {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: [...methods, "boleto"],
                            });
                          } else {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: methods.filter(
                                (m) => m !== "boleto"
                              ),
                            });
                          }
                        }}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                      <i
                        className="fas fa-barcode"
                        style={{ color: "#e91e63" }}
                      ></i>
                      Boleto
                    </label>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "0.5rem",
                    }}
                  >
                    Selecione ao menos um método de pagamento para o aluno
                  </p>
                </div>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => setShowModal(null)}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.formButton} ${styles.primary}`}
                  onClick={handleCreateStudent}
                >
                  Cadastrar Aluno
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar Aluno */}
        {showModal === "editStudent" && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowModal(null)}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Editar Aluno</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Nome Completo *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    placeholder="Nome do aluno"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>E-mail *</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Telefone *</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    placeholder="(41) 98765-4321"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Responsável</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.guardian || ""}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian: e.target.value })
                    }
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={newStudent.birthDate}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>CPF *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.cpf}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>RG *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.rg}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, rg: e.target.value })
                    }
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>CEP *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.cep}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAddressData({ ...addressData, cep: value });
                      handleCepSearch(value);
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {loadingCep && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        marginTop: "0.5rem",
                      }}
                    >
                      Buscando CEP...
                    </p>
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Rua/Avenida *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({ ...addressData, street: e.target.value })
                    }
                    placeholder="Nome da Rua"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Número *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.number}
                    onChange={(e) =>
                      setAddressData({ ...addressData, number: e.target.value })
                    }
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Complemento</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.complement}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        complement: e.target.value,
                      })
                    }
                    placeholder="Apto, Bloco, etc"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Bairro *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.neighborhood}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        neighborhood: e.target.value,
                      })
                    }
                    placeholder="Nome do Bairro"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Cidade *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData({ ...addressData, city: e.target.value })
                    }
                    placeholder="Nome da Cidade"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Estado *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({ ...addressData, state: e.target.value })
                    }
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Turma *</label>
                  <select
                    className={styles.formSelect}
                    value={newStudent.classId}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, classId: e.target.value })
                    }
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name} ({classItem.currentStudents}/
                        {classItem.maxStudents})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Possui alguma deficiência?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="editHasDisability"
                        checked={newStudent.hasDisability === false}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            hasDisability: false,
                            disabilityDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="editHasDisability"
                        checked={newStudent.hasDisability === true}
                        onChange={() =>
                          setNewStudent({ ...newStudent, hasDisability: true })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {newStudent.hasDisability && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newStudent.disabilityDescription}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          disabilityDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva a deficiência"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Toma algum medicamento?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="editTakesMedication"
                        checked={newStudent.takesMedication === false}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            takesMedication: false,
                            medicationDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="editTakesMedication"
                        checked={newStudent.takesMedication === true}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            takesMedication: true,
                          })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {newStudent.takesMedication && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newStudent.medicationDescription}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          medicationDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva os medicamentos"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Métodos de Pagamento Habilitados *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                      marginTop: "0.75rem",
                      padding: "1rem",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newStudent.paymentMethods?.includes("pix")}
                        onChange={(e) => {
                          const methods = newStudent.paymentMethods || [];
                          if (e.target.checked) {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: [...methods, "pix"],
                            });
                          } else {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: methods.filter(
                                (m) => m !== "pix"
                              ),
                            });
                          }
                        }}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                      <i
                        className="fas fa-qrcode"
                        style={{ color: "#e91e63" }}
                      ></i>
                      PIX
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newStudent.paymentMethods?.includes("boleto")}
                        onChange={(e) => {
                          const methods = newStudent.paymentMethods || [];
                          if (e.target.checked) {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: [...methods, "boleto"],
                            });
                          } else {
                            setNewStudent({
                              ...newStudent,
                              paymentMethods: methods.filter(
                                (m) => m !== "boleto"
                              ),
                            });
                          }
                        }}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                      <i
                        className="fas fa-barcode"
                        style={{ color: "#e91e63" }}
                      ></i>
                      Boleto
                    </label>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "0.5rem",
                    }}
                  >
                    Selecione ao menos um método de pagamento para o aluno
                  </p>
                </div>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => setShowModal(null)}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.formButton} ${styles.primary}`}
                  onClick={handleUpdateStudent}
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Novo Professor */}
        {showModal === "teacher" && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowModal(null)}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Novo Professor</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Nome Completo *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    placeholder="Nome do professor"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>E-mail *</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Telefone *</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    placeholder="(41) 98765-4321"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={newStudent.birthDate}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>CPF *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.cpf}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>RG *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newStudent.rg}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, rg: e.target.value })
                    }
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>CEP *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.cep}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAddressData({ ...addressData, cep: value });
                      handleCepSearch(value);
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {loadingCep && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        marginTop: "0.5rem",
                      }}
                    >
                      Buscando CEP...
                    </p>
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Rua/Avenida *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({ ...addressData, street: e.target.value })
                    }
                    placeholder="Nome da Rua"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Número *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.number}
                    onChange={(e) =>
                      setAddressData({ ...addressData, number: e.target.value })
                    }
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Complemento</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.complement}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        complement: e.target.value,
                      })
                    }
                    placeholder="Apto, Bloco, etc"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Bairro *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.neighborhood}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        neighborhood: e.target.value,
                      })
                    }
                    placeholder="Nome do Bairro"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Cidade *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData({ ...addressData, city: e.target.value })
                    }
                    placeholder="Nome da Cidade"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Estado *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({ ...addressData, state: e.target.value })
                    }
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>Especialidade *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Ex: Ballet Clássico, Jazz, Hip Hop"
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Possui alguma deficiência?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="teacherHasDisability"
                        checked={newStudent.hasDisability === false}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            hasDisability: false,
                            disabilityDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="teacherHasDisability"
                        checked={newStudent.hasDisability === true}
                        onChange={() =>
                          setNewStudent({ ...newStudent, hasDisability: true })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {newStudent.hasDisability && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newStudent.disabilityDescription}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          disabilityDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva a deficiência"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Toma algum medicamento?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="teacherTakesMedication"
                        checked={newStudent.takesMedication === false}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            takesMedication: false,
                            medicationDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="teacherTakesMedication"
                        checked={newStudent.takesMedication === true}
                        onChange={() =>
                          setNewStudent({
                            ...newStudent,
                            takesMedication: true,
                          })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {newStudent.takesMedication && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newStudent.medicationDescription}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          medicationDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva os medicamentos"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => setShowModal(null)}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.formButton} ${styles.primary}`}
                  onClick={() => {
                    // Aqui você pode adicionar a lógica para salvar o professor
                    alert(
                      "Funcionalidade de cadastro de professor será implementada"
                    );
                    setShowModal(null);
                  }}
                >
                  Cadastrar Professor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configurações do Admin */}
        {showAdminSettings && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowAdminSettings(false)}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Configurações do Administrador</h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowAdminSettings(false)}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className={styles.formLabel}>Nome Completo *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={adminData.name}
                      onChange={(e) =>
                        setAdminData({ ...adminData, name: e.target.value })
                      }
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="form-group">
                    <label className={styles.formLabel}>
                      Nome de Usuário *
                    </label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={adminData.username}
                      onChange={(e) =>
                        setAdminData({ ...adminData, username: e.target.value })
                      }
                      placeholder="Nome de usuário para login"
                    />
                  </div>

                  <div className="form-group">
                    <label className={styles.formLabel}>E-mail *</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={adminData.email}
                      onChange={(e) =>
                        setAdminData({ ...adminData, email: e.target.value })
                      }
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className={styles.formLabel}>Telefone</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      value={adminData.phone}
                      onChange={(e) =>
                        setAdminData({ ...adminData, phone: e.target.value })
                      }
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="form-group">
                    <label className={styles.formLabel}>
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={adminData.birthDate}
                      onChange={(e) =>
                        setAdminData({
                          ...adminData,
                          birthDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className={styles.formLabel}>Nova Senha *</label>
                    <input
                      type="password"
                      className={styles.formInput}
                      value={adminData.password}
                      onChange={(e) =>
                        setAdminData({ ...adminData, password: e.target.value })
                      }
                      placeholder="Digite uma nova senha"
                    />
                  </div>
                </div>

                <div
                  className={styles.formNote}
                  style={{
                    background: "#f0f8ff",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginTop: "1.5rem",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  <i
                    className="fas fa-info-circle"
                    style={{ color: "#2196f3", marginRight: "0.5rem" }}
                  ></i>
                  <strong>Nota:</strong> As configurações serão salvas
                  localmente neste navegador. Use o novo nome de usuário e senha
                  para fazer login nas próximas vezes.
                </div>
              </div>

              <div className={styles.formButtons}>
                <button
                  className={`${styles.formButton} ${styles.secondary}`}
                  onClick={() => setShowAdminSettings(false)}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.formButton} ${styles.primary}`}
                  onClick={handleSaveAdminSettings}
                >
                  <i className="fas fa-save"></i> Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
