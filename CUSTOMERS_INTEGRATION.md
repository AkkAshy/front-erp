# Интеграция модуля "Покупатели" ✅

**Дата:** 17 ноября 2025
**Статус:** ✅ ЗАВЕРШЕНО

---

## 📋 Что было сделано

### 1. Обновлен API слой

**Файл:** [src/entities/customer/api/customersApi.ts](src/entities/customer/api/customersApi.ts)

Добавлены все необходимые endpoints согласно backend документации:

#### CRUD операции
- ✅ `getAll()` - Получить всех покупателей
- ✅ `getCustomer(id)` - Получить одного покупателя по ID
- ✅ `create(data)` - Создать покупателя
- ✅ `update(data)` - Обновить покупателя
- ✅ `delete(id)` - Удалить покупателя

#### Поиск и фильтрация
- ✅ `getFilteredCustomers(params)` - Фильтрация с пагинацией
  - `search` - поиск по имени/телефону
  - `customer_type` - тип (физлицо/юрлицо)
  - `is_vip` - только VIP клиенты
  - `group` - фильтр по группе
  - `offset/limit` - пагинация
- ✅ `searchByPhone(phone)` - Быстрый поиск по телефону

#### Статистика и история
- ✅ `getPurchaseHistory(id, params)` - История покупок клиента
- ✅ `getStats(id)` - Статистика клиента
- ✅ `getVipCustomers(params)` - Список VIP клиентов

#### Группы клиентов
- ✅ `getAllGroups()` - Все группы
- ✅ `getFilteredGroups(params)` - Фильтрация групп
- ✅ `createGroup(data)` - Создать группу
- ✅ `updateGroup(data)` - Обновить группу
- ✅ `deleteGroup(id)` - Удалить группу

---

### 2. Обновлены типы данных

**Файл:** [src/entities/customer/api/types.ts](src/entities/customer/api/types.ts)

Добавлены полные TypeScript типы:

```typescript
// Основной тип покупателя
export type Customer = {
  id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  customer_type: "individual" | "organization";
  organization_name?: string;
  inn?: string;
  address?: string;
  notes?: string;
  is_vip: boolean;
  group?: CustomerGroup | null;
  bonus_balance: number;
  created_at: string;
  updated_at: string;

  // Статистика (read-only)
  total_purchases?: number;
  total_spent?: number;
  last_purchase_date?: string | null;
};

// Создание покупателя
export type CreateCustomer = {
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  customer_type?: "individual" | "organization";
  organization_name?: string;
  inn?: string;
  address?: string;
  notes?: string;
  is_vip?: boolean;
  group?: number | null;
};

// Группа покупателей
export type CustomerGroup = {
  id: number;
  name: string;
  discount_percent: number;
  description?: string;
  customer_count: number;
  created_at: string;
  updated_at: string;
};

// История покупок
export type PurchaseHistory = {
  id: number;
  sale_number: string;
  created_at: string;
  total_amount: number;
  items: PurchaseHistoryItem[];
};

// Статистика клиента
export type CustomerStats = {
  total_purchases: number;
  total_spent: number;
  average_purchase: number;
  last_purchase_date: string | null;
  bonus_balance: number;
  vip_status: boolean;
};
```

---

### 3. Созданы React Query hooks

Все hooks находятся в `src/entities/customer/model/`:

#### useCustomers.ts
Получение всех покупателей:
```typescript
import { useCustomers } from "@/entities/customer/model";

const { data, isLoading, error } = useCustomers();
const customers = data?.data?.results || [];
```

#### useFilteredCustomers.ts
Фильтрация покупателей:
```typescript
import { useFilteredCustomers } from "@/entities/customer/model";

const { data } = useFilteredCustomers({
  search: "Иван",
  customer_type: "individual",
  is_vip: true,
  limit: 20,
});
```

#### useCreateCustomer.ts
Создание покупателя:
```typescript
import { useCreateCustomer } from "@/entities/customer/model";

const createCustomer = useCreateCustomer();

createCustomer.mutate({
  first_name: "Иван",
  phone: "+998901234567",
  customer_type: "individual",
});
```

#### useUpdateCustomer.ts
Обновление покупателя:
```typescript
import { useUpdateCustomer } from "@/entities/customer/model";

const updateCustomer = useUpdateCustomer();

updateCustomer.mutate({
  id: 1,
  first_name: "Петр",
  is_vip: true,
});
```

#### useDeleteCustomer.ts
Удаление покупателя:
```typescript
import { useDeleteCustomer } from "@/entities/customer/model";

const deleteCustomer = useDeleteCustomer();

deleteCustomer.mutate(customerId);
```

#### useCustomerStats.ts
Статистика клиента:
```typescript
import { useCustomerStats } from "@/entities/customer/model";

const { data } = useCustomerStats(customerId);
const stats = data?.data; // CustomerStats
```

#### usePurchaseHistory.ts
История покупок:
```typescript
import { usePurchaseHistory } from "@/entities/customer/model";

const { data } = usePurchaseHistory(customerId, {
  limit: 10,
  offset: 0,
});
const history = data?.data?.results || [];
```

---

## 🎯 Примеры использования

### Пример 1: Список покупателей с поиском

```typescript
import { useState } from "react";
import { useFilteredCustomers } from "@/entities/customer/model";

export const CustomersList = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useFilteredCustomers({
    search,
    limit: 20,
  });

  const customers = data?.data?.results || [];

  return (
    <div>
      <input
        type="text"
        placeholder="Qidirish (ism yoki telefon)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div>Yuklanmoqda...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ism</th>
              <th>Telefon</th>
              <th>VIP</th>
              <th>Jami xarid</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.first_name} {customer.last_name}</td>
                <td>{customer.phone}</td>
                <td>{customer.is_vip ? "✅" : "❌"}</td>
                <td>{customer.total_spent?.toLocaleString()} сум</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
```

### Пример 2: Форма создания покупателя

```typescript
import { useState } from "react";
import { useCreateCustomer } from "@/entities/customer/model";

export const CreateCustomerForm = () => {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [customerType, setCustomerType] = useState<"individual" | "organization">("individual");

  const createCustomer = useCreateCustomer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCustomer.mutate({
      first_name: firstName,
      phone: phone,
      customer_type: customerType,
    }, {
      onSuccess: () => {
        alert("Mijoz muvaffaqiyatli yaratildi!");
        setFirstName("");
        setPhone("");
      },
      onError: (error) => {
        console.error("Xatolik:", error);
        alert("Xatolik yuz berdi");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Ism</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Telefon</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998901234567"
          required
        />
      </div>

      <div>
        <label>Turi</label>
        <select
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value as any)}
        >
          <option value="individual">Jismoniy shaxs</option>
          <option value="organization">Yuridik shaxs</option>
        </select>
      </div>

      <button type="submit" disabled={createCustomer.isPending}>
        {createCustomer.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
};
```

### Пример 3: Быстрый поиск по телефону

```typescript
import { useState } from "react";
import { customersApi } from "@/entities/customer/api/customersApi";

export const PhoneSearch = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await customersApi.searchByPhone(phone);
      setResult(response.data);
    } catch (error) {
      console.error("Topilmadi:", error);
      alert("Mijoz topilmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="tel"
        placeholder="+998901234567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Qidirilmoqda..." : "Qidirish"}
      </button>

      {result && (
        <div>
          <h3>Topildi:</h3>
          <p>Ism: {result.first_name} {result.last_name}</p>
          <p>Telefon: {result.phone}</p>
          <p>VIP: {result.is_vip ? "Ha" : "Yo'q"}</p>
        </div>
      )}
    </div>
  );
};
```

### Пример 4: История покупок клиента

```typescript
import { usePurchaseHistory } from "@/entities/customer/model";

export const CustomerPurchaseHistory = ({ customerId }: { customerId: number }) => {
  const { data, isLoading } = usePurchaseHistory(customerId, {
    limit: 10,
  });

  const history = data?.data?.results || [];

  if (isLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div>
      <h3>Xarid tarixi</h3>
      {history.length === 0 ? (
        <p>Hali xarid qilinmagan</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Chek raqami</th>
              <th>Sana</th>
              <th>Summa</th>
              <th>Mahsulotlar</th>
            </tr>
          </thead>
          <tbody>
            {history.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.sale_number}</td>
                <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                <td>{sale.total_amount.toLocaleString()} сум</td>
                <td>
                  {sale.items.map((item, idx) => (
                    <div key={idx}>
                      {item.product_name} x{item.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
```

---

## 📊 Структура файлов

```
src/entities/customer/
├── api/
│   ├── customersApi.ts       ✅ Все API методы
│   └── types.ts               ✅ TypeScript типы
└── model/
    ├── index.ts               ✅ Barrel export
    ├── useCustomers.ts        ✅ Получить всех
    ├── useFilteredCustomers.ts ✅ Фильтрация
    ├── useCreateCustomer.ts   ✅ Создание
    ├── useUpdateCustomer.ts   ✅ Обновление
    ├── useDeleteCustomer.ts   ✅ Удаление
    ├── useCustomerStats.ts    ✅ Статистика
    └── usePurchaseHistory.ts  ✅ История покупок
```

---

## ✅ Готово к использованию

Все необходимые компоненты созданы и готовы к использованию:

1. ✅ **API слой** - все endpoints интегрированы
2. ✅ **Типы данных** - полная типизация TypeScript
3. ✅ **React Query hooks** - для всех операций
4. ✅ **Автоматическая инвалидация кэша** - после создания/обновления/удаления
5. ✅ **Поддержка пагинации** - для всех списков
6. ✅ **Обработка ошибок** - встроена в hooks

---

## 🚀 Следующие шаги

Для полноценной работы с модулем покупателей необходимо:

1. **Обновить страницу Customers** ([src/pages/Customers/ui/index.tsx](src/pages/Customers/ui/index.tsx))
   - Добавить форму создания/редактирования
   - Реализовать поиск по телефону
   - Показать статистику клиента

2. **Создать компонент CustomerCard**
   - Отображение детальной информации
   - История покупок
   - Статистика

3. **Интегрировать в модуль продаж**
   - Быстрый поиск клиента при создании продажи
   - Автоматическое применение скидки по группе

---

**Статус:** ✅ Backend API полностью интегрирован
**Dev Server:** ✅ Работает без ошибок на http://localhost:3112/
**Готов к использованию:** ✅ Да
