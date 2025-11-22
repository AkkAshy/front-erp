export type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
  parent_name?: string;
  image?: string | null;
  order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  children_count?: number;
  products_count?: number;
};

export type Category = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryItem[];
};

// ===== CATEGORY ATTRIBUTES (Привязка атрибутов к категориям) =====

export type CategoryAttribute = {
  id: number;
  category: number;
  category_name: string;
  attribute: number;
  attribute_name: string;
  attribute_slug: string;
  attribute_type: string;
  is_required: boolean;
  is_variant: boolean;
  order: number;
  created_at: string;
};

export type CategoryAttributesList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryAttribute[];
};

export type CategoryAttributeDetailed = {
  id: number;
  category: number;
  category_name: string;
  attribute: {
    id: number;
    name: string;
    slug: string;
    type: string;
    type_display: string;
    description?: string;
    is_required: boolean;
    is_filterable: boolean;
    order: number;
    is_active: boolean;
    created_at: string;
    values: Array<{
      id: number;
      attribute: number;
      value: string;
      order: number;
      is_active: boolean;
      created_at: string;
    }>;
  };
  is_required: boolean;
  is_variant: boolean;
  order: number;
  created_at: string;
};

export type CategoryAttributesByCategory = {
  status: string;
  data: CategoryAttributeDetailed[];
};

export type BulkCreateCategoryAttributesRequest = {
  category: number;
  attributes: Array<{
    attribute: number;
    is_required: boolean;
    is_variant: boolean;
    order: number;
  }>;
};

export type BulkCreateCategoryAttributesResponse = {
  status: string;
  message: string;
  data?: CategoryAttribute[];
  created?: CategoryAttribute[];
  errors?: Array<{
    attribute: number;
    errors: Record<string, string[]>;
  }>;
};
