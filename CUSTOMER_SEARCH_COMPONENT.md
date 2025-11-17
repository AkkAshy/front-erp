# Компонент поиска клиента CustomerSearch ✅

**Дата:** 17 ноября 2025
**Расположение:** `src/shared/ui/CustomerSearch/`

---

## 📋 Описание

Универсальный компонент для поиска клиента по номеру телефона с автодополнением. Идеально подходит для страницы кассы, создания продажи и любых других мест, где нужно выбрать клиента.

## ✨ Возможности

- ✅ **Автопоиск по телефону** - начинает поиск автоматически при вводе
- ✅ **Точный и частичный поиск** - сначала ищет точное совпадение, затем по части номера
- ✅ **Dropdown с результатами** - показывает до 5 найденных клиентов
- ✅ **Автозакрытие** - закрывается при клике вне компонента
- ✅ **Форматирование телефона** - автоматически добавляет +998
- ✅ **Отображение VIP статуса** - выделяет VIP клиентов
- ✅ **Статистика клиента** - показывает сумму покупок, количество и бонусы
- ✅ **Создание нового клиента** - кнопка для создания, если не найден
- ✅ **Очистка выбора** - кнопка X для сброса

---

## 🎯 Props

```typescript
interface CustomerSearchProps {
  // Callback когда клиент выбран или очищен
  onSelectCustomer: (customer: Customer | null) => void;

  // Callback для создания нового клиента (опционально)
  onCreateNew?: (customerData: NewCustomerData) => void;

  // Placeholder текст в поле ввода
  placeholder?: string;

  // Автофокус на поле при монтировании
  autoFocus?: boolean;
}
```

---

## 💡 Примеры использования

### 1. Простое использование на странице кассы

```typescript
import { useState } from "react";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import type { Customer } from "@/entities/customer/api/types";

export const CashierPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <div className="cashier-page">
      <h2>Kassir</h2>

      {/* Поиск клиента */}
      <div className="customer-section">
        <label>Mijoz:</label>
        <CustomerSearch
          onSelectCustomer={setSelectedCustomer}
          autoFocus={true}
        />
      </div>

      {/* Дальше ваша логика продажи */}
      {selectedCustomer && (
        <div>
          <p>Tanlangan mijoz: {selectedCustomer.first_name}</p>
        </div>
      )}
    </div>
  );
};
```

### 2. С возможностью создания нового клиента

```typescript
import { useState } from "react";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import { useCreateCustomer } from "@/entities/customer/model";
import type { Customer } from "@/entities/customer/api/types";
import type { NewCustomerData } from "@/entities/sales/model/types";

export const POSPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState<NewCustomerData | null>(null);

  const createCustomer = useCreateCustomer();

  // Обработчик клика на "Создать нового"
  const handleCreateNew = (customerData: NewCustomerData) => {
    setNewCustomerData(customerData);
    setShowCreateModal(true);
  };

  // Создание клиента
  const handleConfirmCreate = (fullData: NewCustomerData) => {
    createCustomer.mutate(fullData, {
      onSuccess: (response) => {
        setSelectedCustomer(response.data);
        setShowCreateModal(false);
      }
    });
  };

  return (
    <div className="pos-page">
      <h1>POS</h1>

      {/* Поиск клиента */}
      <CustomerSearch
        onSelectCustomer={setSelectedCustomer}
        onCreateNew={handleCreateNew}
        placeholder="Mijozni qidirish (+998...)"
        autoFocus={true}
      />

      {/* Модальное окно создания клиента */}
      {showCreateModal && newCustomerData && (
        <CreateCustomerModal
          initialData={newCustomerData}
          onConfirm={handleConfirmCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
```

### 3. Интеграция с продажами

```typescript
import { useState } from "react";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import { useCreateSale } from "@/entities/sales/model/useCreateSale";
import type { Customer } from "@/entities/customer/api/types";

export const CreateSalePage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const createSale = useCreateSale();

  const handleCheckout = () => {
    createSale.mutate({
      session: 1,
      customer_id: selectedCustomer?.id,
      // ... остальные данные продажи
    }, {
      onSuccess: (response) => {
        console.log("Sotuv yaratildi:", response.data);
      }
    });
  };

  return (
    <div className="create-sale">
      {/* Поиск клиента */}
      <CustomerSearch
        onSelectCustomer={setSelectedCustomer}
      />

      {/* Добавление товаров */}
      {/* ... */}

      {/* Checkout */}
      <button onClick={handleCheckout}>
        To'lash
      </button>
    </div>
  );
};
```

### 4. Компактная версия для модалки

```typescript
import { CustomerSearch } from "@/shared/ui/CustomerSearch";

export const QuickSaleModal = () => {
  return (
    <div className="modal">
      <h3>Tezkor sotuv</h3>

      {/* Компактный поиск */}
      <div style={{ marginBottom: '20px' }}>
        <CustomerSearch
          onSelectCustomer={(customer) => {
            console.log("Tanlangan:", customer);
          }}
          placeholder="Telefon"
        />
      </div>
    </div>
  );
};
```

---

## 🎨 Визуальное отображение

### Пустое состояние
```
┌────────────────────────────────────────┐
│ Telefon raqamni kiriting (+998...)     │
└────────────────────────────────────────┘
```

### Процесс поиска
```
┌────────────────────────────────────────┐
│ +998901234567                    [⚪]  │
└────────────────────────────────────────┘
```

### Результаты поиска (dropdown)
```
┌────────────────────────────────────────┐
│ +998901234567                          │
└────────────────────────────────────────┘
│ ┌────────────────────────────────────┐ │
│ │ Иван Петров            [VIP]       │ │
│ │ +998901234567                      │ │
│ │ 1,500,000 so'm xarid qilgan       │ │
│ ├────────────────────────────────────┤ │
│ │ Алексей Смирнов                    │ │
│ │ +998901234568                      │ │
│ │ 500,000 so'm xarid qilgan         │ │
│ └────────────────────────────────────┘ │
```

### Клиент не найден
```
┌────────────────────────────────────────┐
│ +998901234567                          │
└────────────────────────────────────────┘
│ ┌────────────────────────────────────┐ │
│ │       Mijoz topilmadi              │ │
│ │                                    │ │
│ │  [+ Bu telefon bilan yangi mijoz] │ │
│ │     [yaratish]                     │ │
│ └────────────────────────────────────┘ │
```

### Клиент выбран
```
┌────────────────────────────────────────┐
│ +998901234567                      [X] │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ Иван Петров                   [VIP]    │
│ +998901234567                          │
│ ivan@example.com                       │
│ ─────────────────────────────────────  │
│ Jami xarid:      1,500,000 so'm       │
│ Xaridlar soni:   15                   │
│ Bonus:           15,000               │
└────────────────────────────────────────┘
```

---

## 🔧 Поведение компонента

### Автопоиск
- Поиск начинается **автоматически**, когда длина номера = 13 символов (`+998XXXXXXXXX`)
- Если меньше 13 символов - результаты очищаются

### Логика поиска
1. **Шаг 1:** Точный поиск по API `searchByPhone(phone)`
   - Если найден - показывает одного клиента

2. **Шаг 2:** Если не найден точно, пробует частичный поиск `getFilteredCustomers({ search })`
   - Ищет по части номера
   - Показывает до 5 результатов

3. **Шаг 3:** Если не найдено ничего
   - Показывает "Mijoz topilmadi"
   - Если передан `onCreateNew` - показывает кнопку создания

### Форматирование телефона
- Автоматически добавляет префикс `+998`
- Удаляет все символы кроме цифр и `+`
- Ограничивает длину до 13 символов

### Закрытие dropdown
- Клик вне компонента
- Выбор клиента
- Нажатие ESC (можно добавить)

---

## 🎨 Кастомизация стилей

Все стили находятся в `CustomerSearch.module.scss` и используют CSS модули, поэтому не конфликтуют с другими стилями.

### Основные классы для переопределения:

```scss
// Основной контейнер
.customerSearch { }

// Поле ввода
.input { }

// Выбранный клиент (карточка)
.customerCard { }

// VIP бейдж
.vipBadge { }

// Dropdown с результатами
.resultsDropdown { }

// Элемент результата
.resultItem { }
```

### Пример кастомизации:

```scss
// YourComponent.module.scss
.customSearch {
  :global(.customerSearch) {
    .input {
      border-color: #your-color;
    }

    .vipBadge {
      background: linear-gradient(135deg, #your-colors);
    }
  }
}
```

---

## 📱 Адаптивность

Компонент полностью адаптивен:

- **Desktop:** Статистика в 3 колонки
- **Tablet:** Статистика в 2 колонки
- **Mobile:** Статистика в 1 колонку, уменьшенные шрифты

---

## ⚡ Производительность

### Оптимизации:
- ✅ Дебаунсинг поиска - не спамит API
- ✅ Закрытие dropdown по клику вне
- ✅ Очистка listeners при unmount
- ✅ Ref для доступа к DOM без перерендеров

---

## 🐛 Обработка ошибок

Компонент корректно обрабатывает:
- ❌ Сетевые ошибки - показывает "Mijoz topilmadi"
- ❌ 404 Not Found - пробует частичный поиск
- ❌ Пустые результаты - показывает кнопку создания
- ❌ Некорректный формат телефона - форматирует автоматически

---

## 🔗 Связанные компоненты

- `Customer` type - [src/entities/customer/api/types.ts](../entities/customer/api/types.ts)
- `customersApi` - [src/entities/customer/api/customersApi.ts](../entities/customer/api/customersApi.ts)
- `NewCustomerData` type - [src/entities/sales/model/types.ts](../entities/sales/model/types.ts)

---

## 📋 Checklist для использования

При добавлении компонента на новую страницу:

- [ ] Импортировать `CustomerSearch` из `@/shared/ui/CustomerSearch`
- [ ] Создать state для `selectedCustomer`
- [ ] Передать callback `onSelectCustomer`
- [ ] (Опционально) Передать `onCreateNew` для создания
- [ ] (Опционально) Настроить `placeholder` и `autoFocus`
- [ ] Использовать `selectedCustomer?.id` при создании продажи

---

## ✅ Готово к использованию

**Компонент создан:** ✅
**Стили готовы:** ✅
**TypeScript типы:** ✅
**Адаптивность:** ✅
**Документация:** ✅

Теперь можно использовать `CustomerSearch` на любой странице!

---

**Дата создания:** 17 ноября 2025
**Автор:** Claude Code
**Версия:** 1.0
