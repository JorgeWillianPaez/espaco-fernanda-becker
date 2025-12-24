"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import AnimatedSection from "../AnimatedSection";
import styles from "./Classes.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Classes() {
  const swiperRef = useRef<SwiperType | null>(null);
  const mainClasses = [
    {
      id: 1,
      title: "Dança do Ventre",
      image: "/images/turma_danca_ventre.jpg",
      description:
        "Explore a arte milenar da dança do ventre, desenvolvendo expressão corporal, autoestima e consciência corporal.",
    },
    {
      id: 2,
      title: "Retro Dance",
      image: "/images/turma_retro.jpg",
      description:
        "Reviva os clássicos da dança com muito estilo! Ritmos e movimentos que marcaram gerações.",
    },
    {
      id: 3,
      title: "Hip Hop",
      image: "/images/turma_hip_hop.jpg",
      description:
        "Energia, ritmo e atitude! Desenvolva sua criatividade e expressão através da cultura hip hop.",
    },
  ];

  const otherModalities = [
    "Turmas para Deficientes Visuais",
    "Turmas para Síndrome de Down",
    "Dança de Salão",
    "Aulas Particulares",
  ];

  return (
    <section id="classes" className={styles.classes}>
      <div className="container">
        <AnimatedSection animation="fadeUp">
          <h2>Nossas Modalidades</h2>
          <p className={styles.subtitle}>
            Conheça algumas das modalidades que oferecemos
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={0.2}>
          {/* Grid para desktop */}
          <div className={styles.classesGrid}>
            {mainClasses.map((classItem) => (
              <div key={classItem.id} className={styles.classCard}>
                <div className={styles.classImageWrapper}>
                  <Image
                    src={classItem.image}
                    alt={classItem.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className={styles.classImage}
                  />
                </div>
                <div className={styles.classContent}>
                  <h3>{classItem.title}</h3>
                  <p>{classItem.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Carrossel para mobile */}
          <div className={styles.classesCarousel}>
            <button
              className={styles.navButtonPrev}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Slide anterior"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.navButtonNext}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Próximo slide"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <Swiper
              modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className={styles.swiperContainer}
            >
              {mainClasses.map((classItem) => (
                <SwiperSlide key={classItem.id}>
                  <div className={styles.classCard}>
                    <div className={styles.classImageWrapper}>
                      <Image
                        src={classItem.image}
                        alt={classItem.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className={styles.classImage}
                      />
                    </div>
                    <div className={styles.classContent}>
                      <h3>{classItem.title}</h3>
                      <p>{classItem.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={0.4}>
          <div className={styles.otherModalities}>
            <h3>Outras Modalidades Disponíveis</h3>
            <div className={styles.modalitiesList}>
              {otherModalities.map((modality, index) => (
                <div key={index} className={styles.modalityItem}>
                  <svg
                    className={styles.checkIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6667 5L7.50004 14.1667L3.33337 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{modality}</span>
                </div>
              ))}
            </div>
            <p className={styles.contactInfo}>
              Entre em contato para saber mais sobre horários e valores de cada
              modalidade!
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
