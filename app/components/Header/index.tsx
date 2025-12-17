"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAlunoPage = pathname === "/aluno";
  const isAdminPage = pathname === "/admin";
  const isLoginPage = pathname === "/login";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <h1>
              Espaço de Dança <span>Fernanda Becker</span>
            </h1>
          </div>
          <ul
            className={`${styles.navMenu} ${isMenuOpen ? styles.active : ""}`}
          >
            {!isAlunoPage && !isAdminPage && !isLoginPage && (
              <>
                <li>
                  <a
                    onClick={() => scrollToSection("home")}
                    className={styles.navLink}
                  >
                    Início
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("about")}
                    className={styles.navLink}
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("events")}
                    className={styles.navLink}
                  >
                    Eventos
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("contact")}
                    className={styles.navLink}
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className={styles.navLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Área de Acesso
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div
            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </div>
        </div>
      </nav>
    </header>
  );
}
