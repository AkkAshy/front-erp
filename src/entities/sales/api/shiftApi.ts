import { api } from "@/shared/api/base/client";
import type { OpenShiftRequest, CloseShiftRequest, OwnerWithdrawRequest, MovementType, MovementReason } from "./shiftTypes";

export const shiftApi = {
  // ===== CASHIER SESSION (КАССОВЫЕ СМЕНЫ) =====
  // Новый базовый путь: /api/sales/cashier-sessions/

  // Открыть новую смену (всегда с балансом 100 000 сум по умолчанию)
  openShift: (data?: OpenShiftRequest) =>
    api.post("/sales/cashier-sessions/open/", data || {}),

  // Закрыть смену (только владелец/менеджер, вводим shortage - недостачу)
  closeShift: (shiftId: number, data: CloseShiftRequest) =>
    api.post(`/sales/cashier-sessions/${shiftId}/close/`, data),

  // Получить текущую открытую смену
  getCurrentShift: () => api.get("/sales/cashier-sessions/current/"),

  // Получить список всех смен
  getAllShifts: (params?: {
    status?: "open" | "closed" | "suspended";
    ordering?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/cashier-sessions/", { params }),

  // Получить детали смены
  getShift: (shiftId: number) => api.get(`/sales/cashier-sessions/${shiftId}/`),

  // Получить отчет по смене
  getShiftReport: (shiftId: number) => api.get(`/sales/cashier-sessions/${shiftId}/report/`),

  // Приостановить смену
  suspendShift: (shiftId: number) =>
    api.post(`/sales/cashier-sessions/${shiftId}/suspend/`),

  // Возобновить смену
  resumeShift: (shiftId: number) =>
    api.post(`/sales/cashier-sessions/${shiftId}/resume/`),

  // Статистика кассиров
  getCashierStats: (params?: {
    date_from?: string;
    date_to?: string;
    limit?: number;
  }) => api.get("/sales/cashier-sessions/cashier-stats/", { params }),

  // ===== CASH REGISTER (КАССЫ) =====

  // Получить все кассы
  getAllCashRegisters: () => api.get("/sales/cash-registers/"),

  // Получить кассу по ID
  getCashRegister: (id: number) => api.get(`/sales/cash-registers/${id}/`),

  // ===== CASH MOVEMENTS (ДВИЖЕНИЕ НАЛИЧНОСТИ) =====

  // Изъятие денег владельцем (с ограничением - минимум 100 000 должно остаться)
  ownerWithdraw: (data: OwnerWithdrawRequest) =>
    api.post("/sales/cash-movements/owner-withdraw/", data),

  // Создать движение наличности (внесение/изъятие)
  createCashMovement: (data: {
    session: number;
    movement_type: MovementType;
    reason: MovementReason;
    amount: number;
    description?: string;
  }) => api.post("/sales/cash-movements/", data),

  // Получить все движения наличности
  getAllCashMovements: (params?: {
    session?: number;
    movement_type?: MovementType;
    reason?: MovementReason;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/cash-movements/", { params }),
};
