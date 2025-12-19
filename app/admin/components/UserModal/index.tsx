"use client";

import React from "react";
import { Class } from "@/app/types";
import styles from "./UserModal.module.css";
import {
  maskCPF,
  maskRG,
  maskPhone,
  maskCEP,
  removeMask,
} from "@/app/utils/masks";

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
  classId?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  takesMedication?: boolean;
  medicationDescription?: string;
  paymentMethods?: string[];
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
  classes: Class[];
  onSave: () => void;
  isEditing?: boolean;
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
  onSave,
  isEditing = false,
}) => {
  if (!isOpen) return null;

  const isStudent = userData.role === "aluno";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
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
              <label className={styles.formLabel}>E-mail *</label>
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
                placeholder="(41) 98765-4321"
                maxLength={15}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Data de Nascimento *</label>
              <input
                type="date"
                className={styles.formInput}
                value={userData.birthDate || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    birthDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Mostrar campo de responsável apenas para alunos */}
          {isStudent && (
            <div className={styles.formGrid}>
              <div>
                <label className={styles.formLabel}>Responsável</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={userData.guardian || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, guardian: e.target.value })
                  }
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
          )}

          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>CPF *</label>
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
              <label className={styles.formLabel}>RG *</label>
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
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Turma *</label>
                  <select
                    className={styles.formSelect}
                    value={userData.classId || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, classId: e.target.value })
                    }
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name} ({classItem.currentStudents}/
                        {classItem.maxStudents})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
            >
              Cancelar
            </button>
            <button
              className={`${styles.formButton} ${styles.primary}`}
              onClick={onSave}
            >
              {isEditing ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
