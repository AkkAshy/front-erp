export const mapPaymentSummary = (
  data: {
    payment_method: string;
    total_amount: number;
  }[],
  total_amount: number
) => {
  const methodMap: Record<string, string> = {
    total: "Umumiy",
    card: "Karta",
    cash: "Naqd Pul",
    transfer: "O'tkazma",
    debt: "Qarz",
    hybrid: "Gibrid",
  };

  const defaultValues: Record<string, number> = {
    total: total_amount,
    card: 0,
    cash: 0,
    transfer: 0,
    debt: 0,
    hybrid: 0,
  };

  // Переносим реальные суммы в defaultValues
  data.forEach((item) => {
    defaultValues[item.payment_method] = item.total_amount;
  });

  // Преобразуем в массив с локализованными суммами
  return Object.entries(defaultValues).map(([key, value]) => ({
    method: methodMap[key] ?? key,
    price: value,
  }));
};
