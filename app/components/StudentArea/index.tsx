"use client";

import { FormEvent, useState } from "react";
import { Student, StudentsData } from "../../types";

const studentsData: StudentsData = {
  "12345": {
    name: "Fernanda Becker",
    email: "fernanda.becker@email.com",
    phone: "(41) 98765-4321",
    class: "Dança do Ventre",
    status: "Ativo",
    profileImage: "/images/danca_do_ventre.jpeg",
    enrollmentDate: "15/03/2023",
    schedule: [
      {
        day: "Segunda-feira",
        startTime: "19:00",
        endTime: "20:30",
        room: "Sala 1",
      },
    ],
    payments: [
      {
        month: "Setembro 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/10/2025",
        paidDate: "08/09/2025",
      },
      {
        month: "Agosto 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/09/2025",
        paidDate: "05/08/2025",
      },
      {
        month: "Julho 2025",
        status: "paid",
        amount: "R$ 150,00",
        dueDate: "10/08/2025",
        paidDate: "08/07/2025",
      },
    ],
  },
};

export default function StudentArea() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (studentsData[studentId] && password === "123456") {
      setCurrentStudent(studentsData[studentId]);
      setCurrentStudentId(studentId);
      setIsLoggedIn(true);
    } else {
      alert(
        "Matrícula ou senha incorretos. \n\nPara demonstração, use:\nMatrícula: 12345\nSenha: 123456"
      );
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentId("");
    setPassword("");
    setCurrentStudent(null);
    setCurrentStudentId("");
  };

  const handleGenerateBoleto = () => {
    alert(
      "Em um sistema real, aqui seria gerado um boleto bancário para pagamento."
    );
  };

  const handleViewHistory = () => {
    alert("Funcionalidade de histórico completo será implementada em breve.");
  };

  return (
    <section id="student-area" className="student-area">
      <div className="container">
        <h2>Área do Aluno</h2>

        {!isLoggedIn ? (
          <div className="student-login">
            <div className="login-form">
              <h3>Acesso Exclusivo para Alunos</h3>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Número de matrícula"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
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
                <button type="submit" className="login-btn">
                  Entrar
                </button>
              </form>
            </div>
          </div>
        ) : (
          currentStudent && (
            <div className="student-dashboard">
              <div className="dashboard-header">
                <h3>
                  Olá, <span>{currentStudent.name}</span>!
                </h3>
                <button className="logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              </div>

              <div className="dashboard-content">
                <div className="student-info">
                  <h4>Informações da Matrícula</h4>
                  <div className="info-card">
                    <p>
                      <strong>Matrícula:</strong> {currentStudentId}
                    </p>
                    <p>
                      <strong>Nome:</strong> {currentStudent.name}
                    </p>
                    <p>
                      <strong>Modalidade:</strong> {currentStudent.class}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="status-active">
                        {currentStudent.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="payment-info">
                  <h4>Gerenciar Mensalidades</h4>
                  <div className="payment-card">
                    <div className="payment-status">
                      <h5>Status da Mensalidade</h5>
                      <p className="current-month">
                        {currentStudent.payments[0].month}
                      </p>
                      <span
                        className={`payment-badge ${currentStudent.payments[0].status}`}
                      >
                        {currentStudent.payments[0].status === "paid"
                          ? "Pago"
                          : "Pendente"}
                      </span>
                    </div>
                    <div className="payment-details">
                      <p>
                        <strong>Valor:</strong>{" "}
                        {currentStudent.payments[0].amount}
                      </p>
                      <p>
                        <strong>Vencimento:</strong>{" "}
                        {currentStudent.payments[0].dueDate}
                      </p>
                      {currentStudent.payments[0].paidDate && (
                        <p>
                          <strong>Data do Pagamento:</strong>{" "}
                          {currentStudent.payments[0].paidDate}
                        </p>
                      )}
                    </div>
                    <div className="payment-actions">
                      <button
                        className="payment-btn"
                        onClick={handleGenerateBoleto}
                      >
                        Gerar Boleto
                      </button>
                      <button
                        className="payment-btn secondary"
                        onClick={handleViewHistory}
                      >
                        Histórico
                      </button>
                    </div>
                  </div>

                  <div className="payment-history">
                    <h5>Últimos Pagamentos</h5>
                    <div className="history-list">
                      {currentStudent.payments
                        .slice(1)
                        .map((payment, index) => (
                          <div key={index} className="history-item">
                            <span>{payment.month}</span>
                            <span className="paid">
                              {payment.status === "paid" ? "Pago" : "Pendente"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
