# Статус обновления пользователей - Текущая ситуация

## 🎯 Текущая реализация

Frontend реализован **правильно** согласно документации API. Используется двухэтапное обновление:

### Шаг 1: Обновление базовых данных User
**Endpoint:** `PATCH /api/users/users/{id}/`

**Отправляемые поля:**
- `username`
- `password`
- `email`
- `first_name`
- `last_name`

**Код в usersApi.ts (строки 34-46):**
```typescript
updateUser: (data: {
  id: number | string;
  username?: string;
  password?: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
}) => {
  // Явно извлекаем только разрешённые поля, исключая id
  const { id, ...userData } = data;
  return api.patch(`/users/users/${id}/`, userData);
}
```

### Шаг 2: Обновление данных Employee
**Endpoint:** `PATCH /api/users/users/{id}/update-employee/`

**Отправляемые поля:**
- `phone`
- `role`
- `position`
- `is_active`

**Код в usersApi.ts (строки 48-59):**
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

### Использование в Seller компоненте (строки 191-217):
```typescript
function handleUpdate() {
  // ... валидация ...

  const normalizedPhone = normalizePhone(phone);

  // Шаг 1: Обновляем User
  updateUser
    .mutateAsync({
      id: updateId,
      first_name: name,
      email,
      username: login,
      password: password,
    })
    .then((res) => {
      if (res.status === 200) {
        // Шаг 2: Обновляем Employee
        return updateEmployee.mutateAsync({
          id: updateId,
          phone: normalizedPhone,
        });
      }
      throw new Error("Failed to update user");
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

## ⚠️ Проблема: Ошибка 405 Method Not Allowed

### Что происходит
При попытке обновить пользователя через PATCH `/users/users/{id}/`, backend возвращает:

```json
{
  "status": "error",
  "message": "Для обновления сотрудника используйте PATCH /api/users/users/{id}/update-employee/",
  "hint": "Попробуйте: PATCH /api/users/users/2/update-employee/"
}
```

### Возможные причины

1. **Backend не реализовал PATCH для базовых полей**
   - Эндпоинт `/users/users/{id}/` поддерживает только GET
   - PATCH для этого эндпоинта может быть не реализован

2. **Backend требует другую структуру данных**
   - Возможно, нужна вложенная структура
   - Или нужны другие заголовки/параметры

3. **Permissions issue**
   - У текущего пользователя может не быть прав на обновление
   - Проверьте роль пользователя (должен быть owner или manager)

---

## ✅ Что проверить

### 1. Проверьте консоль браузера
Откройте DevTools → Network → найдите PATCH запрос к `/users/users/2/`. Проверьте:

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-Key: <store-id>
```

**Request Body:**
```json
{
  "first_name": "Иван",
  "email": "ivan@example.com",
  "username": "ivan123",
  "password": "NewPassword123"
}
```

**Response:**
- Статус: 405 Method Not Allowed
- Тело ответа: сообщение об ошибке

### 2. Проверьте backend документацию/код
Убедитесь, что:
- Эндпоинт `/users/users/{id}/` принимает PATCH метод
- Есть разрешения (permissions) для текущей роли
- Сериализатор поддерживает обновление этих полей

### 3. Проверьте через Postman/cURL
Попробуйте сделать запрос напрямую:

```bash
curl -X PATCH "http://localhost:8000/api/users/users/2/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Tenant-Key: YOUR_STORE_ID" \
  -d '{
    "first_name": "Иван",
    "email": "ivan@example.com",
    "username": "ivan123"
  }'
```

---

## 🔧 Временные решения

### Вариант 1: Обновлять только Employee данные

Если backend не поддерживает обновление базовых полей, можно временно отключить их редактирование:

```typescript
function handleUpdate() {
  // Валидация только для phone...

  if (phone.replace(/\D/g, "").length < 12) {
    setError("Telefon raqamini to'g'ri kiriting");
    return;
  }

  setError(null);
  const normalizedPhone = normalizePhone(phone);

  // Обновляем ТОЛЬКО employee данные
  updateEmployee
    .mutateAsync({
      id: updateId,
      phone: normalizedPhone,
      // role: selectedRole, // если нужно обновить роль
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

В UI сделайте поля readonly:

```tsx
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
  type="text"
  placeholder="Ishchi ismi"
  readOnly  // ← Добавить
  disabled  // ← Добавить
/>
```

### Вариант 2: Использовать /profile-update/ для текущего пользователя

Если нужно обновить профиль **текущего** пользователя, используйте:

```typescript
// Уже есть в usersApi.ts
updateProfile: (data: {
  first_name: string;
  last_name: string;
  employee: { phone: string; sex: string };
}) => api.patch("/users/profile-update/", data)
```

Но это работает только для собственного профиля, не для других сотрудников.

---

## 📞 Следующие шаги

### Для frontend разработчика (вас):
1. ✅ Код реализован правильно
2. ⏸️ Ждём фикса backend или уточнения API

### Для backend разработчика:
1. ❓ Добавить поддержку PATCH для `/users/users/{id}/`
2. ❓ Или объяснить правильный способ обновления базовых полей
3. ❓ Обновить документацию API с корректными примерами

---

## 📚 Связанные документы

- [API_UPDATE_GUIDE.md](API_UPDATE_GUIDE.md) - Подробное руководство по API обновлений
- [BACKEND_ISSUES.md](BACKEND_ISSUES.md) - Известные проблемы backend
- [FINAL_STATUS.md](FINAL_STATUS.md) - Общий статус проекта

---

## 🎯 Вывод

**Frontend реализован правильно.** Проблема на стороне backend - эндпоинт PATCH `/users/users/{id}/` либо не реализован, либо требует другого подхода. Нужно уточнение от backend разработчика.
