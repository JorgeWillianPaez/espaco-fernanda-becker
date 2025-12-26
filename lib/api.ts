const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface LoginResponse {
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      birthDate: string; // Vem como string ISO do JSON
      cpf: string;
      rg: string;
      roleId: number;
      groupId?: number;
      addressId?: number;
      createdAt: string; // Vem como string ISO do JSON
    };
    token: string;
  };
}

interface ApiError {
  message: string;
  error?: any;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      // Primeiro tenta pegar do storage do Zustand (auth-storage)
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          if (parsed.state?.token) {
            return parsed.state.token;
          }
        } catch (e) {
          console.error("Erro ao parsear auth-storage:", e);
        }
      }
      // Fallback para token direto (compatibilidade)
      return localStorage.getItem("token");
    }
    return null;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "Erro ao processar resposta do servidor",
      }));
      throw new Error(error.message || "Erro na requisição");
    }

    // Verificar se há conteúdo na resposta
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Se não for JSON ou não tiver conteúdo, retornar objeto vazio
      return {} as T;
    }

    // Verificar se há conteúdo no corpo
    const text = await response.text();
    if (!text || text.trim() === "") {
      return {} as T;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Erro ao fazer parse da resposta JSON:", error);
      return {} as T;
    }
  }

  // Método genérico GET
  async get<T = any>(endpoint: string, token?: string): Promise<T> {
    const authToken = token || this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    return this.handleResponse<T>(response);
  }

  // Método genérico POST
  async post<T = any>(
    endpoint: string,
    data?: any,
    token?: string
  ): Promise<T> {
    const authToken = token || this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  // Método genérico PUT
  async put<T = any>(endpoint: string, data?: any, token?: string): Promise<T> {
    const authToken = token || this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  // Método genérico DELETE
  async delete<T = any>(endpoint: string, token?: string): Promise<T> {
    const authToken = token || this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    return this.handleResponse<T>(response);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async getCurrentUser(token: string): Promise<{
    message: string;
    data: {
      user: LoginResponse["data"]["user"];
    };
  }> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async register(
    data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      birth_date: string;
      cpf: string;
      rg: string;
      role?: number;
      address?: {
        zip_code: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
    },
    token?: string
  ): Promise<LoginResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  // Registro feito pelo admin - não precisa de senha (gerada automaticamente) e envia email
  async adminRegister(
    data: {
      name: string;
      email?: string;
      phone: string;
      birth_date: string;
      cpf?: string;
      rg?: string;
      role?: number;
      guardian?: string;
      guardian_id?: number;
      allowed_payment_methods?: string[];
      class_id?: number;
      plan_id?: number;
      discount_type?: "percentage" | "value" | "none";
      discount_percentage?: number;
      discount_value?: number;
      proportional_payment_option?: "immediate" | "next_month";
      has_disability?: boolean;
      disability_description?: string;
      takes_medication?: boolean;
      medication_description?: string;
      address?: {
        zip_code: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
    },
    token: string
  ): Promise<{
    message: string;
    data: {
      user: LoginResponse["data"]["user"];
      token: string;
    };
  }> {
    const response = await fetch(`${API_URL}/auth/admin-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // Alterar senha do usuário logado
  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return this.handleResponse(response);
  }

  // Solicitar recuperação de senha
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return this.handleResponse(response);
  }

  // Redefinir senha com token
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    return this.handleResponse(response);
  }

  // ========== MODULES ==========

  async getModules(token: string): Promise<{
    data: Array<{
      id: number;
      name: string;
      displayName: string;
      description?: string;
      icon?: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }> {
    const response = await fetch(`${API_URL}/modules`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // ========== ROLES ==========

  async getRoles(token: string): Promise<{
    data: Array<{
      id: number;
      name: string;
      description?: string;
      permissions: Array<{
        moduleId: number;
        moduleName: string;
        moduleDisplayName: string;
        canRead: boolean;
        canWrite: boolean;
      }>;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }> {
    const response = await fetch(`${API_URL}/roles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getRoleById(
    id: number,
    token: string
  ): Promise<{
    data: {
      id: number;
      name: string;
      description?: string;
      permissions: Array<{
        moduleId: number;
        moduleName: string;
        moduleDisplayName: string;
        canRead: boolean;
        canWrite: boolean;
      }>;
      createdAt: Date;
      updatedAt: Date;
    };
  }> {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async createRole(
    data: {
      name: string;
      description?: string;
      permissions: Array<{
        moduleId: number;
        canRead: boolean;
        canWrite: boolean;
      }>;
    },
    token: string
  ): Promise<{ message: string; data: any }> {
    const response = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async updateRole(
    id: number,
    data: {
      name?: string;
      description?: string;
      permissions?: Array<{
        moduleId: number;
        canRead: boolean;
        canWrite: boolean;
      }>;
    },
    token: string
  ): Promise<{ message: string; data: any }> {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deleteRole(id: number, token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // ========== USERS ==========

  async getAllUsers(token: string): Promise<{
    data: Array<{
      id: number;
      name: string;
      email: string;
      phone: string;
      birthDate: string; // Vem como string ISO do JSON
      cpf: string;
      rg: string;
      role: "admin" | "teacher" | "student";
      roleId: number;
      groupId?: number;
      addressId?: number;
      guardian?: string;
      classIds?: number[];
      address?: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
      createdAt: string; // Vem como string ISO do JSON
    }>;
  }> {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getUserById(
    id: number,
    token: string
  ): Promise<{
    data: {
      id: number;
      name: string;
      email: string;
      phone: string;
      birthDate: string; // Vem como string ISO do JSON
      cpf: string;
      rg: string;
      role: "admin" | "teacher" | "student";
      groupId?: number;
      addressId?: number;
      createdAt: string; // Vem como string ISO do JSON
    };
  }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      birth_date?: string;
      cpf?: string;
      rg?: string;
      role_id?: number;
      group_id?: number;
      guardian_id?: number | null;
      has_disability?: boolean;
      disability_description?: string | null;
      takes_medication?: boolean;
      medication_description?: string | null;
      allowed_payment_methods?: string[];
      address?: {
        zip_code: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
      class_id?: number;
    },
    token: string
  ): Promise<{ message: string; data: any }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deleteUser(id: number, token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // ========== CLASSES (TURMAS) ==========

  async getClasses(token: string): Promise<{
    data: Array<{
      id: number;
      name: string;
      description?: string;
      room?: string;
      startTime: string;
      endTime: string;
      dayOfWeek: string;
      teacherId?: number;
      maxStudents: number;
      active: boolean;
      teacher?: {
        id: number;
        name: string;
        email: string;
      };
      students?: Array<{
        id: number;
        name: string;
        email: string;
        enrolledAt: Date;
      }>;
      studentCount: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }> {
    const response = await fetch(`${API_URL}/classes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getClassById(id: number, token: string) {
    const response = await fetch(`${API_URL}/classes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async createClass(
    data: {
      name: string;
      roomId?: number;
      startTime: string;
      endTime: string;
      dayOfWeek: string;
      teacherId?: number;
      maxStudents?: number;
      active?: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async updateClass(
    id: number,
    data: {
      name?: string;
      roomId?: number | null;
      startTime?: string;
      endTime?: string;
      dayOfWeek?: string;
      teacherId?: number | null;
      maxStudents?: number;
      active?: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/classes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deleteClass(id: number, token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/classes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async addStudentToClass(
    classId: number,
    studentId: number,
    token: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/classes/${classId}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId }),
    });

    return this.handleResponse(response);
  }

  async removeStudentFromClass(
    classId: number,
    studentId: number,
    token: string
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${API_URL}/classes/${classId}/students/${studentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return this.handleResponse(response);
  }

  async getStudentsByClass(classId: number, token: string) {
    const response = await fetch(`${API_URL}/classes/${classId}/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getClassesByStudent(studentId: number, token: string) {
    const response = await fetch(`${API_URL}/classes/student/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getClassesByTeacher(teacherId: number, token: string) {
    const response = await fetch(`${API_URL}/classes/teacher/${teacherId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // Rooms API
  async getRooms(token: string) {
    const response = await fetch(`${API_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async createRoom(
    data: {
      name: string;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async updateRoom(
    id: number,
    data: {
      name?: string;
      active?: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deleteRoom(id: number, token: string) {
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // Events
  async getEvents() {
    console.log("API_URL:", API_URL);
    const response = await fetch(`${API_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return this.handleResponse(response);
  }

  async getEventById(id: number) {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return this.handleResponse(response);
  }

  async createEvent(data: FormData, token: string) {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    return this.handleResponse(response);
  }

  async updateEvent(id: number, data: FormData, token: string) {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    return this.handleResponse(response);
  }

  async deleteEvent(id: number, token: string) {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // Event Photos
  async getEventPhotos(eventId: number) {
    const response = await fetch(`${API_URL}/event-photos/event/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return this.handleResponse(response);
  }

  async createEventPhoto(
    data: {
      event_id: number;
      url: string;
      caption?: string;
      display_order?: number;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/event-photos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async createManyEventPhotos(eventId: number, urls: string[], token: string) {
    const response = await fetch(
      `${API_URL}/event-photos/event/${eventId}/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ urls }),
      }
    );

    return this.handleResponse(response);
  }

  async deleteEventPhoto(id: number, token: string) {
    const response = await fetch(`${API_URL}/event-photos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async deleteEventPhotosByEventId(eventId: number, token: string) {
    const response = await fetch(`${API_URL}/event-photos/event/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // ============== PLANOS ==============

  async getPlans(token: string) {
    const response = await fetch(`${API_URL}/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getActivePlans() {
    const response = await fetch(`${API_URL}/plans/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return this.handleResponse(response);
  }

  async getPlanById(id: number, token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/plans/${id}`, {
      method: "GET",
      headers,
    });

    return this.handleResponse(response);
  }

  async createPlan(
    data: {
      name: string;
      description?: string;
      type: "individual" | "family" | "premium";
      price: number;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async updatePlan(
    id: number,
    data: {
      name?: string;
      description?: string;
      type?: "individual" | "family" | "premium";
      price?: number;
      active?: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/plans/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deletePlan(id: number, token: string) {
    const response = await fetch(`${API_URL}/plans/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // ============== GRUPOS ==============

  async getGroups(token: string) {
    const response = await fetch(`${API_URL}/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async getGroupById(id: number, token: string) {
    const response = await fetch(`${API_URL}/groups/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  async updateGroup(
    id: number,
    data: {
      name?: string;
      planId?: number | null;
      active?: boolean;
      discountType?: "percentage" | "value" | "none";
      discountPercentage?: number;
      discountValue?: number;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/groups/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        plan_id: data.planId,
        active: data.active,
        discount_type: data.discountType,
        discount_percentage: data.discountPercentage,
        discount_value: data.discountValue,
      }),
    });

    return this.handleResponse(response);
  }

  // ========== REVENUE ==========

  async getMonthlyRevenue(
    year: number,
    token: string
  ): Promise<{
    data: Array<{ month: number; total: number }>;
  }> {
    const response = await fetch(`${API_URL}/tuitions/revenue/${year}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return this.handleResponse(response);
  }

  // ========== PRESENÇAS (ATTENDANCES) ==========

  async createAttendance(
    data: {
      classId: number;
      studentId: number;
      date: string;
      status: "present" | "absent" | "late";
      notes?: string;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/attendances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async createBulkAttendance(
    data: {
      classId: number;
      date: string;
      attendances: Array<{
        studentId: number;
        status: "present" | "absent" | "late";
        notes?: string;
      }>;
    },
    token: string
  ) {
    const response = await fetch(`${API_URL}/attendances/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getAttendancesByClassAndDate(
    classId: number,
    date: string,
    token: string
  ) {
    const response = await fetch(
      `${API_URL}/attendances/class/${classId}?date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return this.handleResponse(response);
  }

  async getAttendancesByStudent(studentId: number, token: string) {
    const response = await fetch(
      `${API_URL}/attendances/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return this.handleResponse(response);
  }

  async getAttendanceStats(studentId: number, token: string) {
    const response = await fetch(
      `${API_URL}/attendances/stats/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return this.handleResponse(response);
  }
}

const apiService = new ApiService();
export default apiService;
