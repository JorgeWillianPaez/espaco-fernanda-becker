"use client";

import React, { useState, useEffect } from "react";
import apiService from "@/lib/api";
import ConfirmModal from "@/app/components/ConfirmModal";
import styles from "./PlansManagement.module.css";

type PlanType = "individual" | "family" | "premium";

interface Plan {
  id: number;
  name: string;
  description?: string;
  type: PlanType;
  price: number;
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
    description: "",
    type: "individual" as PlanType,
    price: "",
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
        description: "",
        type: "individual",
        price: "",
        active: true,
      });
      setShowModal(true);
    }
  }, [showAddModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const planData = {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        price: parseFloat(formData.price),
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
        description: plan.description || "",
        type: plan.type,
        price: plan.price.toString(),
        active: plan.active,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        description: "",
        type: "individual",
        price: "",
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

  const typeLabels: Record<PlanType, string> = {
    individual: "Individual",
    family: "Família",
    premium: "Premium",
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
                <div className={styles.planHeader}>
                  <span className={`${styles.typeBadge} ${styles[plan.type]}`}>
                    {typeLabels[plan.type]}
                  </span>
                  {!plan.active && (
                    <span className={styles.inactiveBadge}>Inativo</span>
                  )}
                </div>
                <div className={styles.planContent}>
                  <h3>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    {formatPrice(plan.price)}
                  </div>
                  <p className={styles.perMonth}>por mês</p>
                  {plan.description && (
                    <p className={styles.planDescription}>{plan.description}</p>
                  )}
                </div>
                {canWrite && (
                  <div className={styles.planActions}>
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleToggleActive(plan)}
                      title={plan.active ? "Desativar" : "Ativar"}
                    >
                      <i
                        className={`fas ${
                          plan.active ? "fa-toggle-on" : "fa-toggle-off"
                        }`}
                      ></i>
                    </button>
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
                  <label>Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as PlanType,
                      })
                    }
                  >
                    <option value="individual">Individual</option>
                    <option value="family">Família</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Preço Mensal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Descrição do plano (opcional)"
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
