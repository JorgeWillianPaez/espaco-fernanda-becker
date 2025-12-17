"use client";

import React from "react";
import Image from "next/image";
import { AdminStudent } from "@/app/types";
import styles from "./StudentsTable.module.css";

interface StudentsTableProps {
  students: AdminStudent[];
  filters: {
    name: string;
    class: string;
    status: string;
    id: string;
  };
  currentPage: number;
  itemsPerPage: number;
  onEditStudent: (student: AdminStudent) => void;
  onDeleteStudent: (studentId: string) => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  filters,
  currentPage,
  itemsPerPage,
  onEditStudent,
  onDeleteStudent,
}) => {
  const filteredStudents = students.filter((student) => {
    if (
      filters.name &&
      !student.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.id &&
      !student.id.toLowerCase().includes(filters.id.toLowerCase())
    ) {
      return false;
    }
    if (filters.class && student.class !== filters.class) {
      return false;
    }
    if (filters.status && student.status !== filters.status) {
      return false;
    }
    return true;
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.studentsTableContainer}>
      <table className={styles.studentsTable}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Turma</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((student) => (
            <tr key={student.id}>
              <td>
                {student.profileImage ? (
                  <Image
                    src={student.profileImage}
                    alt={student.name}
                    width={40}
                    height={40}
                    className={styles.studentAvatar}
                  />
                ) : (
                  <div className={styles.avatarIconPlaceholder}>
                    <i className="fas fa-user-circle"></i>
                  </div>
                )}
              </td>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>
                <span
                  className={`student-status-badge ${
                    student.status === "Ativo" ? "active" : "inactive"
                  }`}
                >
                  {student.status}
                </span>
              </td>
              <td>
                <button
                  className={styles.tableActionBtn}
                  onClick={() => onEditStudent(student)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className={styles.tableActionBtn}
                  onClick={() => onDeleteStudent(student.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
