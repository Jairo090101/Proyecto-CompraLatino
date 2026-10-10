import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).token();
  const authenticated = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    : request;
  return next(authenticated);
};
