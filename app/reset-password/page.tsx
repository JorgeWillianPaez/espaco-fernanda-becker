"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import apiService from "@/lib/api";
import styles from "./reset-password.module.css";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    symbol: boolean;
    match: boolean;
  }>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
    match: false,
  });

  useEffect(() => {
    if (!token) {
      setError("Token inválido ou ausente");
    }
  }, [token]);

  const validatePassword = (password: string, confirmPass: string) => {
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPass && password.length > 0,
    };

    return errors;
  };

  useEffect(() => {
    if (newPassword || confirmPassword) {
      const errors = validatePassword(newPassword, confirmPassword);
      setValidationErrors(errors);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token inválido");
      return;
    }

    const errors = validatePassword(newPassword, confirmPassword);
    const isValid = Object.values(errors).every((valid) => valid);
    
    if (!isValid) {
      setError("Por favor, atenda a todos os requisitos de senha");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiService.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      setError(
        error.message || "Erro ao redefinir senha. Token pode estar expirado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <div className={styles.resetPage}>
          <div className={styles.resetContainer}>
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h2>Senha redefinida com sucesso!</h2>
              <p>
                Você será redirecionado para a página de login em instantes...
              </p>
              <button
                className={styles.loginButton}
                onClick={() => router.push("/login")}
              >
                Ir para Login
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.resetPage}>
        <div className={styles.resetContainer}>
          <div className={styles.resetHeader}>
            <h1>Redefinir Senha 🔒</h1>
            <p>Crie uma nova senha forte e segura</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.resetForm}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">Nova Senha</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading || !token}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Digite novamente sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading || !token}
              />
            </div>

            {(newPassword || confirmPassword) && (
              <div className={styles.validationChecks}>
                <h4>Requisitos da senha:</h4>
                <ul>
                  <li
                    className={
                      validationErrors.length ? styles.valid : styles.invalid
                    }
                  >
                    <span className={styles.checkIcon}>
                      {validationErrors.length ? "✓" : "✗"}
                    </span>
                    Mínimo de 8 caracteres
                  </li>
                  <li
                    className={
                      validationErrors.uppercase ? styles.valid : styles.invalid
                    }
                  >
                    <span className={styles.checkIcon}>
                      {validationErrors.uppercase ? "✓" : "✗"}
                    </span>
                    Pelo menos uma letra maiúscula
                  </li>
                  <li
                    className={
                      validationErrors.lowercase ? styles.valid : styles.invalid
                    }
                  >
                    <span className={styles.checkIcon}>
                      {validationErrors.lowercase ? "✓" : "✗"}
                    </span>
                    Pelo menos uma letra minúscula
                  </li>
                  <li
                    className={
                      validationErrors.number ? styles.valid : styles.invalid
                    }
                  >
                    <span className={styles.checkIcon}>
                      {validationErrors.number ? "✓" : "✗"}
                    </span>
                    Pelo menos um número
                  </li>
                  <li
                    className={
                      validationErrors.symbol ? styles.valid : styles.invalid
                    }
                  >
                    <span className={styles.checkIcon}>
                      {validationErrors.symbol ? "✓" : "✗"}
                    </span>
                    Pelo menos um símbolo (!@#$%^&*...)
                  </li>
                  {confirmPassword && (
                    <li
                      className={
                        validationErrors.match ? styles.valid : styles.invalid
                      }
                    >
                      <span className={styles.checkIcon}>
                        {validationErrors.match ? "✓" : "✗"}
                      </span>
                      As senhas coincidem
                    </li>
                  )}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className={styles.resetButton}
              disabled={
                isLoading ||
                !token ||
                !Object.values(validationErrors).every((valid) => valid) ||
                newPassword !== confirmPassword
              }
            >
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>

          <div className={styles.resetBack}>
            <a href="/login">Voltar ao login</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
