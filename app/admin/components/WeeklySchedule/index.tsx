"use client";

import React from "react";
import { ClassData } from "@/app/types";
import styles from "./WeeklySchedule.module.css";

// Mapa para traduzir dias da semana de inglês para português
const DAY_OF_WEEK_MAP: Record<string, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
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

interface WeeklyScheduleProps {
  classes: ClassData[];
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ classes }) => {
  const weekDays = [
    { key: "monday", label: "Segunda" },
    { key: "tuesday", label: "Terça" },
    { key: "wednesday", label: "Quarta" },
    { key: "thursday", label: "Quinta" },
    { key: "friday", label: "Sexta" },
    { key: "saturday", label: "Sábado" },
  ];

  return (
    <div className={styles.weeklyScheduleSection}>
      <h3 className={styles.scheduleTitle}>
        <i className="fas fa-calendar-week"></i>
        Agenda Semanal
      </h3>
      <div className={styles.weeklyCalendar}>
        {weekDays.map(({ key, label }) => {
          // Filtrar turmas do dia
          const dayClasses = classes
            .filter((c) => c.dayOfWeek.toLowerCase() === key)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={key} className={styles.calendarDay}>
              <div className={styles.calendarDayHeader}>
                <div className={styles.dayName}>{label}</div>
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
                  dayClasses.map((classItem) => (
                    <div key={classItem.id} className={styles.calendarClass}>
                      <div className={styles.classTime}>
                        <i className="fas fa-clock"></i>
                        {formatTime(classItem.startTime)} -{" "}
                        {formatTime(classItem.endTime)}
                      </div>
                      <div className={styles.classDetails}>
                        <div className={styles.classNameCal}>
                          {classItem.name}
                        </div>
                        <div className={styles.classRoom}>
                          <i className="fas fa-door-open"></i>
                          {classItem.room?.name || "Sala não definida"}
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
  );
};

export default WeeklySchedule;
