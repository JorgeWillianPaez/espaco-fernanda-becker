"use client";

import { useState } from "react";
import { tuitionService } from "@/lib/tuitionService";
import styles from "./AdminTuitions.module.css";

const AdminTuitions = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [studentId, setStudentId] = useState("");
  const [referenceMonth, setReferenceMonth] = useState("");

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleGenerateAll = async () => {
    if (!confirm("Deseja gerar mensalidades para todos os alunos ativos?")) {
      return;
    }

    try {
      setLoading(true);
      await tuitionService.generateMonthlyTuitions();
      showMessage(
        "Mensalidades geradas com sucesso para todos os alunos!",
        "success"
      );
    } catch (err: any) {
      showMessage(
        err.response?.data?.message || "Erro ao gerar mensalidades",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateForStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      showMessage("Por favor, informe o ID do aluno", "error");
      return;
    }

    try {
      setLoading(true);
      await tuitionService.generateTuitionForStudent(
        parseInt(studentId),
        referenceMonth || undefined
      );
      showMessage("Mensalidade gerada com sucesso!", "success");
      setStudentId("");
      setReferenceMonth("");
    } catch (err: any) {
      showMessage(
        err.response?.data?.message || "Erro ao gerar mensalidade",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOverdue = async () => {
    if (
      !confirm("Deseja atualizar todos os pagamentos vencidos e aplicar juros?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await tuitionService.updateOverduePayments();
      showMessage("Pagamentos vencidos atualizados com sucesso!", "success");
    } catch (err: any) {
      showMessage(
        err.response?.data?.message || "Erro ao atualizar pagamentos",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gerenciar Mensalidades</h2>

      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}

      <div className={styles.sections}>
        {/* Seção: Gerar mensalidades em massa */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Gerar Mensalidades em Massa</h3>
          <p className={styles.sectionDescription}>
            Gera mensalidades para todos os alunos ativos matriculados no
            sistema. O sistema irá criar automaticamente mensalidades com
            vencimento no dia 10 do mês atual.
          </p>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleGenerateAll}
            disabled={loading}
          >
            {loading ? "Gerando..." : "Gerar Mensalidades para Todos"}
          </button>
        </section>

        {/* Seção: Gerar mensalidade individual */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Gerar Mensalidade Individual</h3>
          <p className={styles.sectionDescription}>
            Gera mensalidade para um aluno específico.
          </p>

          <form onSubmit={handleGenerateForStudent} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="studentId" className={styles.label}>
                ID do Aluno *
              </label>
              <input
                type="number"
                id="studentId"
                className={styles.input}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Ex: 123"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="referenceMonth" className={styles.label}>
                Mês de Referência (Opcional)
              </label>
              <input
                type="month"
                id="referenceMonth"
                className={styles.input}
                value={referenceMonth}
                onChange={(e) => setReferenceMonth(e.target.value)}
                placeholder="Deixe em branco para o mês atual"
              />
              <small className={styles.hint}>
                Formato: YYYY-MM (ex: 2025-01). Deixe em branco para usar o mês
                atual.
              </small>
            </div>

            <button
              type="submit"
              className={`${styles.button} ${styles.secondaryButton}`}
              disabled={loading}
            >
              {loading ? "Gerando..." : "Gerar Mensalidade"}
            </button>
          </form>
        </section>

        {/* Seção: Atualizar pagamentos vencidos */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Atualizar Pagamentos Vencidos</h3>
          <p className={styles.sectionDescription}>
            Verifica todos os pagamentos pendentes e aplica automaticamente 10%
            de juros aos que já venceram. Este processo é executado
            automaticamente todo dia, mas você pode executá-lo manualmente aqui.
          </p>
          <button
            className={`${styles.button} ${styles.warningButton}`}
            onClick={handleUpdateOverdue}
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar Pagamentos Vencidos"}
          </button>
        </section>

        {/* Informações do sistema */}
        <section className={`${styles.section} ${styles.infoSection}`}>
          <h3 className={styles.sectionTitle}>ℹ️ Informações do Sistema</h3>
          <ul className={styles.infoList}>
            <li>
              <strong>Geração Automática:</strong> Mensalidades são geradas
              automaticamente todo dia 1º de cada mês às 00:01 para todos os
              alunos ativos.
            </li>
            <li>
              <strong>Vencimento:</strong> Todas as mensalidades vencem no dia
              10 de cada mês.
            </li>
            <li>
              <strong>Juros:</strong> Pagamentos em atraso recebem
              automaticamente 10% de juros sobre o valor original.
            </li>
            <li>
              <strong>Verificação Diária:</strong> O sistema verifica pagamentos
              vencidos automaticamente todo dia às 00:05.
            </li>
            <li>
              <strong>Métodos de Pagamento:</strong> Os métodos disponíveis (PIX
              e Boleto) são definidos pelo professor ao criar o usuário do
              aluno.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminTuitions;
