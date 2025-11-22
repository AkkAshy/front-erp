import { api } from "@/shared/api/base/client";
import type { BulkCreateCategoryAttributesRequest } from "./types";

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

  // ===== CATEGORY ATTRIBUTES API =====

  // Get all category-attribute bindings
  // GET /api/products/category-attributes/
  getCategoryAttributes: (params?: {
    category?: number;
    attribute?: number;
    is_required?: boolean;
    is_variant?: boolean;
    offset?: number;
    limit?: number;
  }) => api.get("/products/category-attributes/", { params }),

  // Get attributes for specific category with full details
  // GET /api/products/category-attributes/by_category/?category_id={id}
  getCategoryAttributesByCategory: (categoryId: number) =>
    api.get("/products/category-attributes/by_category/", {
      params: { category_id: categoryId },
    }),

  // Create single category-attribute binding
  // POST /api/products/category-attributes/
  createCategoryAttribute: (data: {
    category: number;
    attribute: number;
    is_required?: boolean;
    is_variant?: boolean;
    order?: number;
  }) => api.post("/products/category-attributes/", data),

  // Bulk create category-attribute bindings
  // POST /api/products/category-attributes/bulk_create/
  bulkCreateCategoryAttributes: (data: BulkCreateCategoryAttributesRequest) =>
    api.post("/products/category-attributes/bulk_create/", data),

  // Update category-attribute binding
  // PATCH /api/products/category-attributes/{id}/
  updateCategoryAttribute: (
    id: number,
    data: {
      is_required?: boolean;
      is_variant?: boolean;
      order?: number;
    }
  ) => api.patch(`/products/category-attributes/${id}/`, data),

  // Delete category-attribute binding
  // DELETE /api/products/category-attributes/{id}/
  deleteCategoryAttribute: (id: number) =>
    api.delete(`/products/category-attributes/${id}/`),
};
