# Profile Component - Обновлено ✅

## Что сделано

Компонент Profile обновлен под новую структуру API `/users/profile/`

### 1. Обновлена структура данных

**Старая структура:**
```typescript
{
  first_name: string;
  last_name: string;
  employee: {
    phone: string;
    sex: string;
  }
}
```

**Новая структура (из API):**
```typescript
{
  status: "success",
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    },
    store: {
      id: number;
      name: string;
      slug: string;
      tenant_key: string;
      description?: string;
    },
    employee: {
      id: number;
      role: "owner" | "manager" | "cashier" | "warehouse_keeper";
      role_display: string;  // "Владелец", "Менеджер", "Кассир", "Кладовщик"
      permissions: string[];
      phone: string;
      photo: string | null;
    }
  }
}
```

### 2. Обновлен компонент Profile

**Файл:** `src/pages/Profile/index.tsx`

#### Изменения:

1. **Получение данных из новой структуры:**
```typescript
// Было:
profile.data?.data.first_name

// Стало:
profile.data?.data?.user?.first_name
```

2. **Отображение полного имени:**
```typescript
{profile.data?.data?.user?.full_name ||
 `${profile.data?.data?.user?.first_name} ${profile.data?.data?.user?.last_name}`}
```

3. **Добавлено отображение роли:**
```tsx
{profile.data?.data?.employee?.role_display && (
  <span className={styles.profile__role}>
    {profile.data?.data?.employee?.role_display}
  </span>
)}
```

4. **Исправлен warning о controlled/uncontrolled inputs:**
```typescript
// Все значения имеют fallback к пустой строке
setName(userData?.first_name || "");
setSurname(userData?.last_name || "");
setPhone("");
setGender("");
```

### 3. Добавлены стили

**Файл:** `src/pages/Profile/Profile.module.scss`

```scss
.profile__role {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  width: fit-content;
}
```

### 4. Обновлены типы

**Файл:** `src/entities/cashier/api/types.ts`

Добавлен новый тип `ProfileResponse`:

```typescript
export type ProfileResponse = {
  status: "success";
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    };
    store: {
      id: number;
      name: string;
      slug: string;
      tenant_key: string;
      description?: string;
    };
    employee: {
      id: number;
      role: "owner" | "manager" | "cashier" | "warehouse_keeper";
      role_display: string;
      permissions: string[];
      phone: string;
      photo: string | null;
    };
  };
};
```

---

## Как выглядит в UI

### До:
```
[Фото]  Иван Петров
        +998 90 123 45 67
```

### После:
```
[Фото]  фывфыв фывфц
        +998 88 888 88 88
        [Владелец]  ← Новое!
```

---

## API Endpoint

### GET `/api/users/profile/`

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "asdmi@asdads.com",
      "first_name": "фывфыв",
      "last_name": "фывфц",
      "full_name": "фывфыв фывфц"
    },
    "store": {
      "id": 1,
      "name": "admin",
      "slug": "admin",
      "tenant_key": "admin_1a12e47a",
      "description": "asdijawd"
    },
    "employee": {
      "id": 1,
      "role": "owner",
      "role_display": "Владелец",
      "permissions": [
        "view_all",
        "create_all",
        "update_all",
        "delete_all",
        "manage_employees",
        "manage_store",
        "view_analytics",
        "manage_products",
        "manage_sales",
        "manage_customers"
      ],
      "phone": "+998888888888",
      "photo": null
    }
  }
}
```

---

## Роли пользователей

Доступные роли:
- **owner** - Владелец (все права)
- **manager** - Менеджер (управление товарами, продажами)
- **cashier** - Кассир (только продажи)
- **warehouse_keeper** - Кладовщик (управление складом)

Отображаются на русском через `role_display`:
- "Владелец"
- "Менеджер"
- "Кассир"
- "Кладовщик"

---

## Permissions (Права доступа)

В ответе API есть массив `permissions`, который можно использовать для проверки прав:

```typescript
const hasPermission = (permission: string) => {
  return profile.data?.data?.employee?.permissions.includes(permission);
};

// Использование:
if (hasPermission('manage_products')) {
  // Показать кнопку создания товара
}
```

Доступные права:
- `view_all` - Просмотр всего
- `create_all` - Создание всего
- `update_all` - Обновление всего
- `delete_all` - Удаление всего
- `manage_employees` - Управление сотрудниками
- `manage_store` - Управление магазином
- `view_analytics` - Просмотр аналитики
- `manage_products` - Управление товарами
- `manage_sales` - Управление продажами
- `manage_customers` - Управление клиентами

---

## Информация о магазине

Теперь в профиле доступна информация о магазине:

```typescript
const storeInfo = profile.data?.data?.store;

// Использование:
console.log(storeInfo.name);        // "admin"
console.log(storeInfo.tenant_key);  // "admin_1a12e47a"
```

Это можно использовать для:
- Отображения названия магазина в header
- Проверки tenant_key
- Переключения между магазинами (если пользователь имеет доступ к нескольким)

---

## Отсутствие поля `sex`

⚠️ **Важно:** В новом API нет поля `sex` (пол) в employee.

**Решение:**
1. Убрано из компонента (временно показывается мужской аватар по умолчанию)
2. Можно добавить в будущем на бэкенде, если нужно

**Если нужно добавить:**
```python
# В модели Employee на бэкенде
sex = models.CharField(
    max_length=10,
    choices=[('male', 'Мужской'), ('female', 'Женский')],
    null=True,
    blank=True
)
```

---

## Тестирование

### 1. Проверить отображение данных

```bash
# Открыть страницу профиля
http://localhost:3110/profile
```

**Проверить:**
- ✅ Имя и фамилия отображаются корректно
- ✅ Телефон отображается с маской
- ✅ Роль отображается ("Владелец")
- ✅ Нет ошибок в консоли браузера

### 2. Проверить редактирование

1. Изменить имя/фамилию/телефон
2. Нажать "Saqlash"
3. Проверить что данные обновились

### 3. Проверить Network

Открыть DevTools → Network:

**Запрос:**
```
GET /api/users/profile/
Authorization: Bearer <token>
X-Tenant-Key: <tenant_key>
```

**Ответ:**
```json
{
  "status": "success",
  "data": {
    "user": {...},
    "store": {...},
    "employee": {...}
  }
}
```

---

## Что дальше

### Возможные улучшения:

1. **Добавить смену пароля**
```tsx
<input
  type="password"
  placeholder="Yangi parol"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
/>
```

2. **Добавить загрузку фото**
```tsx
<input
  type="file"
  accept="image/*"
  onChange={handlePhotoUpload}
/>
```

3. **Показать permissions в UI**
```tsx
<div className={styles.permissions}>
  <h3>Huquqlar:</h3>
  {permissions.map(p => (
    <span key={p}>{p}</span>
  ))}
</div>
```

4. **Добавить информацию о магазине**
```tsx
<div className={styles.store__info}>
  <h3>Magazin: {store.name}</h3>
  <p>{store.description}</p>
</div>
```

---

## Итого

✅ **Profile компонент полностью обновлен!**

- ✅ Работает с новой структурой API
- ✅ Отображает роль пользователя
- ✅ Показывает полное имя
- ✅ Исправлены все warnings
- ✅ Готов к использованию

**Можно пользоваться!** 🎉

---

_Обновлено: 2025-01-17_
_API endpoint: GET /api/users/profile/_
