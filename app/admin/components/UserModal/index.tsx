"use client";

import React, { useState, useEffect } from "react";
import { ClassData } from "@/app/types";
import styles from "./UserModal.module.css";
import DatePicker from "@/app/components/DatePicker";
import {
  maskCPF,
  maskRG,
  maskPhone,
  maskCEP,
  removeMask,
} from "@/app/utils/masks";
import api from "@/lib/api";

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface UserFormData {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  cpf?: string;
  rg?: string;
  guardian?: string;
  role?: string;
  classIds?: string[];
  planId?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  takesMedication?: boolean;
  medicationDescription?: string;
  paymentMethods?: string[];
  discountType?: "percentage" | "value" | "none";
  discountPercentage?: string;
  discountValue?: string;
  proportionalPaymentOption?: "immediate" | "next_month";
  // Campos do Responsável Financeiro
  financialResponsibleType?: "self" | "existing" | "new";
  financialResponsibleId?: string;
  financialResponsibleName?: string;
  financialResponsibleEmail?: string;
  financialResponsiblePhone?: string;
  financialResponsibleBirthDate?: string;
  financialResponsibleCpf?: string;
}

interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  active: boolean;
}

interface StudentWithGroup {
  id: string;
  name: string;
  groupId?: number;
}

interface GroupDiscount {
  discountType?: "percentage" | "value" | "none";
  discountPercentage?: number;
  discountValue?: number;
  planId?: number;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserFormData;
  setUserData: (data: UserFormData) => void;
  addressData: AddressData;
  setAddressData: (data: AddressData) => void;
  loadingCep: boolean;
  onCepSearch: (cep: string) => void;
  classes: ClassData[];
  plans?: Plan[];
  onSave: () => void;
  isEditing?: boolean;
  allStudents?: StudentWithGroup[];
  isSaving?: boolean;
  onGetGroupDiscount?: (groupId: number) => Promise<GroupDiscount | null>;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userData,
  setUserData,
  addressData,
  setAddressData,
  loadingCep,
  onCepSearch,
  classes,
  plans = [],
  onSave,
  isEditing = false,
  allStudents = [],
  isSaving = false,
  onGetGroupDiscount,
}) => {
  const [hasGuardianWithPlan, setHasGuardianWithPlan] = useState(false);
  const [remainingClassesThisMonth, setRemainingClassesThisMonth] = useState<
    number | null
  >(null);

  if (!isOpen) return null;

  const isStudent =
    userData.role === "aluno" || userData.role === "responsavel_financeiro";

  // Mapeamento de dias da semana
  const daysOfWeekMap: { [key: string]: string } = {
    sunday: "Domingo",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
  };

  const translateDayOfWeek = (day: string): string => {
    return daysOfWeekMap[day.toLowerCase()] || day;
  };

  // Função para verificar aulas restantes quando selecionar turmas
  const checkRemainingClasses = async (classIds: string[]) => {
    if (!classIds || classIds.length === 0) {
      setRemainingClassesThisMonth(null);
      return;
    }

    try {
      // Verificar a primeira turma selecionada para simplificar
      const response = await api.get(
        `/classes/${classIds[0]}/remaining-classes`
      );
      const remainingClasses = response.data?.data?.remainingClasses ?? 0;
      setRemainingClassesThisMonth(remainingClasses);
    } catch (error) {
      console.error("Erro ao verificar aulas restantes:", error);
      setRemainingClassesThisMonth(0);
    }
  };

  // Função para lidar com a seleção de responsável
  const handleGuardianChange = async (guardianId: string) => {
    setUserData({ ...userData, guardian: guardianId });

    if (guardianId && onGetGroupDiscount) {
      const guardian = allStudents.find((s) => s.id === guardianId);
      if (guardian?.groupId) {
        const groupDiscount = await onGetGroupDiscount(guardian.groupId);
        if (groupDiscount) {
          const hasPlan = !!groupDiscount.planId;
          setHasGuardianWithPlan(hasPlan);

          setUserData({
            ...userData,
            guardian: guardianId,
            planId: groupDiscount.planId?.toString() || userData.planId,
            discountType: groupDiscount.discountType || "none",
            discountPercentage:
              groupDiscount.discountPercentage?.toString() || "",
            discountValue: groupDiscount.discountValue?.toString() || "",
          });
        }
      }
    }
  };

  // Função para lidar com mudanças no tipo de responsável financeiro
  const handleFinancialResponsibleTypeChange = (
    type: "self" | "existing" | "new"
  ) => {
    setUserData({
      ...userData,
      financialResponsibleType: type,
      financialResponsibleId: undefined,
    });

    // Limpar o estado quando mudar o tipo
    if (type !== "existing") {
      setHasGuardianWithPlan(false);
    }
  };

  // Função para lidar com mudanças no responsável financeiro existente
  const handleFinancialResponsibleChange = async (responsibleId: string) => {
    setUserData({
      ...userData,
      financialResponsibleId: responsibleId,
    });

    if (responsibleId && onGetGroupDiscount) {
      const responsible = allStudents.find((s) => s.id === responsibleId);
      if (responsible?.groupId) {
        const groupDiscount = await onGetGroupDiscount(responsible.groupId);
        if (groupDiscount && groupDiscount.planId) {
          setHasGuardianWithPlan(true);
          setUserData({
            ...userData,
            financialResponsibleId: responsibleId,
            planId: groupDiscount.planId.toString(),
            discountType: groupDiscount.discountType || "none",
            discountPercentage:
              groupDiscount.discountPercentage?.toString() || "",
            discountValue: groupDiscount.discountValue?.toString() || "",
          });
        } else {
          setHasGuardianWithPlan(false);
        }
      }
    } else {
      setHasGuardianWithPlan(false);
    }
  };

  // Função para lidar com mudanças nas turmas
  const handleClassChange = (classId: string, isChecked: boolean) => {
    const currentClasses = userData.classIds || [];
    const updatedClasses = isChecked
      ? [...currentClasses, classId]
      : currentClasses.filter((id) => id !== classId);

    setUserData({ ...userData, classIds: updatedClasses });
    checkRemainingClasses(updatedClasses);
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>{isEditing ? "Editar Usuário" : "Novo Usuário"}</h3>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Seleção de Função */}
          {!isEditing && (
            <div className={`${styles.formGrid} ${styles.full}`}>
              <div>
                <label className={styles.formLabel}>Função *</label>
                <select
                  className={styles.formSelect}
                  value={userData.role || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, role: e.target.value })
                  }
                >
                  <option value="">Selecione uma função</option>
                  <option value="aluno">Aluno</option>
                  <option value="responsavel_financeiro">
                    Responsável Financeiro
                  </option>
                  <option value="professor">Professor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
          )}

          {/* Dados Básicos */}
          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>Nome Completo *</label>
              <input
                type="text"
                className={styles.formInput}
                value={userData.name || ""}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className={styles.formLabel}>E-mail</label>
              <input
                type="email"
                className={styles.formInput}
                value={userData.email || ""}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>Telefone *</label>
              <input
                type="tel"
                className={styles.formInput}
                value={userData.phone || ""}
                onChange={(e) => {
                  const maskedValue = maskPhone(e.target.value);
                  setUserData({ ...userData, phone: maskedValue });
                }}
                placeholder="(41) 99999-9999"
                maxLength={15}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Data de Nascimento *</label>
              <DatePicker
                value={userData.birthDate || ""}
                onChange={(value) =>
                  setUserData({
                    ...userData,
                    birthDate: value,
                  })
                }
                placeholder="Selecione a data de nascimento"
              />
            </div>
          </div>

          {/* Mostrar campo de responsável apenas para alunos */}
          {isStudent && (
            <>
              {/* Seção Responsável Financeiro */}
              <div className={styles.sectionDivider}>
                <h4 className={styles.sectionTitle}>
                  <i className="fas fa-wallet"></i> Responsável Financeiro
                </h4>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Quem é o responsável financeiro? *
                  </label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="financialResponsibleType"
                        checked={userData.financialResponsibleType === "self"}
                        onChange={() =>
                          handleFinancialResponsibleTypeChange("self")
                        }
                      />
                      O próprio aluno
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="financialResponsibleType"
                        checked={
                          userData.financialResponsibleType === "existing"
                        }
                        onChange={() =>
                          handleFinancialResponsibleTypeChange("existing")
                        }
                      />
                      Outro (já cadastrado)
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="financialResponsibleType"
                        checked={userData.financialResponsibleType === "new"}
                        onChange={() =>
                          handleFinancialResponsibleTypeChange("new")
                        }
                      />
                      Outro (novo cadastro)
                    </label>
                  </div>
                </div>
              </div>

              {/* Dropdown de responsável existente */}
              {userData.financialResponsibleType === "existing" && (
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>
                      Selecione o Responsável Financeiro *
                    </label>
                    <select
                      className={styles.formSelect}
                      value={userData.financialResponsibleId || ""}
                      onChange={(e) =>
                        handleFinancialResponsibleChange(e.target.value)
                      }
                    >
                      <option value="">Selecione um responsável</option>
                      {allStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Campos para novo responsável financeiro */}
              {userData.financialResponsibleType === "new" && (
                <>
                  <div className={styles.formGrid}>
                    <div>
                      <label className={styles.formLabel}>
                        Nome Completo do Responsável *
                      </label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={userData.financialResponsibleName || ""}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            financialResponsibleName: e.target.value,
                          })
                        }
                        placeholder="Nome completo do responsável"
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>
                        E-mail do Responsável
                      </label>
                      <input
                        type="email"
                        className={styles.formInput}
                        value={userData.financialResponsibleEmail || ""}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            financialResponsibleEmail: e.target.value,
                          })
                        }
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div>
                      <label className={styles.formLabel}>
                        Telefone do Responsável *
                      </label>
                      <input
                        type="tel"
                        className={styles.formInput}
                        value={userData.financialResponsiblePhone || ""}
                        onChange={(e) => {
                          const maskedValue = maskPhone(e.target.value);
                          setUserData({
                            ...userData,
                            financialResponsiblePhone: maskedValue,
                          });
                        }}
                        placeholder="(41) 99999-9999"
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>
                        Data de Nascimento do Responsável *
                      </label>
                      <DatePicker
                        value={userData.financialResponsibleBirthDate || ""}
                        onChange={(value) =>
                          setUserData({
                            ...userData,
                            financialResponsibleBirthDate: value,
                          })
                        }
                        placeholder="Selecione a data de nascimento"
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div>
                      <label className={styles.formLabel}>
                        CPF do Responsável *
                      </label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={userData.financialResponsibleCpf || ""}
                        onChange={(e) => {
                          const maskedValue = maskCPF(e.target.value);
                          setUserData({
                            ...userData,
                            financialResponsibleCpf: maskedValue,
                          });
                        }}
                        placeholder="000.000.000-00"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div className={styles.infoBox}>
                    <i className="fas fa-info-circle"></i>
                    <p>
                      O endereço do responsável financeiro será o mesmo
                      cadastrado para o aluno.
                    </p>
                  </div>
                </>
              )}

              {/* Divisor após seção de Responsável Financeiro */}
              <div className={styles.sectionDivider}></div>
            </>
          )}

          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>CPF</label>
              <input
                type="text"
                className={styles.formInput}
                value={userData.cpf || ""}
                onChange={(e) => {
                  const maskedValue = maskCPF(e.target.value);
                  setUserData({ ...userData, cpf: maskedValue });
                }}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            <div>
              <label className={styles.formLabel}>RG</label>
              <input
                type="text"
                className={styles.formInput}
                value={userData.rg || ""}
                onChange={(e) => {
                  const maskedValue = maskRG(e.target.value);
                  setUserData({ ...userData, rg: maskedValue });
                }}
                placeholder="00.000.000-0"
                maxLength={12}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className={`${styles.formGrid} ${styles.full}`}>
            <div>
              <label className={styles.formLabel}>CEP *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.cep}
                onChange={(e) => {
                  const maskedValue = maskCEP(e.target.value);
                  setAddressData({ ...addressData, cep: maskedValue });
                  onCepSearch(removeMask(maskedValue));
                }}
                placeholder="00000-000"
                maxLength={9}
              />
              {loadingCep && (
                <p className={styles.loadingText}>Buscando CEP...</p>
              )}
            </div>
          </div>

          <div className={`${styles.formGrid} ${styles.full}`}>
            <div>
              <label className={styles.formLabel}>Rua/Avenida *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.street}
                onChange={(e) =>
                  setAddressData({ ...addressData, street: e.target.value })
                }
                placeholder="Nome da Rua"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>Número *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.number}
                onChange={(e) =>
                  setAddressData({ ...addressData, number: e.target.value })
                }
                placeholder="123"
              />
            </div>
            <div>
              <label className={styles.formLabel}>Complemento</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.complement}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    complement: e.target.value,
                  })
                }
                placeholder="Apto, Bloco, etc"
              />
            </div>
          </div>

          <div className={`${styles.formGrid} ${styles.full}`}>
            <div>
              <label className={styles.formLabel}>Bairro *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.neighborhood}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    neighborhood: e.target.value,
                  })
                }
                placeholder="Nome do Bairro"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>Cidade *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.city}
                onChange={(e) =>
                  setAddressData({ ...addressData, city: e.target.value })
                }
                placeholder="Nome da Cidade"
              />
            </div>
            <div>
              <label className={styles.formLabel}>Estado *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.state}
                onChange={(e) =>
                  setAddressData({ ...addressData, state: e.target.value })
                }
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>

          {/* Campos específicos para aluno */}
          {isStudent && (
            <>
              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    <i className="fas fa-chalkboard-teacher"></i> Turmas *
                  </label>
                  <p className={styles.helperText}>
                    Selecione uma ou mais turmas para o aluno
                  </p>
                  <div className={styles.classCheckboxContainer}>
                    {classes.map((classItem) => (
                      <label
                        key={classItem.id}
                        className={styles.classCheckbox}
                      >
                        <input
                          type="checkbox"
                          checked={(userData.classIds || []).includes(
                            classItem.id.toString()
                          )}
                          onChange={(e) =>
                            handleClassChange(
                              classItem.id.toString(),
                              e.target.checked
                            )
                          }
                          disabled={
                            classItem.studentCount >= classItem.maxStudents &&
                            !(userData.classIds || []).includes(
                              classItem.id.toString()
                            )
                          }
                        />
                        <div className={styles.classInfo}>
                          <span className={styles.className}>
                            {classItem.name}
                          </span>
                          <span className={styles.classDetails}>
                            {classItem.dayOfWeek &&
                              `${translateDayOfWeek(classItem.dayOfWeek)} • `}
                            {classItem.startTime &&
                              classItem.endTime &&
                              `${classItem.startTime} - ${classItem.endTime} • `}
                            {classItem.studentCount || 0}/
                            {classItem.maxStudents} alunos
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.formGrid}>
                {!hasGuardianWithPlan && (
                  <div>
                    <label className={styles.formLabel}>Plano</label>
                    <select
                      className={styles.formSelect}
                      value={userData.planId || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, planId: e.target.value })
                      }
                    >
                      <option value="">Selecione um plano (opcional)</option>
                      {plans
                        .filter((p) => p.active)
                        .map((plan) => (
                          <option key={plan.id} value={plan.id.toString()}>
                            {plan.name} -{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(plan.price)}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                {hasGuardianWithPlan && userData.planId && (
                  <div>
                    <label className={styles.formLabel}>Plano</label>
                    <div className={styles.readOnlyField}>
                      <i className="fas fa-link"></i>
                      {plans.find((p) => p.id.toString() === userData.planId)
                        ?.name || "Plano herdado do responsável financeiro"}
                    </div>
                    <p className={styles.helperText}>
                      <i className="fas fa-info-circle"></i> Este aluno herdará
                      o plano do responsável financeiro
                    </p>
                  </div>
                )}
              </div>

              {/* Opção de cobrança proporcional para matrícula no meio do mês */}
              {!isEditing &&
                userData.classIds &&
                userData.classIds.length > 0 &&
                userData.planId &&
                remainingClassesThisMonth !== null &&
                remainingClassesThisMonth > 0 && (
                  <div className={styles.proportionalPaymentSection}>
                    <label className={styles.formLabel}>
                      <i className="fas fa-calendar-alt"></i> Cobrança das Aulas
                      Restantes do Mês ({remainingClassesThisMonth} aula
                      {remainingClassesThisMonth !== 1 ? "s" : ""})
                    </label>
                    <p className={styles.helperText}>
                      Como deseja cobrar o valor proporcional das aulas
                      restantes deste mês?
                    </p>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="proportionalPaymentOption"
                          value="immediate"
                          checked={
                            userData.proportionalPaymentOption !== "next_month"
                          }
                          onChange={() =>
                            setUserData({
                              ...userData,
                              proportionalPaymentOption: "immediate",
                            })
                          }
                        />
                        <span>
                          <strong>Gerar cobrança imediata</strong>
                          <small>
                            Um pagamento separado será gerado com vencimento em
                            3 dias
                          </small>
                        </span>
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="proportionalPaymentOption"
                          value="next_month"
                          checked={
                            userData.proportionalPaymentOption === "next_month"
                          }
                          onChange={() =>
                            setUserData({
                              ...userData,
                              proportionalPaymentOption: "next_month",
                            })
                          }
                        />
                        <span>
                          <strong>Somar com a próxima mensalidade</strong>
                          <small>
                            O valor será adicionado à mensalidade do próximo mês
                          </small>
                        </span>
                      </label>
                    </div>
                  </div>
                )}

              {/* Campos de Desconto */}
              {userData.planId && (
                <div className={styles.discountSection}>
                  <label className={styles.formLabel}>
                    <i className="fas fa-tags"></i> Desconto
                  </label>
                  <p className={styles.helperText}>
                    O desconto é aplicado ao aluno/família. Se o responsável já
                    possui desconto, ele será herdado automaticamente.
                  </p>

                  <div className={styles.discountGrid}>
                    <div>
                      <label className={styles.formLabel}>
                        Tipo de Desconto
                      </label>
                      <select
                        className={styles.formSelect}
                        value={userData.discountType || "none"}
                        onChange={(e) => {
                          const type = e.target.value as
                            | "percentage"
                            | "value"
                            | "none";
                          setUserData({
                            ...userData,
                            discountType: type,
                            discountPercentage:
                              type === "none"
                                ? ""
                                : userData.discountPercentage,
                            discountValue:
                              type === "none" ? "" : userData.discountValue,
                          });
                        }}
                      >
                        <option value="none">Sem desconto</option>
                        <option value="percentage">Percentual (%)</option>
                        <option value="value">Valor fixo (R$)</option>
                      </select>
                    </div>

                    {userData.discountType === "percentage" && (
                      <div>
                        <label className={styles.formLabel}>Desconto (%)</label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="number"
                            className={styles.formInput}
                            value={userData.discountPercentage || ""}
                            onChange={(e) => {
                              const percentage =
                                parseFloat(e.target.value) || 0;
                              const planPrice =
                                plans.find(
                                  (p) => p.id.toString() === userData.planId
                                )?.price || 0;
                              const calculatedValue = (
                                (planPrice * percentage) /
                                100
                              ).toFixed(2);
                              setUserData({
                                ...userData,
                                discountPercentage: e.target.value,
                                discountValue: calculatedValue,
                              });
                            }}
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          <span className={styles.inputSuffix}>%</span>
                        </div>
                        {userData.discountPercentage && (
                          <p className={styles.discountPreview}>
                            = R$ {userData.discountValue || "0.00"} de desconto
                          </p>
                        )}
                      </div>
                    )}

                    {userData.discountType === "value" && (
                      <div>
                        <label className={styles.formLabel}>
                          Desconto (R$)
                        </label>
                        <div
                          className={`${styles.inputWithIcon} ${styles.hasPrefix}`}
                        >
                          <span className={styles.inputPrefix}>R$</span>
                          <input
                            type="number"
                            className={styles.formInput}
                            value={userData.discountValue || ""}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              const planPrice =
                                plans.find(
                                  (p) => p.id.toString() === userData.planId
                                )?.price || 0;
                              const calculatedPercentage =
                                planPrice > 0
                                  ? ((value / planPrice) * 100).toFixed(2)
                                  : "0";
                              setUserData({
                                ...userData,
                                discountValue: e.target.value,
                                discountPercentage: calculatedPercentage,
                              });
                            }}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {userData.discountValue && (
                          <p className={styles.discountPreview}>
                            = {userData.discountPercentage || "0"}% do valor do
                            plano
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {userData.discountType !== "none" && userData.planId && (
                    <div className={styles.discountSummary}>
                      <i className="fas fa-calculator"></i>
                      <span>
                        Valor final da mensalidade:{" "}
                        <strong>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            Math.max(
                              0,
                              (plans.find(
                                (p) => p.id.toString() === userData.planId
                              )?.price || 0) -
                                (parseFloat(userData.discountValue || "0") || 0)
                            )
                          )}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Possui alguma deficiência?
                  </label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="hasDisability"
                        checked={userData.hasDisability === false}
                        onChange={() =>
                          setUserData({
                            ...userData,
                            hasDisability: false,
                            disabilityDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="hasDisability"
                        checked={userData.hasDisability === true}
                        onChange={() =>
                          setUserData({ ...userData, hasDisability: true })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {userData.hasDisability && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={userData.disabilityDescription || ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          disabilityDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva a deficiência"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Toma algum medicamento?
                  </label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="takesMedication"
                        checked={userData.takesMedication === false}
                        onChange={() =>
                          setUserData({
                            ...userData,
                            takesMedication: false,
                            medicationDescription: "",
                          })
                        }
                      />
                      Não
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="takesMedication"
                        checked={userData.takesMedication === true}
                        onChange={() =>
                          setUserData({
                            ...userData,
                            takesMedication: true,
                          })
                        }
                      />
                      Sim
                    </label>
                  </div>
                  {userData.takesMedication && (
                    <input
                      type="text"
                      className={styles.formInput}
                      value={userData.medicationDescription || ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          medicationDescription: e.target.value,
                        })
                      }
                      placeholder="Descreva os medicamentos"
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.full}`}>
                <div>
                  <label className={styles.formLabel}>
                    Métodos de Pagamento Habilitados *
                  </label>
                  <div className={styles.paymentMethods}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={userData.paymentMethods?.includes("pix")}
                        onChange={(e) => {
                          const methods = userData.paymentMethods || [];
                          if (e.target.checked) {
                            setUserData({
                              ...userData,
                              paymentMethods: [...methods, "pix"],
                            });
                          } else {
                            setUserData({
                              ...userData,
                              paymentMethods: methods.filter(
                                (m) => m !== "pix"
                              ),
                            });
                          }
                        }}
                      />
                      <i className="fas fa-qrcode"></i>
                      PIX
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={userData.paymentMethods?.includes("boleto")}
                        onChange={(e) => {
                          const methods = userData.paymentMethods || [];
                          if (e.target.checked) {
                            setUserData({
                              ...userData,
                              paymentMethods: [...methods, "boleto"],
                            });
                          } else {
                            setUserData({
                              ...userData,
                              paymentMethods: methods.filter(
                                (m) => m !== "boleto"
                              ),
                            });
                          }
                        }}
                      />
                      <i className="fas fa-barcode"></i>
                      Boleto
                    </label>
                  </div>
                  <p className={styles.helperText}>
                    Selecione ao menos um método de pagamento para o aluno
                  </p>
                </div>
              </div>
            </>
          )}

          <div className={styles.formButtons}>
            <button
              className={`${styles.formButton} ${styles.secondary}`}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              className={`${styles.formButton} ${styles.primary}`}
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Salvando...
                </>
              ) : isEditing ? (
                "Atualizar"
              ) : (
                "Cadastrar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
