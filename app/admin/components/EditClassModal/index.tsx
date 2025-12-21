import { Class, ClassSchedule } from "@/app/types";
import styles from "./EditClassModal.module.css";

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

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  newClass: Partial<Class>;
  setNewClass: (classData: Partial<Class>) => void;
  scheduleInput: Partial<ClassSchedule>;
  setScheduleInput: React.Dispatch<React.SetStateAction<ClassSchedule>>;
  onAddSchedule: () => void;
  onRemoveSchedule: (index: number) => void;
  onUpdateClass: () => void;
}

export default function EditClassModal({
  isOpen,
  onClose,
  newClass,
  setNewClass,
  scheduleInput,
  setScheduleInput,
  onAddSchedule,
  onRemoveSchedule,
  onUpdateClass,
}: EditClassModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Editar Turma</h3>
          <button className={styles.modalClose} onClick={onClose}>
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
                  } as ClassSchedule)
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
                  } as ClassSchedule)
                }
              />
              <input
                type="time"
                value={scheduleInput.endTime}
                onChange={(e) =>
                  setScheduleInput({
                    ...scheduleInput,
                    endTime: e.target.value,
                  } as ClassSchedule)
                }
              />
            </div>
            <button className={styles.addScheduleBtn} onClick={onAddSchedule}>
              + Adicionar Horário
            </button>

            {newClass.schedule && newClass.schedule.length > 0 && (
              <div>
                {newClass.schedule.map((sch, idx) => (
                  <div key={idx} className={styles.scheduleListItem}>
                    <span>
                      {sch.day} - {formatTime(sch.startTime)} às{" "}
                      {formatTime(sch.endTime)}
                    </span>
                    <button
                      className={styles.removeScheduleBtn}
                      onClick={() => onRemoveSchedule(idx)}
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
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${styles.formButton} ${styles.primary}`}
            onClick={onUpdateClass}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
