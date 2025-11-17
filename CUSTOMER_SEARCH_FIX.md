# ✅ Исправление поиска клиентов

**Дата:** 17 ноября 2025

---

## Проблема

При вводе номера телефона клиента не отображался ни dropdown с результатами поиска, ни кнопка создания нового клиента.

### Причины:

1. **404 ошибка** - Endpoint `/api/customers/customers/search_by_phone/` не существует на backend
2. **Отсутствие setShowResults(true)** - После неудачного поиска не устанавливался флаг показа dropdown

---

## Решение

### 1. Убран точный поиск по `search_by_phone`

Вместо двухшагового поиска (точный → частичный), теперь используется только один запрос через `getFilteredCustomers`:

```typescript
// Было (два запроса):
try {
  // 1. Точный поиск
  const response = await customersApi.searchByPhone(phoneValue);
  // ...
} catch (error) {
  // 2. Частичный поиск
  const searchResponse = await customersApi.getFilteredCustomers({...});
  // ...
}

// Стало (один запрос):
const searchResponse = await customersApi.getFilteredCustomers({
  search: phoneValue,
  limit: 10,
});
```

### 2. Добавлен `setShowResults(true)` во всех случаях

Теперь dropdown показывается:
- ✅ Если клиенты найдены
- ✅ Если клиенты НЕ найдены (с кнопкой создания)
- ✅ При ошибке поиска

```typescript
if (results.length > 0) {
  setCustomers(results);
  setShowResults(true);  // ✅ Показываем dropdown
  setNotFound(false);
} else {
  setCustomers([]);
  setNotFound(true);
  setShowResults(true);  // ✅ Показываем dropdown с "не найдено"
}
```

---

## Как работает сейчас

### Сценарий 1: Клиент найден

1. Вводите номер: `+998905755748`
2. Автоматический поиск при 13 символах
3. Отправляется запрос: `GET /api/customers/customers/?search=+998905755748&limit=10`
4. Показывается dropdown со списком найденных клиентов
5. Клик на клиента → выбор

### Сценарий 2: Клиент НЕ найден

1. Вводите номер: `+998999999999`
2. Автоматический поиск
3. Ответ: `{count: 0, results: []}`
4. Показывается dropdown с:
   ```
   Mijoz topilmadi

   [+ Bu telefon bilan yangi mijoz yaratish]
   ```
5. Клик на кнопку → открывается модальное окно создания

### Сценарий 3: Создание нового клиента

1. Клик на "Yangi mijoz yaratish"
2. Открывается модальное окно с автозаполненным телефоном
3. Заполняете форму (Ism, Familiya, Email, и т.д.)
4. Нажимаете "Saqlash"
5. Клиент создается → автоматически выбирается
6. Можно продолжить продажу

---

## API используемый для поиска

### Endpoint: `GET /api/customers/customers/`

**Параметры:**
- `search` - номер телефона (полный или частичный)
- `limit` - количество результатов (по умолчанию 10)

**Пример запроса:**
```
GET /api/customers/customers/?search=+998905755748&limit=10
```

**Ответ:**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "first_name": "Иван",
      "last_name": "Петров",
      "phone": "+998905755748",
      "email": "ivan@example.com",
      "is_vip": false,
      "total_spent": 150000,
      "total_purchases": 5,
      "bonus_balance": 1500
    }
  ]
}
```

---

## Что изменилось в коде

### Файл: [src/shared/ui/CustomerSearch/index.tsx](src/shared/ui/CustomerSearch/index.tsx:54-98)

**Было:**
```typescript
try {
  const response = await customersApi.searchByPhone(phoneValue);
  // ...
} catch (error) {
  try {
    const searchResponse = await customersApi.getFilteredCustomers({
      search: phoneValue.replace("+998", ""),
      limit: 5,
    });
    // ...
  } catch (searchError) {
    setCustomers([]);
    setNotFound(true);
    // ❌ НЕ было setShowResults(true)
  }
}
```

**Стало:**
```typescript
try {
  const searchResponse = await customersApi.getFilteredCustomers({
    search: phoneValue,
    limit: 10,
  });

  const results = searchResponse.data.results || [];
  if (results.length > 0) {
    setCustomers(results);
    setShowResults(true);
    setNotFound(false);
  } else {
    setCustomers([]);
    setNotFound(true);
    setShowResults(true);  // ✅ Показываем dropdown
  }
} catch (searchError) {
  setCustomers([]);
  setNotFound(true);
  setShowResults(true);  // ✅ Показываем dropdown
}
```

---

## Тестирование

### Checklist:

- [x] Ввод полного номера показывает результаты
- [x] Если клиент не найден - показывается кнопка создания
- [x] Кнопка создания открывает модальное окно
- [x] Телефон автоматически заполняется в форме
- [x] После создания клиент автоматически выбирается
- [x] Dropdown закрывается при клике вне его
- [x] Компиляция без ошибок
- [x] Нет 404 ошибок в консоли

---

## Известные ограничения

### Backend endpoint `search_by_phone` не существует

Если на backend будет добавлен endpoint `/api/customers/customers/search_by_phone/`, можно вернуть двухшаговый поиск для более точных результатов.

**Пример реализации на backend (Django):**
```python
@action(detail=False, methods=['get'])
def search_by_phone(self, request):
    phone = request.query_params.get('phone')
    if not phone:
        return Response({"error": "Phone is required"}, status=400)

    customer = Customer.objects.filter(phone=phone).first()
    if customer:
        serializer = self.get_serializer(customer)
        return Response({
            "status": "success",
            "data": serializer.data
        })
    else:
        return Response({
            "status": "error",
            "message": "Customer not found"
        }, status=404)
```

---

## Статус: ✅ Исправлено и работает!

Теперь поиск клиентов работает корректно:
- ✅ Показывается dropdown с результатами
- ✅ Показывается кнопка создания, если не найдено
- ✅ Нет 404 ошибок
- ✅ Работает создание новых клиентов

---

**Дата исправления:** 17 ноября 2025
**Версия:** 1.1
