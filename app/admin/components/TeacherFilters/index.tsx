"use client";

import React from "react";
import styles from "./TeacherFilters.module.css";

interface TeacherFiltersProps {
  filters: {
    name: string;
    status: string;
  };
  onFiltersChange: (filters: { name: string; status: string }) => void;
}

const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div>
        <label className={styles.filterLabel}>Filtrar por Nome</label>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Digite o nome..."
          value={filters.name}
          onChange={(e) =>
            onFiltersChange({ ...filters, name: e.target.value })
          }
        />
      </div>
      <div>
        <label className={styles.filterLabel}>Filtrar por Status</label>
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value })
          }
        >
          <option value="">Todos os status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>
    </div>
  );
};

export default TeacherFilters;
