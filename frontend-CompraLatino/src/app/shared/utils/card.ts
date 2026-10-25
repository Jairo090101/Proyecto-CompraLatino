import { CardBrand } from '../../models/payment.model';

export const BRAND_LABEL: Record<Exclude<CardBrand, 'unknown'>, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
};

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function detectBrand(number: string): CardBrand {
  const digits = digitsOnly(number);
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  return 'unknown';
}

export function formatCardNumber(value: string): string {
  const digits = digitsOnly(value);
  const brand = detectBrand(digits);
  const max = brand === 'amex' ? 15 : 16;
  const trimmed = digits.slice(0, max);
  if (brand === 'amex') {
    return [trimmed.slice(0, 4), trimmed.slice(4, 10), trimmed.slice(10, 15)].filter(Boolean).join(' ');
  }
  return trimmed.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 1) return digits === '0' || digits === '' ? digits : digits > '1' ? `0${digits}` : digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isExpiryValid(value: string, now = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const end = new Date(year, month, 0, 23, 59, 59);
  return end >= now;
}

export function luhnValid(number: string): boolean {
  const digits = digitsOnly(number);
  if (digits.length < 13) return false;
  let sum = 0;
  let alternate = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}
