"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"aluno" | "professor">("aluno");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (userType === "aluno") {
      // Login de aluno - e-mail e senha
      if (username === "fernanda.becker@email.com" && password === "123456") {
        sessionStorage.setItem("alunoAuth", "true");
        sessionStorage.setItem("studentEmail", username);
        router.push("/aluno");
      } else {
        alert("E-mail ou senha incorretos!");
      }
    } else {
      // Login de professor/admin
      if (username === "admin" && password === "admin123") {
        sessionStorage.setItem("adminAuth", "true");
        router.push("/admin");
      } else {
        alert("Usuário ou senha incorretos!");
      }
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
            <div className="form-group">
              <input
                type="text"
                placeholder={userType === "aluno" ? "E-mail" : "Usuário"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Entrar
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
