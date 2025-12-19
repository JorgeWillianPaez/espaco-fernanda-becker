"use client";

import React, { useState } from "react";
import { AdminStudent } from "@/app/types";
import styles from "./StudentsTable.module.css";

interface StudentsTableProps {
  students: AdminStudent[];
  onEditStudent: (student: AdminStudent) => void;
  onDeleteStudent: (studentId: string) => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  return (
    <div className={styles.container}>
      {/* Tabela */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Turma</th>
              <th>Status</th>
              <th>Data de Matrícula</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className={styles.userName}>
                      <div className={styles.avatarIcon}>
                        <i className="fas fa-user-circle"></i>
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.class || "Sem turma"}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        student.status === "Ativo"
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>{student.enrollmentDate}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => onEditStudent(student)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.danger}`}
                        onClick={() => onDeleteStudent(student.id)}
                        title="Excluir"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
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

export default StudentsTable;
