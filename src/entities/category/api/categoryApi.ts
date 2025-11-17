import { api } from "@/shared/api/base/client";

export const categoryApi = {
  // Get all categories - получить все категории
  // GET /api/products/categories/
  getAll: () => api.get("/products/categories/"),

  // Filter categories - фильтрация категорий
  // GET /api/products/categories/?offset=0&limit=10
  getFilteredCategories: (params?: {
    offset?: number;
    limit?: number;
    search?: string;
    parent?: number;
    is_active?: boolean;
  }) => api.get("/products/categories/", { params }),

  // Get category by ID - получить категорию по ID
  // GET /api/products/categories/{id}/
  getCategory: (id: number) => api.get(`/products/categories/${id}/`),

  // Create category - создать категорию
  // POST /api/products/categories/
  create: (data: {
    name: string;
    description?: string;
    parent?: number | null;
    order?: number;
    is_active?: boolean;
  }) => api.post("/products/categories/", data),

  // Update category - обновить категорию
  // PATCH /api/products/categories/{id}/
  update: (id: number, data: {
    name?: string;
    description?: string;
    parent?: number | null;
    order?: number;
    is_active?: boolean;
  }) => api.patch(`/products/categories/${id}/`, data),

  // Delete category - удалить категорию
  // DELETE /api/products/categories/{id}/
  deleteCategory: (id: number) =>
    api.delete(`/products/categories/${id}/`),
};
