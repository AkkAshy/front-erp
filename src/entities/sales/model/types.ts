// ===== SALE TYPES (Продажи) =====
// Соответствует Postman: POST /api/sales/sales/

export type PaymentMethod = "cash" | "card" | "transfer" | "online" | "credit" | "other";
export type SaleStatus = "pending" | "completed" | "cancelled" | "refunded";

// ===== SIMPLIFIED POS API TYPES (Упрощенный POS) =====

// Scan item request - ИСПРАВЛЕНО согласно Postman
export type ScanItemRequest = {
  session: number;
  product: number;  // ID товара (не barcode!)
  quantity?: number;  // По умолчанию 1
  batch?: number | null;
  cashier?: number;  // ID кассира (ОБЯЗАТЕЛЬНО для общего аккаунта!)
};

// Scan item response - ИСПРАВЛЕНО согласно реальному API
export type ScanItemResponse = {
  status: "success";
  message: string;
  data: Sale;  // Возвращает sale напрямую, не обернутый в { sale: ... }
};

// Current sale response - ИСПРАВЛЕНО согласно реальному API
export type CurrentSaleResponse = {
  status: "success";
  data: Sale | null;  // null если нет pending продажи, иначе Sale напрямую
};

// Add item to sale request
export type AddItemRequest = {
  product: number;
  quantity?: number;  // По умолчанию 1
  batch?: number | null;
};

// Remove item from sale request - ИСПРАВЛЕНО согласно Postman
export type RemoveItemRequest = {
  item_id: number;  // ID позиции в продаже (не product!)
};

// Checkout request - ИСПРАВЛЕНО согласно Postman
export type CheckoutRequest = {
  payments: Array<{
    payment_method: "cash" | "card" | "transfer";  // payment_method, не method!
    amount: number;
    received_amount?: number;
  }>;
  // Customer integration
  customer_id?: number;  // ID существующего покупателя
  new_customer?: NewCustomerData;  // Создать нового покупателя
  customer_name?: string;  // Разовый покупатель
  customer_phone?: string;
  // Cashier integration
  cashier_id?: number;  // ID кассира выполняющего продажу
};

// New customer data for creating customer during sale
export type NewCustomerData = {
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  customer_type?: "individual" | "organization";
  organization_name?: string;
  inn?: string;
};

// Checkout response
export type CheckoutResponse = {
  status: "success";
  message: string;
  data: {
    sale: Sale;  // Завершенная продажа со статусом "completed"
    receipt_number: string;
    total_amount: number;
    change_amount?: number;  // Сдача (если наличными)
  };
};

// Item продажи
export type SaleItem = {
  product: number;  // ID товара
  quantity: number;
  unit_price: number;  // Цена за единицу
  batch?: number | null;  // ID партии (опционально)
  discount_amount?: number;  // Скидка на позицию
  tax_rate?: number;  // НДС % на позицию
};

// Платеж
export type SalePayment = {
  payment_method: PaymentMethod;
  amount: number;  // Сумма платежа
  received_amount?: number;  // Полученная сумма (для наличных)
  card_last4?: string;  // Последние 4 цифры карты
  transaction_id?: string;  // ID транзакции
  notes?: string;  // Примечания
};

// ⚠️ ВАЖНО: Создание продажи происходит в несколько шагов!
//
// ПРАВИЛЬНЫЙ СПОСОБ создания продажи (4 шага):
// 1. POST /api/sales/sales/ - создать пустую продажу (без items и payments)
// 2. POST /api/sales/sale-items/ - добавить товары (каждый товар отдельно или несколько)
// 3. POST /api/sales/payments/ - добавить платежи
// 4. POST /api/sales/sales/{id}/complete/ - завершить продажу и списать товар
//
// Структура для Step 1 (создание пустой продажи):
export type CreateSale = {
  session: number;  // ID текущей кассовой сессии
  receipt_number?: string;  // Номер чека (опционально, генерируется автоматически)

  // ===== CUSTOMER INTEGRATION (Интеграция с покупателями) =====
  // Вариант 1: Привязать к существующему покупателю
  customer_id?: number;  // ID существующего покупателя

  // Вариант 2: Создать нового покупателя при продаже
  new_customer?: NewCustomerData;

  // Вариант 3: Разовый покупатель (не сохраняется в базе)
  customer_name?: string;  // Имя клиента
  customer_phone?: string;  // Телефон клиента
  // ============================================================

  discount_percent?: number;  // Процент скидки
  notes?: string;  // Примечания к продаже
  // НЕ ОТПРАВЛЯЕМ items и payments здесь - они добавляются отдельно!
};

// Структура для Step 2 (добавление товара в продажу):
export type CreateSaleItem = {
  sale: number;  // ID созданной продажи из Step 1
  product: number;  // ID товара
  quantity: number;
  unit_price: number;  // Цена за единицу
  batch?: number | null;  // ID партии (опционально)
  discount_amount?: number;  // Скидка на позицию
  tax_rate?: number;  // НДС % на позицию
};

// Структура для Step 3 (добавление платежа):
export type CreateSalePayment = {
  sale: number;  // ID созданной продажи из Step 1
  session: number;  // ID текущей кассовой сессии
  payment_method: PaymentMethod;
  amount: number;  // Сумма платежа
  received_amount?: number;  // Полученная сумма (для наличных)
  card_last4?: string;  // Последние 4 цифры карты
  transaction_id?: string;  // ID транзакции
  notes?: string;  // Примечания
};

// Customer info in sale response
export type SaleCustomerInfo = {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  is_vip: boolean;
  default_discount: number;
};

// Продажа (ответ от API)
export type Sale = {
  id: number;
  session: number;
  receipt_number: string;
  status: SaleStatus;

  // ===== CUSTOMER INFORMATION (Информация о покупателе) =====
  customer?: number | null;  // ID покупателя (если привязан)
  customer_info?: SaleCustomerInfo | null;  // Полная информация о покупателе
  customer_name?: string;  // Имя покупателя (для разовых или legacy)
  customer_phone?: string;  // Телефон покупателя (для разовых или legacy)
  // ==========================================================

  subtotal: string;  // Сумма без учёта скидок
  discount_amount: string;  // Общая скидка
  discount_percent?: number;  // Процент скидки
  tax_amount: string;  // Общий НДС
  total_amount: string;  // Итоговая сумма
  items: Array<{
    id: number;
    product: number;
    product_name: string;
    batch?: number;
    quantity: string;
    unit_price: string;
    discount_amount: string;
    tax_rate: string;
    tax_amount: string;
    total: string;
  }>;
  payments: Array<{
    id: number;
    payment_method: PaymentMethod;
    amount: string;
    received_amount?: string;
    change_amount?: string;
    card_last4?: string;
    transaction_id?: string;
  }>;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_name: string;
};

// Список продаж
export type SalesList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sale[];
};

// Legacy types (для совместимости со старым кодом)
export type PaymentPart = {
  method: "cash" | "card" | "transfer";
  amount: number;
};

type ParsedDetails = {
  total_amount: string;
  payment_method: string;
  cashier: string;
  customer: string;
  items: Array<{
    product: string;
    quantity: number;
    price: string;
  }>;
};

// Legacy type - старая структура транзакций
export type Transaction = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: number;
    session: number;
    session_info: string;
    cashier_name: string;
    receipt_number: string;
    status: SaleStatus;
    status_display: string;
    customer: number | null;
    customer_info: any | null;
    customer_name: string;
    customer_phone: string;
    subtotal: string;
    discount_amount: string;
    discount_percent: string;
    tax_amount: string;
    total_amount: string;
    items_count: number;
    total_quantity: string;
    notes: string;
    created_at: string;
    completed_at: string | null;
    // Legacy fields для обратной совместимости
    transaction?: number;
    action?: string;
    parsed_details?: ParsedDetails;
  }>;
};
