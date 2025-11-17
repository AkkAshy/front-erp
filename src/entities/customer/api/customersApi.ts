import { api } from "@/shared/api/base/client";
import type { CreateCustomer, UpdateCustomer } from "./types";

export const customersApi = {
  // ===== CRUD OPERATIONS =====

  // Get all customers
  getAll: () => api.get("/customers/customers/"),

  // Get single customer by ID
  getCustomer: (id: number) => api.get(`/customers/customers/${id}/`),

  // Create customer
  create: (data: CreateCustomer) => api.post("/customers/customers/", data),

  // Update customer
  update: (data: UpdateCustomer) => {
    const { id, ...customerData } = data;
    return api.patch(`/customers/customers/${id}/`, customerData);
  },

  // Delete customer
  delete: (id: number) => api.delete(`/customers/customers/${id}/`),

  // ===== SEARCH & FILTER =====

  // Filter customers with pagination
  getFilteredCustomers: (params: {
    search?: string;
    customer_type?: "individual" | "organization";
    is_vip?: boolean;
    group?: number;
    offset?: number;
    limit?: number;
  }) => api.get("/customers/customers/", { params }),

  // Search by phone
  searchByPhone: (phone: string) =>
    api.get("/customers/customers/search_by_phone/", {
      params: { phone },
    }),

  // ===== STATISTICS & HISTORY =====

  // Get customer purchase history
  getPurchaseHistory: (id: number, params?: {
    offset?: number;
    limit?: number;
  }) => api.get(`/customers/customers/${id}/purchase-history/`, { params }),

  // Get customer statistics
  getStats: (id: number) => api.get(`/customers/customers/${id}/stats/`),

  // Get VIP customers
  getVipCustomers: (params?: {
    offset?: number;
    limit?: number;
  }) => api.get("/customers/customers/vip_list/", { params }),

  // ===== CUSTOMER GROUPS =====

  // Get all customer groups
  getAllGroups: () => api.get("/customers/groups/"),

  // Get filtered groups
  getFilteredGroups: (params: {
    search?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/customers/groups/", { params }),

  // Create customer group
  createGroup: (data: {
    name: string;
    discount_percent?: number;
    description?: string;
  }) => api.post("/customers/groups/", data),

  // Update customer group
  updateGroup: (data: {
    id: number;
    name?: string;
    discount_percent?: number;
    description?: string;
  }) => {
    const { id, ...groupData } = data;
    return api.patch(`/customers/groups/${id}/`, groupData);
  },

  // Delete customer group
  deleteGroup: (id: number) => api.delete(`/customers/groups/${id}/`),
};
