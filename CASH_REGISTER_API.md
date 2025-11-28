# API Кассы и Кассовых Смен

## Содержание
1. [Константы](#константы)
2. [Открытие смены](#открытие-смены)
3. [Закрытие смены](#закрытие-смены)
4. [Текущая смена](#текущая-смена)
5. [Изъятие денег владельцем](#изъятие-денег-владельцем)
6. [Движения наличности](#движения-наличности)
7. [Отчёт по смене](#отчёт-по-смене)
8. [Статистика кассиров](#статистика-кассиров)
9. [Пример флоу](#пример-флоу)

---

## Константы

| Константа | Значение | Описание |
|-----------|----------|----------|
| `DEFAULT_OPENING_CASH` | **100 000 сум** | Фиксированная сумма при открытии кассы |
| `MINIMUM_CASH_IN_REGISTER` | **100 000 сум** | Минимум наличных, которые должны оставаться в кассе |

---

## Открытие смены

**Endpoint:** `POST /api/sales/cashier-sessions/open/`

**Кто может:** Любой сотрудник с доступом

Открывает новую кассовую смену. Касса **всегда** открывается с балансом **100 000 сум**.

### Request
```json
{
    "opening_balance": 100000  // Опционально, по умолчанию 100000
}
```

### Response (201 Created)
```json
{
    "status": "success",
    "message": "Смена успешно открыта с балансом 100000.00 сум",
    "data": {
        "id": 1,
        "cash_register": {
            "id": 1,
            "name": "Главная касса",
            "code": "MAIN"
        },
        "cashier_name": "Иван Иванов",
        "status": "open",
        "opening_cash": "100000.00",
        "expected_cash": "0.00",
        "opened_at": "2025-01-15T09:00:00Z",
        "closed_at": null
    },
    "default_opening_cash": 100000.0
}
```

### Ошибки
| Код | Сообщение |
|-----|-----------|
| 400 | У вас уже есть открытая смена |

---

## Закрытие смены

**Endpoint:** `POST /api/sales/cashier-sessions/{id}/close/`

**Кто может:** ⚠️ **Только владелец или менеджер**

Владелец закрывает смену и указывает **сумму недостачи** (не фактическую сумму).

### Request
```json
{
    "shortage": 5000  // Сколько не хватает (0 если всё совпадает)
}
```

### Response (200 OK)
```json
{
    "status": "success",
    "message": "Смена закрыта",
    "data": {
        "id": 1,
        "cash_register": {
            "id": 1,
            "name": "Главная касса"
        },
        "cashier_name": "Иван Иванов",
        "status": "closed",
        "opening_cash": "100000.00",
        "expected_cash": "245000.00",
        "actual_cash": "240000.00",
        "cash_difference": "-5000.00",
        "opened_at": "2025-01-15T09:00:00Z",
        "closed_at": "2025-01-15T21:00:00Z"
    },
    "summary": {
        "expected_cash": 245000.0,
        "shortage": 5000.0,
        "actual_cash": 240000.0,
        "opening_cash_for_next_shift": 100000.0
    }
}
```

### Логика закрытия
1. Система рассчитывает `expected_cash` (ожидаемая сумма)
2. Владелец вводит `shortage` (сколько не хватает денег)
3. `actual_cash = expected_cash - shortage`
4. `cash_difference = -shortage` (отрицательная = недостача)

### Ошибки
| Код | Сообщение |
|-----|-----------|
| 403 | Только владелец или менеджер может закрыть смену |
| 400 | Смена уже закрыта |

---

## Текущая смена

**Endpoint:** `GET /api/sales/cashier-sessions/current/`

### Response (200 OK)
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "cash_register": {
            "id": 1,
            "name": "Главная касса"
        },
        "cashier_name": "Иван Иванов",
        "status": "open",
        "opening_cash": "100000.00",
        "expected_cash": "245000.00",
        "total_sales": "150000.00",
        "cash_sales": "120000.00",
        "card_sales": "30000.00",
        "opened_at": "2025-01-15T09:00:00Z"
    }
}
```

### Response (404 Not Found) — если нет открытой смены
```json
{
    "status": "error",
    "message": "Нет открытой смены",
    "data": null
}
```

---

## Изъятие денег владельцем

**Endpoint:** `POST /api/sales/cash-movements/owner-withdraw/`

**Кто может:** ⚠️ **Только владелец или менеджер**

Изъятие денег с ограничением: **в кассе должно оставаться минимум 100 000 сум**.

### Request
```json
{
    "session": 1,
    "amount": 150000,
    "description": "Инкассация"  // Опционально
}
```

### Response (200 OK) — успешное изъятие
```json
{
    "status": "success",
    "message": "Изъято 150000 сум",
    "data": {
        "movement": {
            "id": 5,
            "session": 1,
            "movement_type": "cash_out",
            "reason": "collection",
            "amount": "150000.00",
            "description": "Инкассация",
            "performed_by": 1,
            "created_at": "2025-01-15T14:30:00Z"
        },
        "cash_before": 350000.0,
        "cash_after": 200000.0,
        "minimum_required": 100000.0
    }
}
```

### Response (400 Bad Request) — превышение лимита
```json
{
    "status": "error",
    "code": "exceeds_limit",
    "message": "Нельзя изъять 400000 сум. Максимум можно изъять: 250000 сум (в кассе должно остаться минимум 100000 сум)",
    "data": {
        "current_balance": 350000.0,
        "requested": 400000.0,
        "max_withdraw": 250000.0,
        "minimum_required": 100000.0
    }
}
```

### Response (400 Bad Request) — недостаточно денег
```json
{
    "status": "error",
    "code": "insufficient_cash",
    "message": "В кассе недостаточно денег. Текущий баланс: 80000 сум. Минимум должно оставаться: 100000 сум",
    "data": {
        "current_balance": 80000.0,
        "minimum_required": 100000.0,
        "max_withdraw": 0
    }
}
```

### Ошибки
| Код | Сообщение |
|-----|-----------|
| 403 | Только владелец или менеджер может изымать деньги |
| 400 | exceeds_limit — нельзя изъять столько |
| 400 | insufficient_cash — в кассе меньше минимума |
| 404 | Смена не найдена или закрыта |

---

## Движения наличности

### Получить все движения

**Endpoint:** `GET /api/sales/cash-movements/`

### Query параметры
| Параметр | Тип | Описание |
|----------|-----|----------|
| `session` | int | Фильтр по ID смены |
| `movement_type` | string | `cash_in` или `cash_out` |
| `reason` | string | Причина (см. ниже) |

### Типы движений
| Тип | Описание |
|-----|----------|
| `cash_in` | Внесение денег |
| `cash_out` | Изъятие денег |

### Причины движений
| Причина | Описание |
|---------|----------|
| `collection` | Инкассация |
| `change` | Размен |
| `float` | Пополнение сдачи |
| `expense` | Расход |
| `correction` | Корректировка |
| `other` | Другое |

### Response
```json
{
    "count": 5,
    "results": [
        {
            "id": 1,
            "session": 1,
            "movement_type": "cash_out",
            "reason": "collection",
            "amount": "150000.00",
            "description": "Инкассация",
            "performed_by": 1,
            "created_at": "2025-01-15T14:30:00Z"
        }
    ]
}
```

---

## Отчёт по смене

**Endpoint:** `GET /api/sales/cashier-sessions/{id}/report/`

### Response
```json
{
    "session": {
        "id": 1,
        "cashier_name": "Иван Иванов",
        "status": "open",
        "opening_cash": "100000.00",
        "expected_cash": "245000.00",
        "opened_at": "2025-01-15T09:00:00Z"
    },
    "sales": {
        "total_amount": 150000,
        "total_items": 25,
        "count": 12
    },
    "payments": [
        {"payment_method": "cash", "total": 120000, "count": 8},
        {"payment_method": "card", "total": 30000, "count": 4}
    ],
    "cash_movements": {
        "cash_in": 50000,
        "cash_out": 150000
    }
}
```

---

## Статистика кассиров

**Endpoint:** `GET /api/sales/cashier-sessions/cashier-stats/`

### Query параметры
| Параметр | Тип | Описание | По умолчанию |
|----------|-----|----------|--------------|
| `date_from` | date | Начало периода | Начало месяца |
| `date_to` | date | Конец периода | Сегодня |
| `limit` | int | Количество кассиров | Все |

### Response
```json
{
    "status": "success",
    "data": {
        "period": {
            "from": "2025-01-01T00:00:00+05:00",
            "to": "2025-01-31T23:59:59+05:00"
        },
        "cashiers": [
            {
                "id": 1,
                "full_name": "Иванов Иван",
                "phone": "+998901234567",
                "role": "cashier",
                "total_sales": "5000000.00",
                "cash_sales": "3500000.00",
                "card_sales": "1500000.00",
                "sales_count": 150,
                "sessions_count": 25
            }
        ],
        "total_cashiers": 1
    }
}
```

---

## Статусы смены

| Статус | Описание |
|--------|----------|
| `open` | Смена открыта, можно работать |
| `closed` | Смена закрыта |
| `suspended` | Смена приостановлена |

---

## Пример флоу

```
┌─────────────────────────────────────────────────────────────────┐
│                    РАБОЧИЙ ДЕНЬ КАССИРА                         │
└─────────────────────────────────────────────────────────────────┘

09:00 - Кассир открывает смену
────────────────────────────────
POST /api/sales/cashier-sessions/open/
→ Касса начинает со 100 000 сум

09:00 - 21:00 - Кассир работает
────────────────────────────────
• Продажи наличными увеличивают expected_cash
• Продажи картой НЕ влияют на expected_cash
• Кассир видит текущий баланс кассы

15:00 - Владелец забирает деньги
────────────────────────────────
POST /api/sales/cash-movements/owner-withdraw/
{
    "session": 1,
    "amount": 200000
}

⚠️ Ограничение: в кассе должно остаться минимум 100 000 сум!

Было: 350 000 сум
Изъято: 200 000 сум
Осталось: 150 000 сум ✓ (больше минимума)

21:00 - Владелец закрывает смену
────────────────────────────────
POST /api/sales/cashier-sessions/1/close/

1. Система показывает: expected_cash = 150 000 сум
2. Владелец считает наличные в кассе
3. Если не хватает 5000 → вводит shortage: 5000

{
    "shortage": 5000  // Недостача
}

→ actual_cash = 145 000 сум
→ cash_difference = -5000 сум (недостача)

СЛЕДУЮЩИЙ ДЕНЬ
────────────────────────────────
POST /api/sales/cashier-sessions/open/
→ Касса снова начинает со 100 000 сум
```

---

## Формула расчёта expected_cash

```
expected_cash = opening_cash
              + cash_sales (продажи наличными)
              + cash_in (внесения)
              - cash_out (изъятия)
```

**Пример:**
```
Открытие:              100 000 сум
+ Продажи наличными:   250 000 сум
+ Внесение размена:     50 000 сум
- Изъятие владельцем:  200 000 сум
────────────────────────────────
= expected_cash:       200 000 сум
```

---

## Для UI: Ключевые моменты

### 1. Открытие смены
```javascript
// Кнопка "Открыть смену"
// Показать: "Касса откроется с балансом 100 000 сум"
const response = await fetch('/api/sales/cashier-sessions/open/', {
    method: 'POST',
    body: JSON.stringify({})  // opening_balance опционален
});
```

### 2. Показ баланса кассы
```javascript
const session = await fetch('/api/sales/cashier-sessions/current/');

// Показать текущий баланс
displayBalance(session.data.expected_cash);

// Показать максимум для изъятия
const maxWithdraw = session.data.expected_cash - 100000;
displayMaxWithdraw(maxWithdraw > 0 ? maxWithdraw : 0);
```

### 3. Изъятие денег
```javascript
// При попытке изъять больше лимита
if (response.status === 400 && response.data.code === 'exceeds_limit') {
    showError(`Максимум можно изъять: ${response.data.data.max_withdraw} сум`);
}
```

### 4. Закрытие смены (только для владельца)
```javascript
// Шаг 1: Показать ожидаемую сумму
const report = await fetch(`/api/sales/cashier-sessions/${sessionId}/report/`);
showExpectedCash(report.session.expected_cash);

// Шаг 2: Владелец вводит недостачу
const shortage = prompt('Сколько не хватает? (0 если всё совпадает)');

// Шаг 3: Закрыть смену
await fetch(`/api/sales/cashier-sessions/${sessionId}/close/`, {
    method: 'POST',
    body: JSON.stringify({ shortage: parseInt(shortage) })
});
```

---

## Заголовки запросов

```
Authorization: Bearer <token>
X-Tenant-Key: <store_key>
Content-Type: application/json
```

---

## Права доступа

| Действие | Кассир | Менеджер | Владелец |
|----------|--------|----------|----------|
| Открыть смену | ✅ | ✅ | ✅ |
| Просмотр баланса | ✅ | ✅ | ✅ |
| Изъятие денег | ❌ | ✅ | ✅ |
| Закрыть смену | ❌ | ✅ | ✅ |
| Отчёт по смене | ✅ | ✅ | ✅ |
