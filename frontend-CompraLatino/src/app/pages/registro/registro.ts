import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { apiErrorMessage, apiFieldErrors } from '../../services/api-error';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
    password_confirmation: ['', Validators.required],
  });
  readonly error = signal('');
  readonly fieldErrors = signal<Record<string, string>>({});
  readonly loading = signal(false);
  submit(): void {
    if (this.form.invalid || this.loading()) { this.form.markAllAsTouched(); return; }
    this.error.set('');
    this.fieldErrors.set({});
    this.loading.set(true);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error) => {
        this.fieldErrors.set(apiFieldErrors(error));
        this.error.set(apiErrorMessage(error, 'No se pudo crear la cuenta.'));
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
