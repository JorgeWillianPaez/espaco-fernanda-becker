"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DatePicker from "@/app/components/DatePicker";
import apiService from "@/lib/api";
import styles from "./AttendanceModal.module.css";

interface Student {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

interface AttendanceRecord {
  studentId: number;
  status: "present" | "absent" | "late";
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    id: number;
    name: string;
    students?: Student[];
  };
  token: string;
  onSuccess?: () => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  classData,
  token,
  onSuccess,
}) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  });

  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [existingAttendances, setExistingAttendances] = useState<any[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  // Inicializar com todos presentes quando os estudantes carregarem
  useEffect(() => {
    if (classData.students && classData.students.length > 0) {
      const initialAttendances = classData.students.map((student) => ({
        studentId: student.id,
        status: "present" as const,
      }));
      setAttendances(initialAttendances);
    }
  }, [classData.students]);

  // Buscar presenças existentes quando a data mudar
  useEffect(() => {
    const fetchExistingAttendances = async () => {
      if (!classData.id || !date || !token) return;

      setIsLoadingExisting(true);
      try {
        const response = (await apiService.getAttendancesByClassAndDate(
          classData.id,
          date,
          token
        )) as {
          data?: Array<{
            studentId: number;
            status: "present" | "absent" | "late";
          }>;
        };

        if (response.data && response.data.length > 0) {
          setExistingAttendances(response.data);
          // Atualizar o estado de presenças com os dados existentes
          const updatedAttendances =
            classData.students?.map((student) => {
              const existing = response.data!.find(
                (att) => att.studentId === student.id
              );
              return {
                studentId: student.id,
                status: existing ? existing.status : ("present" as const),
              };
            }) || [];
          setAttendances(updatedAttendances);
        } else {
          setExistingAttendances([]);
          // Reset para todos presentes se não houver dados existentes
          const resetAttendances =
            classData.students?.map((student) => ({
              studentId: student.id,
              status: "present" as const,
            })) || [];
          setAttendances(resetAttendances);
        }
      } catch (error) {
        console.error("Erro ao buscar presenças existentes:", error);
        setExistingAttendances([]);
      } finally {
        setIsLoadingExisting(false);
      }
    };

    fetchExistingAttendances();
  }, [classData.id, date, token, classData.students]);

  const handleStatusChange = (
    studentId: number,
    status: "present" | "absent" | "late"
  ) => {
    setAttendances((prev) =>
      prev.map((att) =>
        att.studentId === studentId ? { ...att, status } : att
      )
    );
  };

  const handleSave = async () => {
    if (!date || attendances.length === 0) return;

    setIsSaving(true);
    try {
      await apiService.createBulkAttendance(
        {
          classId: classData.id,
          date,
          attendances: attendances.map((att) => ({
            studentId: att.studentId,
            status: att.status,
          })),
        },
        token
      );

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar presenças:", error);
      alert(error.message || "Erro ao salvar presenças");
    } finally {
      setIsSaving(false);
    }
  };

  const getStudentStatus = (studentId: number) => {
    const attendance = attendances.find((att) => att.studentId === studentId);
    return attendance?.status || "present";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusCount = (status: "present" | "absent" | "late") => {
    return attendances.filter((att) => att.status === status).length;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2>
              <i className="fas fa-clipboard-check"></i>
              Controle de Presença
            </h2>
            <span className={styles.className}>{classData.name}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.content}>
          {/* Seletor de Data */}
          <div className={styles.dateSection}>
            <label>
              <i className="fas fa-calendar-day"></i>
              Data da Aula
            </label>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Selecione a data"
              maxYear={new Date().getFullYear()}
            />
            {existingAttendances.length > 0 && (
              <span className={styles.existingNote}>
                <i className="fas fa-info-circle"></i>
                Presenças já registradas para esta data. Alterações serão
                atualizadas.
              </span>
            )}
          </div>

          {/* Resumo */}
          <div className={styles.summary}>
            <div className={`${styles.summaryItem} ${styles.present}`}>
              <i className="fas fa-check-circle"></i>
              <span>{getStatusCount("present")}</span>
              <small>Presentes</small>
            </div>
            <div className={`${styles.summaryItem} ${styles.absent}`}>
              <i className="fas fa-times-circle"></i>
              <span>{getStatusCount("absent")}</span>
              <small>Ausentes</small>
            </div>
            <div className={`${styles.summaryItem} ${styles.late}`}>
              <i className="fas fa-clock"></i>
              <span>{getStatusCount("late")}</span>
              <small>Atrasados</small>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <i className="fas fa-users"></i>
              <span>{classData.students?.length || 0}</span>
              <small>Total</small>
            </div>
          </div>

          {/* Lista de Alunos */}
          <div className={styles.studentsList}>
            <h3>
              <i className="fas fa-user-graduate"></i>
              Alunos da Turma
            </h3>

            {isLoadingExisting ? (
              <div className={styles.loading}>
                <i className="fas fa-spinner fa-spin"></i>
                Carregando...
              </div>
            ) : !classData.students || classData.students.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-user-slash"></i>
                <p>Nenhum aluno matriculado nesta turma</p>
              </div>
            ) : (
              <div className={styles.studentsGrid}>
                {classData.students.map((student) => {
                  const status = getStudentStatus(student.id);
                  return (
                    <div
                      key={student.id}
                      className={`${styles.studentCard} ${styles[status]}`}
                    >
                      <div className={styles.studentInfo}>
                        {student.profileImage ? (
                          <Image
                            src={student.profileImage}
                            alt={student.name}
                            width={45}
                            height={45}
                            className={styles.studentAvatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {getInitials(student.name)}
                          </div>
                        )}
                        <div className={styles.studentDetails}>
                          <span className={styles.studentName}>
                            {student.name}
                          </span>
                          <span className={styles.studentEmail}>
                            {student.email}
                          </span>
                        </div>
                      </div>

                      <div className={styles.statusButtons}>
                        <button
                          type="button"
                          className={`${styles.statusBtn} ${
                            styles.presentBtn
                          } ${status === "present" ? styles.active : ""}`}
                          onClick={() =>
                            handleStatusChange(student.id, "present")
                          }
                          title="Presente"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          type="button"
                          className={`${styles.statusBtn} ${styles.lateBtn} ${
                            status === "late" ? styles.active : ""
                          }`}
                          onClick={() => handleStatusChange(student.id, "late")}
                          title="Atrasado"
                        >
                          <i className="fas fa-clock"></i>
                        </button>
                        <button
                          type="button"
                          className={`${styles.statusBtn} ${styles.absentBtn} ${
                            status === "absent" ? styles.active : ""
                          }`}
                          onClick={() =>
                            handleStatusChange(student.id, "absent")
                          }
                          title="Ausente"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving || !classData.students?.length}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Salvar Presenças
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
