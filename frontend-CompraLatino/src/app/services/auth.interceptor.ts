import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';
import { API_URL } from './api.config';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).token();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token && request.url.startsWith(API_URL)) headers.Authorization = `Bearer ${token}`;
  return next(request.clone({ setHeaders: headers }));
};
