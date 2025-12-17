"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

interface Slide {
  src: string;
  title: string;
  description: string;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      src: "/images/flash_becker.jpeg",
      title: "Espaço de Dança Fernanda Becker",
      description: "Onde a paixão pela dança encontra a inclusão",
    },
    {
      src: "/images/danca_do_ventre.jpeg",
      title: "Dança do Ventre",
      description: "Expressão, cultura e movimento",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      <div className={styles.heroContent}>
        <h1>Bem-vindos ao Espaço de Dança Fernanda Becker</h1>
        <p>
          Onde a paixão pela dança ganha vida através do movimento e da arte
        </p>
        <button onClick={scrollToAbout} className={styles.ctaButton}>
          Conheça Nossa Escola
        </button>
      </div>

      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.carouselSlide} ${
                index === currentSlide ? styles.active : ""
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
              <div className={styles.carouselCaption}>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className={`${styles.carouselBtn} ${styles.prev}`}
          onClick={prevSlide}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          className={`${styles.carouselBtn} ${styles.next}`}
          onClick={nextSlide}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        <div className={styles.carouselIndicators}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicator} ${
                index === currentSlide ? styles.active : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
