"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import styles from "./AnimatedSection.module.css";

type AnimationType =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "fadeIn"
  | "scaleUp"
  | "slideUp";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.6,
  className = "",
  threshold = 0.1,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  return (
    <div
      ref={ref}
      className={`${styles.animated} ${styles[animation]} ${
        isVisible ? styles.visible : ""
      } ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
