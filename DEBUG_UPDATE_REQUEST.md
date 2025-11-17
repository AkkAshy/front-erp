# Debug Guide - Отладка запросов обновления пользователя

## 🔍 Как проверить что отправляется на backend

### 1. Откройте DevTools

**Chrome/Edge:**
- Нажмите `F12` или `Ctrl+Shift+I` (Windows/Linux)
- Нажмите `Cmd+Option+I` (Mac)

**Firefox:**
- Нажмите `F12` или `Ctrl+Shift+I` (Windows/Linux)
- Нажмите `Cmd+Option+I` (Mac)

### 2. Перейдите на вкладку Network

### 3. Попробуйте обновить сотрудника

Заполните форму и нажмите "O'zgartirish" (Изменить)

### 4. Найдите PATCH запросы

Должны появиться ДВА запроса (если реализация правильная):

#### Запрос 1: PATCH /users/users/2/

**Request URL:**
```
http://localhost:8000/api/users/users/2/
```

**Request Method:**
```
PATCH
```

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
X-Tenant-Key: 1
```

**Request Payload (Body):**
```json
{
  "first_name": "Иван",
  "email": "ivan@example.com",
  "username": "ivan123",
  "password": "NewPassword123"
}
```

**Expected Response:**
- ✅ **Status: 200 OK** - если backend поддерживает обновление
- ❌ **Status: 405 Method Not Allowed** - если backend не поддерживает (текущая проблема)

**Response Body (если 405):**
```json
{
  "status": "error",
  "message": "Для обновления сотрудника используйте PATCH /api/users/users/{id}/update-employee/",
  "hint": "Попробуйте: PATCH /api/users/users/2/update-employee/"
}
```

---

#### Запрос 2: PATCH /users/users/2/update-employee/

**Request URL:**
```
http://localhost:8000/api/users/users/2/update-employee/
```

**Request Method:**
```
PATCH
```

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
X-Tenant-Key: 1
```

**Request Payload (Body):**
```json
{
  "phone": "+998901234567"
}
```

**Expected Response:**
- ✅ **Status: 200 OK**

**Response Body:**
```json
{
  "id": 2,
  "username": "ivan123",
  "email": "ivan@example.com",
  "first_name": "Иван",
  "employee_info": {
    "id": 2,
    "role": "cashier",
    "role_display": "Кассир",
    "phone": "+998901234567",
    "position": null,
    "is_active": true,
    "hired_at": "2025-11-17",
    "photo": null
  }
}
```

---

## 🐛 Частые проблемы

### Проблема 1: Отправляется только один запрос

**Симптом:** Видите только PATCH к `/update-employee/`, но нет PATCH к `/users/users/{id}/`

**Причина:** Первый запрос упал с ошибкой, и код не дошёл до второго

**Решение:** Проверьте console в DevTools на ошибки

---

### Проблема 2: В теле запроса есть поле "id"

**Симптом:**
```json
{
  "id": 2,  // ← НЕ ДОЛЖНО БЫТЬ!
  "first_name": "Иван",
  "email": "ivan@example.com"
}
```

**Причина:** Не используется деструктуризация в usersApi

**Решение:** Проверьте что код использует:
```typescript
const { id, ...userData } = data;
return api.patch(`/users/users/${id}/`, userData);
```

---

### Проблема 3: В запросе есть поля phone, role, sex

**Симптом:**
```json
{
  "first_name": "Иван",
  "email": "ivan@example.com",
  "phone": "+998901234567",  // ← НЕ ДОЛЖНО БЫТЬ!
  "sex": "male"              // ← НЕ ДОЛЖНО БЫТЬ!
}
```

**Причина:** Не разделены поля между двумя эндпоинтами

**Решение:**
- `phone`, `role`, `sex`, `position` → ТОЛЬКО в `/update-employee/`
- `username`, `password`, `email`, `first_name` → ТОЛЬКО в `/users/users/{id}/`

---

### Проблема 4: Нет заголовка X-Tenant-Key

**Симптом:** Ответ 401 Unauthorized или 403 Forbidden

**Решение:** Проверьте что authInterceptor добавляет заголовок

---

## ✅ Checklist для проверки

Перед тем как обращаться к backend разработчику, убедитесь что:

- [ ] Запрос идёт на правильный URL: `http://localhost:8000/api/users/users/2/`
- [ ] Метод: `PATCH` (не PUT, не POST)
- [ ] Заголовок `Content-Type: application/json`
- [ ] Заголовок `Authorization: Bearer <token>`
- [ ] Заголовок `X-Tenant-Key: <store-id>`
- [ ] В теле запроса НЕТ поля `id`
- [ ] В теле запроса НЕТ полей `phone`, `role`, `sex`, `position`
- [ ] В теле запроса ТОЛЬКО базовые поля: `username`, `password`, `email`, `first_name`, `last_name`

---

## 📝 Как отправить информацию backend разработчику

Если все пункты checklist выполнены, но всё равно ошибка 405, сделайте скриншот или скопируйте:

### 1. Request Headers
```
Content-Type: application/json
Authorization: Bearer eyJ...
X-Tenant-Key: 1
```

### 2. Request URL
```
http://localhost:8000/api/users/users/2/
```

### 3. Request Method
```
PATCH
```

### 4. Request Payload
```json
{
  "first_name": "Иван",
  "email": "ivan@example.com",
  "username": "ivan123",
  "password": "NewPassword123"
}
```

### 5. Response Status
```
405 Method Not Allowed
```

### 6. Response Body
```json
{
  "status": "error",
  "message": "Для обновления сотрудника используйте PATCH /api/users/users/{id}/update-employee/"
}
```

И напишите:
> "Frontend отправляет правильные данные согласно документации. Почему backend не принимает PATCH для базовых полей пользователя? Какой эндпоинт нужно использовать для обновления username, password, email, first_name?"

---

## 🔧 Консоль браузера

В console DevTools вы должны видеть логи от interceptor'ов:

```
🌐 API Request: {
  method: 'PATCH',
  url: '/users/users/2/',
  baseURL: 'http://localhost:8000/api',
  fullUrl: 'http://localhost:8000/api/users/users/2/',
  data: {
    first_name: 'Иван',
    email: 'ivan@example.com',
    username: 'ivan123',
    password: 'NewPassword123'
  }
}

❌ API Error: {
  url: '/users/users/2/',
  status: 405,
  message: 'Request failed with status code 405',
  data: {
    status: 'error',
    message: 'Для обновления сотрудника используйте PATCH /api/users/users/{id}/update-employee/'
  }
}
```

Если видите такие логи - значит frontend работает правильно, проблема в backend.

---

## 📚 Связанные документы

- [UPDATE_USER_STATUS.md](UPDATE_USER_STATUS.md) - Полный анализ проблемы
- [API_UPDATE_GUIDE.md](API_UPDATE_GUIDE.md) - Руководство по использованию API
- [FINAL_STATUS.md](FINAL_STATUS.md) - Общий статус проекта
