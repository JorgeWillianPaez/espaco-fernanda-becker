"use client";

import React from "react";
import styles from "./TeacherFilters.module.css";

interface TeacherFiltersProps {
  filters: {
    name: string;
  };
  onFiltersChange: (filters: { name: string }) => void;
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
    </div>
  );
};

export default TeacherFilters;
