import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { User } from '../models/user.model';

import { API_URL } from './api.config';

const TOKEN_KEY = 'compralatino.auth_token';

interface AuthResponse { user: User; token: string; token_type: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userState = signal<User | null>(null);
  readonly user = this.userState.asReadonly();
  readonly isLoggedIn = computed(() => this.userState() !== null);
  readonly isAdmin = computed(() => this.userState()?.role === 'admin');

  constructor(private readonly http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, credentials).pipe(tap((response) => this.accept(response)));
  }

  register(data: { name: string; email: string; password: string; password_confirmation: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, data).pipe(tap((response) => this.accept(response)));
  }

  restoreSession(): Observable<User | null> {
    const token = this.token();
    if (!token) return of(null);
    return this.http.get<{ data: User }>(`${API_URL}/auth/me`).pipe(
      tap((response) => this.userState.set(response.data)),
      map((response) => response.data),
      catchError(() => { this.clear(); return of(null); }),
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${API_URL}/auth/logout`, {}).pipe(tap(() => this.clear()), catchError(() => { this.clear(); return of(null); }));
  }

  token(): string | null { return localStorage.getItem(TOKEN_KEY); }
  clear(): void { localStorage.removeItem(TOKEN_KEY); this.userState.set(null); }
  private accept(response: AuthResponse): void { localStorage.setItem(TOKEN_KEY, response.token); this.userState.set(response.user); }
}
