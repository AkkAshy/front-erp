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
