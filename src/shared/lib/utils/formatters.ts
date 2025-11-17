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
