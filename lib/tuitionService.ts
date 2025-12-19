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

export interface PaymentCalculation {
  amount: number;
  fineAmount: number;
  isOverdue: boolean;
}

export const tuitionService = {
  // Buscar mensalidades de um aluno
  async getStudentPayments(userId: number): Promise<Payment[]> {
    const response = await api.get(`/tuitions/student/${userId}`);
    return response.data.data;
  },

  // Processar pagamento de mensalidade
  async processTuitionPayment(
    paymentId: number,
    paymentMethod: "pix" | "boleto"
  ): Promise<Payment> {
    const response = await api.post(`/tuitions/pay/${paymentId}`, {
      paymentMethod,
    });
    return response.data.data;
  },

  // Gerar mensalidade para um aluno (admin/professor)
  async generateTuitionForStudent(
    userId: number,
    referenceMonth?: string
  ): Promise<Payment> {
    const response = await api.post(`/tuitions/generate/${userId}`, {
      referenceMonth,
    });
    return response.data.data;
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
    const response = await api.post("/tuitions/calculate", {
      originalAmount,
      dueDate,
    });
    return response.data.data;
  },
};

export default tuitionService;
