import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ensureSessionReady().pipe(
    map(() => auth.isLoggedIn() ? true : router.createUrlTree(['/login'])),
  );
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ensureSessionReady().pipe(
    map(() => auth.isLoggedIn() ? router.createUrlTree(['/']) : true),
  );
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ensureSessionReady().pipe(
    map(() => auth.isAdmin() ? true : router.createUrlTree(['/'])),
  );
};
