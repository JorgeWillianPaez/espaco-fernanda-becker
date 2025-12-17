"use client";

import React from "react";
import styles from "./QuickInfoCards.module.css";
import { AdminStudent } from "@/app/types";

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

interface QuickInfoCardsProps {
  classes: Class[];
  students: AdminStudent[];
}

const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({
  classes,
  students,
}) => {
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const weeklyClasses = classes.reduce((acc, c) => acc + c.schedule.length, 0);
  const averagePerClass = classes.length
    ? Math.round(
        classes.reduce((acc, c) => acc + c.currentStudents, 0) / classes.length
      )
    : 0;
  const paidStudents = students.filter(
    (s) => s.payments[0]?.status === "paid"
  ).length;
  const availableSpots = classes.reduce(
    (acc, c) => acc + (c.maxStudents - c.currentStudents),
    0
  );

  return (
    <div className={styles.quickInfo}>
      <div className={styles.infoCard}>
        <i className="fas fa-chalkboard-teacher"></i>
        <div>
          <div className={styles.infoValue}>{totalClasses}</div>
          <div className={styles.infoLabel}>Turmas Ativas</div>
        </div>
      </div>
      <div className={styles.infoCard}>
        <i className="fas fa-user-graduate"></i>
        <div>
          <div className={styles.infoValue}>{totalStudents}</div>
          <div className={styles.infoLabel}>Alunos Matriculados</div>
        </div>
      </div>
      <div className={styles.infoCard}>
        <i className="fas fa-clock"></i>
        <div>
          <div className={styles.infoValue}>{weeklyClasses}</div>
          <div className={styles.infoLabel}>Aulas por Semana</div>
        </div>
      </div>
      <div className={styles.infoCard}>
        <i className="fas fa-users"></i>
        <div>
          <div className={styles.infoValue}>{averagePerClass}</div>
          <div className={styles.infoLabel}>Média por Turma</div>
        </div>
      </div>
      <div className={styles.infoCard}>
        <i className="fas fa-check-circle"></i>
        <div>
          <div className={styles.infoValue}>{paidStudents}</div>
          <div className={styles.infoLabel}>Pagamentos em Dia</div>
        </div>
      </div>
      <div className={styles.infoCard}>
        <i className="fas fa-door-open"></i>
        <div>
          <div className={styles.infoValue}>{availableSpots}</div>
          <div className={styles.infoLabel}>Vagas Disponíveis</div>
        </div>
      </div>
    </div>
  );
};

export default QuickInfoCards;
