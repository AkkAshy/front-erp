# API Frontend Адаптация Завершена! ✅

## 📋 Что сделано

Фронтенд полностью настроен под Postman API коллекцию (`ERP_API.postman_collection.json`)

### 1. ✅ Products API

**Файлы:**
- `src/entities/product/api/types.ts` - обновлены типы
- `src/entities/product/api/productApi.ts` - все эндпоинты

**Обновленные типы:**
```typescript
// Создание товара (в одном запросе)
CreateProduct {
  name, description, category, unit
  cost_price, sale_price, wholesale_price, tax_rate
  initial_quantity, min_quantity, max_quantity, track_inventory
  batch_number, expiry_date, supplier
  weight, volume, is_featured
}

// Партии товаров
CreateBatch {
  product, quantity, purchase_price
  batch_number, supplier, supplier_name
  expiry_date, manufacturing_date, notes
}
```

**Эндпоинты:**
- ✅ GET `/api/products/products/` - получить все товары
- ✅ POST `/api/products/products/` - создать товар
- ✅ GET `/api/products/products/{id}/` - получить товар
- ✅ PATCH `/api/products/products/{id}/` - обновить товар
- ✅ DELETE `/api/products/products/{id}/` - удалить товар
- ✅ GET `/api/products/products/scan_barcode/?barcode=` - сканировать штрихкод
- ✅ GET `/api/products/products/low_stock/` - товары с низким остатком

**Batches (партии):**
- ✅ POST `/api/products/batches/` - создать партию
- ✅ PATCH `/api/products/batches/{id}/` - обновить партию
- ✅ GET `/api/products/batches/` - получить все партии
- ✅ GET `/api/products/batches/{id}/` - получить партию

---

### 2. ✅ Categories API

**Файл:** `src/entities/category/api/categoryApi.ts`

**Эндпоинты:**
- ✅ GET `/api/products/categories/` - получить все категории
- ✅ GET `/api/products/categories/{id}/` - получить категорию
- ✅ POST `/api/products/categories/` - создать категорию
- ✅ PATCH `/api/products/categories/{id}/` - обновить категорию
- ✅ DELETE `/api/products/categories/{id}/` - удалить категорию

**Поля:**
```typescript
{
  name, description, parent, order, is_active
}
```

---

### 3. ✅ Units API

**Файл:** `src/entities/unit/api/unitApi.ts`

**Эндпоинты:**
- ✅ GET `/api/products/units/` - получить все единицы
- ✅ GET `/api/products/units/{id}/` - получить единицу
- ✅ POST `/api/products/units/` - создать единицу
- ✅ PATCH `/api/products/units/{id}/` - обновить единицу
- ✅ DELETE `/api/products/units/{id}/` - удалить единицу

**Поля:**
```typescript
{
  name, short_name, description, is_active
}
```

---

### 4. ✅ Sales API

**Файлы:**
- `src/entities/sales/model/types.ts` - обновлены типы
- `src/entities/sales/api/salesApi.ts` - эндпоинты

**Новые типы:**
```typescript
// Создание продажи
CreateSale {
  session: number              // ID кассовой сессии
  receipt_number?: string      // Номер чека (авто)
  customer_name?: string
  customer_phone?: string
  items: SaleItem[]           // Товары
  payments: SalePayment[]     // Оплаты
  notes?: string
}

// Товар в продаже
SaleItem {
  product: number
  quantity: number
  unit_price: number
  batch?: number
  discount_amount?: number
  tax_rate?: number
}

// Платеж
SalePayment {
  payment_method: "cash" | "card" | "transfer" | ...
  amount: number
  received_amount?: number    // Для наличных
  card_last4?: string
  transaction_id?: string
  notes?: string
}
```

**Эндпоинты:**
- ✅ GET `/api/sales/sales/` - получить все продажи
- ✅ POST `/api/sales/sales/` - создать продажу
- ✅ GET `/api/sales/sales/{id}/` - получить продажу
- ✅ POST `/api/sales/sales/{id}/complete/` - завершить продажу
- ✅ POST `/api/sales/sales/{id}/cancel/` - отменить продажу
- ✅ POST `/api/sales/sales/{id}/refund/` - возврат
- ✅ GET `/api/sales/sales/today/` - продажи за сегодня

---

### 5. ✅ Cashier Sessions API

**Файл:** `src/entities/sales/api/shiftApi.ts`

**Эндпоинты:**
- ✅ POST `/api/sales/sessions/open/` - открыть смену
- ✅ POST `/api/sales/sessions/{id}/close/` - закрыть смену
- ✅ GET `/api/sales/sessions/current/` - текущая смена
- ✅ GET `/api/sales/sessions/active/` - активные смены
- ✅ GET `/api/sales/sessions/` - все смены
- ✅ GET `/api/sales/sessions/{id}/report/` - отчет по смене
- ✅ POST `/api/sales/sessions/{id}/suspend/` - приостановить смену
- ✅ POST `/api/sales/sessions/{id}/resume/` - возобновить смену

**Cash Registers:**
- ✅ GET `/api/sales/cash-registers/` - все кассы
- ✅ GET `/api/sales/cash-registers/{id}/current_session/` - текущая смена кассы
- ✅ GET `/api/sales/cash-registers/{id}/sessions/` - смены кассы

**Cash Movements:**
- ✅ POST `/api/sales/cash-movements/` - создать движение наличности
- ✅ GET `/api/sales/cash-movements/` - получить движения

---

### 6. ✅ Attributes API

**Файл:** `src/entities/attribute/api/attributeApi.ts`

**Эндпоинты:**
- ✅ GET `/api/products/attributes/` - все атрибуты
- ✅ POST `/api/products/attributes/` - создать атрибут
- ✅ PATCH `/api/products/attributes/{id}/` - обновить атрибут
- ✅ DELETE `/api/products/attributes/{id}/` - удалить атрибут
- ✅ GET `/api/products/attribute-values/` - все значения
- ✅ POST `/api/products/attribute-values/` - создать значение
- ✅ PATCH `/api/products/attribute-values/{id}/` - обновить значение
- ✅ DELETE `/api/products/attribute-values/{id}/` - удалить значение

---

### 7. ✅ Users API

**Файл:** `src/entities/cashier/api/usersApi.ts`

**Эндпоинты:**
- ✅ GET `/api/users/users/` - все пользователи
- ✅ GET `/api/users/profile/` - профиль текущего пользователя
- ✅ POST `/api/users/users/` - создать пользователя
- ✅ PATCH `/api/users/users/{id}/` - обновить пользователя

---

## 🔑 Ключевые особенности

### Автоматическая генерация
На бэкенде **автоматически** генерируются:
- ✅ SKU (артикул товара)
- ✅ Barcode (штрихкод товара)
- ✅ Batch Number (номер партии)
- ✅ Batch Barcode (штрихкод партии)
- ✅ Receipt Number (номер чека)

**Не отправляйте эти поля в запросах!**

### Multi-tenant автоматически
- ✅ `X-Tenant-Key` добавляется автоматически ко всем запросам
- ✅ Настроено в `src/shared/api/auth/authInterceptor.ts`
- ✅ `tenant_key` сохраняется после логина/регистрации

### Единая структура создания товара
```typescript
// ❌ Старый способ (2 запроса)
1. POST /products/products/ - создать товар
2. POST /products/batches/ - создать партию

// ✅ Новый способ (1 запрос)
POST /products/products/ {
  name, category, unit,
  cost_price, sale_price,
  initial_quantity,  // Первая партия создается автоматически!
  batch_number, expiry_date, supplier
}
```

### Единая структура продажи
```typescript
// Все в одном запросе
POST /api/sales/sales/ {
  session: 1,
  customer_name: "Иван",
  items: [
    { product: 5, quantity: 2, unit_price: 75000 }
  ],
  payments: [
    { payment_method: "cash", amount: 150000, received_amount: 200000 }
  ]
}

// Бэкенд автоматически:
// - Создаст продажу
// - Создаст позиции (sale items)
// - Создаст платежи (payments)
// - Рассчитает сдачу
// - Обновит остатки товаров
// - Сгенерирует номер чека
```

---

## 📊 Сравнение с Postman

### Products

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /products/products/ | ✅ | ✅ | ✅ |
| POST /products/products/ | ✅ | ✅ | ✅ |
| GET /products/products/{id}/ | ✅ | ✅ | ✅ |
| PATCH /products/products/{id}/ | ✅ | ✅ | ✅ |
| DELETE /products/products/{id}/ | ✅ | ✅ | ✅ |
| GET /products/products/scan_barcode/ | ✅ | ✅ | ✅ |
| GET /products/products/low_stock/ | ✅ | ✅ | ✅ |

### Batches

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| POST /products/batches/ | ✅ | ✅ | ✅ |
| PATCH /products/batches/{id}/ | ✅ | ✅ | ✅ |
| GET /products/batches/ | ❌ | ✅ | ➕ |
| GET /products/batches/{id}/ | ❌ | ✅ | ➕ |

### Categories

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /products/categories/ | ✅ | ✅ | ✅ |
| POST /products/categories/ | ✅ | ✅ | ✅ |
| PATCH /products/categories/{id}/ | ✅ | ✅ | ✅ |

### Units

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /products/units/ | ✅ | ✅ | ✅ |
| POST /products/units/ | ✅ | ✅ | ✅ |

### Sales

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| GET /sales/sales/ | ✅ | ✅ | ✅ |
| POST /sales/sales/ | ✅ | ✅ | ✅ |
| GET /sales/sales/{id}/ | ✅ | ✅ | ✅ |
| POST /sales/sales/{id}/complete/ | ✅ | ✅ | ✅ |
| POST /sales/sales/{id}/cancel/ | ✅ | ✅ | ✅ |
| POST /sales/sales/{id}/refund/ | ✅ | ✅ | ✅ |
| GET /sales/sales/today/ | ✅ | ✅ | ✅ |

### Sessions

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| POST /sales/sessions/open/ | ✅ | ✅ | ✅ |
| POST /sales/sessions/{id}/close/ | ✅ | ✅ | ✅ |
| GET /sales/sessions/current/ | ✅ | ✅ | ✅ |
| GET /sales/sessions/active/ | ✅ | ✅ | ✅ |
| GET /sales/sessions/ | ✅ | ✅ | ✅ |
| GET /sales/sessions/{id}/report/ | ✅ | ✅ | ✅ |
| POST /sales/sessions/{id}/suspend/ | ✅ | ✅ | ✅ |
| POST /sales/sessions/{id}/resume/ | ✅ | ✅ | ✅ |

### Authentication

| Endpoint | Postman | Frontend | Status |
|----------|---------|----------|--------|
| POST /users/login/ | ✅ | ✅ | ✅ |
| GET /users/profile/ | ✅ | ✅ | ✅ |
| GET /users/users/ | ✅ | ✅ | ✅ |

---

## 🎯 Следующие шаги

### 1. Обновить компоненты
Нужно обновить React компоненты для использования новых типов:

- [ ] `src/shared/ui/CreateProduct/index.tsx`
  - Использовать новый тип `CreateProduct`
  - Убрать генерацию barcode/sku на фронте
  - Один запрос вместо нескольких

- [ ] `src/shared/ui/UpdateProduct/index.tsx`
  - Использовать новую структуру ответа

- [ ] `src/pages/Home/ui/index.tsx` (POS)
  - Использовать новый тип `CreateSale`
  - Обновить структуру оплаты

### 2. Тестирование

```bash
# Запустить backend
cd /Users/akkanat/Projects/erp_v2/new_backend
source venv/bin/activate
python manage.py runserver

# Запустить frontend
cd /Users/akkanat/Projects/erp_v2/new_frontend
npm run dev
```

**Тесты:**
1. ✅ Регистрация - работает
2. ✅ Логин - работает
3. ⏳ Создание товара - требует обновления компонента
4. ⏳ Создание продажи - требует обновления компонента
5. ⏳ Открытие/закрытие смены - требует проверки

### 3. Миграция данных (если нужно)

Если у вас уже есть данные в старой БД:
- Создать скрипты миграции данных
- Обновить существующие записи под новую структуру

---

## ⚠️ Breaking Changes

### 1. Product Creation
```typescript
// ❌ Старый код
const product = await productApi.create({
  name: "Test",
  barcode: "123456",  // УБРАТЬ!
  sku: "SKU001"       // УБРАТЬ!
})

// ✅ Новый код
const product = await productApi.create({
  name: "Test",
  category: 1,
  unit: 1,
  cost_price: 50000,
  sale_price: 75000,
  initial_quantity: 100
  // barcode и sku генерируются автоматически!
})
```

### 2. Sale Creation
```typescript
// ❌ Старый код
const sale = {
  payment_method: "cash",
  items: [{ product_id: 1, quantity: 2, price: 75000 }]
}

// ✅ Новый код
const sale = {
  session: currentSessionId,
  items: [
    { product: 1, quantity: 2, unit_price: 75000 }
  ],
  payments: [
    { payment_method: "cash", amount: 150000, received_amount: 200000 }
  ]
}
```

### 3. API Responses
```typescript
// Ответы теперь содержат вложенные объекты
ProductItem {
  pricing: {
    cost_price, sale_price, wholesale_price, tax_rate
  },
  inventory: {
    quantity, min_quantity, track_inventory
  },
  batches: Batch[]
}
```

---

## 🎉 Готово!

**Все API эндпоинты настроены под Postman коллекцию!**

- ✅ Products API - полностью готов
- ✅ Categories API - готов
- ✅ Units API - готов
- ✅ Sales API - готов
- ✅ Sessions API - готов
- ✅ Attributes API - готов
- ✅ Users API - готов

**Теперь можно:**
1. Обновить UI компоненты
2. Протестировать все функции
3. Запустить в production!

---

_Документ создан: 2025-01-17_
_Обновления API: Все модули обновлены согласно Postman коллекции_
