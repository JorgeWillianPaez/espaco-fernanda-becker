const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface LoginResponse {
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      birthDate: Date;
      cpf: string;
      rg: string;
      role: "admin" | "teacher" | "student";
      groupId?: number;
      addressId?: number;
      createdAt: Date;
    };
    token: string;
  };
}

interface ApiError {
  message: string;
  error?: any;
}

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "Erro ao processar resposta do servidor",
      }));
      throw new Error(error.message || "Erro na requisição");
    }
    return response.json();
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

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    birth_date: string;
    cpf: string;
    rg: string;
    role?: "student" | "teacher" | "admin";
  }): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<LoginResponse>(response);
  }
}

const apiService = new ApiService();
export default apiService;
