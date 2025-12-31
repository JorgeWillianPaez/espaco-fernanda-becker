"use client";

import { useEffect } from "react";
import styles from "./SkipLink.module.css";

export default function SkipLink() {
  useEffect(() => {
    // Adicionar suporte a navegação por teclado
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove("user-is-tabbing");
    };

    window.addEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleFirstTab);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <a href="#main-content" className={styles.skipLink}>
      Pular para o conteúdo principal
    </a>
  );
}
