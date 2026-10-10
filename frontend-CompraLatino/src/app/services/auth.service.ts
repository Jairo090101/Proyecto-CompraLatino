import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';

import { User } from '../models/user.model';

import { API_URL } from './api.config';

const TOKEN_KEY = 'compralatino.auth_token';

interface AuthResponse { user: User; token: string; token_type: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userState = signal<User | null>(null);
  private readonly sessionReadyState = signal(false);
  private restoreRequest?: Observable<User | null>;
  readonly user = this.userState.asReadonly();
  readonly isLoggedIn = computed(() => this.userState() !== null);
  readonly isAdmin = computed(() => this.userState()?.role === 'admin');
  readonly sessionReady = this.sessionReadyState.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, credentials).pipe(tap((response) => this.accept(response)));
  }

  register(data: { name: string; email: string; password: string; password_confirmation: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, data).pipe(tap((response) => this.accept(response)));
  }

  restoreSession(): Observable<User | null> {
    if (this.sessionReadyState()) return of(this.userState());
    if (this.restoreRequest) return this.restoreRequest;

    const token = this.token();
    if (!token) {
      this.sessionReadyState.set(true);
      return of(null);
    }

    this.restoreRequest = this.http.get<{ data: User }>(`${API_URL}/auth/me`).pipe(
      tap((response) => this.userState.set(response.data)),
      map((response) => response.data),
      catchError(() => { this.clear(); return of(null); }),
      tap({ complete: () => this.sessionReadyState.set(true) }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.restoreRequest;
  }

  ensureSessionReady(): Observable<User | null> {
    return this.restoreSession();
  }

  logout(): Observable<unknown> {
    return this.http.post(`${API_URL}/auth/logout`, {}).pipe(tap(() => this.clear()), catchError(() => { this.clear(); return of(null); }));
  }

  token(): string | null { return localStorage.getItem(TOKEN_KEY); }
  clear(): void { localStorage.removeItem(TOKEN_KEY); this.userState.set(null); }
  private accept(response: AuthResponse): void { localStorage.setItem(TOKEN_KEY, response.token); this.userState.set(response.user); }
}
