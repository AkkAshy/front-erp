# API Update Guide - Обновление пользователей

## ✅ ОБНОВЛЕНО: Текущее состояние API

Обновление пользователей работает через **ТРИ отдельных эндпоинта**:
1. **PATCH `/users/users/{id}/update-profile/`** - для username, email, first_name, last_name
2. **POST `/users/users/{id}/change-password/`** - для изменения пароля
3. **PATCH `/users/users/{id}/update-employee/`** - для phone, role, position, is_active

## Правильный способ обновления пользователей

При обновлении данных сотрудника нужно использовать **ТРИ отдельных эндпоинта**:

### 1. PATCH `/api/users/users/{id}/update-profile/` - для основной информации

Этот эндпоинт обновляет базовые данные пользователя (профиль):

**Допустимые поля:**
- `username` - Логин пользователя
- `email` - Email
- `first_name` - Имя
- `last_name` - Фамилия

**Права доступа:**
- ✅ Любой сотрудник может редактировать **свой** профиль
- ✅ Owner и Manager могут редактировать профили **других**

**❌ НЕ отправлять:**
- `password` - используйте `/change-password/`
- `phone` - относится к employee
- `sex` - относится к employee
- `role` - относится к employee

**Пример запроса:**
```typescript
await api.patch(`/users/users/2/update-profile/`, {
  first_name: "Иван",
  email: "ivan@example.com",
  username: "ivan123",
});
```

---

### 2. POST `/api/users/users/{id}/change-password/` - для изменения пароля (ОПЦИОНАЛЬНО)

Этот эндпоинт изменяет пароль пользователя:

**⚠️ ВАЖНО:** Этот запрос выполняется **только если пользователь ввёл новый пароль**. Если поле пароля пустое при редактировании, этот шаг пропускается.

**Допустимые поля:**
- `new_password` - Новый пароль (минимум 8 символов)

**Требования к паролю:**
- ✅ Минимум 8 символов
- ✅ Рекомендуется использовать буквы, цифры и спецсимволы

**Права доступа:**
- ✅ `owner` и `manager` - могут менять пароли других пользователей
- ❌ `cashier` и `stockkeeper` - не могут

**Пример запроса:**
```typescript
await api.post(`/users/users/2/change-password/`, {
  new_password: "NewSecurePass123!",
});
```

**Успешный ответ:**
```json
{
  "status": "success",
  "message": "Пароль для пользователя cashier1 успешно изменен",
  "data": {
    "user_id": 2,
    "username": "cashier1"
  }
}
```

---

### 3. PATCH `/api/users/users/{id}/update-employee/` - для информации о сотруднике

Этот эндпоинт обновляет данные employee (сотрудника):

**Допустимые поля:**
- `phone` - Номер телефона
- `role` - Роль (owner, manager, cashier, stockkeeper)
- `position` - Должность (опционально)
- `is_active` - Активность сотрудника

**Примечания:**
- ✅ Поддерживает частичное обновление (можно обновить только нужные поля)
- ✅ Доступно только для owner и manager
- ❌ Нельзя обновить `sex` (пол) через этот эндпоинт

**Пример запроса:**
```typescript
await api.patch(`/users/users/2/update-employee/`, {
  phone: "+998901234567",
  role: "manager",
  position: "Старший менеджер",
});
```

---

## Правильная последовательность обновления

```typescript
async function updateEmployee(userId: number, data) {
  // 1. Обновляем профиль пользователя (БЕЗ пароля)
  await api.patch(`/users/users/${userId}/update-profile/`, {
    first_name: data.name,
    email: data.email,
    username: data.login,
  });

  // 2. Обновляем пароль (если нужно)
  if (data.password) {
    await api.post(`/users/users/${userId}/change-password/`, {
      new_password: data.password,
    });
  }

  // 3. Обновляем информацию о сотруднике
  await api.patch(`/users/users/${userId}/update-employee/`, {
    phone: data.phone,
    // role: data.role, // если нужно обновить роль
  });
}
```

---

## Типы в TypeScript

### usersApi.updateUser()

```typescript
updateUser: (data: {
  id: number | string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}) => {
  // Явно извлекаем только разрешённые поля, исключая id
  const { id, ...userData } = data;
  return api.patch(`/users/users/${id}/update-profile/`, userData);
}
```

### usersApi.changePassword()

```typescript
changePassword: (data: {
  id: number | string;
  new_password: string;
}) => {
  const { id, new_password } = data;
  return api.post(`/users/users/${id}/change-password/`, { new_password });
}
```

### usersApi.updateEmployee()

```typescript
updateEmployee: (data: {
  id: number | string;
  role?: string;
  phone?: string;
  position?: string;
  is_active?: boolean;
}) => {
  // Явно извлекаем только разрешённые поля для employee, исключая id
  const { id, ...employeeData } = data;
  return api.patch(`/users/users/${id}/update-employee/`, employeeData);
}
```

**Важно:** Мы явно деструктурируем объект, чтобы исключить `id` из тела запроса и отправить его только в URL.

---

## Частые ошибки

### ❌ Ошибка 1: Отправка phone в основной PATCH

```typescript
// НЕПРАВИЛЬНО ❌
await api.patch(`/users/users/2/`, {
  first_name: "Иван",
  phone: "+998901234567", // ❌ Бэкенд вернет ошибку!
});
```

**Ошибка от API:**
```json
{
  "status": "error",
  "message": "Для обновления сотрудника используйте PATCH /api/users/users/{id}/update-employee/",
  "hint": "Попробуйте: PATCH /api/users/users/2/update-employee/"
}
```

**Решение:** Используйте `/update-employee/` для phone:
```typescript
// ПРАВИЛЬНО ✅
await api.patch(`/users/users/2/`, {
  first_name: "Иван",
});

await api.patch(`/users/users/2/update-employee/`, {
  phone: "+998901234567",
});
```

---

### ❌ Ошибка 2: Попытка обновить role через основной PATCH

```typescript
// НЕПРАВИЛЬНО ❌
await api.patch(`/users/users/2/`, {
  role: "manager", // ❌ Игнорируется или вызывает ошибку
});
```

**Решение:** Используйте `/update-employee/`:
```typescript
// ПРАВИЛЬНО ✅
await api.patch(`/users/users/2/update-employee/`, {
  role: "manager",
});
```

---

## Создание пользователя

При создании нового пользователя используется **ОДИН** эндпоинт, который принимает все данные:

**POST `/api/users/users/`**

```typescript
await api.post(`/users/users/`, {
  username: "ivan123",
  password: "Password123",
  first_name: "Иван",
  email: "ivan@example.com",
  phone: "+998901234567",
  role: "cashier",
  sex: "male",
});
```

**Отличие от обновления:**
- ✅ При создании можно отправить все поля в одном запросе
- ❌ При обновлении нужно разделить на два запроса

---

## Примеры из кода

### Реализация в Seller компоненте

```typescript
function handleUpdate() {
  // Валидация...

  const normalizedPhone = normalizePhone(phone);

  // Шаг 1: Обновляем User (БЕЗ пароля)
  updateUser
    .mutateAsync({
      id: updateId,
      first_name: name,
      email,
      username: login,
    })
    .then((res) => {
      if (res.status === 200) {
        // Шаг 2: Обновляем пароль ТОЛЬКО если он был введён
        if (password && password.trim()) {
          return changePassword.mutateAsync({
            id: updateId,
            new_password: password,
          });
        }
        // Если пароль не введён, пропускаем этот шаг
        return Promise.resolve(res);
      }
      throw new Error("Failed to update user");
    })
    .then((res) => {
      if (res.status === 200) {
        // Шаг 3: Обновляем Employee
        return updateEmployee.mutateAsync({
          id: updateId,
          phone: normalizedPhone,
        });
      }
      throw new Error("Failed to change password");
    })
    .then(() => {
      setIsOpenUpdate(false);
      clearData();
    })
    .catch((error) => {
      console.error("Update error:", error);
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    });
}
```

---

## Проверочный чеклист

Перед отправкой запроса на обновление проверьте:

- [ ] Основные данные (name, email, username) отправляются на `/users/users/{id}/update-profile/` **БЕЗ password**
- [ ] Пароль отправляется отдельно на `/users/users/{id}/change-password/` с полем `new_password` (опционально)
- [ ] Employee данные (phone, role, position) отправляются на `/users/users/{id}/update-employee/`
- [ ] Не смешиваете поля из разных категорий в одном запросе
- [ ] Все три эндпоинта вызываются последовательно (profile → password → employee)
- [ ] Обработка ошибок настроена для всех трёх запросов

---

## Устранение неполадок

### Ошибка 405: Method Not Allowed при обновлении пользователя

Если вы получаете эту ошибку при попытке обновить данные пользователя через PATCH `/users/users/{id}/`:

```json
{
  "status": "error",
  "message": "Для обновления сотрудника используйте PATCH /api/users/users/{id}/update-employee/",
  "hint": "Попробуйте: PATCH /api/users/users/2/update-employee/"
}
```

**Возможные причины:**

1. **Вы отправляете employee-поля в основной запрос**
   - Проверьте, что не отправляете `phone`, `role`, `sex`, `position` в PATCH `/users/users/{id}/`
   - Эти поля должны идти только в `/update-employee/`

2. **Бэкенд не поддерживает обновление базовых полей**
   - Возможно, эндпоинт `/users/users/{id}/` поддерживает только GET и не принимает PATCH
   - Проверьте документацию бэкенда или обратитесь к backend-разработчику

3. **Вы отправляете `id` в теле запроса**
   - `id` должен быть только в URL, не в body
   - Убедитесь, что используете деструктуризацию: `const { id, ...userData } = data`

**Решение:**

Если бэкенд действительно не поддерживает обновление базовых полей (username, password, email), рассмотрите один из вариантов:

1. **Временное решение:** Отключите возможность редактирования этих полей в UI
2. **Альтернатива:** Используйте только `/update-employee/` для обновления `phone` и `role`
3. **Запрос к backend:** Попросите добавить поддержку PATCH для базовых полей

### Пример временного решения

Если нужно обновить только employee-данные:

```typescript
function handleUpdate() {
  // Валидация только для phone...

  const normalizedPhone = normalizePhone(phone);

  // Обновляем ТОЛЬКО employee данные
  updateEmployee
    .mutateAsync({
      id: updateId,
      phone: normalizedPhone,
      // role: selectedRole, // если нужно
    })
    .then(() => {
      setIsOpenUpdate(false);
      clearData();
    })
    .catch((error) => {
      console.error("Update error:", error);
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    });
}
```

---

## Дополнительные ресурсы

- [BACKEND_ISSUES.md](BACKEND_ISSUES.md) - Полная документация по API
- [FINAL_STATUS.md](FINAL_STATUS.md) - Текущее состояние проекта
- [AUTH_AND_API_FIXES.md](AUTH_AND_API_FIXES.md) - История исправлений
