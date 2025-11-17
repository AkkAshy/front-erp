import { api } from "@/shared/api/base/client";

export const unitApi = {
  // Get all units - получить все единицы измерения
  // GET /api/products/units/
  getAll: () => api.get("/products/units/"),

  // Get unit by ID - получить единицу измерения по ID
  // GET /api/products/units/{id}/
  getUnit: (id: number) => api.get(`/products/units/${id}/`),

  // Create unit - создать единицу измерения
  // POST /api/products/units/
  create: (data: {
    name: string;
    short_name: string;
    description?: string;
    is_active?: boolean;
  }) => api.post("/products/units/", data),

  // Update unit - обновить единицу измерения
  // PATCH /api/products/units/{id}/
  update: (id: number, data: {
    name?: string;
    short_name?: string;
    description?: string;
    is_active?: boolean;
  }) => api.patch(`/products/units/${id}/`, data),

  // Delete unit - удалить единицу измерения
  // DELETE /api/products/units/{id}/
  delete: (id: number) => api.delete(`/products/units/${id}/`),
};
