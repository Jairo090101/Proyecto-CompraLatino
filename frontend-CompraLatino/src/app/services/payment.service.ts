import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CardPaymentRequest, PaymentResult } from '../models/payment.model';
import { detectBrand, digitsOnly, isExpiryValid, luhnValid } from '../shared/utils/card';

/** Demo gateway. A real charge later uses a token from Stripe; the server never sees the PAN. */
const DEMO_CARDS = new Map<string, 'approved' | 'declined'>([
  ['4242424242424242', 'approved'],
  ['5555555555554444', 'approved'],
  ['378282246310005', 'approved'],
  ['4000000000000002', 'declined'],
]);

export const TEST_CARDS = [
  { number: '4242 4242 4242 4242', raw: '4242424242424242', cvv: '123', result: 'Aprobada' },
  { number: '5555 5555 5555 4444', raw: '5555555555554444', cvv: '123', result: 'Aprobada' },
  { number: '3782 822463 10005', raw: '378282246310005', cvv: '1234', result: 'Aprobada' },
  { number: '4000 0000 0000 0002', raw: '4000000000000002', cvv: '123', result: 'Rechazada' },
];

@Injectable({ providedIn: 'root' })
export class PaymentService {
  authorize(request: CardPaymentRequest, amountUsd: number): Observable<PaymentResult> {
    const number = digitsOnly(request.number);
    const brand = detectBrand(number);
    const cvvLength = brand === 'amex' ? 4 : 3;
    const outcome = DEMO_CARDS.get(number);
    const cardOk =
      brand !== 'unknown' &&
      luhnValid(number) &&
      isExpiryValid(request.expiry) &&
      digitsOnly(request.cvv).length === cvvLength &&
      request.holder.trim().length >= 2;

    let result: PaymentResult;
    if (!cardOk || amountUsd <= 0 || !outcome) {
      result = { approved: false, reason: 'rejected', message: 'Los datos de la tarjeta no son válidos.' };
    } else if (outcome === 'declined') {
      result = {
        approved: false,
        reason: 'declined',
        message: 'El banco de prueba rechazó el cargo. Prueba con otra tarjeta.',
      };
    } else {
      result = {
        approved: true,
        brand,
        last4: number.slice(-4),
        authorizationCode: createAuthCode(),
      };
    }
    return of(result).pipe(delay(700));
  }
}

function createAuthCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join('');
}
