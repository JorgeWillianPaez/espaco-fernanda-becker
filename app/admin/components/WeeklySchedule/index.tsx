"use client";

import React from "react";
import styles from "./WeeklySchedule.module.css";

interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

interface Class {
  id: string;
  name: string;
  schedule: ClassSchedule[];
}

interface WeeklyScheduleProps {
  classes: Class[];
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ classes }) => {
  const weekDays = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  return (
    <div className={styles.weeklyScheduleSection}>
      <h3 className={styles.scheduleTitle}>
        <i className="fas fa-calendar-week"></i>
        Agenda Semanal
      </h3>
      <div className={styles.weeklyCalendar}>
        {weekDays.map((day) => {
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
                <div className={styles.dayName}>{day.split("-")[0]}</div>
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
  );
};

export default WeeklySchedule;
