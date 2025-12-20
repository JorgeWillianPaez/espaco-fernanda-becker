"use client";

import React from "react";
import { Student } from "@/app/types";
import styles from "./PaymentHistoryModal.module.css";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modalContainer} ${styles.large}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Histórico de Pagamentos - {student.name}</h3>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.studentPaymentInfo}>
          <div className={styles.paymentInfoItem}>
            <strong>Turma:</strong> {student.class}
          </div>
          <div className={styles.paymentInfoItem}>
            <strong>Data de Matrícula:</strong> {student.enrollmentDate}
          </div>
        </div>

        <div className={styles.paymentHistory}>
          <h4>Histórico de Mensalidades</h4>
          <table className={styles.paymentHistoryTable}>
            <thead>
              <tr>
                <th>Mês/Ano</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Data Pagamento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {student.payments.map((payment, idx) => (
                <tr key={idx}>
                  <td>{payment.month}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.dueDate}</td>
                  <td>{payment.paidDate || "-"}</td>
                  <td>
                    <span className={`payment-status-badge ${payment.status}`}>
                      {payment.status === "paid" ? "Pago" : "Pendente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formButtons}>
          <button
            className={`${styles.formButton} ${styles.secondary}`}
            onClick={onClose}
          >
            Fechar
          </button>
          <button className={`${styles.formButton} ${styles.primary}`}>
            <i className="fas fa-check"></i> Registrar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
