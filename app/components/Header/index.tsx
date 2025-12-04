"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h1>
              Espaço de Dança <span>Fernanda Becker</span>
            </h1>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            {!isAlunoPage && !isAdminPage && !isLoginPage && (
              <>
                <li>
                  <a
                    onClick={() => scrollToSection("home")}
                    className="nav-link"
                  >
                    Início
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("about")}
                    className="nav-link"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("events")}
                    className="nav-link"
                  >
                    Eventos
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => scrollToSection("contact")}
                    className="nav-link"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Área de Acesso
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
}
