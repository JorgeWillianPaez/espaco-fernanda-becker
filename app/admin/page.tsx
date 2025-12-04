"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
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
    "overview" | "classes" | "students" | "payments" | "attendance"
  >("overview");
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [students, setStudents] = useState<AdminStudent[]>(initialStudents);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [showModal, setShowModal] = useState<
    "class" | "student" | "payment" | "attendance" | null
  >(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(
    null
  );
  const router = useRouter();

  // Verificar se já está autenticado via sessionStorage
  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuth");
    if (isAuth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Estados para formulários
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    level: "",
    maxStudents: 15,
    currentStudents: 0,
    schedule: [],
    teacher: teacherData.name,
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

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <div className="aluno-login-page">
          <div className="aluno-login-container">
            <div className="aluno-login-header">
              <h1>Área do Professor</h1>
              <p>Acesse o painel administrativo</p>
            </div>
            <form onSubmit={handleLogin} className="aluno-login-form">
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
              <button type="submit" className="aluno-login-button">
                Entrar
              </button>
            </form>
            <div className="aluno-login-back">
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
      <div className="admin-page">
        <div className="aluno-container">
          <div className="aluno-header">
            <div className="aluno-welcome">
              <h1>Painel Administrativo 🎭</h1>
              <p>Bem-vindo(a), {teacherData.name}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Sair
            </button>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-chart-line"></i>
              Visão Geral
            </button>
            <button
              className={`admin-tab ${activeTab === "classes" ? "active" : ""}`}
              onClick={() => setActiveTab("classes")}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              Turmas
            </button>
            <button
              className={`admin-tab ${
                activeTab === "students" ? "active" : ""
              }`}
              onClick={() => setActiveTab("students")}
            >
              <i className="fas fa-user-graduate"></i>
              Alunos
            </button>
            <button
              className={`admin-tab ${
                activeTab === "payments" ? "active" : ""
              }`}
              onClick={() => setActiveTab("payments")}
            >
              <i className="fas fa-money-bill-wave"></i>
              Financeiro
            </button>
            <button
              className={`admin-tab ${
                activeTab === "attendance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("attendance")}
            >
              <i className="fas fa-clipboard-check"></i>
              Presenças
            </button>
          </div>

          {/* Perfil do Professor e Cards - Layout lado a lado */}
          {activeTab === "overview" && (
            <div className="overview-layout">
              <div className="teacher-profile-section">
                <div className="profile-image-container">
                  {teacherData.profileImage ? (
                    <Image
                      src={teacherData.profileImage}
                      alt={teacherData.name}
                      fill
                      className="profile-image"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="profile-icon-placeholder">
                      <i className="fas fa-user-circle"></i>
                    </div>
                  )}
                </div>
                <h2 className="profile-name">{teacherData.name}</h2>
                <p className="profile-class">{teacherData.specialty}</p>
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <i className="fas fa-envelope"></i>
                    <span>{teacherData.email}</span>
                  </div>
                  <div className="profile-detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{teacherData.phone}</span>
                  </div>
                  <div className="profile-detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Desde {teacherData.startDate}</span>
                  </div>
                </div>
              </div>

              {/* Cards de Informação */}
              <div className="quick-info">
                <div className="info-card">
                  <i className="fas fa-chalkboard-teacher"></i>
                  <div>
                    <div className="info-value">{classes.length}</div>
                    <div className="info-label">Turmas Ativas</div>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fas fa-user-graduate"></i>
                  <div>
                    <div className="info-value">{students.length}</div>
                    <div className="info-label">Alunos Matriculados</div>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fas fa-clock"></i>
                  <div>
                    <div className="info-value">
                      {classes.reduce((acc, c) => acc + c.schedule.length, 0)}
                    </div>
                    <div className="info-label">Aulas por Semana</div>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fas fa-users"></i>
                  <div>
                    <div className="info-value">
                      {Math.round(
                        classes.reduce((acc, c) => acc + c.currentStudents, 0) /
                          classes.length
                      )}
                    </div>
                    <div className="info-label">Média por Turma</div>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <div className="info-value">
                      {
                        students.filter((s) => s.payments[0]?.status === "paid")
                          .length
                      }
                    </div>
                    <div className="info-label">Pagamentos em Dia</div>
                  </div>
                </div>
                <div className="info-card">
                  <i className="fas fa-door-open"></i>
                  <div>
                    <div className="info-value">
                      {classes.reduce(
                        (acc, c) => acc + (c.maxStudents - c.currentStudents),
                        0
                      )}
                    </div>
                    <div className="info-label">Vagas Disponíveis</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendário Semanal */}
          {activeTab === "overview" && (
            <div className="weekly-schedule-section">
              <h3 className="schedule-title">
                <i className="fas fa-calendar-week"></i>
                Agenda Semanal
              </h3>
              <div className="weekly-calendar">
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
                    <div key={day} className="calendar-day">
                      <div className="calendar-day-header">
                        <div className="day-name">{day.split("-")[0]}</div>
                        {dayClasses.length > 0 && (
                          <div className="day-count">
                            {dayClasses.length}{" "}
                            {dayClasses.length === 1 ? "aula" : "aulas"}
                          </div>
                        )}
                      </div>
                      <div className="calendar-day-content">
                        {dayClasses.length === 0 ? (
                          <div className="no-classes">Sem aulas</div>
                        ) : (
                          dayClasses.map((classItem, idx) => (
                            <div key={idx} className="calendar-class">
                              <div className="class-time">
                                <i className="fas fa-clock"></i>
                                {classItem.startTime} - {classItem.endTime}
                              </div>
                              <div className="class-details">
                                <div className="class-name-cal">
                                  {classItem.className}
                                </div>
                                <div className="class-room">
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
          <div className="admin-content">
            {activeTab === "overview" && (
              <div>
                <h2 style={{ color: "#e91e63", marginBottom: "1.5rem" }}>
                  Resumo das Atividades
                </h2>
                <div className="classes-grid">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="class-card">
                      <div className="class-card-header">
                        <div>
                          <div className="class-name">{classItem.name}</div>
                          <div className="class-level">{classItem.level}</div>
                        </div>
                        <div className="class-students-badge">
                          {classItem.currentStudents}/{classItem.maxStudents}
                        </div>
                      </div>
                      <div className="class-info">
                        <div className="class-info-item">
                          <i className="fas fa-door-open"></i>
                          {classItem.room}
                        </div>
                        <div className="class-info-item">
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
                <div className="admin-section-header">
                  <h2>Gerenciar Turmas</h2>
                  <button
                    className="add-button"
                    onClick={() => setShowModal("class")}
                  >
                    <i className="fas fa-plus"></i>
                    Nova Turma
                  </button>
                </div>

                <div className="classes-grid">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="class-card">
                      <div className="class-card-header">
                        <div>
                          <div className="class-name">{classItem.name}</div>
                          <div className="class-level">{classItem.level}</div>
                        </div>
                        <div className="class-students-badge">
                          {classItem.currentStudents}/{classItem.maxStudents}
                        </div>
                      </div>
                      <div className="class-info">
                        <div className="class-info-item">
                          <i className="fas fa-door-open"></i>
                          {classItem.room}
                        </div>
                        {classItem.schedule.map((sch, idx) => (
                          <div key={idx} className="class-info-item">
                            <i className="fas fa-calendar"></i>
                            {sch.day} - {sch.startTime} às {sch.endTime}
                          </div>
                        ))}
                      </div>
                      <div className="class-actions">
                        <button className="class-action-btn">
                          <i className="fas fa-edit"></i> Editar
                        </button>
                        <button
                          className="class-action-btn"
                          onClick={() => handleDeleteClass(classItem.id)}
                        >
                          <i className="fas fa-trash"></i> Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <div className="admin-section-header">
                  <h2>Gerenciar Alunos</h2>
                  <button
                    className="add-button"
                    onClick={() => setShowModal("student")}
                  >
                    <i className="fas fa-user-plus"></i>
                    Novo Aluno
                  </button>
                </div>

                <div className="students-table-container">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Matrícula</th>
                        <th>Turma</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>
                            {student.profileImage ? (
                              <Image
                                src={student.profileImage}
                                alt={student.name}
                                width={40}
                                height={40}
                                className="student-avatar"
                              />
                            ) : (
                              <div className="avatar-icon-placeholder">
                                <i className="fas fa-user-circle"></i>
                              </div>
                            )}
                          </td>
                          <td>{student.name}</td>
                          <td>{student.id}</td>
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
                            <button className="table-action-btn">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="table-action-btn"
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
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <div className="admin-section-header">
                  <h2>Gestão Financeira</h2>
                </div>

                {/* Resumo Financeiro */}
                <div className="financial-summary">
                  <div className="financial-card paid">
                    <i className="fas fa-check-circle"></i>
                    <div>
                      <div className="financial-value">
                        {students.reduce(
                          (acc, s) =>
                            acc +
                            s.payments.filter((p) => p.status === "paid")
                              .length,
                          0
                        )}
                      </div>
                      <div className="financial-label">Pagamentos em Dia</div>
                    </div>
                  </div>
                  <div className="financial-card pending">
                    <i className="fas fa-exclamation-circle"></i>
                    <div>
                      <div className="financial-value">
                        {students.reduce(
                          (acc, s) =>
                            acc +
                            s.payments.filter((p) => p.status === "pending")
                              .length,
                          0
                        )}
                      </div>
                      <div className="financial-label">
                        Pagamentos Pendentes
                      </div>
                    </div>
                  </div>
                  <div className="financial-card total">
                    <i className="fas fa-dollar-sign"></i>
                    <div>
                      <div className="financial-value">
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
                      <div className="financial-label">Receita Total</div>
                    </div>
                  </div>
                </div>

                {/* Lista de Alunos e Status de Pagamento */}
                <div className="payments-section">
                  <h3>Status de Pagamentos por Aluno</h3>
                  <div className="payments-table-container">
                    <table className="students-table">
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
                        {students.map((student) => {
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
                                      className="student-avatar"
                                    />
                                  ) : (
                                    <div
                                      className="avatar-icon-placeholder"
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
                                  <span className="payment-status-badge pending">
                                    {pendingCount}{" "}
                                    {pendingCount === 1 ? "mês" : "meses"}{" "}
                                    pendente{pendingCount > 1 ? "s" : ""}
                                  </span>
                                ) : (
                                  <span className="payment-status-badge paid">
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
                                  className="table-action-btn"
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
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div>
                <div className="admin-section-header">
                  <h2>Controle de Presença</h2>
                </div>

                {/* Seleção de Turma e Data */}
                <div className="attendance-controls">
                  <div className="form-group">
                    <label className="form-label">Selecione a Turma</label>
                    <select
                      className="form-select"
                      value={selectedClass?.id || ""}
                      onChange={(e) => {
                        const classItem = classes.find(
                          (c) => c.id === e.target.value
                        );
                        setSelectedClass(classItem || null);
                      }}
                    >
                      <option value="">Escolha uma turma</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name} - {classItem.level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Data da Aula</label>
                    <input
                      type="date"
                      className="form-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                {selectedClass && (
                  <>
                    {/* Resumo de Presença */}
                    <div className="attendance-summary">
                      <div className="attendance-stat present">
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <div className="stat-value">
                            {getAttendanceStats().present}
                          </div>
                          <div className="stat-label">Presentes</div>
                        </div>
                      </div>
                      <div className="attendance-stat absent">
                        <i className="fas fa-times-circle"></i>
                        <div>
                          <div className="stat-value">
                            {getAttendanceStats().absent}
                          </div>
                          <div className="stat-label">Ausentes</div>
                        </div>
                      </div>
                      <div className="attendance-stat late">
                        <i className="fas fa-clock"></i>
                        <div>
                          <div className="stat-value">
                            {getAttendanceStats().late}
                          </div>
                          <div className="stat-label">Atrasados</div>
                        </div>
                      </div>
                      <div className="attendance-stat total">
                        <i className="fas fa-users"></i>
                        <div>
                          <div className="stat-value">
                            {getAttendanceStats().total}
                          </div>
                          <div className="stat-label">Total de Alunos</div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Alunos para Marcar Presença */}
                    <div className="attendance-list">
                      <h3>Marcar Presença - {selectedClass.name}</h3>
                      <div className="students-table-container">
                        <table className="students-table">
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
                              .filter((s) => s.classId === selectedClass.id)
                              .map((student) => {
                                const attendance = getStudentAttendanceForDate(
                                  student.id,
                                  selectedDate
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
                                          className="student-avatar"
                                        />
                                      ) : (
                                        <div className="avatar-icon-placeholder">
                                          <i className="fas fa-user-circle"></i>
                                        </div>
                                      )}
                                    </td>
                                    <td>{student.name}</td>
                                    <td>
                                      {attendance ? (
                                        <span
                                          className={`attendance-badge ${attendance.status}`}
                                        >
                                          {attendance.status === "present" &&
                                            "Presente"}
                                          {attendance.status === "absent" &&
                                            "Ausente"}
                                          {attendance.status === "late" &&
                                            "Atrasado"}
                                        </span>
                                      ) : (
                                        <span className="attendance-badge pending">
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
                                          className="attendance-btn present"
                                          onClick={() =>
                                            handleMarkAttendance(
                                              student.id,
                                              "present"
                                            )
                                          }
                                          disabled={!!attendance}
                                        >
                                          <i className="fas fa-check"></i>
                                        </button>
                                        <button
                                          className="attendance-btn late"
                                          onClick={() =>
                                            handleMarkAttendance(
                                              student.id,
                                              "late"
                                            )
                                          }
                                          disabled={!!attendance}
                                        >
                                          <i className="fas fa-clock"></i>
                                        </button>
                                        <button
                                          className="attendance-btn absent"
                                          onClick={() =>
                                            handleMarkAttendance(
                                              student.id,
                                              "absent"
                                            )
                                          }
                                          disabled={!!attendance}
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
                      </div>
                    </div>

                    {/* Histórico de Presença */}
                    <div className="attendance-history">
                      <h3>Histórico de Presenças - {selectedClass.name}</h3>
                      <div className="students-table-container">
                        <table className="students-table">
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Aluno</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendances
                              .filter((att) => att.classId === selectedClass.id)
                              .sort(
                                (a, b) =>
                                  new Date(b.date).getTime() -
                                  new Date(a.date).getTime()
                              )
                              .map((att) => (
                                <tr key={att.id}>
                                  <td>
                                    {new Date(att.date).toLocaleDateString(
                                      "pt-BR"
                                    )}
                                  </td>
                                  <td>{att.studentName}</td>
                                  <td>
                                    <span
                                      className={`attendance-badge ${att.status}`}
                                    >
                                      {att.status === "present" && "Presente"}
                                      {att.status === "absent" && "Ausente"}
                                      {att.status === "late" && "Atrasado"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        {attendances.filter(
                          (att) => att.classId === selectedClass.id
                        ).length === 0 && (
                          <p
                            style={{
                              textAlign: "center",
                              padding: "2rem",
                              color: "#666",
                            }}
                          >
                            Nenhuma presença registrada para esta turma ainda.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {!selectedClass && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "#666",
                    }}
                  >
                    <i
                      className="fas fa-clipboard-check"
                      style={{
                        fontSize: "3rem",
                        marginBottom: "1rem",
                        opacity: 0.3,
                      }}
                    ></i>
                    <p>Selecione uma turma para marcar as presenças</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Histórico de Pagamentos */}
        {showModal === "payment" && selectedStudent && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowModal(null);
              setSelectedStudent(null);
            }}
          >
            <div
              className="modal-container large"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Histórico de Pagamentos - {selectedStudent.name}</h3>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowModal(null);
                    setSelectedStudent(null);
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="student-payment-info">
                <div className="payment-info-item">
                  <strong>Matrícula:</strong> {selectedStudent.id}
                </div>
                <div className="payment-info-item">
                  <strong>Turma:</strong> {selectedStudent.class}
                </div>
                <div className="payment-info-item">
                  <strong>Data de Matrícula:</strong>{" "}
                  {selectedStudent.enrollmentDate}
                </div>
              </div>

              <div className="payment-history">
                <h4>Histórico de Mensalidades</h4>
                <table className="payment-history-table">
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

              <div className="form-buttons">
                <button
                  className="form-button secondary"
                  onClick={() => {
                    setShowModal(null);
                    setSelectedStudent(null);
                  }}
                >
                  Fechar
                </button>
                <button className="form-button primary">
                  <i className="fas fa-check"></i> Registrar Pagamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nova Turma */}
        {showModal === "class" && (
          <div className="modal-overlay" onClick={() => setShowModal(null)}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Nova Turma</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Nome da Turma *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass({ ...newClass, name: e.target.value })
                    }
                    placeholder="Ex: Ballet Avançado"
                  />
                </div>
                <div>
                  <label className="form-label">Nível *</label>
                  <select
                    className="form-select"
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

              <div className="form-grid">
                <div>
                  <label className="form-label">Máximo de Alunos</label>
                  <input
                    type="number"
                    className="form-input"
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
                  <label className="form-label">Sala *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newClass.room}
                    onChange={(e) =>
                      setNewClass({ ...newClass, room: e.target.value })
                    }
                    placeholder="Ex: Sala 1 - Principal"
                  />
                </div>
              </div>

              <div className="form-grid full">
                <div>
                  <label className="form-label">Horários das Aulas</label>
                  <div className="schedule-inputs">
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
                    className="add-schedule-btn"
                    onClick={handleAddSchedule}
                  >
                    + Adicionar Horário
                  </button>

                  {newClass.schedule && newClass.schedule.length > 0 && (
                    <div>
                      {newClass.schedule.map((sch, idx) => (
                        <div key={idx} className="schedule-list-item">
                          <span>
                            {sch.day} - {sch.startTime} às {sch.endTime} (
                            {sch.room})
                          </span>
                          <button
                            className="remove-schedule-btn"
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

              <div className="form-buttons">
                <button
                  className="form-button secondary"
                  onClick={() => setShowModal(null)}
                >
                  Cancelar
                </button>
                <button
                  className="form-button primary"
                  onClick={handleCreateClass}
                >
                  Criar Turma
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Novo Aluno */}
        {showModal === "student" && (
          <div className="modal-overlay" onClick={() => setShowModal(null)}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Novo Aluno</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(null)}
                >
                  &times;
                </button>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Nome Completo *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    placeholder="Nome do aluno"
                  />
                </div>
                <div>
                  <label className="form-label">E-mail *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Telefone *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    placeholder="(41) 98765-4321"
                  />
                </div>
                <div>
                  <label className="form-label">Data de Nascimento *</label>
                  <input
                    type="date"
                    className="form-input"
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

              <div className="form-grid">
                <div>
                  <label className="form-label">CPF *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudent.cpf}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <label className="form-label">RG *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudent.rg}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, rg: e.target.value })
                    }
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className="form-grid full">
                <div>
                  <label className="form-label">CEP *</label>
                  <input
                    type="text"
                    className="form-input"
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

              <div className="form-grid full">
                <div>
                  <label className="form-label">Rua/Avenida *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({ ...addressData, street: e.target.value })
                    }
                    placeholder="Nome da Rua"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Número *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressData.number}
                    onChange={(e) =>
                      setAddressData({ ...addressData, number: e.target.value })
                    }
                    placeholder="123"
                  />
                </div>
                <div>
                  <label className="form-label">Complemento</label>
                  <input
                    type="text"
                    className="form-input"
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

              <div className="form-grid full">
                <div>
                  <label className="form-label">Bairro *</label>
                  <input
                    type="text"
                    className="form-input"
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

              <div className="form-grid">
                <div>
                  <label className="form-label">Cidade *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData({ ...addressData, city: e.target.value })
                    }
                    placeholder="Nome da Cidade"
                  />
                </div>
                <div>
                  <label className="form-label">Estado *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({ ...addressData, state: e.target.value })
                    }
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Turma *</label>
                  <select
                    className="form-select"
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

              <div className="form-grid full">
                <div>
                  <label className="form-label">
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
                      className="form-input"
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

              <div className="form-grid full">
                <div>
                  <label className="form-label">Toma algum medicamento?</label>
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
                      className="form-input"
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

              <div className="form-buttons">
                <button
                  className="form-button secondary"
                  onClick={() => setShowModal(null)}
                >
                  Cancelar
                </button>
                <button
                  className="form-button primary"
                  onClick={handleCreateStudent}
                >
                  Cadastrar Aluno
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
