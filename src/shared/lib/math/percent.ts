export function percentGrowth(today: number, yesterday: number): string {
  // оба ноль → нет роста
  if (yesterday === 0 && today === 0) return "0%";

  // если вчера не было, а сегодня есть → показываем +100% вместо бесконечности
  if (yesterday === 0 && today > 0) return "+100%";

  // если вчера не было, а сегодня меньше нуля (теоретически убытки)
  if (yesterday === 0 && today < 0) return "-100%";

  // если какое-то значение не число → 0%
  if (!Number.isFinite(today) || !Number.isFinite(yesterday)) return "0%";

  const growth = ((today - yesterday) / yesterday) * 100;
  const rounded = Math.round(growth);

  return `${growth > 0 ? "+" : ""}${rounded}%`;
}

export function percentOfTotal(
  value: number | undefined,
  total: number | undefined
): string {
  // Проверяем на null/undefined и NaN
  const numValue = typeof value === 'number' ? value : 0;
  const numTotal = typeof total === 'number' ? total : 0;

  if (!Number.isFinite(numValue) || !Number.isFinite(numTotal) || numTotal === 0) {
    return "0%";
  }

  if (numValue === 0) return "0%";

  const percent = (numValue / numTotal) * 100;
  return `${percent.toFixed(1)}%`; // например "12.3%"
}
