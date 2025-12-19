"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const [userType, setUserType] = useState<"aluno" | "professor">("aluno");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);

      // Recuperar dados do usuário do store para saber a role
      const user = useAuthStore.getState().user;
      if (user) {
        // Redirecionar baseado no tipo de usuário e roleId
        // 1 = Administrador, 2 = Professor, 3 = Aluno
        if (userType === "aluno" && user.roleId === 3) {
          router.push("/aluno");
        } else if (
          userType === "professor" &&
          (user.roleId === 1 || user.roleId === 2)
        ) {
          router.push("/admin");
        } else {
          setError("Tipo de usuário incorreto para este login");
          // Fazer logout se o tipo não corresponder
          logout();
        }
      }
    } catch (error: any) {
      setError(error.message || "E-mail ou senha incorretos!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1>Área de Acesso 🎭</h1>
            <p>Faça login para acessar sua área</p>
          </div>

          {/* Seletor de tipo de usuário */}
          <div className={styles.userTypeSelector}>
            <button
              type="button"
              className={`${styles.userTypeBtn} ${
                userType === "aluno" ? styles.active : ""
              }`}
              onClick={() => setUserType("aluno")}
            >
              <i className="fas fa-user-graduate"></i>
              <span>Aluno</span>
            </button>
            <button
              type="button"
              className={`${styles.userTypeBtn} ${
                userType === "professor" ? styles.active : ""
              }`}
              onClick={() => setUserType("professor")}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Professor</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            {error && (
              <div
                style={{
                  padding: "10px",
                  marginBottom: "15px",
                  backgroundColor: "#fee",
                  color: "#c33",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
            <div className="form-group">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <div className={styles.loginBack}>
            <a href="/">Voltar ao site principal</a>
          </div>
        </div>
      </div>
    </>
  );
}
