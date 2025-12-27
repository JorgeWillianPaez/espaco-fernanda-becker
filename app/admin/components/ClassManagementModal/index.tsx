"use client";

import { useState, useEffect } from "react";
import { ClassData, ClassFormData } from "@/app/types";
import { useAuthStore } from "@/app/store/authStore";
import { maskTime } from "@/app/utils/masks";
import apiService from "@/lib/api";
import styles from "./ClassManagementModal.module.css";

interface ClassManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClassFormData) => Promise<void>;
  classData?: ClassData;
  teachers: Array<{ id: number; name: string }>;
}

interface Room {
  id: number;
  name: string;
  active: boolean;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export default function ClassManagementModal({
  isOpen,
  onClose,
  onSave,
  classData,
  teachers,
}: ClassManagementModalProps) {
  const { token } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    roomId: undefined,
    startTime: "",
    endTime: "",
    dayOfWeek: "monday",
    teacherId: undefined,
    maxStudents: 20,
    active: true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchRooms();
    }
  }, [isOpen, token]);

  const fetchRooms = async () => {
    if (!token) return;

    try {
      const response = await apiService.getRooms(token);
      setRooms((response as { data: Room[] }).data);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
    }
  };

  useEffect(() => {
    if (classData) {
      // Função para remover segundos do horário (HH:MM:SS -> HH:MM)
      const formatTimeWithoutSeconds = (time: string) => {
        if (!time) return "";
        const parts = time.split(":");
        if (parts.length >= 2) {
          return `${parts[0]}:${parts[1]}`;
        }
        return time;
      };

      setFormData({
        name: classData.name,
        roomId: classData.roomId ?? undefined,
        startTime: formatTimeWithoutSeconds(classData.startTime),
        endTime: formatTimeWithoutSeconds(classData.endTime),
        dayOfWeek: classData.dayOfWeek,
        teacherId: classData.teacherId ?? undefined,
        maxStudents: classData.maxStudents,
        active: classData.active,
      });
    } else {
      setFormData({
        name: "",
        roomId: undefined,
        startTime: "",
        endTime: "",
        dayOfWeek: "monday",
        teacherId: undefined,
        maxStudents: 20,
        active: true,
      });
    }
    setError("");
  }, [classData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.startTime || !formData.endTime) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("Horário de início deve ser anterior ao horário de fim");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar turma");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.classModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{classData ? "Editar Turma" : "Nova Turma"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Nome da Turma <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Dança Contemporânea Iniciante"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Sala</label>
              <select
                value={formData.roomId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roomId: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
              >
                <option value="">Nenhuma sala selecionada</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Dia da Semana <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) =>
                  setFormData({ ...formData, dayOfWeek: e.target.value })
                }
                required
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Capacidade Máxima</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStudents: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Horário de Início <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startTime: maskTime(e.target.value),
                  })
                }
                placeholder="00:00"
                maxLength={5}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Horário de Fim <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endTime: maskTime(e.target.value),
                  })
                }
                placeholder="00:00"
                maxLength={5}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Professor Responsável</label>
            <select
              value={formData.teacherId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  teacherId: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            >
              <option value="">Sem professor atribuído</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
            <label htmlFor="active">Turma ativa</label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : classData
                ? "Salvar Alterações"
                : "Criar Turma"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
