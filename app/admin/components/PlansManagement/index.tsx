"use client";

import React, { useState, useEffect } from "react";
import apiService from "@/lib/api";
import ConfirmModal from "@/app/components/ConfirmModal";
import styles from "./PlansManagement.module.css";

type DurationType = "day" | "week" | "month";

interface Plan {
  id: number;
  name: string;
  duration: number;
  durationType: DurationType;
  price: number;
  totalPrice: number;
  active: boolean;
  createdAt: string;
}

interface PlansManagementProps {
  token: string;
  canWrite?: boolean;
  showAddModal?: boolean;
  onCloseAddModal?: () => void;
}

const PlansManagement: React.FC<PlansManagementProps> = ({
  token,
  canWrite = true,
  showAddModal = false,
  onCloseAddModal,
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "1",
    durationType: "month" as DurationType,
    price: "",
    totalPrice: "",
    active: true,
  });

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = (await apiService.getPlans(token)) as { data?: Plan[] };
      setPlans(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      alert("Erro ao carregar planos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [token]);

  // Abrir modal quando showAddModal for true (controlado externamente)
  useEffect(() => {
    if (showAddModal) {
      setEditingPlan(null);
      setFormData({
        name: "",
        duration: "1",
        durationType: "month",
        price: "",
        totalPrice: "",
        active: true,
      });
      setShowModal(true);
    }
  }, [showAddModal]);

  // Calcular total price automaticamente
  useEffect(() => {
    const duration = parseInt(formData.duration) || 0;
    const price = parseFloat(formData.price) || 0;
    const total = duration * price;
    setFormData((prev) => ({
      ...prev,
      totalPrice: total > 0 ? total.toFixed(2) : "",
    }));
  }, [formData.duration, formData.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const planData = {
        name: formData.name,
        duration: parseInt(formData.duration),
        durationType: formData.durationType,
        price: parseFloat(formData.price),
        totalPrice: parseFloat(formData.totalPrice),
        active: formData.active,
      };

      if (editingPlan) {
        await apiService.updatePlan(editingPlan.id, planData, token);
      } else {
        await apiService.createPlan(planData, token);
      }

      await fetchPlans();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      alert("Erro ao salvar plano");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setPlanToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await apiService.deletePlan(planToDelete, token);
      await fetchPlans();
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      alert(
        "Erro ao deletar plano. Verifique se não há grupos usando este plano."
      );
    } finally {
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };

  const openModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        duration: plan.duration.toString(),
        durationType: plan.durationType,
        price: plan.price.toString(),
        totalPrice: plan.totalPrice.toString(),
        active: plan.active,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        duration: "1",
        durationType: "month",
        price: "",
        totalPrice: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    // Notificar o componente pai que o modal foi fechado
    if (onCloseAddModal) {
      onCloseAddModal();
    }
  };

  const durationTypeLabels: Record<DurationType, string> = {
    day: "dia",
    week: "semana",
    month: "mês",
  };

  const durationTypePlaceholders: Record<DurationType, string> = {
    day: "Valor por dia",
    week: "Valor por semana",
    month: "Valor por mês",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await apiService.updatePlan(plan.id, { active: !plan.active }, token);
      await fetchPlans();
    } catch (error) {
      console.error("Erro ao alterar status do plano:", error);
      alert("Erro ao alterar status do plano");
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loading}>Carregando planos...</div>
      ) : (
        <div className={styles.plansGrid}>
          {plans.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-clipboard-list"></i>
              <p>Nenhum plano cadastrado</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${
                  !plan.active ? styles.inactive : ""
                }`}
              >
                <div className={styles.planContent}>
                  <div className={styles.planTitleRow}>
                    <h3>{plan.name}</h3>
                    {!plan.active && (
                      <span className={styles.inactiveBadge}>Inativo</span>
                    )}
                  </div>
                  <div className={styles.planPrice}>
                    {formatPrice(plan.price)}
                  </div>
                  <p className={styles.perMonth}>
                    por {durationTypeLabels[plan.durationType]}
                  </p>
                </div>
                {canWrite && (
                  <div className={styles.planActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => openModal(plan)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(plan.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingPlan ? "Editar Plano" : "Novo Plano"}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nome do Plano *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Plano Mensal"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tipo de Duração *</label>
                  <select
                    value={formData.durationType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationType: e.target.value as DurationType,
                      })
                    }
                  >
                    <option value="day">Dia</option>
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Duração *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="1"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder={
                      durationTypePlaceholders[formData.durationType]
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Valor Total (R$)</label>
                <input
                  type="text"
                  value={
                    formData.totalPrice
                      ? `R$ ${parseFloat(formData.totalPrice).toFixed(2)}`
                      : ""
                  }
                  disabled
                  placeholder="Calculado automaticamente"
                  className={styles.readOnlyInput}
                />
              </div>

              {editingPlan && (
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                    />
                    <span>Plano ativo</span>
                  </label>
                </div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Salvando..."
                    : editingPlan
                    ? "Salvar Alterações"
                    : "Criar Plano"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setPlanToDelete(null);
        }}
        danger={true}
      />
    </div>
  );
};

export default PlansManagement;
