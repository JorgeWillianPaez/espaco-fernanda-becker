"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"aluno" | "professor">("aluno");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (userType === "aluno") {
      // Login de aluno - matrícula e senha
      if (username === "12345" && password === "123456") {
        sessionStorage.setItem("alunoAuth", "true");
        sessionStorage.setItem("studentId", username);
        router.push("/aluno");
      } else {
        alert("Matrícula ou senha incorretos!");
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
      <div className="aluno-login-page">
        <div className="aluno-login-container">
          <div className="aluno-login-header">
            <h1>Área de Acesso 🎭</h1>
            <p>Faça login para acessar sua área</p>
          </div>

          {/* Seletor de tipo de usuário */}
          <div className="user-type-selector">
            <button
              type="button"
              className={`user-type-btn ${
                userType === "aluno" ? "active" : ""
              }`}
              onClick={() => setUserType("aluno")}
            >
              <i className="fas fa-user-graduate"></i>
              <span>Aluno</span>
            </button>
            <button
              type="button"
              className={`user-type-btn ${
                userType === "professor" ? "active" : ""
              }`}
              onClick={() => setUserType("professor")}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Professor</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="aluno-login-form">
            <div className="form-group">
              <input
                type="text"
                placeholder={userType === "aluno" ? "Matrícula" : "Usuário"}
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
            <button type="submit" className="aluno-login-button">
              Entrar
            </button>
          </form>
          <div className="aluno-login-back">
            <a href="/">Voltar ao site principal</a>
          </div>
        </div>
      </div>
    </>
  );
}
