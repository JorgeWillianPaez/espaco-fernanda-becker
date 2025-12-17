"use client";

import React from "react";
import Image from "next/image";
import { AdminStudent } from "@/app/types";
import styles from "./PaymentsTable.module.css";

interface PaymentsTableProps {
  students: AdminStudent[];
  filters: {
    name: string;
    class: string;
    status: string;
    month: string;
  };
  currentPage: number;
  itemsPerPage: number;
  onSelectStudent: (student: AdminStudent) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  students,
  filters,
  currentPage,
  itemsPerPage,
  onSelectStudent,
}) => {
  const filteredStudents = students.filter((student) => {
    // Aplicar filtros
    if (
      filters.name &&
      !student.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    if (filters.class && student.class !== filters.class) {
      return false;
    }
    if (filters.status) {
      const currentPayment = student.payments[0];
      if (filters.status === "overdue") {
        if (currentPayment.status !== "pending") return false;
        const dueDate = new Date(
          currentPayment.dueDate.split("/").reverse().join("-")
        );
        if (dueDate >= new Date()) return false;
      } else if (currentPayment.status !== filters.status) {
        return false;
      }
    }
    if (
      filters.month &&
      !student.payments[0]?.month
        .toLowerCase()
        .includes(filters.month.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.paymentsTableContainer}>
      <table className={styles.studentsTable}>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Turma</th>
            <th>Mensalidade</th>
            <th>Status Atual</th>
            <th>Última Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((student) => {
            const currentPayment = student.payments[0];
            const pendingCount = student.payments.filter(
              (p) => p.status === "pending"
            ).length;

            return (
              <tr key={student.id}>
                <td>
                  <div className={styles.studentInfo}>
                    {student.profileImage ? (
                      <Image
                        src={student.profileImage}
                        alt={student.name}
                        width={35}
                        height={35}
                        className={styles.studentAvatar}
                      />
                    ) : (
                      <div className={styles.avatarIconPlaceholder}>
                        <i className="fas fa-user-circle"></i>
                      </div>
                    )}
                    <span>{student.name}</span>
                  </div>
                </td>
                <td>{student.class}</td>
                <td>{currentPayment?.amount}</td>
                <td>
                  {pendingCount > 0 ? (
                    <span
                      className={`${styles.paymentStatusBadge} ${styles.pending}`}
                    >
                      {pendingCount} {pendingCount === 1 ? "mês" : "meses"}{" "}
                      pendente{pendingCount > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span
                      className={`${styles.paymentStatusBadge} ${styles.paid}`}
                    >
                      Em dia
                    </span>
                  )}
                </td>
                <td>
                  {currentPayment?.status === "paid"
                    ? currentPayment.paidDate
                    : `Vence em ${currentPayment?.dueDate}`}
                </td>
                <td>
                  <button
                    className={styles.tableActionBtn}
                    onClick={() => onSelectStudent(student)}
                  >
                    <i className="fas fa-eye"></i> Ver Histórico
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
