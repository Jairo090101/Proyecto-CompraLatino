export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

/** Collected only to authorize the charge. Do not persist the number or the CVV. */
export interface CardPaymentRequest {
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

export type PaymentResult =
  | { approved: true; brand: Exclude<CardBrand, 'unknown'>; last4: string; authorizationCode: string }
  | { approved: false; reason: 'declined' | 'rejected'; message: string };
