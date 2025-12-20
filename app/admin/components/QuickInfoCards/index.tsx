"use client";

import React from "react";
import styles from "./QuickInfoCards.module.css";
import { AdminStudent, ClassData } from "@/app/types";

interface QuickInfoCardsProps {
  classes: ClassData[];
  students: AdminStudent[];
}

const QuickInfoCards: React.FC<QuickInfoCardsProps> = ({
  classes,
  students,
}) => {
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const weeklyClasses = classes.length; // Cada turma = 1 aula semanal
  const averagePerClass = classes.length
    ? Math.round(
        classes.reduce((acc, c) => acc + (c.studentCount || 0), 0) /
          classes.length
      )
    : 0;
  const paidStudents = students.filter(
    (s) => s.payments[0]?.status === "paid"
  ).length;
  const availableSpots = classes.reduce(
    (acc, c) => acc + (c.maxStudents - (c.studentCount || 0)),
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
