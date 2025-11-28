# Продажи и Реферальная система

## Содержание
1. [Продажи на кассе](#продажи-на-кассе)
2. [Изменение цены товара](#изменение-цены-товара)
3. [Применение купона](#применение-купона)
4. [Реферальная система](#реферальная-система)
5. [Создание реферала](#создание-реферала)
6. [Дашборд реферала](#дашборд-реферала)
7. [Выплаты рефералам](#выплаты-рефералам)

---

## Продажи на кассе

### Полный цикл продажи

```
1. Открыть кассовую смену
2. Сканировать/добавить товары
3. (Опционально) Изменить цену товара
4. (Опционально) Применить купон
5. Оформить оплату (checkout)
```

### 1. Открытие кассовой смены

```bash
POST /api/sales/sessions/open/
Headers:
  Authorization: Bearer {token}
  X-Tenant-Key: {store_schema}

Body:
{
    "cash_register": 1,
    "opening_amount": 100000
}

Response:
{
    "status": "success",
    "message": "Смена открыта",
    "data": {
        "id": 1,
        "cash_register": 1,
        "status": "open",
        "opening_amount": "100000.00",
        "opened_at": "2024-01-15T09:00:00Z"
    }
}
```

### 2. Сканирование товара

```bash
POST /api/sales/sales/scan_item/
Headers:
  Authorization: Bearer {token}
  X-Tenant-Key: {store_schema}

Body:
{
    "session": 1,
    "product": "4607001234567",  // Штрихкод или ID товара
    "quantity": 1
}

Response:
{
    "status": "success",
    "message": "Товар добавлен",
    "data": {
        "id": 1,
        "receipt_number": "CHECK-20240115093045",
        "status": "pending",
        "items": [
            {
                "id": 1,
                "product": {
                    "id": 5,
                    "name": "Молоко 1л",
                    "barcode": "4607001234567"
                },
                "quantity": "1.000",
                "unit_price": "12000.00",
                "total_price": "12000.00"
            }
        ],
        "subtotal": "12000.00",
        "discount_amount": "0.00",
        "total_amount": "12000.00"
    }
}
```

---

## Изменение цены товара

Кассир может изменить цену товара тремя способами:

### Способ 1: При сканировании товара

```bash
POST /api/sales/sales/scan_item/
{
    "session": 1,
    "product": "4607001234567",
    "quantity": 1,
    "unit_price": 10000  // Кастомная цена вместо 12000
}
```

### Способ 2: При добавлении в существующую продажу

```bash
POST /api/sales/sales/{sale_id}/add_item/
{
    "product": 5,
    "quantity": 2,
    "unit_price": 10000  // Кастомная цена
}
```

### Способ 3: Изменение уже добавленного товара

```bash
POST /api/sales/sales/{sale_id}/update-item/
{
    "item_id": 1,           // ID позиции в чеке
    "unit_price": 10000,    // Новая цена
    "quantity": 3           // Новое количество (опционально)
}

Response:
{
    "status": "success",
    "message": "Товар обновлён",
    "data": {
        "id": 1,
        "items": [
            {
                "id": 1,
                "product": {"name": "Молоко 1л"},
                "quantity": "3.000",
                "unit_price": "10000.00",
                "total_price": "30000.00"
            }
        ],
        "subtotal": "30000.00",
        "total_amount": "30000.00"
    }
}
```

### Удаление товара из чека

```bash
DELETE /api/sales/sales/{sale_id}/remove-item/
{
    "item_id": 1
}
```

---

## Применение купона

### Проверка купона перед применением

```bash
POST /api/referrals/coupons/validate/
{
    "coupon_code": "IVAN10",
    "subtotal": 100000
}

Response:
{
    "status": "valid",
    "coupon": {
        "id": 1,
        "code": "IVAN10",
        "name": "Купон Ивана",
        "coupon_type": "both",
        "referral_name": "Иван Петров"
    },
    "discount": 10000.00,
    "final_total": 90000.00,
    "message": "Купон \"IVAN10\" применён. Скидка: 10000 сум"
}
```

### Применение купона к продаже

```bash
POST /api/sales/sales/{sale_id}/apply-coupon/
{
    "coupon_code": "IVAN10"
}

Response:
{
    "status": "success",
    "message": "Купон применён",
    "data": {
        "id": 1,
        "coupon": {
            "id": 1,
            "code": "IVAN10",
            "referral_name": "Иван Петров"
        },
        "subtotal": "100000.00",
        "coupon_discount": "10000.00",
        "discount_amount": "10000.00",
        "total_amount": "90000.00"
    }
}
```

### Удаление купона

```bash
POST /api/sales/sales/{sale_id}/remove-coupon/

Response:
{
    "status": "success",
    "message": "Купон удалён",
    "data": {
        "coupon": null,
        "coupon_discount": "0.00",
        "total_amount": "100000.00"
    }
}
```

### Оформление оплаты (checkout)

```bash
POST /api/sales/sales/{sale_id}/checkout/
{
    "payments": [
        {
            "payment_method": "cash",
            "amount": 90000,
            "received_amount": 100000  // Получено от клиента
        }
    ]
}

Response:
{
    "status": "success",
    "message": "Продажа завершена",
    "data": {
        "id": 1,
        "status": "completed",
        "total_amount": "90000.00",
        "change_amount": "10000.00",  // Сдача
        "coupon": {"code": "IVAN10"},
        "coupon_discount": "10000.00"
    }
}
```

При завершении продажи с купоном автоматически:
- Реферал получает комиссию (% от суммы продажи)
- Обновляется статистика реферала
- Увеличивается счётчик использований купона

---

## Реферальная система

### Роли и доступ

| Роль | Доступ |
|------|--------|
| **Owner/Manager** | Создание рефералов, управление купонами, выплаты |
| **Referral** | Только просмотр своего дашборда |
| **Cashier** | Применение купонов при продаже |

### Типы купонов

| Тип | Описание |
|-----|----------|
| `discount` | Только скидка покупателю |
| `referral_bonus` | Только бонус рефералу (без скидки) |
| `both` | И скидка покупателю, и бонус рефералу |

### Типы скидок

| Тип | Пример |
|-----|--------|
| `percent` | 10% от суммы чека |
| `fixed` | 5000 сум фиксированная скидка |

---

## Создание реферала

Только **владелец** или **менеджер** магазина может создавать рефералов.

### Полный запрос на создание

```bash
POST /api/referrals/referrals/
Headers:
  Authorization: Bearer {owner_token}
  X-Tenant-Key: {store_schema}

Body:
{
    "name": "Иван Петров",
    "phone": "+998901234567",
    "email": "ivan@example.com",
    "commission_percent": 5.00,

    "username": "ivan_referral",
    "password": "securepassword123",

    "create_coupon": true,
    "coupon_code": "IVAN10",
    "coupon_name": "Купон Ивана",
    "coupon_type": "both",
    "discount_type": "percent",
    "discount_value": 10
}

Response:
{
    "status": "success",
    "message": "Реферал успешно создан",
    "data": {
        "referral": {
            "id": 1,
            "name": "Иван Петров",
            "phone": "+998901234567",
            "email": "ivan@example.com",
            "commission_percent": "5.00",
            "balance": "0.00",
            "total_paid": "0.00",
            "total_sales_count": 0,
            "total_sales_amount": "0.00",
            "is_active": true,
            "coupons": [
                {
                    "id": 1,
                    "code": "IVAN10",
                    "name": "Купон Ивана",
                    "coupon_type": "both",
                    "discount_type": "percent",
                    "discount_value": "10.00",
                    "is_active": true,
                    "usage_count": 0
                }
            ]
        },
        "credentials": {
            "username": "ivan_referral",
            "password": "securepassword123"
        },
        "coupon": {
            "id": 1,
            "code": "IVAN10",
            "discount_type": "percent",
            "discount_value": "10.00"
        }
    }
}
```

### Параметры создания реферала

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `name` | string | Да | Имя реферала |
| `phone` | string | Нет | Телефон |
| `email` | string | Нет | Email |
| `commission_percent` | decimal | Нет | Процент комиссии (по умолчанию 5%) |
| `username` | string | Да | Логин для входа |
| `password` | string | Да | Пароль (мин. 6 символов) |
| `create_coupon` | boolean | Нет | Создать купон (по умолчанию true) |
| `coupon_code` | string | Нет | Код купона (автогенерация если пусто) |
| `coupon_name` | string | Нет | Название купона |
| `coupon_type` | string | Нет | Тип: discount, referral_bonus, both |
| `discount_type` | string | Нет | Тип скидки: percent, fixed |
| `discount_value` | decimal | Нет | Размер скидки |

### Пример: Купон только с бонусом рефералу (без скидки клиенту)

```bash
POST /api/referrals/referrals/
{
    "name": "Мария Сидорова",
    "commission_percent": 3.00,
    "username": "maria_ref",
    "password": "password123",

    "create_coupon": true,
    "coupon_code": "MARIA",
    "coupon_type": "referral_bonus",  // Клиент НЕ получает скидку
    "discount_type": "percent",
    "discount_value": 0
}
```

При использовании этого купона:
- Клиент платит полную цену
- Мария получает 3% комиссии с продажи

### Пример: Фиксированная скидка

```bash
{
    "name": "Алексей",
    "commission_percent": 2.00,
    "username": "alex_ref",
    "password": "password123",

    "coupon_code": "ALEX5000",
    "coupon_type": "both",
    "discount_type": "fixed",
    "discount_value": 5000  // 5000 сум скидка
}
```

---

## Дашборд реферала

Реферал входит в систему со своими credentials и видит только свой дашборд.

### Вход реферала

```bash
POST /api/users/auth/login/
{
    "username": "ivan_referral",
    "password": "securepassword123"
}

Response:
{
    "access": "eyJ...",
    "refresh": "eyJ...",
    "user": {
        "id": 10,
        "username": "ivan_referral",
        "role": "referral"
    }
}
```

### Получение дашборда

```bash
GET /api/referrals/referrals/dashboard/
Headers:
  Authorization: Bearer {referral_token}
  X-Tenant-Key: {store_schema}

Response:
{
    "id": 1,
    "name": "Иван Петров",
    "commission_percent": "5.00",

    "balance": "125000.00",
    "total_paid": "50000.00",
    "total_earned": "175000.00",

    "total_sales_count": 45,
    "total_sales_amount": "3500000.00",

    "coupons": [
        {
            "id": 1,
            "code": "IVAN10",
            "name": "Купон Ивана",
            "coupon_type": "both",
            "discount_type": "percent",
            "discount_value": "10.00",
            "is_active": true,
            "is_valid": true,
            "usage_count": 45,
            "total_discount_given": "350000.00",
            "total_sales_amount": "3500000.00"
        }
    ],

    "recent_earnings": [
        {
            "id": 100,
            "sale": 456,
            "sale_amount": "80000.00",
            "commission_percent": "5.00",
            "commission_amount": "4000.00",
            "discount_given": "8000.00",
            "status": "confirmed",
            "created_at": "2024-01-15T14:30:00Z"
        },
        {
            "id": 99,
            "sale": 455,
            "sale_amount": "120000.00",
            "commission_percent": "5.00",
            "commission_amount": "6000.00",
            "discount_given": "12000.00",
            "status": "confirmed",
            "created_at": "2024-01-15T12:15:00Z"
        }
    ],

    "recent_payouts": [
        {
            "id": 5,
            "amount": "50000.00",
            "payment_method": "cash",
            "payment_method_display": "Наличные",
            "notes": "Выплата за январь",
            "created_at": "2024-01-10T16:00:00Z"
        }
    ]
}
```

### Описание полей дашборда

| Поле | Описание |
|------|----------|
| `balance` | Текущий баланс (доступно к выплате) |
| `total_paid` | Всего выплачено за всё время |
| `total_earned` | Всего заработано (balance + total_paid) |
| `total_sales_count` | Количество продаж по купону |
| `total_sales_amount` | Общая сумма продаж по купону |
| `recent_earnings` | Последние 10 заработков |
| `recent_payouts` | Последние 10 выплат |

### Статистика реферала по периодам

```bash
GET /api/referrals/referrals/{id}/stats/?period=month
Headers:
  Authorization: Bearer {owner_or_referral_token}

Response:
{
    "period": "month",
    "start_date": "2024-01-01T00:00:00Z",
    "stats": {
        "total_sales": 45,
        "total_amount": 3500000.00,
        "total_commission": 175000.00,
        "total_discount": 350000.00
    },
    "current_balance": 125000.00,
    "total_paid": 50000.00
}
```

Доступные периоды: `week`, `month`, `year`

---

## Выплаты рефералам

Только **владелец** или **менеджер** может делать выплаты.

### Создание выплаты

```bash
POST /api/referrals/referrals/{referral_id}/payout/
Headers:
  Authorization: Bearer {owner_token}
  X-Tenant-Key: {store_schema}

Body:
{
    "amount": 100000,
    "payment_method": "cash",
    "notes": "Выплата за январь 2024"
}

Response:
{
    "status": "success",
    "message": "Выплачено 100000 сум",
    "data": {
        "payout": {
            "id": 6,
            "referral": 1,
            "referral_name": "Иван Петров",
            "amount": "100000.00",
            "payment_method": "cash",
            "payment_method_display": "Наличные",
            "notes": "Выплата за январь 2024",
            "paid_by": 1,
            "paid_by_name": "Админ Магазина",
            "created_at": "2024-01-15T17:00:00Z"
        },
        "new_balance": 25000.00
    }
}
```

### Способы выплаты

| Метод | Описание |
|-------|----------|
| `cash` | Наличные |
| `card` | Перевод на карту |
| `bank` | Банковский перевод |

### Ошибки при выплате

```bash
# Сумма превышает баланс
{
    "error": "Сумма выплаты (200000) превышает баланс (125000)"
}

# Отрицательная сумма
{
    "error": "Сумма должна быть положительной"
}
```

### История выплат реферала

```bash
GET /api/referrals/referrals/{referral_id}/payouts/
Headers:
  Authorization: Bearer {owner_token}

Response:
{
    "count": 5,
    "results": [
        {
            "id": 6,
            "amount": "100000.00",
            "payment_method": "cash",
            "notes": "Выплата за январь 2024",
            "created_at": "2024-01-15T17:00:00Z"
        },
        ...
    ]
}
```

### История заработков реферала

```bash
GET /api/referrals/referrals/{referral_id}/earnings/?status=confirmed
Headers:
  Authorization: Bearer {owner_token}

# Фильтры:
# - status: pending, confirmed, paid, cancelled
# - date_from: 2024-01-01
# - date_to: 2024-01-31

Response:
{
    "count": 45,
    "results": [
        {
            "id": 100,
            "sale": 456,
            "sale_amount": "80000.00",
            "commission_percent": "5.00",
            "commission_amount": "4000.00",
            "discount_given": "8000.00",
            "status": "confirmed",
            "created_at": "2024-01-15T14:30:00Z"
        },
        ...
    ]
}
```

---

## Управление купонами

### Список купонов магазина

```bash
GET /api/referrals/coupons/
Headers:
  Authorization: Bearer {owner_token}

Response:
{
    "count": 3,
    "results": [
        {
            "id": 1,
            "referral": 1,
            "referral_name": "Иван Петров",
            "code": "IVAN10",
            "name": "Купон Ивана",
            "coupon_type": "both",
            "discount_type": "percent",
            "discount_value": "10.00",
            "min_purchase_amount": "0.00",
            "max_discount_amount": null,
            "usage_limit": null,
            "usage_count": 45,
            "is_active": true,
            "is_valid": true
        }
    ]
}
```

### Создание дополнительного купона

```bash
POST /api/referrals/coupons/
Headers:
  Authorization: Bearer {owner_token}

Body:
{
    "referral": 1,
    "code": "IVAN20",
    "name": "VIP Купон Ивана",
    "coupon_type": "both",
    "discount_type": "percent",
    "discount_value": 20,
    "min_purchase_amount": 200000,
    "max_discount_amount": 50000,
    "usage_limit": 100,
    "valid_until": "2024-12-31T23:59:59Z"
}
```

### Параметры купона

| Поле | Описание |
|------|----------|
| `min_purchase_amount` | Минимальная сумма чека для активации |
| `max_discount_amount` | Максимальная скидка (для процентных купонов) |
| `usage_limit` | Лимит использований (null = без лимита) |
| `valid_from` | Действует с (null = сразу) |
| `valid_until` | Действует до (null = бессрочно) |

### Деактивация купона

```bash
PATCH /api/referrals/coupons/{coupon_id}/
{
    "is_active": false
}
```

### Получение купона по коду

```bash
GET /api/referrals/coupons/by-code/IVAN10/

Response:
{
    "coupon": {
        "id": 1,
        "code": "IVAN10",
        "referral_name": "Иван Петров",
        ...
    },
    "is_valid": true
}
```

---

## Примеры сценариев

### Сценарий 1: Полная продажа с купоном

```bash
# 1. Кассир открывает смену
POST /api/sales/sessions/open/
{"cash_register": 1, "opening_amount": 100000}

# 2. Сканирует товары
POST /api/sales/sales/scan_item/
{"session": 1, "product": "4607001234567", "quantity": 2}

POST /api/sales/sales/scan_item/
{"session": 1, "product": "4607009876543", "quantity": 1}

# Subtotal: 50000

# 3. Клиент называет купон
POST /api/sales/sales/1/apply-coupon/
{"coupon_code": "IVAN10"}

# Discount: 5000 (10%)
# Total: 45000

# 4. Оплата
POST /api/sales/sales/1/checkout/
{"payments": [{"payment_method": "cash", "amount": 45000, "received_amount": 50000}]}

# Сдача: 5000
# Иван получает: 2250 сум (5% от 45000)
```

### Сценарий 2: Изменение цены со скидкой

```bash
# 1. Сканирование товара
POST /api/sales/sales/scan_item/
{"session": 1, "product": 5, "quantity": 1}
# Цена из каталога: 100000

# 2. Кассир даёт персональную скидку
POST /api/sales/sales/1/update-item/
{"item_id": 1, "unit_price": 85000}

# 3. Применение купона поверх
POST /api/sales/sales/1/apply-coupon/
{"coupon_code": "IVAN10"}

# Subtotal: 85000
# Coupon discount: 8500 (10%)
# Total: 76500
```

### Сценарий 3: Просмотр дашборда рефералом

```bash
# 1. Реферал входит
POST /api/users/auth/login/
{"username": "ivan_referral", "password": "securepassword123"}

# 2. Получает токен и смотрит дашборд
GET /api/referrals/referrals/dashboard/
Headers: Authorization: Bearer {token}

# Видит:
# - Баланс: 125000 сум
# - Всего заработано: 175000 сум
# - Продаж: 45
# - Последние транзакции
```

---

## Ограничения и правила

1. **Реферал не может**:
   - Видеть товары магазина
   - Видеть других рефералов
   - Делать выплаты себе
   - Создавать/редактировать купоны

2. **Купон можно применить только**:
   - К незавершённой продаже (status: pending)
   - Если купон активен и валиден
   - Если сумма чека >= min_purchase_amount

3. **Комиссия начисляется**:
   - Автоматически при завершении продажи
   - От суммы total_amount (после скидки)
   - Сразу в статусе "confirmed"

4. **Выплата возможна**:
   - Только если amount <= balance
   - Только владельцем/менеджером
