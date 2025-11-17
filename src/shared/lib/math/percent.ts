export function percentGrowth(today: number, yesterday: number): string {
  // оба ноль → нет роста
  if (yesterday === 0 && today === 0) return "0%";

  // если вчера не было, а сегодня есть → бесконечный рост
  if (yesterday === 0 && today > 0) return "+∞%";

  // если вчера не было, а сегодня меньше нуля (теоретически убытки)
  if (yesterday === 0 && today < 0) return "-∞%";

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
  if (!value || !total || total === 0) return "0%";
  const percent = (value / total) * 100;
  return `${percent.toFixed(1)}%`; // например "12.3%"
}
