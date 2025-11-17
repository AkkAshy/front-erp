import { api } from "@/shared/api/base/client";
import type { OpenShiftRequest, CloseShiftRequest } from "./shiftTypes";

export const shiftApi = {
  // ===== CASHIER SESSION (КАССОВЫЕ СМЕНЫ) =====

  // Открыть новую смену
  openShift: (data: OpenShiftRequest) =>
    api.post("/sales/sessions/open/", data),

  // Закрыть смену
  closeShift: (shiftId: number, data: CloseShiftRequest) =>
    api.post(`/sales/sessions/${shiftId}/close/`, data),

  // Получить текущую открытую смену
  getCurrentShift: () => api.get("/sales/sessions/current/"),

  // Получить все активные смены
  getActiveShifts: () => api.get("/sales/sessions/active/"),

  // Получить список всех смен
  getAllShifts: (params?: {
    cash_register?: number;
    cashier_name?: string;
    status?: "open" | "closed" | "suspended";
    ordering?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/sessions/", { params }),

  // Получить детали смены
  getShift: (shiftId: number) => api.get(`/sales/sessions/${shiftId}/`),

  // Получить отчет по смене
  getShiftReport: (shiftId: number) => api.get(`/sales/sessions/${shiftId}/report/`),

  // Приостановить смену
  suspendShift: (shiftId: number) =>
    api.post(`/sales/sessions/${shiftId}/suspend/`),

  // Возобновить смену
  resumeShift: (shiftId: number) =>
    api.post(`/sales/sessions/${shiftId}/resume/`),

  // ===== CASH REGISTER (КАССЫ) =====

  // Получить все кассы
  getAllCashRegisters: () => api.get("/sales/cash-registers/"),

  // Получить кассу по ID
  getCashRegister: (id: number) => api.get(`/sales/cash-registers/${id}/`),

  // Получить текущую смену кассы
  getCashRegisterCurrentSession: (id: number) =>
    api.get(`/sales/cash-registers/${id}/current_session/`),

  // Получить все смены кассы
  getCashRegisterSessions: (id: number, params?: {
    status?: "open" | "closed" | "suspended";
    offset?: number;
    limit?: number;
  }) => api.get(`/sales/cash-registers/${id}/sessions/`, { params }),

  // ===== CASH MOVEMENTS (ДВИЖЕНИЕ НАЛИЧНОСТИ) =====

  // Создать движение наличности (внесение/изъятие)
  createCashMovement: (data: {
    session: number;
    movement_type: "cash_in" | "cash_out";
    reason: "collection" | "change" | "float" | "expense" | "correction" | "other";
    amount: number;
    description?: string;
  }) => api.post("/sales/cash-movements/", data),

  // Получить все движения наличности
  getAllCashMovements: (params?: {
    session?: number;
    movement_type?: "cash_in" | "cash_out";
    reason?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/cash-movements/", { params }),
};
