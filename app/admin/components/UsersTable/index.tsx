"use client";

import React, { useState } from "react";
import { maskPhone, maskCPF } from "@/app/utils/masks";
import styles from "./UsersTable.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: string;
  createdAt?: string;
}

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
  canWrite?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEditUser,
  onDeleteUser,
  canWrite = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar usuários
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm);

    const matchesRole = roleFilter === "" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getRoleName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      aluno: "Aluno",
      professor: "Professor",
      admin: "Administrador",
    };
    return roleMap[role] || role;
  };

  const getRoleClass = (role: string) => {
    const roleClassMap: { [key: string]: string } = {
      aluno: styles.roleStudent,
      professor: styles.roleTeacher,
      admin: styles.roleAdmin,
    };
    return roleClassMap[role] || "";
  };

  return (
    <div className={styles.container}>
      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          className={styles.roleFilter}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Todas as funções</option>
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {/* Tabela */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Função</th>
              {canWrite && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td data-label="Nome">
                    <div className={styles.userName}>
                      <div className={styles.avatarIcon}>
                        <i className="fas fa-user-circle"></i>
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td data-label="E-mail">{user.email}</td>
                  <td data-label="Telefone">{maskPhone(user.phone)}</td>
                  <td data-label="CPF">{maskCPF(user.cpf)}</td>
                  <td data-label="Função">
                    <span
                      className={`${styles.roleBadge} ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  {canWrite && (
                    <td data-label="Ações">
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => onEditUser(user)}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.danger}`}
                          onClick={() => onDeleteUser(user.id)}
                          title="Excluir"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canWrite ? 6 : 5} className={styles.noResults}>
                  {searchTerm || roleFilter
                    ? "Nenhum usuário encontrado com os filtros aplicados"
                    : "Nenhum usuário cadastrado"}
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
            Próxima
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Informação de resultados */}
      <div className={styles.resultsInfo}>
        Mostrando {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, filteredUsers.length)} de{" "}
        {filteredUsers.length} usuário(s)
      </div>
    </div>
  );
};

export default UsersTable;
