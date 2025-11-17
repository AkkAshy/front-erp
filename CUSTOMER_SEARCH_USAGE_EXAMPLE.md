# Пример использования CustomerSearch на странице кассы

## Быстрый старт

### 1. Импорт компонента

```typescript
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import type { Customer } from "@/entities/customer/api/types";
```

### 2. Базовое использование

```typescript
import { useState } from "react";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import type { Customer } from "@/entities/customer/api/types";

export const CashierPage = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <div>
      <h2>Kassir sahifasi</h2>

      {/* Компонент поиска клиента */}
      <CustomerSearch
        onSelectCustomer={setCustomer}
        placeholder="Mijozni qidirish (+998...)"
        autoFocus={true}
      />

      {/* Информация отобразится автоматически когда клиент выбран */}
    </div>
  );
};
```

Вот и всё! Компонент сам:
- ✅ Отобразит поле ввода
- ✅ Будет искать клиентов при вводе телефона
- ✅ Покажет dropdown с результатами
- ✅ Отобразит карточку выбранного клиента
- ✅ Предложит создать нового, если не найден

---

## Полный пример с созданием продажи

```typescript
import { useState } from "react";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import { useCreateSale } from "@/entities/sales/model/useCreateSale";
import type { Customer } from "@/entities/customer/api/types";
import type { NewCustomerData } from "@/entities/sales/model/types";

export const POSPage = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const createSale = useCreateSale();

  // Обработчик создания нового клиента
  const handleCreateNewCustomer = (data: NewCustomerData) => {
    setNewCustomerPhone(data.phone);
    setShowNewCustomerModal(true);
  };

  // Создание продажи
  const handleCreateSale = () => {
    createSale.mutate({
      session: 1,
      customer_id: customer?.id, // Используем ID выбранного клиента
      // ... остальные данные
    });
  };

  return (
    <div className="pos-page">
      <h1>Sotuv punkti</h1>

      {/* Поиск клиента */}
      <section className="customer-section">
        <h3>Mijoz</h3>
        <CustomerSearch
          onSelectCustomer={setCustomer}
          onCreateNew={handleCreateNewCustomer}
          autoFocus={true}
        />
      </section>

      {/* Товары и т.д. */}

      {/* Checkout */}
      <button onClick={handleCreateSale}>
        To'lash
      </button>

      {/* Модальное окно создания клиента */}
      {showNewCustomerModal && (
        <CreateCustomerModal
          phone={newCustomerPhone}
          onClose={() => setShowNewCustomerModal(false)}
          onSuccess={(newCustomer) => {
            setCustomer(newCustomer);
            setShowNewCustomerModal(false);
          }}
        />
      )}
    </div>
  );
};
```

---

## Скриншоты работы

### Шаг 1: Начальное состояние
Пользователь видит пустое поле ввода:
```
┌────────────────────────────────────────┐
│ Mijozni qidirish (+998...)             │
└────────────────────────────────────────┘
```

### Шаг 2: Ввод телефона
Пользователь начинает вводить номер:
```
┌────────────────────────────────────────┐
│ +998901234567                    [⚪]  │
└────────────────────────────────────────┘
```
Появляется спиннер загрузки.

### Шаг 3: Результаты поиска
Компонент показывает найденных клиентов:
```
┌────────────────────────────────────────┐
│ +998901234567                          │
└────────────────────────────────────────┘
  ┌────────────────────────────────────┐
  │ Иван Петров            [VIP]       │
  │ +998901234567                      │
  │ 1,500,000 so'm xarid qilgan       │
  ├────────────────────────────────────┤
  │ Алексей Иванов                     │
  │ +998901234568                      │
  │ 500,000 so'm xarid qilgan         │
  └────────────────────────────────────┘
```

### Шаг 4: Клиент выбран
После клика показывается полная информация:
```
┌────────────────────────────────────────┐
│ +998901234567                      [X] │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ 👤 Иван Петров               [VIP]     │
│ 📞 +998901234567                       │
│ 📧 ivan@example.com                    │
│ ──────────────────────────────────────│
│ 💰 Jami xarid:      1,500,000 so'm    │
│ 📊 Xaridlar soni:   15                │
│ ⭐ Bonus:           15,000            │
└────────────────────────────────────────┘
```

### Шаг 5: Клиент не найден
Если клиент не найден, показывается кнопка создания:
```
┌────────────────────────────────────────┐
│ +998909999999                          │
└────────────────────────────────────────┘
  ┌────────────────────────────────────┐
  │       Mijoz topilmadi              │
  │                                    │
  │  ┌──────────────────────────────┐ │
  │  │ + Bu telefon bilan yangi     │ │
  │  │   mijoz yaratish             │ │
  │  └──────────────────────────────┘ │
  └────────────────────────────────────┘
```

---

## Интеграция с модальным окном создания клиента

```typescript
// CreateCustomerModal.tsx
import { useState } from "react";
import { useCreateCustomer } from "@/entities/customer/model";
import type { NewCustomerData } from "@/entities/sales/model/types";

interface Props {
  phone: string;
  onClose: () => void;
  onSuccess: (customer: Customer) => void;
}

export const CreateCustomerModal = ({ phone, onClose, onSuccess }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const createCustomer = useCreateCustomer();

  const handleSubmit = () => {
    createCustomer.mutate({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email,
    }, {
      onSuccess: (response) => {
        onSuccess(response.data);
      }
    });
  };

  return (
    <div className="modal">
      <h3>Yangi mijoz yaratish</h3>

      <p>Telefon: {phone}</p>

      <input
        placeholder="Ism *"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Familiya"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Yaratish
      </button>
      <button onClick={onClose}>
        Bekor qilish
      </button>
    </div>
  );
};
```

---

## Tips & Tricks

### 1. Автофокус на поле при загрузке страницы
```typescript
<CustomerSearch
  autoFocus={true}  // ← Курсор автоматически в поле
  onSelectCustomer={setCustomer}
/>
```

### 2. Получение ID клиента для продажи
```typescript
const customerId = customer?.id; // null если не выбран

// Использование в createSale
createSale.mutate({
  customer_id: customerId, // Backend проигнорирует если null
});
```

### 3. Проверка VIP статуса
```typescript
{customer?.is_vip && (
  <div className="vip-discount">
    VIP скидка применена!
  </div>
)}
```

### 4. Очистка выбора программно
```typescript
// Компонент автоматически управляет своим состоянием,
// но если нужно очистить извне:
setCustomer(null);
```

### 5. Отображение истории покупок
```typescript
import { usePurchaseHistory } from "@/entities/customer/model";

const { data } = usePurchaseHistory(customer?.id || 0);
const history = data?.data?.results || [];
```

---

## Готовый код для копирования

```typescript
import { useState } from "react";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import type { Customer } from "@/entities/customer/api/types";

export const YourPage = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <div>
      <CustomerSearch
        onSelectCustomer={setCustomer}
        autoFocus={true}
      />

      {/* Ваш код здесь */}
      {customer && (
        <p>Tanlangan: {customer.first_name}</p>
      )}
    </div>
  );
};
```

**Это всё что нужно!** 🎉

---

## Кастомные стили (опционально)

Если нужно изменить цвета или размеры:

```scss
// YourPage.module.scss
.customSearch {
  :global {
    .customerSearch {
      .input {
        border-color: #your-color;
        font-size: 18px;
      }

      .vipBadge {
        background: linear-gradient(135deg, #ff6b6b, #feca57);
      }
    }
  }
}
```

```tsx
<div className={styles.customSearch}>
  <CustomerSearch ... />
</div>
```

---

**Готово!** Теперь у вас есть полнофункциональный поиск клиента на странице кассы! 🚀
