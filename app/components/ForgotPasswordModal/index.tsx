"use client";

import { useState, FormEvent } from "react";
import apiService from "@/lib/api";
import styles from "./ForgotPasswordModal.module.css";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await apiService.forgotPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Erro ao enviar e-mail de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Recuperar Senha</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {!success ? (
          <>
            <p className={styles.modalDescription}>
              Digite seu e-mail cadastrado para receber o link de recuperação de
              senha.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.formGroup}>
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Link"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h3>E-mail Enviado!</h3>
            <p>
              Verifique sua caixa de entrada. Enviamos um link para redefinição
              de senha para <strong>{email}</strong>.
            </p>
            <p className={styles.note}>
              O link expira em 1 hora. Não se esqueça de verificar sua caixa de
              spam.
            </p>
            <button className={styles.okButton} onClick={handleClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
