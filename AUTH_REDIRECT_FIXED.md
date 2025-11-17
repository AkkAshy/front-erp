# Auth Redirect Fixed - Исправлен редирект после логина ✅

## Проблема

После успешного логина/регистрации пользователь оставался на странице авторизации, вместо того чтобы перейти на главную страницу.

---

## Причина

`GuestRoute` компонент проверяет авторизацию только при монтировании через хук `useAuth`. После успешного логина:

1. ✅ Токены сохраняются в localStorage
2. ✅ `navigate("/")` вызывается
3. ❌ Но `GuestRoute` не перерендеривается
4. ❌ `useAuth` не проверяет токены повторно
5. ❌ Пользователь остается на `/auth`

### Почему не работал `navigate()`?

```typescript
// useAuth.ts
useEffect(() => {
  const checkAuth = async () => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  };

  checkAuth();
}, []); // ⚠️ Пустой массив зависимостей - проверка только 1 раз!
```

React Router пытается перейти на `/`, но `GuestRoute` видит `isAuthenticated: false` (старое значение) и редиректит обратно на `/auth`.

---

## Решение

Используем **жесткий редирект** через `window.location.href` вместо `navigate()`.

### До (НЕПРАВИЛЬНО):

```typescript
// LoginForm.tsx
login.mutate(
  { username, password },
  {
    onSuccess: () => {
      const from = location.state?.from || "/";
      navigate(from, { replace: true }); // ❌ Не работает
    },
  }
);
```

### После (ПРАВИЛЬНО):

```typescript
// LoginForm.tsx
login.mutate(
  { username, password },
  {
    onSuccess: () => {
      const from = location.state?.from || "/";
      window.location.href = from; // ✅ Работает
    },
  }
);
```

---

## Почему `window.location.href` работает?

| Метод | Что делает | Проверяет ли useAuth? |
|-------|------------|----------------------|
| `navigate()` | SPA навигация | ❌ НЕТ (использует старое состояние) |
| `window.location.href` | Полная перезагрузка страницы | ✅ ДА (вызывает useEffect заново) |

При использовании `window.location.href`:
1. Страница полностью перезагружается
2. `GuestRoute` монтируется заново
3. `useAuth` запускается заново
4. `getAccessToken()` находит токен
5. `isAuthenticated` становится `true`
6. Редирект на главную срабатывает

---

## Измененные файлы

### 1. Login Form ✅

**Файл:** [src/features/Auth/Login/ui/index.tsx](src/features/Auth/Login/ui/index.tsx#L30-L35)

```typescript
onSuccess: () => {
  // Используем window.location для жесткого редиректа
  // Это гарантирует, что GuestRoute перепроверит авторизацию
  const from = location.state?.from || "/";
  window.location.href = from;
},
```

### 2. Register Form ✅

**Файл:** [src/features/Auth/Register/ui/RegisterForm.tsx](src/features/Auth/Register/ui/RegisterForm.tsx#L102-L107)

```typescript
onSuccess: () => {
  // ⭐ tenant_key уже сохранён в sessionApi.register()
  // Используем window.location для жесткого редиректа
  const from = location.state?.from || "/";
  window.location.href = from;
},
```

---

## Альтернативные решения

### Вариант 1: Контекст авторизации (более правильно, но сложнее)

```typescript
// AuthContext.tsx
const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// LoginForm.tsx
const { login: authLogin } = useAuthContext();

login.mutate(data, {
  onSuccess: () => {
    authLogin(); // Обновляет контекст
    navigate("/"); // Теперь работает
  }
});
```

**Плюсы:**
- ✅ SPA навигация (без перезагрузки)
- ✅ Реактивное состояние
- ✅ Более React-way

**Минусы:**
- ❌ Требует рефакторинга всего auth
- ❌ Больше кода
- ❌ Нужно оборачивать всё приложение в Provider

### Вариант 2: Обновить useAuth с зависимостями (средне)

```typescript
// useAuth.ts
export const useAuth = (refreshTrigger?: number) => {
  useEffect(() => {
    checkAuth();
  }, [refreshTrigger]); // Проверка при изменении trigger
};

// LoginForm.tsx
const [authTrigger, setAuthTrigger] = useState(0);

login.mutate(data, {
  onSuccess: () => {
    setAuthTrigger(prev => prev + 1); // Триггерит перепроверку
    navigate("/");
  }
});
```

**Плюсы:**
- ✅ SPA навигация
- ✅ Меньше изменений

**Минусы:**
- ❌ Нужно пробрасывать trigger через всё дерево
- ❌ Может не сработать из-за timing

### Вариант 3: window.location.href (выбрано) ✅

**Плюсы:**
- ✅ Просто
- ✅ Надежно
- ✅ Минимум изменений
- ✅ Гарантированно работает

**Минусы:**
- ⚠️ Перезагрузка страницы (теряется состояние)
- ⚠️ Небольшая задержка

**Почему выбрали:**
После логина/регистрации состояние всё равно нужно загружать заново (профиль, смена, и т.д.), поэтому перезагрузка страницы не критична.

---

## Как тестировать

### 1. Тест логина

```bash
1. Открыть http://localhost:3110/auth
2. Ввести username и password
3. Нажать "Kirish"
4. ✅ Должен перейти на http://localhost:3110/
5. ✅ Не должен возвращаться на /auth
```

### 2. Тест регистрации

```bash
1. Открыть http://localhost:3110/register
2. Заполнить форму
3. Нажать "Ro'yxatdan o'tish"
4. ✅ Должен перейти на http://localhost:3110/
5. ✅ Не должен возвращаться на /register
```

### 3. Тест protected route

```bash
1. Выйти из системы (очистить localStorage)
2. Попытаться открыть http://localhost:3110/inventory
3. ✅ Должен редиректнуть на /auth
4. Залогиниться
5. ✅ Должен вернуться на /inventory (from state)
```

---

## Workflow авторизации

```
┌─────────────────────────────────────────┐
│  Пользователь на /auth                  │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Вводит логин/пароль                    │
│  Нажимает "Kirish"                      │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  POST /api/users/auth/login/            │
│  { username, password }                 │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  sessionApi.login() сохраняет:          │
│  - access_token                         │
│  - refresh_token                        │
│  - tenant_key                           │
│  - user, store, employee                │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  onSuccess callback                     │
│  window.location.href = "/"             │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  ПЕРЕЗАГРУЗКА СТРАНИЦЫ                  │
│  Браузер загружает /                    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  PrivateRoute монтируется               │
│  useAuth() проверяет токен              │
│  getAccessToken() ✅ находит токен      │
│  isAuthenticated = true                 │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Рендерит <App />                       │
│  Показывает главную страницу            │
└─────────────────────────────────────────┘
```

---

## Важные замечания

### 1. Сохранение состояния

После перезагрузки страницы локальное состояние React теряется. Но это не проблема, потому что:

- ✅ Токены сохранены в localStorage
- ✅ Данные пользователя загружаются через API
- ✅ Корзина POS загружается через GET /api/sales/sales/current/
- ✅ Смена загружается через GET /api/sales/sessions/current/

### 2. Performance

Перезагрузка страницы занимает ~100-300ms. Это приемлемо для логина/регистрации, которые происходят редко.

### 3. UX

Пользователь видит белый экран на долю секунды, пока страница перезагружается. Это нормально и ожидаемо при логине.

---

## Итого

✅ **Проблема решена!**

- ✅ После логина пользователь перенаправляется на главную
- ✅ После регистрации пользователь перенаправляется на главную
- ✅ Protected routes работают корректно
- ✅ Минимум изменений в коде
- ✅ Надежное решение

**Можно пользоваться!** 🎉

---

_Создано: 2025-01-17_
_Статус: ✅ ИСПРАВЛЕНО_
