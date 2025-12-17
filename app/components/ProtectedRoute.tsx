"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("admin" | "teacher" | "student")[];
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated()) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        // Redirecionar para a área correta baseado na role
        if (user.role === "student") {
          router.push("/aluno");
        } else if (user.role === "admin" || user.role === "teacher") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated() || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
