"use client";

import React from "react";
import { Class } from "@/app/types";
import styles from "./StudentFilters.module.css";

interface StudentFiltersProps {
  filters: {
    name: string;
    class: string;
    status: string;
    id: string;
  };
  onFiltersChange: (filters: {
    name: string;
    class: string;
    status: string;
    id: string;
  }) => void;
  classes: Class[];
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  filters,
  onFiltersChange,
  classes,
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
        <label className={styles.filterLabel}>Filtrar por Turma</label>
        <select
          className={styles.filterSelect}
          value={filters.class}
          onChange={(e) =>
            onFiltersChange({ ...filters, class: e.target.value })
          }
        >
          <option value="">Todas as turmas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
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

export default StudentFilters;
