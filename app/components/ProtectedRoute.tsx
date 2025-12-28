"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: number[]; // 1 = Administrador, 2 = Professor, 3 = Aluno, 4 = Responsável Financeiro
}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated()) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.roleId)) {
        // Redirecionar para a área correta baseado na roleId
        if (user.roleId === 3 || user.roleId === 4) {
          router.push("/aluno");
        } else if (user.roleId === 1 || user.roleId === 2) {
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

  if (!isAuthenticated() || (user && !allowedRoles.includes(user.roleId))) {
    return null;
  }

  return <>{children}</>;
}
