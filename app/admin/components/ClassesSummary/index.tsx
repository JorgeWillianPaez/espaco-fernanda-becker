"use client";

import React from "react";
import styles from "./ClassesSummary.module.css";

interface Class {
  id: string;
  name: string;
  level: string;
  room: string;
  currentStudents: number;
  maxStudents: number;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }>;
}

interface ClassesSummaryProps {
  classes: Class[];
}

const ClassesSummary: React.FC<ClassesSummaryProps> = ({ classes }) => {
  return (
    <div>
      <h2 style={{ color: "#e91e63", marginBottom: "1.5rem" }}>
        Resumo das Atividades
      </h2>
      <div className={styles.classesGrid}>
        {classes.map((classItem) => (
          <div key={classItem.id} className={styles.classCard}>
            <div className={styles.classCardHeader}>
              <div>
                <div className={styles.className}>{classItem.name}</div>
                <div className={styles.classLevel}>{classItem.level}</div>
              </div>
              <div className={styles.classStudentsBadge}>
                {classItem.currentStudents}/{classItem.maxStudents}
              </div>
            </div>
            <div className={styles.classInfo}>
              <div className={styles.classInfoItem}>
                <i className="fas fa-door-open"></i>
                {classItem.room}
              </div>
              <div className={styles.classInfoItem}>
                <i className="fas fa-clock"></i>
                {classItem.schedule.length} aulas por semana
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesSummary;
