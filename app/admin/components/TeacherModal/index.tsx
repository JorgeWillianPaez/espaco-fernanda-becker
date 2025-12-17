"use client";

import React from "react";
import { Student } from "@/app/types";
import styles from "./TeacherModal.module.css";

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherData: Partial<Student>;
  setTeacherData: (data: Partial<Student>) => void;
  addressData: AddressData;
  setAddressData: (data: AddressData) => void;
  loadingCep: boolean;
  onCepSearch: (cep: string) => void;
  onSave: () => void;
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  teacherData,
  setTeacherData,
  addressData,
  setAddressData,
  loadingCep,
  onCepSearch,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Novo Professor</h3>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>Nome Completo *</label>
              <input
                type="text"
                className={styles.formInput}
                value={teacherData.name || ""}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, name: e.target.value })
                }
                placeholder="Nome do professor"
              />
            </div>
            <div>
              <label className={styles.formLabel}>E-mail *</label>
              <input
                type="email"
                className={styles.formInput}
                value={teacherData.email || ""}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, email: e.target.value })
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
                value={teacherData.phone || ""}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, phone: e.target.value })
                }
                placeholder="(41) 98765-4321"
              />
            </div>
            <div>
              <label className={styles.formLabel}>Data de Nascimento *</label>
              <input
                type="date"
                className={styles.formInput}
                value={teacherData.birthDate || ""}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    birthDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div>
              <label className={styles.formLabel}>CPF *</label>
              <input
                type="text"
                className={styles.formInput}
                value={teacherData.cpf || ""}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, cpf: e.target.value })
                }
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className={styles.formLabel}>RG *</label>
              <input
                type="text"
                className={styles.formInput}
                value={teacherData.rg || ""}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, rg: e.target.value })
                }
                placeholder="00.000.000-0"
              />
            </div>
          </div>

          <div className={`${styles.formGrid} ${styles.full}`}>
            <div>
              <label className={styles.formLabel}>CEP *</label>
              <input
                type="text"
                className={styles.formInput}
                value={addressData.cep}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddressData({ ...addressData, cep: value });
                  onCepSearch(value);
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

          <div className={`${styles.formGrid} ${styles.full}`}>
            <div>
              <label className={styles.formLabel}>Especialidade *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Ex: Ballet Clássico, Jazz, Hip Hop"
              />
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
                    name="teacherHasDisability"
                    checked={teacherData.hasDisability === false}
                    onChange={() =>
                      setTeacherData({
                        ...teacherData,
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
                    name="teacherHasDisability"
                    checked={teacherData.hasDisability === true}
                    onChange={() =>
                      setTeacherData({ ...teacherData, hasDisability: true })
                    }
                  />
                  Sim
                </label>
              </div>
              {teacherData.hasDisability && (
                <input
                  type="text"
                  className={styles.formInput}
                  value={teacherData.disabilityDescription || ""}
                  onChange={(e) =>
                    setTeacherData({
                      ...teacherData,
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
                    name="teacherTakesMedication"
                    checked={teacherData.takesMedication === false}
                    onChange={() =>
                      setTeacherData({
                        ...teacherData,
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
                    name="teacherTakesMedication"
                    checked={teacherData.takesMedication === true}
                    onChange={() =>
                      setTeacherData({
                        ...teacherData,
                        takesMedication: true,
                      })
                    }
                  />
                  Sim
                </label>
              </div>
              {teacherData.takesMedication && (
                <input
                  type="text"
                  className={styles.formInput}
                  value={teacherData.medicationDescription || ""}
                  onChange={(e) =>
                    setTeacherData({
                      ...teacherData,
                      medicationDescription: e.target.value,
                    })
                  }
                  placeholder="Descreva os medicamentos"
                  style={{ marginTop: "1rem" }}
                />
              )}
            </div>
          </div>
        </div>

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
            Cadastrar Professor
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherModal;
