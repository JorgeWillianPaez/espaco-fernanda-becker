"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import PaymentsList from "../components/PaymentsList";
import SkipLink from "../components/SkipLink";
import { useAuthStore } from "../store/authStore";
import { Student, StudentsData, ClassSchedule } from "../types";
import { maskPhone } from "../utils/masks";
import apiService from "@/lib/api";
import styles from "./aluno.module.css";

export default function AlunoPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [studentClasses, setStudentClasses] = useState<ClassSchedule[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [studentAttendances, setStudentAttendances] = useState<
    Array<{
      id: string;
      studentId: string;
      studentName: string;
      classId: string;
      className: string;
      date: string;
      status: "present" | "absent" | "late";
    }>
  >([]);
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(false);

  // Estado para informações do grupo
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [isLoadingGroupDetails, setIsLoadingGroupDetails] = useState(false);

  // Modal de alteração de senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Mapa para traduzir dias da semana
  const DAY_OF_WEEK_MAP: Record<string, string> = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const translateDayOfWeek = (day: string): string => {
    return DAY_OF_WEEK_MAP[day.toLowerCase()] || day;
  };

  // Carregar turmas do aluno
  const fetchStudentClasses = async () => {
    if (!user?.id || !token) return;

    try {
      setIsLoadingClasses(true);
      const response = (await apiService.getClassesByStudent(
        user.id,
        token
      )) as { data?: any[] };

      if (response.data && Array.isArray(response.data)) {
        // Função para formatar horário (remover segundos)
        const formatTime = (time: string) => {
          if (!time) return "";
          // Se vier no formato HH:mm:ss, pegar só HH:mm
          return time.substring(0, 5);
        };

        // Converter dados da API para formato de schedule
        const schedules: ClassSchedule[] = response.data.map(
          (classItem: any) => ({
            day: translateDayOfWeek(classItem.dayOfWeek),
            startTime: formatTime(classItem.startTime),
            endTime: formatTime(classItem.endTime),
            room: classItem.room?.name || "Sala não definida",
            className: classItem.name,
          })
        );
        setStudentClasses(schedules);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  // Carregar presenças do aluno
  const fetchStudentAttendances = async () => {
    if (!user?.id || !token) return;

    try {
      setIsLoadingAttendances(true);
      const response = (await apiService.getAttendancesByStudent(
        user.id,
        token
      )) as {
        data?: Array<{
          id: number;
          studentId: number;
          classId: number;
          date: string;
          status: "present" | "absent" | "late";
          class?: { name: string };
        }>;
      };

      if (response.data && Array.isArray(response.data)) {
        const formattedAttendances = response.data.map((att) => ({
          id: String(att.id),
          studentId: String(att.studentId),
          studentName: user.name,
          classId: String(att.classId),
          className: att.class?.name || "Turma",
          date: att.date,
          status: att.status,
        }));
        setStudentAttendances(formattedAttendances);
      }
    } catch (error) {
      console.error("Erro ao carregar presenças:", error);
    } finally {
      setIsLoadingAttendances(false);
    }
  };

  // Carregar detalhes do grupo com membros e turmas
  const fetchGroupDetails = async () => {
    if (!user?.groupId || !token) return;

    try {
      setIsLoadingGroupDetails(true);
      const response = (await apiService.getGroupDetails(
        user.groupId,
        token
      )) as { data?: any };

      if (response.data) {
        setGroupDetails(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do grupo:", error);
    } finally {
      setIsLoadingGroupDetails(false);
    }
  };

  // Carregar dados do aluno baseado no usuário logado
  useEffect(() => {
    if (user && user.email) {
      setCurrentStudent({
        name: user.name,
        email: user.email,
        phone: user.phone,
        class: "Sem turma",
        status: "Ativo",
        profileImage: "",
        enrollmentDate: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("pt-BR")
          : new Date().toLocaleDateString("pt-BR"),
        schedule: [],
        payments: [],
      });

      // Carregar turmas do backend
      fetchStudentClasses();

      // Carregar presenças do backend
      fetchStudentAttendances();

      // Carregar detalhes do grupo
      fetchGroupDetails();
    }
  }, [user, token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!token) {
      setPasswordError("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setIsChangingPassword(true);
      await apiService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        token
      );

      setPasswordSuccess("Senha alterada com sucesso!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.message || "Erro ao alterar senha");
    } finally {
      setIsChangingPassword(false);
    }
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !token) return;

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 10MB");
      return;
    }

    // Validar tipo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)");
      return;
    }

    try {
      setIsUploadingPhoto(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      const data = await response.json();
      const imageUrl = data.data.profileImage;

      // Atualizar user no auth store
      useAuthStore.getState().setUser({
        ...user,
        profileImage: imageUrl,
      });

      // Atualizar student local
      setCurrentStudent((prev) =>
        prev ? { ...prev, profileImage: imageUrl } : null
      );

      alert("Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      alert("Erro ao atualizar foto de perfil");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (!currentStudent) return null;

  return (
    <ProtectedRoute allowedRoles={[3, 4]}>
      <SkipLink />
      <Header />
      <div className={styles.alunoPage}>
        <div className={styles.alunoContainer}>
          <div className={styles.alunoHeader}>
            <div className={styles.alunoWelcome}>
              <h1>Olá, {currentStudent.name}! 👋</h1>
              <p>Bem-vindo(a) de volta à sua área exclusiva</p>
            </div>
            <button
              className="logout-button"
              onClick={handleLogout}
              aria-label="Sair do sistema"
            >
              <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
              Sair
            </button>
          </div>

          <div className={styles.alunoGrid} id="main-content">
            <aside
              className={styles.alunoSidebar}
              role="complementary"
              aria-label="Informações do perfil"
            >
              <div className={styles.profileCard}>
                <div className={styles.avatarWrapper}>
                  <div
                    className={styles.profileImageContainer}
                    onClick={() =>
                      document.getElementById("student-photo-upload")?.click()
                    }
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                    aria-label="Alterar foto de perfil"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        document
                          .getElementById("student-photo-upload")
                          ?.click();
                      }
                    }}
                  >
                    {currentStudent.profileImage ? (
                      <Image
                        src={currentStudent.profileImage}
                        alt={`Foto de perfil de ${currentStudent.name}`}
                        fill
                        className={styles.profileImage}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className={styles.profileIconPlaceholder}
                        aria-label="Sem foto de perfil"
                      >
                        <i
                          className="fas fa-user-circle"
                          aria-hidden="true"
                        ></i>
                      </div>
                    )}
                    <input
                      id="student-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: "none" }}
                      aria-label="Selecionar arquivo de imagem para foto de perfil"
                    />
                  </div>
                  <div
                    className={styles.cameraIconBadge}
                    onClick={() =>
                      document.getElementById("student-photo-upload")?.click()
                    }
                    role="button"
                    tabIndex={0}
                    aria-label="Clique para alterar foto"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        document
                          .getElementById("student-photo-upload")
                          ?.click();
                      }
                    }}
                  >
                    <i className="fas fa-camera" aria-hidden="true"></i>
                  </div>
                </div>
                <h2 className={styles.profileName}>{currentStudent.name}</h2>
                <p className={styles.profileClass}>{currentStudent.class}</p>
                <span className={styles.profileStatus} role="status">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>{" "}
                  {currentStudent.status}
                </span>
                <div className={styles.profileDetails}>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-envelope" aria-hidden="true"></i>
                    <span>{currentStudent.email}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-phone" aria-hidden="true"></i>
                    <span>{maskPhone(currentStudent.phone || "")}</span>
                  </div>
                  <div className={styles.profileDetailItem}>
                    <i className="fas fa-calendar" aria-hidden="true"></i>
                    <span>Matrícula desde {currentStudent.enrollmentDate}</span>
                  </div>
                </div>

                {/* Botão de Alterar Senha */}
                <button
                  className={styles.changePasswordBtn}
                  onClick={() => setShowPasswordModal(true)}
                  aria-label="Abrir modal para alterar senha"
                >
                  <i className="fas fa-key" aria-hidden="true"></i>
                  Alterar Senha
                </button>
              </div>

              <div
                className={styles.scheduleCard}
                role="region"
                aria-label="Horários das aulas"
              >
                <h3>
                  <i className="fas fa-clock" aria-hidden="true"></i>
                  Horários das Aulas
                </h3>
                <div className={styles.scheduleList} role="list">
                  {isLoadingClasses ? (
                    <div
                      className={styles.loadingSchedule}
                      role="status"
                      aria-live="polite"
                    >
                      <i
                        className="fas fa-spinner fa-spin"
                        aria-hidden="true"
                      ></i>
                      <span>Carregando horários...</span>
                    </div>
                  ) : studentClasses.length > 0 ? (
                    studentClasses.map((schedule, index) => (
                      <div
                        key={index}
                        className={styles.scheduleItem}
                        role="listitem"
                      >
                        {schedule.className && (
                          <div className={styles.scheduleClassName}>
                            <i
                              className="fas fa-graduation-cap"
                              aria-hidden="true"
                            ></i>
                            {schedule.className}
                          </div>
                        )}
                        <div className={styles.scheduleDay}>
                          <i
                            className="fas fa-calendar-day"
                            aria-hidden="true"
                          ></i>
                          {schedule.day}
                        </div>
                        <div className={styles.scheduleTime}>
                          <i className="fas fa-clock" aria-hidden="true"></i>{" "}
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className={styles.scheduleRoom}>
                          <i
                            className="fas fa-door-open"
                            aria-hidden="true"
                          ></i>
                          {schedule.room}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noSchedule} role="status">
                      <i className="fas fa-info-circle" aria-hidden="true"></i>
                      <span>Nenhuma turma vinculada</span>
                    </div>
                  )}
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
                        {studentClasses.length ||
                          currentStudent.schedule.length}
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
              {/* Seção de Informações do Grupo */}
              {groupDetails && (
                <section className={styles.groupInfoSection}>
                  <h3>
                    <i className="fas fa-users"></i>
                    Informações
                  </h3>

                  <div
                    className={
                      groupDetails.members?.length > 1
                        ? styles.groupInfoGrid
                        : styles.groupInfoSingle
                    }
                  >
                    {/* Card do Plano */}
                    {groupDetails.plan_name && (
                      <div
                        className={styles.planInfoCard}
                        role="region"
                        aria-label="Plano atual do grupo"
                      >
                        <div className={styles.planHeader}>
                          <i className="fas fa-tag" aria-hidden="true"></i>
                          <h4>Plano Atual</h4>
                        </div>
                        <div className={styles.planDetails}>
                          <div className={styles.planName}>
                            {groupDetails.plan_name}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card de Membros do Grupo - Apenas se houver mais de 1 membro */}
                    {groupDetails.members?.length > 1 && (
                      <div
                        className={styles.membersCard}
                        role="region"
                        aria-label="Membros do grupo"
                      >
                        <div className={styles.membersHeader}>
                          <i
                            className="fas fa-user-friends"
                            aria-hidden="true"
                          ></i>
                          <h4>Membros do Grupo</h4>
                          <span
                            className={styles.memberCount}
                            aria-label={`${
                              groupDetails.members?.length || 0
                            } membros no grupo`}
                          >
                            {groupDetails.members?.length || 0}
                          </span>
                        </div>

                        <div className={styles.membersList} role="list">
                          {groupDetails.members &&
                          groupDetails.members.length > 0 ? (
                            groupDetails.members.map((member: any) => (
                              <div
                                key={member.id}
                                className={styles.memberItem}
                                role="listitem"
                              >
                                <div
                                  className={styles.memberAvatar}
                                  aria-hidden="true"
                                >
                                  {member.profileImage ? (
                                    <Image
                                      src={member.profileImage}
                                      alt={`Foto de ${member.name}`}
                                      width={40}
                                      height={40}
                                      className={styles.memberPhoto}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  ) : (
                                    <i className="fas fa-user-circle"></i>
                                  )}
                                </div>
                                <div className={styles.memberInfo}>
                                  <div className={styles.memberName}>
                                    {member.name}
                                  </div>
                                  <div
                                    className={styles.memberRole}
                                    aria-label={`Função: ${member.role}`}
                                  >
                                    {member.role}
                                  </div>
                                  {member.classes &&
                                    member.classes.length > 0 && (
                                      <div
                                        className={styles.memberClasses}
                                        role="list"
                                        aria-label={`Turmas de ${member.name}`}
                                      >
                                        {member.classes.map(
                                          (cls: any, idx: number) => (
                                            <div
                                              key={idx}
                                              className={styles.classTag}
                                              role="listitem"
                                              aria-label={`Turma ${
                                                cls.name
                                              }, ${translateDayOfWeek(
                                                cls.dayOfWeek
                                              )}, das ${cls.startTime} às ${
                                                cls.endTime
                                              }`}
                                            >
                                              <i
                                                className="fas fa-graduation-cap"
                                                aria-hidden="true"
                                              ></i>
                                              <span
                                                className={styles.className}
                                              >
                                                {cls.name}
                                              </span>
                                              <span className={styles.classDay}>
                                                {translateDayOfWeek(
                                                  cls.dayOfWeek
                                                )}
                                              </span>
                                              <span
                                                className={styles.classTime}
                                              >
                                                {cls.startTime} - {cls.endTime}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={styles.noMembers} role="status">
                              <i
                                className="fas fa-info-circle"
                                aria-hidden="true"
                              ></i>
                              <p>Nenhum membro no grupo</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section className={styles.paymentSection}>
                <h3>
                  <i className="fas fa-credit-card"></i>
                  Gerenciar Mensalidades
                </h3>

                {/* Componente de Mensalidades Integrado com Backend */}
                {user?.id && (
                  <PaymentsList
                    userId={user.id}
                    allowedPaymentMethods={user.allowedPaymentMethods}
                  />
                )}
              </section>

              <section className={styles.attendanceSection}>
                <h3>
                  <i className="fas fa-clipboard-check"></i>
                  Histórico de Presenças
                </h3>

                {isLoadingAttendances ? (
                  <div className={styles.noAttendance}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Carregando presenças...</p>
                  </div>
                ) : studentAttendances.length > 0 ? (
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
                              studentAttendances.filter(
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
                              studentAttendances.filter(
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
                              studentAttendances.filter(
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
                            {studentAttendances.length}
                          </div>
                          <div className={styles.statLabel}>Total de Aulas</div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de Presenças */}
                    <div className={styles.attendanceListStudent}>
                      <h4>Registro de Presenças</h4>
                      <div className={styles.attendanceItems}>
                        {studentAttendances
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

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowPasswordModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowPasswordModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className={styles.modalTitle}>
              <i className="fas fa-key"></i>
              Alterar Senha
            </h2>
            <form
              onSubmit={handleChangePassword}
              className={styles.passwordForm}
            >
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Senha Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Digite sua senha atual"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">Nova Senha</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Digite a nova senha"
                  minLength={6}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Confirme a nova senha"
                  minLength={6}
                />
              </div>
              {passwordError && (
                <div className={styles.errorMessage}>
                  <i className="fas fa-exclamation-circle"></i>
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className={styles.successMessage}>
                  <i className="fas fa-check-circle"></i>
                  {passwordSuccess}
                </div>
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Alterando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Salvar Nova Senha
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
