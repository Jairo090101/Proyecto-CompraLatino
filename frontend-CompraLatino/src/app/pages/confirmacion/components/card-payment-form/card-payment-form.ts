import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { CardPaymentRequest } from '../../../../models/payment.model';
import { TEST_CARDS } from '../../../../services/payment.service';
import { detectBrand, digitsOnly, formatCardNumber, formatExpiry, isExpiryValid, luhnValid } from '../../../../shared/utils/card';

const cardNumberValidator: ValidatorFn = (control) => {
  const digits = digitsOnly(String(control.value ?? ''));
  const brand = detectBrand(digits);
  const length = brand === 'amex' ? 15 : 16;
  return brand !== 'unknown' && digits.length === length && luhnValid(digits) ? null : { card: true };
};

const expiryValidator: ValidatorFn = (control) => (isExpiryValid(String(control.value ?? '')) ? null : { expiry: true });

const cvvValidator: ValidatorFn = (control) => {
  const number = String(control.parent?.get('number')?.value ?? '');
  const length = detectBrand(number) === 'amex' ? 4 : 3;
  return digitsOnly(String(control.value ?? '')).length === length ? null : { cvv: true };
};

@Component({
  selector: 'app-card-payment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './card-payment-form.html',
  styleUrl: './card-payment-form.css',
})
export class CardPaymentForm {
  readonly busy = input(false);
  readonly pay = output<CardPaymentRequest>();
  readonly testCards = TEST_CARDS;
  readonly form = inject(FormBuilder).nonNullable.group({
    holder: ['', [Validators.required, Validators.minLength(2)]],
    number: ['', [Validators.required, cardNumberValidator]],
    expiry: ['', [Validators.required, expiryValidator]],
    cvv: ['', [Validators.required, cvvValidator]],
  });

  invalid(name: 'holder' | 'number' | 'expiry' | 'cvv'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  onNumber(value: string): void {
    this.form.controls.number.setValue(formatCardNumber(value), { emitEvent: false });
    this.form.controls.cvv.updateValueAndValidity({ emitEvent: false });
  }

  onExpiry(value: string): void {
    this.form.controls.expiry.setValue(formatExpiry(value), { emitEvent: false });
  }

  onCvv(value: string): void {
    const length = detectBrand(this.form.controls.number.value) === 'amex' ? 4 : 3;
    this.form.controls.cvv.setValue(digitsOnly(value).slice(0, length), { emitEvent: false });
  }

  applyDemo(raw: string, cvv: string): void {
    this.form.patchValue({ number: formatCardNumber(raw), expiry: '12/30', cvv });
    this.form.markAllAsTouched();
  }

  clearSensitive(): void {
    this.form.patchValue({ number: '', cvv: '' });
    this.form.controls.number.markAsUntouched();
    this.form.controls.cvv.markAsUntouched();
  }

  submit(): void {
    if (this.busy()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.pay.emit({ holder: value.holder.trim(), number: value.number, expiry: value.expiry, cvv: value.cvv });
  }
}
