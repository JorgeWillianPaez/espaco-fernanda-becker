"use client";

import React, { useState } from "react";
import styles from "./AdminSettingsModal.module.css";
import { maskPhone } from "@/app/utils/masks";
import DatePicker from "@/app/components/DatePicker";

interface AdminData {
  name: string;
  email: string;
  phone: string;
  password: string;
  currentPassword: string;
  birthDate: string;
}

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminData: AdminData;
  setAdminData: (data: AdminData) => void;
  onSave: () => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  adminData,
  setAdminData,
  onSave,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "#ccc",
  });

  // Validar força da senha
  const validatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, feedback: "", color: "#ccc" });
      return;
    }

    let score = 0;
    const feedback: string[] = [];

    // Mínimo 8 caracteres
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push("mínimo 8 caracteres");
    }

    // Letra maiúscula
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("uma letra maiúscula");
    }

    // Letra minúscula
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("uma letra minúscula");
    }

    // Número
    if (/[0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("um número");
    }

    // Caractere especial
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("um caractere especial");
    }

    let strengthText = "";
    let color = "#ccc";

    if (score < 40) {
      strengthText = "Senha muito fraca";
      color = "#f44336";
    } else if (score < 60) {
      strengthText = "Senha fraca";
      color = "#ff9800";
    } else if (score < 80) {
      strengthText = "Senha média";
      color = "#ffc107";
    } else if (score < 100) {
      strengthText = "Senha forte";
      color = "#8bc34a";
    } else {
      strengthText = "Senha muito forte";
      color = "#4caf50";
    }

    if (feedback.length > 0) {
      strengthText += ` - Falta: ${feedback.join(", ")}`;
    }

    setPasswordStrength({ score, feedback: strengthText, color });
  };

  const handlePasswordChange = (newPassword: string) => {
    setAdminData({ ...adminData, password: newPassword });
    validatePasswordStrength(newPassword);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Configurações do Administrador</h3>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            <div className="form-group">
              <label className={styles.formLabel}>Nome Completo *</label>
              <input
                type="text"
                className={styles.formInput}
                value={adminData.name}
                onChange={(e) =>
                  setAdminData({ ...adminData, name: e.target.value })
                }
                placeholder="Seu nome completo"
              />
            </div>

            <div className="form-group">
              <label className={styles.formLabel}>E-mail *</label>
              <input
                type="email"
                className={styles.formInput}
                value={adminData.email}
                onChange={(e) =>
                  setAdminData({ ...adminData, email: e.target.value })
                }
                placeholder="seu@email.com"
              />
            </div>

            <div className="form-group">
              <label className={styles.formLabel}>Telefone</label>
              <input
                type="tel"
                className={styles.formInput}
                value={maskPhone(adminData.phone)}
                onChange={(e) =>
                  setAdminData({
                    ...adminData,
                    phone: maskPhone(e.target.value),
                  })
                }
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            <div className="form-group">
              <label className={styles.formLabel}>Data de Nascimento</label>
              <DatePicker
                value={adminData.birthDate}
                onChange={(value) =>
                  setAdminData({
                    ...adminData,
                    birthDate: value,
                  })
                }
                placeholder="Selecione a data"
              />
            </div>

            <div className="form-group">
              <label className={styles.formLabel}>Senha Atual</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={adminData.currentPassword}
                  onChange={(e) =>
                    setAdminData({
                      ...adminData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Digite sua senha atual"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                    fontSize: "16px",
                  }}
                >
                  <i
                    className={`fas ${
                      showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className={styles.formLabel}>Nova Senha</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={adminData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Digite a nova senha"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                    fontSize: "16px",
                  }}
                >
                  <i
                    className={`fas ${
                      showNewPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {adminData.password && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      height: "6px",
                      background: "#e0e0e0",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${passwordStrength.score}%`,
                        background: passwordStrength.color,
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: passwordStrength.color,
                      marginTop: "4px",
                      fontWeight: 600,
                    }}
                  >
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formNote}>
            <i className="fas fa-info-circle"></i>
            <strong>Nota:</strong> Para alterar a senha, preencha ambos os
            campos acima. Deixe em branco para manter sua senha atual.
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
            <i className="fas fa-save"></i> Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
