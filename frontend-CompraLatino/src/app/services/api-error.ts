import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: HttpErrorResponse, fallback: string): string {
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  if (error.status === 429) return 'Demasiados intentos. Espera un momento y vuelve a probar.';
  if (error.status >= 500) return 'El servidor no está disponible. Intenta más tarde.';
  return error.error?.message ?? fallback;
}

export function apiFieldErrors(error: HttpErrorResponse): Record<string, string> {
  const errors = error.error?.errors ?? {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, String((messages as string[])[0] ?? '')]),
  );
}
