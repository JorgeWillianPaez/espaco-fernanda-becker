"use client";

import React, { useState } from "react";
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
  onSelectStudent: (student: AdminStudent) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  students,
  filters,
  onSelectStudent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      // Verifica se o aluno tem pagamentos
      if (!student.payments || student.payments.length === 0) {
        // Se não tem pagamentos e o filtro é "pending", inclui; caso contrário, exclui
        return filters.status === "pending";
      }
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
    if (filters.month) {
      if (!student.payments || student.payments.length === 0) {
        return false;
      }
      if (
        !student.payments[0]?.month
          .toLowerCase()
          .includes(filters.month.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  });

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className={styles.container}>
      {/* Tabela */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
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
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => {
                const currentPayment = student.payments?.[0];
                const pendingCount =
                  student.payments?.filter((p) => p.status === "pending")
                    .length || 0;

                return (
                  <tr key={student.id}>
                    <td data-label="Aluno">
                      <div className={styles.userName}>
                        {student.profileImage ? (
                          <Image
                            src={student.profileImage}
                            alt={student.name}
                            width={35}
                            height={35}
                            className={styles.studentAvatar}
                          />
                        ) : (
                          <div className={styles.avatarIcon}>
                            <i className="fas fa-user-circle"></i>
                          </div>
                        )}
                        {student.name}
                      </div>
                    </td>
                    <td data-label="Turma">{student.class || "-"}</td>
                    <td data-label="Mensalidade">
                      {currentPayment?.amount || "-"}
                    </td>
                    <td data-label="Status">
                      {pendingCount > 0 ? (
                        <span
                          className={`${styles.statusBadge} ${styles.statusPending}`}
                        >
                          {pendingCount} {pendingCount === 1 ? "mês" : "meses"}{" "}
                          pendente{pendingCount > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span
                          className={`${styles.statusBadge} ${styles.statusActive}`}
                        >
                          Em dia
                        </span>
                      )}
                    </td>
                    <td data-label="Atualização">
                      {currentPayment
                        ? currentPayment.status === "paid"
                          ? currentPayment.paidDate
                          : `Vence em ${currentPayment.dueDate}`
                        : "-"}
                    </td>
                    <td data-label="Ações">
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => onSelectStudent(student)}
                          title="Ver Histórico"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Nenhum aluno encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próximo
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsTable;
