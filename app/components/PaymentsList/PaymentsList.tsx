"use client";

import { useState, useEffect } from "react";
import { Payment, tuitionService } from "@/lib/tuitionService";
import styles from "./PaymentsList.module.css";

interface PaymentsListProps {
  userId: number;
}

const PaymentsList = ({ userId }: PaymentsListProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingPaymentId, setProcessingPaymentId] = useState<number | null>(
    null
  );

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Minhas Mensalidades</h2>

      <div className={styles.paymentsList}>
        {payments.map((payment) => (
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
                className={`${styles.status} ${getStatusClass(payment.status)}`}
              >
                {getStatusLabel(payment.status)}
              </div>
            </div>

            <div className={styles.paymentBody}>
              <div className={styles.paymentInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Valor Original:</span>
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

                {payment.paymentDate && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Data do Pagamento:</span>
                    <span className={styles.value}>
                      {formatDate(payment.paymentDate)}
                    </span>
                  </div>
                )}

                {payment.paymentMethod && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Método:</span>
                    <span className={styles.value}>
                      {getPaymentMethodLabel(payment.paymentMethod)}
                    </span>
                  </div>
                )}

                {payment.notes && (
                  <div className={styles.notes}>
                    <span className={styles.label}>Observações:</span>
                    <p>{payment.notes}</p>
                  </div>
                )}
              </div>

              {(payment.status === "pending" ||
                payment.status === "overdue") && (
                <div className={styles.paymentActions}>
                  <button
                    className={`${styles.payButton} ${styles.pixButton}`}
                    onClick={() => handlePayment(payment.id, "pix")}
                    disabled={processingPaymentId === payment.id}
                  >
                    {processingPaymentId === payment.id
                      ? "Processando..."
                      : "Pagar com PIX"}
                  </button>

                  <button
                    className={`${styles.payButton} ${styles.boletoButton}`}
                    onClick={() => handlePayment(payment.id, "boleto")}
                    disabled={processingPaymentId === payment.id}
                  >
                    {processingPaymentId === payment.id
                      ? "Processando..."
                      : "Pagar com Boleto"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsList;
