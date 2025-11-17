# Интеграция покупателей в модуль продаж ✅

**Дата:** 17 ноября 2025
**Статус:** ✅ ЗАВЕРШЕНО

---

## 📋 Обзор

Теперь при создании продажи можно привязать покупателя тремя способами:

1. **Выбрать существующего покупателя** - указать `customer_id`
2. **Создать нового покупателя** - передать `new_customer` с данными
3. **Разовый покупатель** - использовать `customer_name` и `customer_phone` (не сохраняется в базе)

---

## 🎯 Обновленные типы

### NewCustomerData

Новый тип для создания покупателя при продаже:

```typescript
export type NewCustomerData = {
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  customer_type?: "individual" | "organization";
  organization_name?: string;
  inn?: string;
};
```

### CreateSale (обновлен)

```typescript
export type CreateSale = {
  session: number;  // ID текущей кассовой сессии
  receipt_number?: string;  // Номер чека

  // ===== CUSTOMER INTEGRATION =====
  // Вариант 1: Привязать к существующему покупателю
  customer_id?: number;

  // Вариант 2: Создать нового покупателя при продаже
  new_customer?: NewCustomerData;

  // Вариант 3: Разовый покупатель (не сохраняется в базе)
  customer_name?: string;
  customer_phone?: string;
  // ================================

  discount_percent?: number;  // Процент скидки
  notes?: string;  // Примечания
};
```

### Sale (обновлен)

Ответ от API теперь включает информацию о покупателе:

```typescript
export type SaleCustomerInfo = {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  is_vip: boolean;
  default_discount: number;
};

export type Sale = {
  id: number;
  session: number;
  receipt_number: string;
  status: SaleStatus;

  // ===== CUSTOMER INFORMATION =====
  customer?: number | null;  // ID покупателя (если привязан)
  customer_info?: SaleCustomerInfo | null;  // Полная информация о покупателе
  customer_name?: string;  // Имя покупателя (для разовых)
  customer_phone?: string;  // Телефон покупателя (для разовых)
  // ================================

  subtotal: string;
  discount_amount: string;
  discount_percent?: number;
  tax_amount: string;
  total_amount: string;
  items: [...],
  payments: [...],
  // ...
};
```

---

## 💡 Примеры использования

### 1. Продажа с существующим покупателем

```typescript
import { salesApi } from "@/entities/sales/api/salesApi";
import { useCreateSale } from "@/entities/sales/model/useCreateSale";

const createSale = useCreateSale();

// Создаем продажу с привязкой к существующему покупателю
createSale.mutate({
  session: 1,
  customer_id: 5,  // ID существующего покупателя
  notes: "Постоянный клиент"
}, {
  onSuccess: (response) => {
    const sale = response.data;
    console.log("Продажа создана:", sale.id);
    console.log("Покупатель:", sale.customer_info?.full_name);

    // Теперь добавляем товары через saleItems API
  }
});
```

### 2. Продажа с созданием нового покупателя

```typescript
// Создаем продажу и нового покупателя одновременно
createSale.mutate({
  session: 1,
  new_customer: {
    first_name: "Иван",
    last_name: "Петров",
    phone: "+998901234567",
    email: "ivan@example.com",
    customer_type: "individual"
  },
  notes: "Первая покупка"
}, {
  onSuccess: (response) => {
    const sale = response.data;
    console.log("Продажа создана:", sale.id);
    console.log("Новый покупатель создан:", sale.customer);
  }
});
```

### 3. Продажа для юридического лица

```typescript
// Создаем покупателя-организацию
createSale.mutate({
  session: 1,
  new_customer: {
    first_name: "Директор",
    last_name: "Иванов",
    phone: "+998901111111",
    email: "director@company.uz",
    customer_type: "organization",
    organization_name: "ООО Рога и Копыта",
    inn: "123456789"
  }
});
```

### 4. Разовая продажа (без сохранения покупателя)

```typescript
// Покупатель не сохраняется в базе
createSale.mutate({
  session: 1,
  customer_name: "Разовый покупатель",
  customer_phone: "+998909999999"
});
```

---

## 🔄 Автоопределение существующего покупателя

Если при создании нового покупателя (`new_customer`) указан телефон, который уже есть в базе, система автоматически:

1. Найдёт существующего покупателя по телефону
2. Использует его для продажи
3. **Не создаст дубликат**
4. Обновит статистику существующего покупателя

```typescript
// Телефон уже есть в базе
createSale.mutate({
  session: 1,
  new_customer: {
    first_name: "Другое имя",  // Будет проигнорировано
    phone: "+998901234567"  // ← Этот телефон уже существует!
  }
});

// Результат: Продажа будет привязана к существующему покупателю
```

---

## 📊 Компонент выбора покупателя

### CustomerSelector Component

```typescript
import { useState } from "react";
import { customersApi } from "@/entities/customer/api/customersApi";
import type { NewCustomerData } from "@/entities/sales/model/types";

interface CustomerSelectorProps {
  onSelectCustomer: (customerId: number | null) => void;
  onCreateCustomer: (customer: NewCustomerData | null) => void;
}

export const CustomerSelector = ({
  onSelectCustomer,
  onCreateCustomer
}: CustomerSelectorProps) => {
  const [mode, setMode] = useState<"search" | "create">("search");
  const [phone, setPhone] = useState("+998");
  const [foundCustomer, setFoundCustomer] = useState<any>(null);
  const [newCustomerData, setNewCustomerData] = useState<NewCustomerData>({
    first_name: "",
    phone: "+998",
  });

  // Поиск по телефону
  const handleSearch = async () => {
    try {
      const response = await customersApi.searchByPhone(phone);
      setFoundCustomer(response.data);
      onSelectCustomer(response.data.id);
      onCreateCustomer(null);
    } catch (error) {
      setFoundCustomer(null);
      onSelectCustomer(null);
      alert("Mijoz topilmadi");
    }
  };

  // Переключение на создание нового
  const handleSwitchToCreate = () => {
    setMode("create");
    const updated = { ...newCustomerData, phone };
    setNewCustomerData(updated);
    onSelectCustomer(null);
    onCreateCustomer(updated);
  };

  // Обновление данных нового покупателя
  const handleChange = (field: keyof NewCustomerData, value: string) => {
    const updated = { ...newCustomerData, [field]: value };
    setNewCustomerData(updated);
    onCreateCustomer(updated);
  };

  return (
    <div className="customer-selector">
      <h3>Mijoz</h3>

      {/* Переключатель режима */}
      <div className="mode-toggle">
        <button
          onClick={() => setMode("search")}
          className={mode === "search" ? "active" : ""}
        >
          Mavjud mijozni topish
        </button>
        <button
          onClick={() => setMode("create")}
          className={mode === "create" ? "active" : ""}
        >
          Yangi mijoz yaratish
        </button>
      </div>

      {mode === "search" ? (
        <div className="search-mode">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998901234567"
          />
          <button onClick={handleSearch}>Qidirish</button>

          {foundCustomer && (
            <div className="customer-info">
              <h4>{foundCustomer.first_name} {foundCustomer.last_name}</h4>
              <p>Telefon: {foundCustomer.phone}</p>
              <p>Xaridlar: {foundCustomer.total_purchases?.toLocaleString()} sum</p>
              {foundCustomer.is_vip && (
                <span className="vip-badge">VIP</span>
              )}
            </div>
          )}

          {!foundCustomer && phone.length > 4 && (
            <div className="not-found">
              <p>Mijoz topilmadi</p>
              <button onClick={handleSwitchToCreate}>
                Bu telefon bilan yangi mijoz yaratish
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="create-mode">
          <input
            type="text"
            placeholder="Ism *"
            value={newCustomerData.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Familiya"
            value={newCustomerData.last_name || ""}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefon *"
            value={newCustomerData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomerData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <select
            value={newCustomerData.customer_type || "individual"}
            onChange={(e) => handleChange("customer_type", e.target.value)}
          >
            <option value="individual">Jismoniy shaxs</option>
            <option value="organization">Yuridik shaxs</option>
          </select>

          {newCustomerData.customer_type === "organization" && (
            <>
              <input
                type="text"
                placeholder="Tashkilot nomi *"
                value={newCustomerData.organization_name || ""}
                onChange={(e) => handleChange("organization_name", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="INN"
                value={newCustomerData.inn || ""}
                onChange={(e) => handleChange("inn", e.target.value)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
```

### Использование в POS компоненте

```typescript
import { useState } from "react";
import { useCreateSale } from "@/entities/sales/model/useCreateSale";
import { CustomerSelector } from "./CustomerSelector";
import type { NewCustomerData } from "@/entities/sales/model/types";

export const POSPage = () => {
  const [sessionId] = useState(1);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [newCustomer, setNewCustomer] = useState<NewCustomerData | null>(null);

  const createSale = useCreateSale();

  const handleStartSale = () => {
    const saleData: any = {
      session: sessionId,
    };

    // Добавляем покупателя если выбран/создан
    if (customerId) {
      saleData.customer_id = customerId;
    } else if (newCustomer && newCustomer.first_name && newCustomer.phone) {
      saleData.new_customer = newCustomer;
    }

    createSale.mutate(saleData, {
      onSuccess: (response) => {
        console.log("Продажа создана:", response.data);
        // Переходим к добавлению товаров
      }
    });
  };

  return (
    <div className="pos-page">
      <h1>Sotuv punkti</h1>

      {/* Выбор/создание покупателя */}
      <CustomerSelector
        onSelectCustomer={setCustomerId}
        onCreateCustomer={setNewCustomer}
      />

      <button onClick={handleStartSale}>
        Sotuvni boshlash
      </button>
    </div>
  );
};
```

---

## 📈 Автоматическое обновление статистики

При создании продажи с покупателем автоматически обновляется:

- `total_purchases` - общая сумма всех покупок
- `total_purchases_count` - количество покупок
- `last_purchase_date` - дата последней покупки
- `bonus_balance` - бонусные баллы (1% от суммы покупки)

**Пример:**
```typescript
// До продажи
{
  "total_purchases": 500000.00,
  "total_purchases_count": 10,
  "bonus_balance": 5000
}

// После продажи на 100000 сум
{
  "total_purchases": 600000.00,  // +100000
  "total_purchases_count": 11,    // +1
  "bonus_balance": 6000           // +1000 (1% от 100000)
}
```

---

## 🔗 История покупок

После создания продажи она автоматически появляется в истории покупателя:

```typescript
import { usePurchaseHistory } from "@/entities/customer/model";

const { data } = usePurchaseHistory(customerId);
const history = data?.data?.results || [];

// history содержит все продажи клиента
history.forEach(sale => {
  console.log(sale.sale_number);  // "SALE-2025-00123"
  console.log(sale.total_amount);  // 100000.00
  console.log(sale.items);  // Детали товаров
});
```

---

## ⚠️ Важные замечания

### 1. Обязательные поля для нового покупателя
- `first_name` - обязательно
- `phone` - обязательно (формат: `+998XXXXXXXXX`)

### 2. Для юридических лиц
Если `customer_type: "organization"`, то обязательно:
- `organization_name` - название компании

### 3. Автоопределение
Система автоматически проверяет телефон при создании нового покупателя и использует существующего, если найден.

### 4. VIP статус и скидки
Если покупатель VIP или состоит в группе со скидкой, backend автоматически применяет скидку к продаже.

---

## 📁 Измененные файлы

1. ✅ [src/entities/sales/model/types.ts](src/entities/sales/model/types.ts)
   - Добавлен `NewCustomerData`
   - Обновлен `CreateSale` с полями покупателя
   - Добавлен `SaleCustomerInfo`
   - Обновлен `Sale` с информацией о покупателе

2. ✅ [src/entities/customer/api/customersApi.ts](src/entities/customer/api/customersApi.ts)
   - Уже есть метод `searchByPhone`

3. ✅ [src/entities/customer/model/](src/entities/customer/model/)
   - Hooks готовы к использованию

---

## ✅ Готово к использованию

**Типы обновлены:** ✅
**API готов:** ✅
**Hooks созданы:** ✅
**Компиляция:** ✅ Без ошибок
**Dev Server:** http://localhost:3112/

Теперь можно создавать продажи с привязкой к покупателям!

---

## 🎯 Следующие шаги

1. **Обновить POS компонент** - добавить `CustomerSelector`
2. **Показывать информацию о покупателе** - отображать VIP статус, скидки
3. **История покупок** - добавить просмотр истории в карточке покупателя
4. **Быстрый поиск** - реализовать автодополнение по телефону

---

**Дата создания:** 17 ноября 2025
**Автор:** Claude Code
**Версия:** 1.0
