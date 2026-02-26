export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateAge(age: string): boolean {
  const num = parseInt(age);
  return !isNaN(num) && num > 0 && num <= 111;
}

export function validateHeight(height: string): boolean {
  return /^\d{3}$/.test(height);
}

export function validateWeight(weight: string): boolean {
  return /^\d{2,3}$/.test(weight);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+7|8)\d{10}$/.test(cleaned) && cleaned.length <= 12;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
