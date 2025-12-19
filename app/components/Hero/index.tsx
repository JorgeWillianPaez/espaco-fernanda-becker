"use client";

import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroImage}>
        <Image
          src="/images/banner.jpg"
          alt="Espaço de Dança Fernanda Becker"
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={90}
        />
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Espaço de Dança Fernanda Becker</h1>
        <p className={styles.heroSlogan}>Valorizando as diferenças</p>
        <p className={styles.heroDescription}>
          Onde a paixão pela dança ganha vida através do movimento e da arte
        </p>
        <button onClick={scrollToAbout} className={styles.ctaButton}>
          Conheça Nossa Escola
        </button>
      </div>
    </section>
  );
}
