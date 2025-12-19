"use client";

import React, { useState } from "react";
import { UserData } from "@/app/types";
import styles from "./TeachersTable.module.css";

interface TeachersTableProps {
  teachers: UserData[];
  onEditTeacher: (teacher: UserData) => void;
  onDeleteTeacher: (teacherId: number) => void;
}

const TeachersTable: React.FC<TeachersTableProps> = ({
  teachers,
  onEditTeacher,
  onDeleteTeacher,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = teachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(teachers.length / itemsPerPage);

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
              <th>CPF</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <div className={styles.userName}>
                      <div className={styles.avatarIcon}>
                        <i className="fas fa-user-tie"></i>
                      </div>
                      {teacher.name}
                    </div>
                  </td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone || "N/A"}</td>
                  <td>{teacher.cpf || "N/A"}</td>
                  <td>
                    {teacher.createdAt
                      ? new Date(teacher.createdAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => onEditTeacher(teacher)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.danger}`}
                        onClick={() => onDeleteTeacher(teacher.id)}
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
                <td colSpan={6} className={styles.emptyState}>
                  Nenhum professor encontrado
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

export default TeachersTable;
