"use client";

import { FormEvent, useState } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(
      `Obrigado por entrar em contato, ${formData.name}!\n\nSua mensagem foi recebida e responderemos em breve no e-mail: ${formData.email}`
    );
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <h2>Entre em Contato</h2>
        <div className={styles.contactContent}>
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
                ></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
