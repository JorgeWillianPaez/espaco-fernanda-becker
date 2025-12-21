"use client";

import { FormEvent, useState } from "react";
import AnimatedSection from "../AnimatedSection";
import styles from "./Contact.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setModal({
          isOpen: true,
          type: "success",
          title: "Mensagem Enviada! ✨",
          message: `Obrigado por entrar em contato, ${formData.name}! Recebemos sua mensagem e responderemos em breve no e-mail ${formData.email}.`,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "Ops! Algo deu errado 😕",
          message: data.message || "Erro ao enviar mensagem. Tente novamente.",
        });
      }
    } catch {
      setModal({
        isOpen: true,
        type: "error",
        title: "Erro de Conexão 🔌",
        message:
          "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <AnimatedSection animation="fadeUp">
          <h2>Entre em Contato</h2>
        </AnimatedSection>
        <div className={styles.contactContent}>
          <AnimatedSection animation="fadeRight" delay={0.1}>
            <div className={styles.contactInfo}>
              <h3>Fale Conosco</h3>
              <p>
                Tem alguma dúvida ou quer conhecer melhor nossa escola? Entre em
                contato!
              </p>
              <div className={styles.contactMethods}>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactBtn} ${styles.whatsapp}`}
                >
                  <i className="fab fa-whatsapp"></i>
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/espaco.ferbecker/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.contactBtn} ${styles.instagram}`}
                >
                  <i className="fab fa-instagram"></i>
                  Instagram
                </a>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <div className={styles.contactForm}>
              <h3>Envie uma Mensagem</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Sua mensagem"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Modal de Feedback */}
      {modal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modal} ${styles[modal.type]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={closeModal}>
              &times;
            </button>
            <div className={styles.modalIcon}>
              {modal.type === "success" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <h3 className={styles.modalTitle}>{modal.title}</h3>
            <p className={styles.modalMessage}>{modal.message}</p>
            <button className={styles.modalBtn} onClick={closeModal}>
              {modal.type === "success" ? "Entendido!" : "Tentar Novamente"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
