"use client";

import React, { useState } from "react";
import { UserData } from "@/app/types";
import { maskPhone, maskCPF } from "@/app/utils/masks";
import styles from "./TeachersTable.module.css";

interface TeachersTableProps {
  teachers: UserData[];
}

const TeachersTable: React.FC<TeachersTableProps> = ({ teachers }) => {
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
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td data-label="Nome">
                    <div className={styles.userName}>
                      <div className={styles.avatarIcon}>
                        <i className="fas fa-user-tie"></i>
                      </div>
                      {teacher.name}
                    </div>
                  </td>
                  <td data-label="E-mail">{teacher.email}</td>
                  <td data-label="Telefone">
                    {teacher.phone ? maskPhone(teacher.phone) : "N/A"}
                  </td>
                  <td data-label="CPF">
                    {teacher.cpf ? maskCPF(teacher.cpf) : "N/A"}
                  </td>
                  <td data-label="Cadastro">
                    {teacher.createdAt
                      ? new Date(teacher.createdAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
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
