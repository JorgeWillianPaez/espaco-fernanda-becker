"use client";

import React from "react";
import { Class } from "@/app/types";
import styles from "./PaymentFilters.module.css";

interface PaymentFiltersProps {
  filters: {
    name: string;
    class: string;
    status: string;
    month: string;
  };
  onFiltersChange: (filters: {
    name: string;
    class: string;
    status: string;
    month: string;
  }) => void;
  classes: Class[];
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
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
          <option value="paid">Pago</option>
          <option value="pending">Pendente</option>
          <option value="overdue">Atrasado</option>
        </select>
      </div>
      <div>
        <label className={styles.filterLabel}>Filtrar por Mês</label>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Ex: Dezembro 2024"
          value={filters.month}
          onChange={(e) =>
            onFiltersChange({ ...filters, month: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default PaymentFilters;
