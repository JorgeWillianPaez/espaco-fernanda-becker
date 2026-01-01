import api from "@/lib/api";

export interface Payment {
  id: number;
  userId: number;
  groupId: number;
  paidByUserId?: number;
  originalAmount: number;
  amount: number;
  fineAmount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: "pix" | "boleto" | "credit_card" | "debit_card" | "cash";
  status: "pending" | "paid" | "overdue" | "cancelled";
  referenceMonth: string;
  notes?: string;
  createdAt: string;
}

// Interface para os dados da API (snake_case)
interface PaymentFromApi {
  id: number;
  user_id: number;
  group_id: number;
  paid_by_user_id?: number;
  original_amount: string;
  amount: string;
  fine_amount: string;
  due_date: string;
  payment_date?: string;
  payment_method?: "pix" | "boleto" | "credit_card" | "debit_card" | "cash";
  status: "pending" | "paid" | "overdue" | "cancelled";
  reference_month: string;
  notes?: string;
  created_at: string;
}

// Função para converter snake_case para camelCase
const mapPaymentFromApi = (data: PaymentFromApi): Payment => ({
  id: data.id,
  userId: data.user_id,
  groupId: data.group_id,
  paidByUserId: data.paid_by_user_id,
  originalAmount: parseFloat(data.original_amount),
  amount: parseFloat(data.amount),
  fineAmount: parseFloat(data.fine_amount),
  dueDate: data.due_date,
  paymentDate: data.payment_date,
  paymentMethod: data.payment_method,
  status: data.status,
  referenceMonth: data.reference_month,
  notes: data.notes,
  createdAt: data.created_at,
});

export interface PaymentCalculation {
  amount: number;
  fineAmount: number;
  isOverdue: boolean;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const tuitionService = {
  // Buscar mensalidades de um aluno
  async getStudentPayments(userId: number): Promise<Payment[]> {
    const response = await api.get<ApiResponse<PaymentFromApi[]>>(
      `/tuitions/student/${userId}`
    );
    const payments = response.data || [];
    return payments.map(mapPaymentFromApi);
  },

  // Processar pagamento de mensalidade
  async processTuitionPayment(
    paymentId: number,
    paymentMethod: "pix" | "boleto"
  ): Promise<Payment> {
    const response = await api.post<ApiResponse<PaymentFromApi>>(
      `/tuitions/pay/${paymentId}`,
      {
        paymentMethod,
      }
    );
    return mapPaymentFromApi(response.data);
  },

  // Gerar mensalidade para um aluno (admin/professor)
  async generateTuitionForStudent(
    userId: number,
    referenceMonth?: string
  ): Promise<Payment> {
    const response = await api.post<ApiResponse<Payment>>(
      `/tuitions/generate/${userId}`,
      {
        referenceMonth,
      }
    );
    return response.data;
  },

  // Gerar mensalidades para todos os alunos (admin/professor)
  async generateMonthlyTuitions(): Promise<void> {
    await api.post("/tuitions/generate-all");
  },

  // Atualizar pagamentos vencidos (admin/professor)
  async updateOverduePayments(): Promise<void> {
    await api.post("/tuitions/update-overdue");
  },

  // Calcular valor com juros
  async calculatePaymentAmount(
    originalAmount: number,
    dueDate: string
  ): Promise<PaymentCalculation> {
    const response = await api.post<ApiResponse<PaymentCalculation>>(
      "/tuitions/calculate",
      {
        originalAmount,
        dueDate,
      }
    );
    return response.data;
  },

  // Gerar PIX via OpenPix
  async generatePix(paymentId: number): Promise<PixPaymentResponse> {
    const response = await api.post<PixPaymentResponse>(
      `/openpix/charge/${paymentId}`
    );
    return response;
  },

  // Verificar status do pagamento PIX
  async checkPixStatus(paymentId: number): Promise<PixStatusResponse> {
    const response = await api.get<PixStatusResponse>(
      `/openpix/charge/${paymentId}/status`
    );
    return response;
  },
};

// Interface para resposta do PIX
export interface PixPaymentResponse {
  correlationID: string;
  brCode: string;
  qrCodeImage: string;
  expiresIn: number;
  status: string;
}

export interface PixStatusResponse {
  status: string;
  internalStatus: string;
}

export default tuitionService;
