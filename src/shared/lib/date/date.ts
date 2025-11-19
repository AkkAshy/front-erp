export const getToday = (timeZone = "Asia/Tashkent"): string => {
  return new Date().toLocaleDateString("en-CA", { timeZone });
};

export const getYesterday = (timeZone = "Asia/Tashkent"): string => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toLocaleDateString("en-CA", { timeZone });
};

export const getFirstDayOfMonth = (timeZone = "Asia/Tashkent"): string => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDay.toLocaleDateString("en-CA", { timeZone });
};
