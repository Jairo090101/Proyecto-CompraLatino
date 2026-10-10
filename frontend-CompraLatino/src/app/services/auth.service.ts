import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

import { API_BASE_URL } from './api-url';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: SessionUser;
  token: string;
  token_type: string;
}

interface StoredSession {
  token: string;
  user: SessionUser;
}

const STORAGE_KEY = 'compralatino.session';

/**
 * Real session against the Laravel API. The JWT lives in localStorage and
 * the HTTP interceptor attaches it to later requests.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = signal<StoredSession | null>(this.read());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly token = computed(() => this.session()?.token ?? null);

  login(email: string, password: string): Promise<SessionUser> {
    return this.saveSession(
      this.http.post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, {
        email: email.trim(),
        password,
      }),
      'No se pudo iniciar sesión.',
    );
  }

  async logout(): Promise<void> {
    if (this.token()) {
      try {
        await firstValueFrom(this.http.post(`${API_BASE_URL}/api/auth/logout`, {}));
      } catch {
        // A rejected token still means the local session should disappear.
      }
    }
    this.clearSession();
  }

  clearSession(): void {
    this.session.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('compralatino.user');
    } catch {
      // The in-memory session is already cleared.
    }
  }

  private saveSession(request: Observable<AuthResponse>, fallback: string): Promise<SessionUser> {
    return firstValueFrom(request)
      .then((response) => {
        const user = response.user;
        if (!response.token || !user?.email) {
          throw new Error('El servidor no devolvió una sesión válida.');
        }
        this.persist({ token: response.token, user });
        return user;
      })
      .catch((error: unknown) => {
        throw new Error(apiErrorMessage(error, fallback));
      });
  }

  private read(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as StoredSession;
      return parsed?.token && parsed.user?.email ? parsed : null;
    } catch {
      return null;
    }
  }

  private persist(session: StoredSession): void {
    this.session.set(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // The session still works until the tab is closed.
    }
  }
}

/** Blocks private screens until there is a session, and sends the visitor to login. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }
    const body = error.error;
    if (body && typeof body === 'object') {
      const errors = (body as { errors?: Record<string, string[]> }).errors;
      const first = errors ? Object.values(errors).flat().find((message) => !!message) : undefined;
      if (first) {
        return first;
      }
      const message = (body as { message?: string }).message;
      if (message) {
        return message;
      }
    }
  }
  return error instanceof Error && error.message ? error.message : fallback;
}
