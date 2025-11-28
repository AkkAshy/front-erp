export const normalizePhone = (maskedPhone: string) => {
  if (!maskedPhone) return "";

  // оставляем только цифры
  let digits = maskedPhone.replace(/\D/g, "");

  // если номер начинается с 998 (код Узбекистана) или 9 (локальный), нормализуем
  if (digits.startsWith("998")) {
    // уже с кодом, ничего не делаем
  } else if (digits.startsWith("9")) {
    digits = "998" + digits; // добавляем код
  }

  return `+${digits}`;
};

/**
 * Форматирует телефон с маской +998 XX XXX XX XX
 * @param value - введенное значение
 * @returns отформатированный телефон
 */
export function formatPhoneWithMask(value: string): string {
  // Убираем все кроме цифр
  let digits = value.replace(/\D/g, "");

  // Убираем начальные 998 если есть (мы добавим их потом)
  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }

  // Ограничиваем 9 цифрами (после 998)
  digits = digits.slice(0, 9);

  // Форматируем: XX XXX XX XX
  let formatted = "+998";
  if (digits.length > 0) {
    formatted += " " + digits.slice(0, 2);
  }
  if (digits.length > 2) {
    formatted += " " + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += " " + digits.slice(5, 7);
  }
  if (digits.length > 7) {
    formatted += " " + digits.slice(7, 9);
  }

  return formatted;
}

/**
 * Получает чистый номер телефона из форматированного (+998XXXXXXXXX)
 * @param formatted - форматированный номер
 * @returns чистый номер в формате +998XXXXXXXXX
 */
export function getCleanPhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  return digits.length > 0 ? `+${digits}` : "+998";
}

/**
 * Проверяет валидность номера телефона
 * @param phone - номер телефона
 * @returns true если номер валидный (13 символов: +998XXXXXXXXX)
 */
export function isValidPhone(phone: string): boolean {
  const clean = getCleanPhone(phone);
  return clean.length === 13 && clean.startsWith("+998");
}

/**
 * Парсит ошибку API и возвращает читаемое сообщение
 * @param error - объект ошибки от axios
 * @returns читаемое сообщение об ошибке
 */
export function parseApiError(error: any): string {
  const data = error?.response?.data;

  if (!data) {
    return "Xatolik yuz berdi";
  }

  // Если есть конкретное сообщение
  if (typeof data.message === "string" && !data.message.includes("ErrorDetail")) {
    return data.message;
  }

  // Если есть errors объект
  if (data.errors && typeof data.errors === "object") {
    const messages: string[] = [];
    for (const [field, errors] of Object.entries(data.errors)) {
      if (Array.isArray(errors)) {
        const fieldName = getFieldName(field);
        messages.push(`${fieldName}: ${errors.join(", ")}`);
      }
    }
    if (messages.length > 0) {
      return messages.join("; ");
    }
  }

  // Если есть отдельные поля с ошибками
  const fieldErrors: string[] = [];
  const knownFields = ["phone", "email", "first_name", "last_name", "name", "code", "amount"];
  for (const field of knownFields) {
    if (data[field] && Array.isArray(data[field])) {
      const fieldName = getFieldName(field);
      fieldErrors.push(`${fieldName}: ${data[field].join(", ")}`);
    }
  }
  if (fieldErrors.length > 0) {
    return fieldErrors.join("; ");
  }

  // Если есть detail
  if (data.detail) {
    return data.detail;
  }

  // Если есть error
  if (data.error) {
    return data.error;
  }

  return "Xatolik yuz berdi";
}

/**
 * Возвращает читаемое имя поля
 */
function getFieldName(field: string): string {
  const fieldNames: Record<string, string> = {
    phone: "Telefon",
    email: "Email",
    first_name: "Ism",
    last_name: "Familiya",
    name: "Nom",
    code: "Kod",
    amount: "Summa",
    password: "Parol",
    username: "Foydalanuvchi",
  };
  return fieldNames[field] || field;
}

export function formatUzPhone(phone?: string | number): string {
  if (!phone) return "";

  // убираем всё, кроме цифр
  let digits = String(phone).replace(/\D/g, "");

  // добавляем 998 если не хватает
  if (!digits.startsWith("998")) digits = "998" + digits;

  // ограничиваем 12 символами
  digits = digits.slice(0, 12);

  // форматируем через regexp
  return digits.replace(
    /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
    "+$1 $2 $3 $4 $5"
  );
}

/**
 * Форматирует число с пробелами в качестве разделителя тысяч
 * @param value - число для форматирования
 * @returns отформатированную строку (например: "1 000", "10 000", "100")
 */
export function formatNumber(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  // Используем русскую локаль (ru-RU) которая использует пробел как разделитель тысяч
  return num.toLocaleString('ru-RU');
}
