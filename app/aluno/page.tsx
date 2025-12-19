"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import PaymentsList from "../components/PaymentsList";
import { useAuthStore } from "../store/authStore";
import { Student, StudentsData } from "../types";
import styles from "./aluno.module.css";

const studentsData: StudentsData = {
  "fernanda.becker@email.com": {
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
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Carregar dados do aluno baseado no usuário logado
  useEffect(() => {
    if (user && user.email) {
      // Por enquanto usando dados mockados, mas você pode buscar do backend
      if (studentsData[user.email]) {
        setCurrentStudent(studentsData[user.email]);
      } else {
        // Se não encontrar nos dados mockados, criar um objeto básico
        setCurrentStudent({
          name: user.name,
          email: user.email,
          phone: user.phone,
          class: "Sem turma",
          status: "Ativo",
          profileImage: "",
          enrollmentDate: new Date().toLocaleDateString("pt-BR"),
          schedule: [],
          payments: [],
        });
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
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

  if (!currentStudent) return null;

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <Header />
      <div className={styles.alunoPage}>
        <div className={styles.alunoContainer}>
          <div className={styles.alunoHeader}>
            <div className={styles.alunoWelcome}>
              <h1>Olá, {currentStudent.name}! 👋</h1>
              <p>Bem-vindo(a) de volta à sua área exclusiva</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Sair
            </button>
          </div>

          <div className={styles.alunoGrid}>
            <aside className={styles.alunoSidebar}>
              <div className={styles.profileCard}>
                <div className={styles.avatarWrapper}>
                  <div
                    className={styles.profileImageContainer}
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
                        className={styles.profileImage}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.profileIconPlaceholder}>
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
                    className={styles.cameraIconBadge}
                    onClick={() =>
                      document.getElementById("student-photo-upload")?.click()
                    }
                  >
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <h2 className={styles.profileName}>{currentStudent.name}</h2>
                <p className={styles.profileClass}>{currentStudent.class}</p>
                <span className={styles.profileStatus}>
                  <i className="fas fa-check-circle"></i>{" "}
                  {currentStudent.status}
                </span>
                <div className={styles.profileDetails}>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-id-card"></i>
                    <span>E-mail: {currentStudent.email}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-envelope"></i>
                    <span>{currentStudent.email}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-phone"></i>
                    <span>{currentStudent.phone}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-calendar"></i>
                    <span>Matrícula desde {currentStudent.enrollmentDate}</span>
                  </div>
                </div>
              </div>

              <div className={styles.scheduleCard}>
                <h3>
                  <i className="fas fa-clock"></i>
                  Horários das Aulas
                </h3>
                <div className={styles.scheduleList}>
                  {currentStudent.schedule.map((schedule, index) => (
                    <div key={index} className={styles.scheduleItem}>
                      <div className={styles.scheduleDay}>
                        <i className="fas fa-calendar-day"></i>
                        {schedule.day}
                      </div>
                      <div className={styles.scheduleTime}>
                        <i className="fas fa-clock"></i> {schedule.startTime} -{" "}
                        {schedule.endTime}
                      </div>
                      <div className={styles.scheduleRoom}>
                        <i className="fas fa-door-open"></i>
                        {schedule.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.quickStatsSidebar}>
                <h3>Estatísticas</h3>
                <div className={styles.statsVertical}>
                  <div
                    className={`${styles.statItemVertical} ${styles.purple}`}
                  >
                    <i className="fas fa-calendar-week"></i>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>
                        {currentStudent.schedule.length}
                      </div>
                      <div className={styles.statLabel}>Aulas por Semana</div>
                    </div>
                  </div>
                  <div className={`${styles.statItemVertical} ${styles.blue}`}>
                    <i className="fas fa-calendar-alt"></i>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>
                        {calculateMonthsEnrolled()}
                      </div>
                      <div className={styles.statLabel}>Meses de Matrícula</div>
                    </div>
                  </div>
                  <div className={`${styles.statItemVertical} ${styles.green}`}>
                    <i className="fas fa-check-circle"></i>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>
                        {calculatePaymentsMade()}
                      </div>
                      <div className={styles.statLabel}>
                        Pagamentos Realizados
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.statItemVertical} ${styles.orange}`}
                  >
                    <i className="fas fa-chart-line"></i>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>100%</div>
                      <div className={styles.statLabel}>Frequência Média</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className={styles.alunoMain}>
              <section className={styles.paymentSection}>
                <h3>
                  <i className="fas fa-credit-card"></i>
                  Gerenciar Mensalidades
                </h3>

                {/* Componente de Mensalidades Integrado com Backend */}
                {user?.id && <PaymentsList userId={user.id} />}
              </section>

              <section className={styles.attendanceSection}>
                <h3>
                  <i className="fas fa-clipboard-check"></i>
                  Histórico de Presenças
                </h3>

                {currentStudent.attendances &&
                currentStudent.attendances.length > 0 ? (
                  <>
                    {/* Resumo de Presenças */}
                    <div className={styles.attendanceSummaryStudent}>
                      <div
                        className={`${styles.attendanceStatStudent} ${styles.present}`}
                      >
                        <i className="fas fa-check-circle"></i>
                        <div>
                          <div className={styles.statValue}>
                            {
                              currentStudent.attendances.filter(
                                (att) => att.status === "present"
                              ).length
                            }
                          </div>
                          <div className={styles.statLabel}>Presenças</div>
                        </div>
                      </div>
                      <div
                        className={`${styles.attendanceStatStudent} ${styles.absent}`}
                      >
                        <i className="fas fa-times-circle"></i>
                        <div>
                          <div className={styles.statValue}>
                            {
                              currentStudent.attendances.filter(
                                (att) => att.status === "absent"
                              ).length
                            }
                          </div>
                          <div className={styles.statLabel}>Faltas</div>
                        </div>
                      </div>
                      <div
                        className={`${styles.attendanceStatStudent} ${styles.late}`}
                      >
                        <i className="fas fa-clock"></i>
                        <div>
                          <div className={styles.statValue}>
                            {
                              currentStudent.attendances.filter(
                                (att) => att.status === "late"
                              ).length
                            }
                          </div>
                          <div className={styles.statLabel}>Atrasos</div>
                        </div>
                      </div>
                      <div
                        className={`${styles.attendanceStatStudent} ${styles.total}`}
                      >
                        <i className="fas fa-calendar-check"></i>
                        <div>
                          <div className={styles.statValue}>
                            {currentStudent.attendances.length}
                          </div>
                          <div className={styles.statLabel}>Total de Aulas</div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Presenças */}
                    <div className={styles.attendanceListStudent}>
                      <h4>Registro de Presenças</h4>
                      <div className={styles.attendanceItems}>
                        {currentStudent.attendances
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .map((attendance, index) => (
                            <div key={index} className={styles.attendanceItem}>
                              <div className={styles.attendanceDate}>
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
                              <div className={styles.attendanceClass}>
                                <i className="fas fa-chalkboard-teacher"></i>
                                {attendance.className}
                              </div>
                              <div
                                className={`${styles.attendanceStatus} ${
                                  styles[attendance.status]
                                }`}
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
                  <div className={styles.noAttendance}>
                    <i className="fas fa-clipboard-check"></i>
                    <p>Nenhuma presença registrada ainda.</p>
                  </div>
                )}
              </section>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
