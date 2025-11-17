import { api } from "@/shared/api/base/client";
import type {
  CreateAttributeType,
  CreateAttributeValue,
} from "./types";

export const attributeApi = {
  // Attributes (ранее назывались Types)
  getAllTypes: (params?: { offset?: number; limit?: number }) =>
    api.get("/products/attributes/", { params }),

  createType: (data: CreateAttributeType) =>
    api.post("/products/attributes/", data),

  updateType: (id: number, data: Partial<CreateAttributeType>) =>
    api.patch(`/products/attributes/${id}/`, data),

  deleteType: (id: number) =>
    api.delete(`/products/attributes/${id}/`),

  // Attribute Values
  getAllValues: (params?: { offset?: number; limit?: number; attribute?: number }) =>
    api.get("/products/attribute-values/", { params }),

  createValue: (data: CreateAttributeValue) =>
    api.post("/products/attribute-values/", data),

  updateValue: (id: number, data: Partial<CreateAttributeValue>) =>
    api.patch(`/products/attribute-values/${id}/`, data),

  deleteValue: (id: number) =>
    api.delete(`/products/attribute-values/${id}/`),
};
