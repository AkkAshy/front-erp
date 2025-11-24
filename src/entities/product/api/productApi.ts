import { api } from "@/shared/api/base/client";
import type { CreateProduct, UpdateProduct, CreateBatch, UpdateBatch } from "./types";

export const productApi = {
  // ===== PRODUCTS =====

  // Scan barcode - поиск товара по штрихкоду (новый warehouse scan API)
  scanBarcode: (barcode: string) =>
    api.post(`/products/warehouse-scan/scan/`, { barcode }),

  // Create product - создание товара (полная информация в одном запросе)
  create: (data: CreateProduct) =>
    api.post("/products/products/", data),

  // Update product - обновление товара
  updateProduct: (data: UpdateProduct) =>
    api.patch(`/products/products/${data.id}/`, data),

  // Delete product - удаление товара
  delete: (id: number) => api.delete(`/products/products/${id}/`),

  // Get all products - получить все товары
  getAll: () => api.get("/products/products/"),

  // Filter products - фильтрация товаров
  getFilteredProducts: (params: {
    search?: string;
    category?: number | string;
    unit?: number | string;
    is_active?: boolean;
    is_featured?: boolean;
    offset?: number;
    limit?: number;
  }) => api.get("/products/products/", { params }),

  // Low stock products - товары с низким остатком
  getLowStockProducts: (min_quantity: number = 5) =>
    api.get("/products/products/low_stock/", {
      params: { min_quantity },
    }),

  // Print label - получить данные для печати этикетки
  getPrintLabel: (id: number, quantity: number = 1) =>
    api.get(`/products/products/${id}/print-label/`, {
      params: { quantity },
    }),

  // ===== BATCHES (ПАРТИИ) =====

  // Update batch - обновление партии (PATCH /api/products/batches/{id}/)
  updateBatch: (data: UpdateBatch) =>
    api.patch(`/products/batches/${data.id}/`, data),

  // Add batch - создать новую партию товара (POST /api/products/batches/)
  addBatch: (data: CreateBatch) =>
    api.post("/products/batches/", data),

  // Get all batches - получить все партии
  getAllBatches: (params?: {
    product?: number;
    supplier?: number;
    offset?: number;
    limit?: number;
  }) => api.get("/products/batches/", { params }),

  // Get batch by ID - получить партию по ID
  getBatch: (id: number) =>
    api.get(`/products/batches/${id}/`),

  // ===== UNITS (ЕДИНИЦЫ ИЗМЕРЕНИЯ) =====

  // Get all units - получить все единицы измерения
  getAllUnits: () => api.get("/products/units/"),

  // ===== CATEGORIES (КАТЕГОРИИ) =====

  // Get all categories - получить все категории
  getAllCategories: () => api.get("/products/categories/"),

  // Filter categories
  getFilteredCategories: (params: {
    search?: string;
    parent?: number | string;
    is_active?: boolean;
    offset?: number;
    limit?: number;
  }) => api.get("/products/categories/", { params }),

  // ===== ATTRIBUTES (АТРИБУТЫ) =====

  // Get all attributes
  getAllAttributes: () => api.get("/products/attributes/"),

  // Filter attributes
  getFilteredAttributes: (params: {
    search?: string;
    type?: string;
    is_filterable?: boolean;
    is_active?: boolean;
    offset?: number;
    limit?: number;
  }) => api.get("/products/attributes/", { params }),

  // Get attribute values - получить значения атрибута
  getAttributeValues: (attributeId: number) =>
    api.get(`/products/attributes/${attributeId}/values/`),

  // ===== VARIANTS (ВАРИАНТЫ ТОВАРА) =====

  // Create variant - создать вариант товара
  createVariant: (data: {
    product: number;
    attributes: { attribute: number; value: number }[];
    price_override?: number;  // Цена продажи варианта (опционально, null = использует цену родителя)
  }) => api.post("/products/variants/", data),

  // Get product variants - получить все варианты товара
  getProductVariants: (productId: number) =>
    api.get(`/products/variants/`, { params: { product: productId } }),

  // Get product variants by product ID - получить все варианты конкретного товара
  getVariantsByProduct: (productId: number) =>
    api.get(`/products/variants/by_product/${productId}/`),

  // Delete variant - удалить вариант
  deleteVariant: (id: number) =>
    api.delete(`/products/variants/${id}/`),

  // ===== SUPPLIERS (ПОСТАВЩИКИ) =====

  // Get all suppliers
  getAllSuppliers: () => api.get("/products/suppliers/"),

  // Filter suppliers
  getFilteredSuppliers: (params: {
    search?: string;
    is_active?: boolean;
    offset?: number;
    limit?: number;
  }) => api.get("/products/suppliers/", { params }),

  // ===== LEGACY ENDPOINTS (старые эндпоинты для совместимости) =====

  // Inventory Stats (если существует старый эндпоинт)
  getInventoryStats: () => api.get("/products/stats/"),

  // Size endpoints (старые, возможно нужно удалить или переделать)
  addSize: (data: {
    size: string;
    chest?: number;
    waist?: number;
    length?: number;
  }) => api.post("/inventory/size-info/", data),

  updateSize: (id: number, size: string) =>
    api.patch(`/inventory/size-info/${id}/`, { size }),

  deleteSize: (id: number | string) => api.delete(`/inventory/size-info/${id}/`),

  getAllSizes: () => api.get("/inventory/size-info/"),

  getFilteredSizes: (params: {
    search?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/inventory/size-info/", { params }),

  getAvailableSizes: (params: { name?: string }) =>
    api.get("/inventory/products/sizes_summary/", { params }),

  // ===== WAREHOUSE SCAN =====

  // Add batch via warehouse scan - добавление партии через складской сканер
  warehouseAddBatch: (data: {
    type: "variant" | "product";
    id: number;
    quantity: number;
    purchase_price: number;
    supplier?: number;
    manufacturing_date?: string;
    expiry_date?: string;
  }) => api.post("/products/warehouse-scan/add-batch/", data),
};
