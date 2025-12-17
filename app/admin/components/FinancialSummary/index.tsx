"use client";

import React from "react";
import { AdminStudent } from "@/app/types";
import styles from "./FinancialSummary.module.css";

interface FinancialSummaryProps {
  students: AdminStudent[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ students }) => {
  const paidCount = students.reduce(
    (acc, s) => acc + s.payments.filter((p) => p.status === "paid").length,
    0
  );

  const pendingCount = students.reduce(
    (acc, s) => acc + s.payments.filter((p) => p.status === "pending").length,
    0
  );

  const overdueCount = students.reduce((acc, s) => {
    const overduePayments = s.payments.filter((p) => {
      if (p.status !== "pending") return false;
      const dueDate = new Date(p.dueDate.split("/").reverse().join("-"));
      return dueDate < new Date();
    });
    return acc + overduePayments.length;
  }, 0);

  const totalRevenue = students
    .reduce((acc, s) => {
      const total = s.payments
        .filter((p) => p.status === "paid")
        .reduce(
          (sum, p) =>
            sum + parseFloat(p.amount.replace("R$ ", "").replace(",", ".")),
          0
        );
      return acc + total;
    }, 0)
    .toFixed(2)
    .replace(".", ",");

  return (
    <div className={styles.financialSummary}>
      <div className={`${styles.financialCard} ${styles.paid}`}>
        <i className="fas fa-check-circle"></i>
        <div>
          <div className={styles.financialValue}>{paidCount}</div>
          <div className={styles.financialLabel}>Pagamentos em Dia</div>
        </div>
      </div>
      <div className={`${styles.financialCard} ${styles.pending}`}>
        <i className="fas fa-exclamation-circle"></i>
        <div>
          <div className={styles.financialValue}>{pendingCount}</div>
          <div className={styles.financialLabel}>Pagamentos Pendentes</div>
        </div>
      </div>
      <div className={`${styles.financialCard} ${styles.overdue}`}>
        <i className="fas fa-times-circle"></i>
        <div>
          <div className={styles.financialValue}>{overdueCount}</div>
          <div className={styles.financialLabel}>Pagamentos Atrasados</div>
        </div>
      </div>
      <div className={`${styles.financialCard} ${styles.total}`}>
        <i className="fas fa-dollar-sign"></i>
        <div>
          <div className={styles.financialValue}>R$ {totalRevenue}</div>
          <div className={styles.financialLabel}>Receita Total</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
