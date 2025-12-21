"use client";

import AnimatedSection from "../AnimatedSection";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <AnimatedSection animation="fadeUp">
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>Espaço de Dança Fernanda Becker</h3>
              <p>Transformando vidas através da dança há mais de 10 anos.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Contato</h4>
              <p>
                <i className="fas fa-phone"></i> (41) 99999-9999
              </p>
              <p>
                <i className="fas fa-envelope"></i>{" "}
                contato@espacofernandabecker.com
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> Curitiba, PR
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4>Redes Sociais</h4>
              <div className={styles.socialLinks}>
                <a
                  href="https://www.instagram.com/espaco.ferbecker/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className={styles.socialLink}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <div className={styles.footerBottom}>
            <p>
              &copy; 2025 Espaço de Dança Fernanda Becker. Todos os direitos
              reservados.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
