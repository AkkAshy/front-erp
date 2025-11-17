// Attribute value type
export type AttributeValue = {
  id: number;
  attribute: number; // Изменено с attribute_type
  value: string;
  order: number; // Изменено с ordering
  is_active?: boolean;
  created_at?: string;
};

export type AttributeType = {
  id: number;
  name: string;
  slug: string;
  type?: string; // text, number, select, multiselect, boolean
  type_display?: string;
  description?: string;
  is_required?: boolean;
  is_filterable?: boolean;
  order?: number;
  is_active?: boolean;
  created_at?: string;
  values?: AttributeValue[];
};

export type AttributeTypeList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttributeType[];
};

export type AttributeValueList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttributeValue[];
};

export type CreateAttributeType = {
  name: string;
  slug?: string;
  type?: string;
  description?: string;
  is_required?: boolean;
  is_filterable?: boolean;
  order?: number;
};

export type CreateAttributeValue = {
  attribute: number; // Изменено с attribute_type
  value: string;
  order?: number; // Изменено с ordering
};

export type UpdateAttributeValue = Partial<CreateAttributeValue> & { id: number };
