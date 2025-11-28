export type UpdateProduct = {
  id?: number;
  name: string;
  category: number | string;
  sale_price: number;
  unit: number | string;
};

// ⭐ Новый тип для создания товара - полная информация в одном запросе
// Соответствует Postman: POST /api/products/products/
export type CreateProduct = {
  // Основная информация
  name: string;
  description?: string;
  category: number;  // ID категории
  unit: number;  // ID единицы измерения
  // ВАЖНО: sku и barcode НЕ отправляем! Они генерируются автоматически на бэкенде

  // Цены
  cost_price: number;  // Себестоимость (закупочная)
  sale_price: number;  // Цена продажи
  wholesale_price?: number;  // Оптовая цена
  tax_rate?: number;  // НДС % (по умолчанию 0)

  // Количество (первая партия)
  initial_quantity: number;

  // Настройки учёта
  min_quantity?: number;  // Минимальный остаток
  max_quantity?: number;  // Максимальный остаток
  track_inventory?: boolean;  // Вести учёт остатков (по умолчанию true)

  // Партия (первая партия создается автоматически)
  batch_number?: string;  // Номер партии (опционально, генерируется автоматически)
  expiry_date?: string | null;  // Срок годности (формат ISO: YYYY-MM-DD)
  supplier?: number | null;  // ID поставщика (если null, можно использовать supplier_name)

  // Дополнительно
  weight?: number;  // Вес (кг)
  volume?: number;  // Объём (л)
  is_featured?: boolean;  // Популярный товар (по умолчанию false)
};

export type SizeItem = {
  id: number;
  size: string;
  chest?: number;
  waist?: number;
  length?: number;
  selected?: boolean;
  quantity: number | string;
};

export type Size = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SizeItem[];
};

// Batch (Партия товара)
export type Batch = {
  id: number;
  product: number;
  product_name: string;
  batch_number: string;  // Номер партии (генерируется автоматически)
  barcode: string;  // Штрихкод партии (генерируется автоматически)
  quantity: string;  // Остаток
  purchase_price: string;  // Закупочная цена
  supplier?: number | null;  // ID поставщика
  supplier_name?: string;  // Название поставщика
  expiry_date?: string | null;  // Срок годности
  manufacturing_date?: string | null;  // Дата производства
  notes?: string;  // Примечания
  created_at: string;
  updated_at?: string;

  // Legacy поля (для совместимости)
  size?: string | null;
  expiration_date?: string | null;
};

// Создание новой партии
export type CreateBatch = {
  product: number;
  quantity: number;
  purchase_price: number;
  batch_number?: string;  // Опционально, генерируется автоматически
  supplier?: number | null;
  supplier_name?: string;  // Если supplier не указан, используется supplier_name
  expiry_date?: string | null;  // ISO формат: YYYY-MM-DD
  manufacturing_date?: string | null;  // ISO формат: YYYY-MM-DD
  notes?: string;
};

// Обновление партии
export type UpdateBatch = {
  id: number;
  quantity?: number;
  purchase_price?: number;
  supplier?: number | null;
  supplier_name?: string;
  expiry_date?: string | null;
  manufacturing_date?: string | null;
  notes?: string;
};

export type UnitInfo = {
  id: number;
  name: string;
  short_name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
};

// Product Item (реальная структура из API)
// GET /api/products/products/
export type ProductItem = {
  id: number;
  name: string;
  slug: string;
  sku: string;  // Артикул (генерируется автоматически)
  barcode: string;  // Штрихкод (генерируется автоматически, может быть пустым)
  category: number;
  category_name: string;
  unit: number;
  unit_name: string;

  // Цены и маржа (в flat структуре)
  sale_price: string;
  cost_price: string;
  margin: string;  // Процент маржи

  // Остатки (в flat структуре)
  quantity: string;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";

  // Изображения
  main_image: string | null;

  // Статусы
  is_active: boolean;
  is_featured: boolean;

  // Даты
  created_at: string;
  updated_at: string;

  // Опциональные поля (могут быть в детальном запросе)
  description?: string;
  category_path?: string;
  unit_short?: string;
  unit_info?: UnitInfo;
  weight?: number;
  volume?: number;

  // Pricing info (вложенная структура - может быть в детальном запросе)
  pricing?: {
    cost_price: string;
    sale_price: string;
    wholesale_price?: string;
    tax_rate: string;
    margin: string;
    profit: string;
  };

  // Inventory info (вложенная структура - может быть в детальном запросе)
  inventory?: {
    quantity: string;
    min_quantity: string;
    max_quantity?: string;
    track_inventory: boolean;
    is_low_stock: boolean;
    stock_status: string;
  };

  // Batches (партии товара - в детальном запросе)
  batches?: Batch[];

  // Attributes (атрибуты товара - в детальном запросе)
  attributes?: Array<{
    id: number;
    attribute_name: string;
    attribute_type: string;
    value: string;
  }>;

  // Images (изображения товара - в детальном запросе)
  images?: Array<{
    id: number;
    image: string;
    is_main: boolean;
    order: number;
  }>;

  // Legacy fields (для совместимости со старым кодом)
  current_stock?: number;
  count?: number;  // Для корзины
  size?: SizeItem | null;
  image_label?: string | null;
  created_by?: {
    first_name: string;
  };
  is_low_stock?: boolean;
  profit?: string;
};

export type Product = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductItem[];
};

// ===== TOP PRODUCTS TYPES =====

export type TopProduct = {
  product_id: number;
  product_name: string;
  product_sku: string;
  total_revenue: string;
  total_quantity: string;
  total_profit: string;
  sales_count: number;
  percentage: number;
};

export type TopProductsResponse = {
  period: {
    start_date: string;
    end_date: string;
  };
  total_quantity_sold: number;
  top_products: TopProduct[];
  tenant_key: string;
  store_name: string;
  store_slug: string;
};
