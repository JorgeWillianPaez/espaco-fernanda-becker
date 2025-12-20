"use client";

import React from "react";
import { ClassData } from "@/app/types";
import styles from "./ClassesSummary.module.css";

// Mapa para traduzir dias da semana
const DAY_OF_WEEK_MAP: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
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

interface ClassesSummaryProps {
  classes: ClassData[];
}

const ClassesSummary: React.FC<ClassesSummaryProps> = ({ classes }) => {
  return (
    <div>
      <h2 style={{ color: "#e91e63", marginBottom: "1.5rem" }}>
        Resumo das Atividades
      </h2>
      {classes.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fas fa-chalkboard-teacher"></i>
          <p>Nenhuma turma cadastrada</p>
        </div>
      ) : (
        <div className={styles.classesGrid}>
          {classes.map((classItem) => (
            <div key={classItem.id} className={styles.classCard}>
              <div className={styles.classCardHeader}>
                <div>
                  <div className={styles.className}>{classItem.name}</div>
                  <div className={styles.classLevel}>
                    {DAY_OF_WEEK_MAP[classItem.dayOfWeek] ||
                      classItem.dayOfWeek}
                  </div>
                </div>
                <div className={styles.classStudentsBadge}>
                  {classItem.studentCount || 0}/{classItem.maxStudents}
                </div>
              </div>
              <div className={styles.classInfo}>
                <div className={styles.classInfoItem}>
                  <i className="fas fa-door-open"></i>
                  {classItem.room?.name || "Sala não definida"}
                </div>
                <div className={styles.classInfoItem}>
                  <i className="fas fa-clock"></i>
                  {formatTime(classItem.startTime)} -{" "}
                  {formatTime(classItem.endTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesSummary;
