# API Comparison - Postman vs Frontend

## 🔍 Анализ нового Postman файла

Сравнение реального API (из Postman) с текущей реализацией на фронтенде.

---

## ⚠️ КРИТИЧЕСКИЕ ОТЛИЧИЯ

### 1. **Scan Item API - РАЗНЫЕ СТРУКТУРЫ!**

#### В Postman (РЕАЛЬНЫЙ API):
```http
POST /api/sales/sales/scan-item/
```

**Request:**
```json
{
  "session": 1,
  "product": 18,
  "quantity": 2,
  "batch": null
}
```

**⚠️ НЕТ поля `barcode`!** Используется `product` (ID товара)!

#### В нашем фронтенде (НЕПРАВИЛЬНО):
```typescript
// src/entities/sales/api/salesApi.ts
scanItem: (data: { barcode: string; session: number; quantity?: number })
```

**❌ ПРОБЛЕМА:** Мы отправляем `barcode`, но API ожидает `product` (ID)!

---

### 2. **Remove Item API - РАЗНАЯ СТРУКТУРА!**

#### В Postman (РЕАЛЬНЫЙ API):
```http
DELETE /api/sales/sales/:sale_id/remove-item/
```

**Request:**
```json
{
  "item_id": 1
}
```

**⚠️ Используется `item_id` (ID позиции в продаже), а не `product`!**

#### В нашем фронтенде (НЕПРАВИЛЬНО):
```typescript
removeItemFromSale: (saleId: number, data: { product: number })
```

**❌ ПРОБЛЕМА:** Мы отправляем `product`, но API ожидает `item_id`!

---

### 3. **Checkout API - РАЗНАЯ СТРУКТУРА ПЛАТЕЖЕЙ!**

#### В Postman (РЕАЛЬНЫЙ API):
```json
{
  "payments": [
    {
      "payment_method": "cash",
      "amount": 150000,
      "received_amount": 200000
    }
  ]
}
```

**⚠️ Используется `payment_method`, а не `method`!**

#### В нашем фронтенде (НЕПРАВИЛЬНО):
```typescript
checkout: (saleId: number, data: {
  payments: Array<{
    method: "cash" | "card" | "transfer";  // ❌ Должно быть payment_method
    amount: number;
  }>;
})
```

---

### 4. **Product API - ДРУГАЯ СТРУКТУРА СОЗДАНИЯ!**

#### В Postman (РЕАЛЬНЫЙ API):
```json
{
  "name": "iPhone 14 Pro",
  "sku": "IPHONE-14-PRO",
  "barcode": "1234567890123",
  "description": "Latest iPhone model",
  "cost_price": 50000,
  "sale_price": 75000,
  "wholesale_price": 65000,
  "tax_rate": 12,
  "unit": "pcs"
}
```

**⚠️ Новые поля:**
- `wholesale_price` - оптовая цена
- `tax_rate` - ставка налога
- `unit` - строка, не ID! (например: "pcs", "kg")

#### В нашем фронтенде:
```typescript
// Используем category (ID), unit (ID)
// НЕТ wholesale_price, tax_rate
```

---

## 📊 Полное сравнение endpoints

### Authentication ✅
| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| POST /api/users/auth/register/ | ✅ | ✅ | ✅ OK |
| POST /api/users/auth/login/ | ✅ | ✅ | ✅ OK |
| GET /api/users/profile/ | ✅ | ✅ | ✅ OK |

---

### Products ⚠️
| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /api/products/products/ | ✅ | ✅ | ✅ OK |
| POST /api/products/products/ | ✅ unit: "pcs" | ✅ unit: 3 | ⚠️ РАЗНИЦА |
| GET /api/products/products/:id/ | ✅ | ✅ | ✅ OK |
| GET /api/products/products/low-stock/ | ✅ | ✅ | ✅ OK |

**Проблема:** В Postman `unit` - строка ("pcs"), у нас ID (3)

---

### Sales (Cashier) ❌
| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| POST /api/sales/sessions/open/ | ✅ | ✅ | ✅ OK |
| GET /api/sales/sessions/current/ | ✅ | ✅ | ✅ OK |
| POST /api/sales/sessions/:id/close/ | ✅ | ✅ | ✅ OK |
| **POST /api/sales/sales/scan-item/** | ✅ product: 18 | ❌ barcode: "123" | ❌ НЕПРАВИЛЬНО |
| GET /api/sales/sales/current/?session=1 | ✅ | ✅ | ✅ OK |
| POST /api/sales/sales/:id/add-item/ | ✅ | ✅ | ✅ OK |
| **DELETE /api/sales/sales/:id/remove-item/** | ✅ item_id: 1 | ❌ product: 18 | ❌ НЕПРАВИЛЬНО |
| **POST /api/sales/sales/:id/checkout/** | ✅ payment_method | ❌ method | ❌ НЕПРАВИЛЬНО |
| GET /api/sales/sales/ | ✅ | ✅ | ✅ OK |
| GET /api/sales/sales/today/ | ✅ | ✅ | ✅ OK |

---

### Analytics ❌
| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /api/analytics/daily-sales/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/daily-sales/today/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/daily-sales/period/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/daily-sales/trends/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/product-performance/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/product-performance/top-products/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/product-performance/slow-movers/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/customer-analytics/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/customer-analytics/segments/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/customer-analytics/at-risk/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/inventory-snapshots/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/inventory-snapshots/latest/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/inventory-snapshots/low-stock-alerts/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/analytics/inventory-snapshots/out-of-stock/ | ✅ | ❌ | ❌ НЕТ |

**⚠️ Весь раздел Analytics отсутствует на фронтенде!**

---

### Tasks ❌
| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /api/tasks/tasks/ | ✅ | ❌ | ❌ НЕТ |
| POST /api/tasks/tasks/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/tasks/tasks/:id/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/tasks/tasks/my-tasks/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/tasks/tasks/today/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/tasks/tasks/overdue/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/tasks/tasks/stats/ | ✅ | ❌ | ❌ НЕТ |
| POST /api/tasks/tasks/:id/start/ | ✅ | ❌ | ❌ НЕТ |
| POST /api/tasks/tasks/:id/complete/ | ✅ | ❌ | ❌ НЕТ |
| POST /api/tasks/comments/ | ✅ | ❌ | ❌ НЕТ |
| GET /api/tasks/templates/ | ✅ | ❌ | ❌ НЕТ |

**⚠️ Весь раздел Tasks отсутствует на фронтенде!**

---

### Customers ⚠️
| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /api/customers/customers/ | ✅ | ✅ | ✅ OK |
| POST /api/customers/customers/ | ✅ | ⚠️ | ⚠️ Нужно проверить |

---

## 🔧 НЕОБХОДИМЫЕ ИСПРАВЛЕНИЯ

### ПРИОРИТЕТ 1 (КРИТИЧНО) 🚨

#### 1. Исправить Scan Item API
**Файл:** `src/entities/sales/api/salesApi.ts`

**Было:**
```typescript
scanItem: (data: { barcode: string; session: number; quantity?: number }) =>
  api.post("/sales/scan-item/", data),
```

**Должно быть:**
```typescript
scanItem: (data: {
  session: number;
  product: number;  // ID товара, не barcode!
  quantity?: number;
  batch?: number | null;
}) => api.post("/sales/sales/scan-item/", data),
```

#### 2. Исправить Remove Item API
**Файл:** `src/entities/sales/api/salesApi.ts`

**Было:**
```typescript
removeItemFromSale: (saleId: number, data: { product: number }) =>
  api.delete(`/sales/${saleId}/remove-item/`, { data }),
```

**Должно быть:**
```typescript
removeItemFromSale: (saleId: number, data: { item_id: number }) =>
  api.delete(`/sales/sales/${saleId}/remove-item/`, { data }),
```

#### 3. Исправить Checkout API
**Файл:** `src/entities/sales/api/salesApi.ts`

**Было:**
```typescript
checkout: (saleId: number, data: {
  payments: Array<{
    method: "cash" | "card" | "transfer";
    amount: number;
  }>;
})
```

**Должно быть:**
```typescript
checkout: (saleId: number, data: {
  payments: Array<{
    payment_method: "cash" | "card" | "transfer";
    amount: number;
    received_amount?: number;
  }>;
})
```

#### 4. Обновить типы
**Файл:** `src/entities/sales/model/types.ts`

**Добавить:**
```typescript
export type ScanItemRequest = {
  session: number;
  product: number;  // ID товара
  quantity?: number;
  batch?: number | null;
};

export type RemoveItemRequest = {
  item_id: number;  // ID позиции, не product!
};

export type CheckoutRequest = {
  payments: Array<{
    payment_method: "cash" | "card" | "transfer";
    amount: number;
    received_amount?: number;
  }>;
};
```

---

### ПРИОРИТЕТ 2 (ВАЖНО) ⚠️

#### 5. Добавить Analytics API
**Создать:** `src/entities/analytics/api/analyticsApi.ts`

```typescript
export const analyticsApi = {
  // Daily Sales
  getDailySales: () => api.get("/analytics/daily-sales/"),
  getTodayReport: () => api.get("/analytics/daily-sales/today/"),
  getPeriodReport: (start_date: string, end_date: string) =>
    api.get("/analytics/daily-sales/period/", { params: { start_date, end_date } }),
  getSalesTrends: (days: number = 30) =>
    api.get("/analytics/daily-sales/trends/", { params: { days } }),

  // Product Performance
  getProductPerformance: () => api.get("/analytics/product-performance/"),
  getTopProducts: (limit: number = 10, order_by: string = "revenue") =>
    api.get("/analytics/product-performance/top-products/", { params: { limit, order_by } }),
  getSlowMovers: (days: number = 30) =>
    api.get("/analytics/product-performance/slow-movers/", { params: { days } }),

  // Customer Analytics
  getCustomerAnalytics: () => api.get("/analytics/customer-analytics/"),
  getCustomerSegments: () => api.get("/analytics/customer-analytics/segments/"),
  getAtRiskCustomers: () => api.get("/analytics/customer-analytics/at-risk/"),

  // Inventory
  getInventorySnapshots: () => api.get("/analytics/inventory-snapshots/"),
  getLatestInventory: () => api.get("/analytics/inventory-snapshots/latest/"),
  getLowStockAlerts: () => api.get("/analytics/inventory-snapshots/low-stock-alerts/"),
  getOutOfStock: () => api.get("/analytics/inventory-snapshots/out-of-stock/"),
};
```

#### 6. Добавить Tasks API
**Создать:** `src/entities/tasks/api/tasksApi.ts`

```typescript
export const tasksApi = {
  // Tasks CRUD
  getTasks: () => api.get("/tasks/tasks/"),
  createTask: (data: CreateTask) => api.post("/tasks/tasks/", data),
  getTask: (id: number) => api.get(`/tasks/tasks/${id}/`),

  // Task filters
  getMyTasks: () => api.get("/tasks/tasks/my-tasks/"),
  getTodayTasks: () => api.get("/tasks/tasks/today/"),
  getOverdueTasks: () => api.get("/tasks/tasks/overdue/"),
  getTaskStats: () => api.get("/tasks/tasks/stats/"),

  // Task actions
  startTask: (id: number) => api.post(`/tasks/tasks/${id}/start/`),
  completeTask: (id: number) => api.post(`/tasks/tasks/${id}/complete/`),

  // Comments
  addComment: (data: { task: number; comment: string }) =>
    api.post("/tasks/comments/", data),

  // Templates
  getTemplates: () => api.get("/tasks/templates/"),
};
```

---

### ПРИОРИТЕТ 3 (УЛУЧШЕНИЯ) 💡

#### 7. Обновить Product API
**Добавить поля:**
- `wholesale_price` - оптовая цена
- `tax_rate` - ставка налога

#### 8. Проверить Customers API
Убедиться что структура создания клиента соответствует Postman.

---

## 📋 Детальный план исправлений

### Шаг 1: Исправить критические ошибки POS
1. ✅ Обновить `scanItem()` - использовать `product` вместо `barcode`
2. ✅ Обновить `removeItemFromSale()` - использовать `item_id`
3. ✅ Обновить `checkout()` - использовать `payment_method`
4. ✅ Обновить типы в `types.ts`

### Шаг 2: Обновить компонент Home
1. ✅ Изменить логику сканирования - нужно сначала найти товар по barcode, потом отправить ID
2. ✅ Обновить логику удаления - использовать `item.id` вместо `item.product`

### Шаг 3: Добавить Analytics
1. ✅ Создать `src/entities/analytics/api/analyticsApi.ts`
2. ✅ Создать типы для Analytics
3. ✅ Создать хуки для Analytics
4. ✅ Создать страницу Analytics (если нужно)

### Шаг 4: Добавить Tasks
1. ✅ Создать `src/entities/tasks/api/tasksApi.ts`
2. ✅ Создать типы для Tasks
3. ✅ Создать хуки для Tasks
4. ✅ Создать страницу Tasks (если нужно)

---

## 🎯 Выводы

### ❌ Текущие проблемы:

1. **Scan Item API неправильный** - используем `barcode`, но API ожидает `product` (ID)
2. **Remove Item API неправильный** - используем `product`, но API ожидает `item_id`
3. **Checkout API неправильный** - используем `method`, но API ожидает `payment_method`
4. **Отсутствует весь раздел Analytics** (14 endpoints)
5. **Отсутствует весь раздел Tasks** (11 endpoints)

### ✅ Что работает:

1. Authentication (Login, Register, Profile)
2. Products (List, Create, Get by ID, Low Stock)
3. Sessions (Open, Get Current, Close)
4. Get Current Sale
5. Add Item to Sale
6. List Sales
7. Today Sales

---

## 🚀 Следующие шаги

1. **СРОЧНО:** Исправить POS API (scan, remove, checkout)
2. **ВАЖНО:** Добавить Analytics API
3. **ВАЖНО:** Добавить Tasks API
4. **ОПЦИОНАЛЬНО:** Обновить Product API (wholesale_price, tax_rate)

---

_Создано: 2025-01-17_
_На основе: ERP_v2_Full.postman_collection.json_
