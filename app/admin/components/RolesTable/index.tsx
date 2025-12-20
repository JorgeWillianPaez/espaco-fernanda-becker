"use client";

import React, { useState } from "react";
import { Role } from "@/app/types/role";
import styles from "./RolesTable.module.css";

interface RolesTableProps {
  roles: Role[];
  onEditRole: (role?: Role) => void;
  onDeleteRole: (roleId: number) => void;
  canWrite?: boolean;
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  onEditRole,
  onDeleteRole,
  canWrite = true,
}) => {
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roles.length / itemsPerPage);

  const toggleExpand = (roleId: number) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };

  const getPermissionSummary = (permissions: Role["permissions"]) => {
    if (permissions.length === 0) return "Nenhuma permissão";
    const withAccess = permissions.filter(
      (p) => p.canRead || p.canWrite
    ).length;
    return `${withAccess} de ${permissions.length} módulos`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Permissões</th>
              {canWrite && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {currentRoles.length > 0 ? (
              currentRoles.map((role) => (
                <React.Fragment key={role.id}>
                  <tr
                    className={
                      expandedRoleId === role.id ? styles.expandedRow : ""
                    }
                  >
                    <td>
                      <button
                        className={styles.expandButton}
                        onClick={() => toggleExpand(role.id)}
                        title={
                          expandedRoleId === role.id ? "Recolher" : "Expandir"
                        }
                      >
                        <i
                          className={`fas fa-chevron-${
                            expandedRoleId === role.id ? "up" : "down"
                          }`}
                        ></i>
                      </button>
                    </td>
                    <td>
                      <div className={styles.roleName}>
                        <div className={styles.roleIcon}>
                          <i className="fas fa-user-shield"></i>
                        </div>
                        {role.name}
                      </div>
                    </td>
                    <td className={styles.description}>
                      {role.description || (
                        <span className={styles.noDescription}>
                          Sem descrição
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={styles.permissionBadge}>
                        {getPermissionSummary(role.permissions)}
                      </span>
                    </td>
                    {canWrite && (
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.actionButton}
                            onClick={() => onEditRole(role)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.danger}`}
                            onClick={() => onDeleteRole(role.id)}
                            title="Excluir"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  {expandedRoleId === role.id && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={canWrite ? 5 : 4}>
                        <div className={styles.permissionsContainer}>
                          <div className={styles.permissionsHeader}>
                            <i className="fas fa-key"></i>
                            Permissões por Módulo
                          </div>
                          {role.permissions.length === 0 ? (
                            <p className={styles.noPermissions}>
                              Nenhuma permissão configurada para esta função.
                            </p>
                          ) : (
                            <div className={styles.permissionsGrid}>
                              {role.permissions.map((perm) => (
                                <div
                                  key={perm.moduleId}
                                  className={styles.permissionItem}
                                >
                                  <span className={styles.moduleName}>
                                    {perm.moduleDisplayName}
                                  </span>
                                  <div className={styles.permissionTags}>
                                    {perm.canRead && (
                                      <span
                                        className={`${styles.tag} ${styles.tagRead}`}
                                      >
                                        <i className="fas fa-eye"></i>
                                        Ler
                                      </span>
                                    )}
                                    {perm.canWrite && (
                                      <span
                                        className={`${styles.tag} ${styles.tagWrite}`}
                                      >
                                        <i className="fas fa-edit"></i>
                                        Editar
                                      </span>
                                    )}
                                    {!perm.canRead && !perm.canWrite && (
                                      <span
                                        className={`${styles.tag} ${styles.tagNone}`}
                                      >
                                        <i className="fas fa-ban"></i>
                                        Sem acesso
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={canWrite ? 5 : 4} className={styles.emptyState}>
                  Nenhuma função encontrada
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

export default RolesTable;
