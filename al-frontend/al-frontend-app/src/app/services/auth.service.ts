import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BACKEND_ORIGIN } from './backend-origin';

export interface AuthUser {
  userId: number;
  username: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  roleId: number | null;
  roleName: string | null;
  companyType: string | null;
  companyId: number | null;
  companyName: string | null;
  verifiedCompanyType: string | null;
}

interface SessionResponse { user: AuthUser; }
interface LoginResponse extends SessionResponse { message: string; }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = BACKEND_ORIGIN;
  private readonly userState = signal<AuthUser | null>(null);
  private readonly statusState = signal<'checking' | 'authenticated' | 'unauthenticated' | 'unavailable'>('checking');
  readonly user = this.userState.asReadonly();
  readonly status = this.statusState.asReadonly();
  private generation = 0;
  private logoutPending = false;

  constructor(private http: HttpClient) {
    this.restoreSession();
    window.setInterval(() => this.restoreSession(), 60_000);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData);
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    const generation = ++this.generation;
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (generation === this.generation) {
          this.userState.set(response.user);
          this.statusState.set('authenticated');
        }
      })
    );
  }

  getCurrentUser(): Observable<SessionResponse> {
    const generation = this.generation;
    return this.http.get<SessionResponse>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      tap(response => {
        if (generation === this.generation) {
          this.userState.set(response.user);
          this.statusState.set('authenticated');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (generation === this.generation) {
          this.userState.set(null);
          this.statusState.set(error.status === 401 ? 'unauthenticated' : 'unavailable');
        }
        return throwError(() => error);
      })
    );
  }

  restoreSession(): void {
    if (!this.logoutPending) this.getCurrentUser().subscribe({ error: () => {} });
  }

  get sessionGeneration(): number { return this.generation; }

  invalidateSession(generation: number): void {
    if (generation !== this.generation || this.logoutPending) return;
    ++this.generation;
    this.userState.set(null);
    this.statusState.set('unauthenticated');
  }

  logout(): Observable<{ message: string }> {
    ++this.generation;
    this.logoutPending = true;
    this.userState.set(null);
    this.statusState.set('checking');
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => { this.logoutPending = false; this.statusState.set('unauthenticated'); }),
      catchError((error: HttpErrorResponse) => {
        this.logoutPending = false;
        this.statusState.set('unavailable');
        return throwError(() => error);
      })
    );
  }
}

