"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import { Student, StudentsData } from "../types";

const studentsData: StudentsData = {
  "12345": {
    name: "Fernanda Becker",
    email: "fernanda.becker@email.com",
    phone: "(41) 98765-4321",
    class: "Dança do Ventre",
    status: "Ativo",
    profileImage: "",
    enrollmentDate: "15/03/2023",
    schedule: [
      {
        day: "Segunda-feira",
        startTime: "19:00",
        endTime: "20:30",
        room: "Sala 1 - Principal",
      },
      {
        day: "Quarta-feira",
        startTime: "19:00",
        endTime: "20:30",
        room: "Sala 1 - Principal",
      },
      {
        day: "Sexta-feira",
        startTime: "18:00",
        endTime: "19:30",
        room: "Sala 2 - Espelho",
      },
    ],
    payments: [
      {
        month: "Dezembro 2025",
        status: "pending",
        amount: "R$ 150,00",
        dueDate: "10/12/2025",
      },
      {
        month: "Novembro 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/11/2025",
        paidDate: "08/11/2025",
      },
      {
        month: "Outubro 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/10/2025",
        paidDate: "05/10/2025",
      },
      {
        month: "Setembro 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/09/2025",
        paidDate: "08/09/2025",
      },
      {
        month: "Agosto 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/08/2025",
        paidDate: "05/08/2025",
      },
    ],
    attendances: [
      {
        id: "att-001",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-12-02",
        status: "present",
      },
      {
        id: "att-002",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-11-29",
        status: "present",
      },
      {
        id: "att-003",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-11-27",
        status: "late",
      },
      {
        id: "att-004",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-11-25",
        status: "present",
      },
      {
        id: "att-005",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-11-22",
        status: "present",
      },
      {
        id: "att-006",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-11-20",
        status: "absent",
      },
      {
        id: "att-007",
        studentId: "12345",
        studentName: "Fernanda Becker",
        classId: "danca-ventre",
        className: "Dança do Ventre",
        date: "2025-11-18",
        status: "present",
      },
    ],
  },
};

export default function AlunoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const router = useRouter();

  // Verificar se já está autenticado via sessionStorage
  useEffect(() => {
    const isAuth = sessionStorage.getItem("alunoAuth");
    const savedStudentId = sessionStorage.getItem("studentId");

    if (isAuth === "true" && savedStudentId && studentsData[savedStudentId]) {
      setCurrentStudent(studentsData[savedStudentId]);
      setCurrentStudentId(savedStudentId);
      setStudentId(savedStudentId);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (studentsData[studentId] && password === "123456") {
      sessionStorage.setItem("alunoAuth", "true");
      sessionStorage.setItem("studentId", studentId);
      setCurrentStudent(studentsData[studentId]);
      setCurrentStudentId(studentId);
      setIsLoggedIn(true);
    } else {
      alert(
        "Matrícula ou senha incorretos. \n\nPara demonstração, use:\nMatrícula: 12345\nSenha: 123456"
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("alunoAuth");
    sessionStorage.removeItem("studentId");
    setIsLoggedIn(false);
    setStudentId("");
    setPassword("");
    setCurrentStudent(null);
    setCurrentStudentId("");
    router.push("/login");
  };

  const handleGenerateBoleto = () => {
    alert(
      "Gerando boleto bancário...\n\nEm um sistema real, o boleto seria gerado e enviado por email."
    );
  };

  const handlePayPix = () => {
    alert(
      "Redirecionando para pagamento via PIX...\n\nEm breve você receberá o QR Code para pagamento."
    );
  };

  const handleViewHistory = () => {
    const historySection = document.getElementById("payment-history");
    if (historySection) {
      historySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const calculateMonthsEnrolled = () => {
    if (!currentStudent) return 0;
    const enrollDate = new Date(
      currentStudent.enrollmentDate.split("/").reverse().join("-")
    );
    const today = new Date();
    const months =
      (today.getFullYear() - enrollDate.getFullYear()) * 12 +
      (today.getMonth() - enrollDate.getMonth());
    return months;
  };

  const calculatePaymentsMade = () => {
    if (!currentStudent) return 0;
    return currentStudent.payments.filter((p) => p.status === "paid").length;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }

      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCurrentStudent((prev) =>
          prev ? { ...prev, profileImage: imageUrl } : null
        );
        setIsUploadingPhoto(false);
        alert("Foto atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <div className="aluno-login-page">
          <div className="aluno-login-container">
            <div className="aluno-login-header">
              <h1>Área do Aluno</h1>
              <p>Acesse sua conta para gerenciar suas aulas e pagamentos</p>
            </div>
            <form onSubmit={handleLogin} className="aluno-login-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Número de matrícula"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
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
              <Link href="/">Voltar ao site principal</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentStudent) return null;

  return (
    <>
      <Header />
      <div className="aluno-page">
        <div className="aluno-container">
          <div className="aluno-header">
            <div className="aluno-welcome">
              <h1>Olá, {currentStudent.name}! 👋</h1>
              <p>Bem-vindo(a) de volta à sua área exclusiva</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Sair
            </button>
          </div>

          <div className="aluno-grid">
            <aside className="aluno-sidebar">
              <div className="profile-card">
                <div className="avatar-wrapper">
                  <div
                    className="profile-image-container"
                    onClick={() =>
                      document.getElementById("student-photo-upload")?.click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {currentStudent.profileImage ? (
                      <Image
                        src={currentStudent.profileImage}
                        alt={currentStudent.name}
                        fill
                        className="profile-image"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="profile-icon-placeholder">
                        <i className="fas fa-user-circle"></i>
                      </div>
                    )}
                    <input
                      id="student-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div
                    className="camera-icon-badge"
                    onClick={() =>
                      document.getElementById("student-photo-upload")?.click()
                    }
                  >
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <h2 className="profile-name">{currentStudent.name}</h2>
                <p className="profile-class">{currentStudent.class}</p>
                <span className="profile-status">
                  <i className="fas fa-check-circle"></i>{" "}
                  {currentStudent.status}
                </span>
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <i className="fas fa-id-card"></i>
                    <span>Matrícula: {currentStudentId}</span>
                  </div>
                  <div className="profile-detail-item">
                    <i className="fas fa-envelope"></i>
                    <span>{currentStudent.email}</span>
                  </div>
                  <div className="profile-detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{currentStudent.phone}</span>
                  </div>
                  <div className="profile-detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Matrícula desde {currentStudent.enrollmentDate}</span>
                  </div>
                </div>
              </div>

              <div className="schedule-card">
                <h3>
                  <i className="fas fa-clock"></i>
                  Horários das Aulas
                </h3>
                <div className="schedule-list">
                  {currentStudent.schedule.map((schedule, index) => (
                    <div key={index} className="schedule-item">
                      <div className="schedule-day">
                        <i className="fas fa-calendar-day"></i>
                        {schedule.day}
                      </div>
                      <div className="schedule-time">
                        <i className="fas fa-clock"></i> {schedule.startTime} -{" "}
                        {schedule.endTime}
                      </div>
                      <div className="schedule-room">
                        <i className="fas fa-door-open"></i>
                        {schedule.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-stats-sidebar">
                <h3>Estatísticas</h3>
                <div className="stats-vertical">
                  <div className="stat-item-vertical purple">
                    <i className="fas fa-calendar-week"></i>
                    <div className="stat-content">
                      <div className="stat-value">
                        {currentStudent.schedule.length}
                      </div>
                      <div className="stat-label">Aulas por Semana</div>
                    </div>
                  </div>
                  <div className="stat-item-vertical blue">
                    <i className="fas fa-calendar-alt"></i>
                    <div className="stat-content">
                      <div className="stat-value">
                        {calculateMonthsEnrolled()}
                      </div>
                      <div className="stat-label">Meses de Matrícula</div>
                    </div>
                  </div>
                  <div className="stat-item-vertical green">
                    <i className="fas fa-check-circle"></i>
                    <div className="stat-content">
                      <div className="stat-value">
                        {calculatePaymentsMade()}
                      </div>
                      <div className="stat-label">Pagamentos Realizados</div>
                    </div>
                  </div>
                  <div className="stat-item-vertical orange">
                    <i className="fas fa-chart-line"></i>
                    <div className="stat-content">
                      <div className="stat-value">100%</div>
                      <div className="stat-label">Frequência Média</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="aluno-main">
              <section className="payment-section">
                <h3>
                  <i className="fas fa-credit-card"></i>
                  Gerenciar Mensalidades
                </h3>

                <div className="current-payment">
                  <div className="current-payment-header">
                    <div className="current-payment-month">
                      {currentStudent.payments[0].month}
                    </div>
                    <span
                      className={`payment-status-badge ${currentStudent.payments[0].status}`}
                    >
                      {currentStudent.payments[0].status === "paid"
                        ? "✓ Pago"
                        : "⚠ Pendente"}
                    </span>
                  </div>

                  <div className="current-payment-info">
                    <div className="payment-info-item">
                      <h4>Valor</h4>
                      <p>{currentStudent.payments[0].amount}</p>
                    </div>
                    <div className="payment-info-item">
                      <h4>Vencimento</h4>
                      <p>{currentStudent.payments[0].dueDate}</p>
                    </div>
                    {currentStudent.payments[0].paidDate && (
                      <div className="payment-info-item">
                        <h4>Data do Pagamento</h4>
                        <p>{currentStudent.payments[0].paidDate}</p>
                      </div>
                    )}
                  </div>

                  {currentStudent.payments[0].status === "pending" && (
                    <div className="payment-buttons">
                      <button
                        className="payment-button primary"
                        onClick={handlePayPix}
                      >
                        <i className="fas fa-qrcode"></i>
                        Pagar com PIX
                      </button>
                      <button
                        className="payment-button secondary"
                        onClick={handleGenerateBoleto}
                      >
                        <i className="fas fa-barcode"></i>
                        Gerar Boleto
                      </button>
                      <button
                        className="payment-button secondary"
                        onClick={handleViewHistory}
                      >
                        <i className="fas fa-history"></i>
                        Ver Histórico
                      </button>
                    </div>
                  )}
                </div>

                <div className="payment-history-section" id="payment-history">
                  <h4>Histórico de Pagamentos</h4>
                  <div className="payment-history-grid">
                    {currentStudent.payments.slice(1).map((payment, index) => (
                      <div key={index} className="payment-history-item">
                        <div className="payment-history-month">
                          {payment.month}
                        </div>
                        <div className="payment-history-amount">
                          {payment.amount}
                        </div>
                        <div className="payment-history-date">
                          {payment.status === "paid"
                            ? `✓ Pago em ${payment.paidDate}`
                            : `⚠ Vencimento: ${payment.dueDate}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="attendance-section">
                <h3>
                  <i className="fas fa-clipboard-check"></i>
                  Histórico de Presenças
                </h3>

                {currentStudent.attendances &&
                currentStudent.attendances.length > 0 ? (
                  <>
                    {/* Resumo de Presenças */}
                    <div className="attendance-summary-student">
                      <div className="attendance-stat-student present">
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <div className="stat-value">
                            {
                              currentStudent.attendances.filter(
                                (att) => att.status === "present"
                              ).length
                            }
                          </div>
                          <div className="stat-label">Presenças</div>
                        </div>
                      </div>
                      <div className="attendance-stat-student absent">
                        <i className="fas fa-times-circle"></i>
                        <div>
                          <div className="stat-value">
                            {
                              currentStudent.attendances.filter(
                                (att) => att.status === "absent"
                              ).length
                            }
                          </div>
                          <div className="stat-label">Faltas</div>
                        </div>
                      </div>
                      <div className="attendance-stat-student late">
                        <i className="fas fa-clock"></i>
                        <div>
                          <div className="stat-value">
                            {
                              currentStudent.attendances.filter(
                                (att) => att.status === "late"
                              ).length
                            }
                          </div>
                          <div className="stat-label">Atrasos</div>
                        </div>
                      </div>
                      <div className="attendance-stat-student total">
                        <i className="fas fa-calendar-check"></i>
                        <div>
                          <div className="stat-value">
                            {currentStudent.attendances.length}
                          </div>
                          <div className="stat-label">Total de Aulas</div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Presenças */}
                    <div className="attendance-list-student">
                      <h4>Registro de Presenças</h4>
                      <div className="attendance-items">
                        {currentStudent.attendances
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .map((attendance, index) => (
                            <div key={index} className="attendance-item">
                              <div className="attendance-date">
                                <i className="fas fa-calendar"></i>
                                {new Date(attendance.date).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div className="attendance-class">
                                <i className="fas fa-chalkboard-teacher"></i>
                                {attendance.className}
                              </div>
                              <div
                                className={`attendance-status ${attendance.status}`}
                              >
                                {attendance.status === "present" && (
                                  <>
                                    <i className="fas fa-check-circle"></i>
                                    Presente
                                  </>
                                )}
                                {attendance.status === "absent" && (
                                  <>
                                    <i className="fas fa-times-circle"></i>
                                    Ausente
                                  </>
                                )}
                                {attendance.status === "late" && (
                                  <>
                                    <i className="fas fa-clock"></i>
                                    Atrasado
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-attendance">
                    <i className="fas fa-clipboard-check"></i>
                    <p>Nenhuma presença registrada ainda.</p>
                  </div>
                )}
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
