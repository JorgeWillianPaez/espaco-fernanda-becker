"use client";

import React from "react";
import styles from "./AdminSettingsModal.module.css";
import { maskPhone } from "@/app/utils/masks";

interface AdminData {
  name: string;
  email: string;
  phone: string;
  password: string;
  birthDate: string;
  username: string;
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
              <label className={styles.formLabel}>Nome de Usuário *</label>
              <input
                type="text"
                className={styles.formInput}
                value={adminData.username}
                onChange={(e) =>
                  setAdminData({ ...adminData, username: e.target.value })
                }
                placeholder="Nome de usuário para login"
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
                value={adminData.phone}
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
              <input
                type="date"
                className={styles.formInput}
                value={adminData.birthDate}
                onChange={(e) =>
                  setAdminData({
                    ...adminData,
                    birthDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className={styles.formLabel}>Nova Senha *</label>
              <input
                type="password"
                className={styles.formInput}
                value={adminData.password}
                onChange={(e) =>
                  setAdminData({ ...adminData, password: e.target.value })
                }
                placeholder="Digite uma nova senha"
              />
            </div>
          </div>

          <div className={styles.formNote}>
            <i className="fas fa-info-circle"></i>
            <strong>Nota:</strong> As configurações serão salvas localmente
            neste navegador. Use o novo nome de usuário e senha para fazer login
            nas próximas vezes.
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
