"use client";

import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 7) return pages;

    return pages.filter((page) => {
      if (page === 1 || page === totalPages) return true;
      if (Math.abs(page - currentPage) <= 1) return true;
      return false;
    });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.paginationHeader}>
        <div className={styles.paginationInfo}>
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
          a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}{" "}
          alunos
        </div>
        <div className={styles.itemsPerPageSelector}>
          <label>Mostrar:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <span>por página</span>
        </div>
      </div>

      <div className={styles.paginationControls}>
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <i className="fas fa-angle-left"></i>
        </button>
        {pageNumbers.map((page, index, array) => {
          if (index > 0 && array[index - 1] !== page - 1) {
            return (
              <React.Fragment key={`group-${page}`}>
                <span className={styles.paginationEllipsis}>...</span>
                <button
                  className={`${styles.paginationBtn} ${
                    currentPage === page ? styles.active : ""
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          }
          return (
            <button
              key={page}
              className={`${styles.paginationBtn} ${
                currentPage === page ? styles.active : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          <i className="fas fa-angle-right"></i>
        </button>
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
