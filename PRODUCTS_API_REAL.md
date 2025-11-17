# Products API - Реальная структура ✅

## Обновлено под реальный API

Типы обновлены на основе реального ответа от `/api/products/products/`

---

## 📋 Структура ответа

### GET `/api/products/products/`

**Response:**
```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 18,
      "name": "Test Futbolka",
      "slug": "test-futbolka",
      "sku": "TEST_FUTBOLKA_20251117_939596D3",
      "barcode": "",
      "category": 12,
      "category_name": "Аксессуары",
      "unit": 3,
      "unit_name": "г",
      "sale_price": "75000.00",
      "cost_price": "50000.00",
      "margin": "50.00",
      "quantity": "15.000",
      "stock_status": "in_stock",
      "main_image": null,
      "is_active": true,
      "is_featured": false,
      "created_at": "2025-11-17T12:27:55.100007+05:00",
      "updated_at": "2025-11-17T12:27:55.100012+05:00"
    }
  ]
}
```

---

## 🔑 Ключевые поля

### Идентификация
- **id** - ID товара
- **name** - Название товара
- **slug** - URL-friendly название
- **sku** - Артикул (генерируется автоматически)
- **barcode** - Штрихкод (может быть пустым)

### Категория и единица
- **category** - ID категории
- **category_name** - Название категории
- **unit** - ID единицы измерения
- **unit_name** - Название единицы

### Цены
- **sale_price** - Цена продажи (decimal as string)
- **cost_price** - Себестоимость (decimal as string)
- **margin** - Процент маржи (вычисляется автоматически)

### Остатки
- **quantity** - Количество на складе (decimal as string)
- **stock_status** - Статус остатка:
  - `"in_stock"` - В наличии
  - `"low_stock"` - Мало на складе
  - `"out_of_stock"` - Нет в наличии

### Изображения
- **main_image** - Главное изображение (URL или null)

### Статусы
- **is_active** - Активен ли товар
- **is_featured** - Популярный товар

### Даты
- **created_at** - Дата создания (ISO 8601)
- **updated_at** - Дата обновления (ISO 8601)

---

## 📊 Flat vs Nested структура

### Текущая (Flat) - `/api/products/products/`
```typescript
{
  id: 18,
  sale_price: "75000.00",  // ← Прямо в корне
  cost_price: "50000.00",  // ← Прямо в корне
  margin: "50.00",         // ← Прямо в корне
  quantity: "15.000",      // ← Прямо в корне
  stock_status: "in_stock" // ← Прямо в корне
}
```

### Возможная (Nested) - `/api/products/products/{id}/`
```typescript
{
  id: 18,
  pricing: {               // ← Вложенный объект
    sale_price: "75000.00",
    cost_price: "50000.00",
    margin: "50.00"
  },
  inventory: {             // ← Вложенный объект
    quantity: "15.000",
    stock_status: "in_stock"
  },
  batches: [...]           // ← Массив партий
}
```

**Вывод:** Список товаров использует flat структуру для производительности. Детальный запрос может иметь вложенную структуру.

---

## 🎯 Обновленный тип ProductItem

**Файл:** `src/entities/product/api/types.ts`

```typescript
export type ProductItem = {
  // Обязательные поля
  id: number;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  category: number;
  category_name: string;
  unit: number;
  unit_name: string;

  // Цены (flat структура)
  sale_price: string;
  cost_price: string;
  margin: string;

  // Остатки (flat структура)
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

  // Опциональные (могут быть в детальном запросе)
  description?: string;
  pricing?: {...};      // Nested структура
  inventory?: {...};    // Nested структура
  batches?: Batch[];    // Партии
  attributes?: [...];   // Атрибуты
  images?: [...];       // Изображения
};
```

---

## 💡 Использование в коде

### Получение списка товаров
```typescript
import { productApi } from '@/entities/product/api/productApi';

const products = await productApi.getAll();

// Response:
// {
//   count: 4,
//   next: null,
//   previous: null,
//   results: [
//     {
//       id: 18,
//       name: "Test Futbolka",
//       sale_price: "75000.00",
//       cost_price: "50000.00",
//       margin: "50.00",
//       quantity: "15.000",
//       stock_status: "in_stock"
//     }
//   ]
// }
```

### Отображение в таблице
```tsx
{products.results.map(product => (
  <tr key={product.id}>
    <td>{product.name}</td>
    <td>{product.category_name}</td>
    <td>{product.quantity} {product.unit_name}</td>
    <td>{product.sale_price} uzs</td>
    <td>
      <StatusBadge status={product.stock_status} />
    </td>
  </tr>
))}
```

### Работа с ценами
```typescript
// Цены приходят как строки, нужно конвертировать для расчетов
const salePrice = parseFloat(product.sale_price);
const costPrice = parseFloat(product.cost_price);
const margin = parseFloat(product.margin);

// Или использовать уже вычисленную маржу
console.log(`Маржа: ${product.margin}%`);
```

### Работа с остатками
```typescript
const quantity = parseFloat(product.quantity);

// Проверка статуса
if (product.stock_status === "in_stock") {
  // Товар в наличии
} else if (product.stock_status === "low_stock") {
  // Мало на складе
} else {
  // Нет в наличии
}
```

---

## 🔍 Поиск и фильтрация

### Фильтрация товаров
```typescript
const filtered = await productApi.getFilteredProducts({
  search: "футболка",
  category: 12,
  is_active: true,
  offset: 0,
  limit: 20
});
```

### Поиск по штрихкоду
```typescript
const product = await productApi.scanBarcode("1234567890123");

// Если barcode пустой, можно искать по SKU
const productBySku = await productApi.getFilteredProducts({
  search: "TEST_FUTBOLKA_20251117_939596D3"
});
```

---

## ⚠️ Важные замечания

### 1. Barcode может быть пустым
В примере ответа `barcode: ""` - пустая строка.

**Причины:**
- Штрихкод может генерироваться асинхронно
- Или только для партий (batches)
- Или для конкретных товаров

**Решение:**
```typescript
if (product.barcode) {
  // Показать штрихкод
} else if (product.sku) {
  // Показать SKU как fallback
}
```

### 2. Decimal как строка
Все числовые значения с точностью приходят как строки:
- `"75000.00"` вместо `75000`
- `"15.000"` вместо `15`

**Причина:** Точность decimal типа в Python/Django

**Решение:**
```typescript
// Для отображения
{product.sale_price} uzs  // "75000.00 uzs"

// Для расчетов
const price = parseFloat(product.sale_price);  // 75000.00
const quantity = parseFloat(product.quantity); // 15.0
```

### 3. Маржа вычисляется автоматически
Поле `margin` уже рассчитано на бэкенде:
```
margin = ((sale_price - cost_price) / cost_price) * 100
```

Не нужно считать на фронтенде!

---

## 📝 Создание товара

Структура запроса остается прежней:

```typescript
const newProduct = await productApi.create({
  name: "Новая футболка",
  category: 12,
  unit: 3,
  cost_price: 50000,
  sale_price: 75000,
  initial_quantity: 100,
  min_quantity: 10
});

// SKU генерируется автоматически:
// "NOVAYA_FUTBOLKA_20251117_XXXXXXXX"
```

---

## 🎨 Компоненты UI

### StatusBadge для stock_status
```tsx
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    in_stock: { text: "В наличии", color: "green" },
    low_stock: { text: "Мало", color: "orange" },
    out_of_stock: { text: "Нет", color: "red" }
  };

  const { text, color } = config[status] || config.in_stock;

  return (
    <span className={`badge badge-${color}`}>
      {text}
    </span>
  );
};
```

### Отображение маржи
```tsx
const MarginBadge = ({ margin }: { margin: string }) => {
  const value = parseFloat(margin);
  const color = value >= 50 ? "green" : value >= 25 ? "orange" : "red";

  return (
    <span className={`margin margin-${color}`}>
      {margin}%
    </span>
  );
};
```

---

## 🔄 Разница с документацией

### В документации (ожидалось):
```typescript
{
  pricing: {
    sale_price: "75000.00",
    cost_price: "50000.00"
  },
  inventory: {
    quantity: "15.000"
  }
}
```

### В реальности (получили):
```typescript
{
  sale_price: "75000.00",
  cost_price: "50000.00",
  quantity: "15.000",
  margin: "50.00"  // ← Бонус!
}
```

**Плюсы flat структуры:**
- ✅ Проще доступ к полям
- ✅ Меньше вложенности
- ✅ Быстрее сериализация
- ✅ Готовая маржа

**Минусы:**
- ⚠️ Больше полей в корне
- ⚠️ Меньше группировки

---

## ✅ Итого

**Типы обновлены под реальную структуру API!**

- ✅ ProductItem соответствует реальному ответу
- ✅ Flat структура для списка товаров
- ✅ Опциональные вложенные поля для детальных запросов
- ✅ Маржа вычисляется автоматически на бэкенде
- ✅ Decimal поля как строки
- ✅ Barcode может быть пустым

**Можно использовать!** 🚀

---

_Обновлено: 2025-01-17_
_На основе реального ответа: GET /api/products/products/_
