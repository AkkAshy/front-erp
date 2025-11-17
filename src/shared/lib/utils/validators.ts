export const isEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isStrongPassword = (value: string): boolean => {
  return value.length >= 6 && /[A-Z]/.test(value) && /\d/.test(value);
};
