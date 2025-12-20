"use client";

import { useState, useEffect } from "react";
import { Payment, tuitionService } from "@/lib/tuitionService";
import PixModal from "../PixModal";
import styles from "./PaymentsList.module.css";

interface PaymentsListProps {
  userId: number;
  allowedPaymentMethods?: string[];
}

interface PixModalData {
  paymentId: number;
  amount: number;
  referenceMonth: string;
}

const PaymentsList = ({
  userId,
  allowedPaymentMethods = ["pix", "boleto"],
}: PaymentsListProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(
    null
  );
  const [pixModalData, setPixModalData] = useState<PixModalData | null>(null);

  useEffect(() => {
    loadPayments();
  }, [userId]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await tuitionService.getStudentPayments(userId);
      setPayments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar mensalidades");
    } finally {
      setLoading(false);
    }
  };

  const handlePixPayment = (payment: Payment) => {
    setPixModalData({
      paymentId: payment.id,
      amount: payment.amount,
      referenceMonth: payment.referenceMonth.split("-").reverse().join("/"),
    });
  };

  const handlePaymentConfirmed = () => {
    loadPayments();
    setPixModalData(null);
  };

  const handlePayment = async (paymentId: number, method: "pix" | "boleto") => {
    if (processingPaymentId) return;

    try {
      setProcessingPaymentId(paymentId);
      await tuitionService.processTuitionPayment(paymentId, method);

      // Recarregar lista de pagamentos
      await loadPayments();
      alert("Pagamento processado com sucesso!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao processar pagamento");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      paid: "Pago",
      overdue: "Vencido",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    return styles[`status-${status}`] || "";
  };

  const getPaymentMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      pix: "PIX",
      boleto: "Boleto",
      credit_card: "Cartão de Crédito",
      debit_card: "Cartão de Débito",
      cash: "Dinheiro",
    };
    return method ? labels[method] || method : "-";
  };

  if (loading) {
    return <div className={styles.loading}>Carregando mensalidades...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (payments.length === 0) {
    return <div className={styles.empty}>Nenhuma mensalidade encontrada.</div>;
  }

  // Separar mensalidades em aberto das pagas
  const openPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "overdue"
  );
  const paidPayments = payments.filter(
    (p) => p.status === "paid" || p.status === "cancelled"
  );

  const formatMonth = (referenceMonth: string) => {
    const [year, month] = referenceMonth.split("-");
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${months[parseInt(month) - 1]}/${year}`;
  };

  return (
    <div className={styles.container}>
      {/* Mensalidades em aberto - Layout completo */}
      {openPayments.length > 0 && (
        <div className={styles.openPaymentsSection}>
          {openPayments.map((payment) => (
            <div
              key={payment.id}
              className={`${styles.paymentCard} ${getStatusClass(
                payment.status
              )}`}
            >
              <div className={styles.paymentHeader}>
                <div className={styles.referenceMonth}>
                  {payment.referenceMonth.split("-").reverse().join("/")}
                </div>
                <div
                  className={`${styles.status} ${getStatusClass(
                    payment.status
                  )}`}
                >
                  {getStatusLabel(payment.status)}
                </div>
              </div>

              <div className={styles.paymentBody}>
                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Valor:</span>
                    <span className={styles.value}>
                      {formatCurrency(payment.originalAmount)}
                    </span>
                  </div>

                  {payment.fineAmount > 0 && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Juros (10%):</span>
                      <span className={`${styles.value} ${styles.fine}`}>
                        + {formatCurrency(payment.fineAmount)}
                      </span>
                    </div>
                  )}

                  <div className={`${styles.infoRow} ${styles.totalRow}`}>
                    <span className={styles.label}>Valor Total:</span>
                    <span className={styles.valueTotal}>
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>Vencimento:</span>
                    <span className={styles.value}>
                      {formatDate(payment.dueDate)}
                    </span>
                  </div>
                </div>

                <div className={styles.paymentActions}>
                  {allowedPaymentMethods.includes("pix") && (
                    <button
                      className={`${styles.payButton} ${styles.pixButton}`}
                      onClick={() => handlePixPayment(payment)}
                      disabled={processingPaymentId === payment.id}
                    >
                      Pagar com PIX
                    </button>
                  )}

                  {allowedPaymentMethods.includes("boleto") && (
                    <button
                      className={`${styles.payButton} ${styles.boletoButton}`}
                      onClick={() => handlePayment(payment.id, "boleto")}
                      disabled={processingPaymentId === payment.id}
                    >
                      {processingPaymentId === payment.id
                        ? "Processando..."
                        : "Pagar com Boleto"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensalidades pagas - Layout compacto */}
      {paidPayments.length > 0 && (
        <div className={styles.paidPaymentsSection}>
          <h4 className={styles.paidTitle}>
            <i className="fas fa-history"></i> Histórico de Pagamentos
          </h4>
          <div className={styles.paidList}>
            {paidPayments.map((payment) => (
              <div key={payment.id} className={styles.paidItem}>
                <div className={styles.paidMonth}>
                  {formatMonth(payment.referenceMonth)}
                </div>
                <div className={styles.paidAmount}>
                  {formatCurrency(payment.amount)}
                </div>
                <div className={styles.paidDate}>
                  <i className="fas fa-calendar-check"></i>
                  {payment.paymentDate ? formatDate(payment.paymentDate) : "-"}
                </div>
                <div className={styles.paidMethod}>
                  {getPaymentMethodLabel(payment.paymentMethod)}
                </div>
                <div
                  className={`${styles.paidStatus} ${getStatusClass(
                    payment.status
                  )}`}
                >
                  <i className="fas fa-check-circle"></i>{" "}
                  {getStatusLabel(payment.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {openPayments.length === 0 && paidPayments.length > 0 && (
        <div className={styles.allPaidMessage}>
          <i className="fas fa-check-circle"></i>
          <span>Todas as mensalidades estão em dia!</span>
        </div>
      )}

      {/* Modal PIX */}
      {pixModalData && (
        <PixModal
          isOpen={!!pixModalData}
          onClose={() => setPixModalData(null)}
          paymentId={pixModalData.paymentId}
          amount={pixModalData.amount}
          referenceMonth={pixModalData.referenceMonth}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </div>
  );
};

export default PaymentsList;
