import {Injectable, Signal, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../environments/environment';

export interface User {
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface RegisterResponse {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  private currentUserState = signal<User | null>(null);
  public currentUser: Signal<User | null> = this.currentUserState.asReadonly();

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser() {
    const token = this.getToken();
    if (token) {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      if (username && role) {
        this.currentUserState.set({ username, role });
      }
    }
  }

  login(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('bearerToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        this.currentUserState.set({ username: response.username, role: response.role });
      })
    );
  }

  register(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, credentials).pipe(
      switchMap(() => {
        return this.login(credentials);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.currentUserState.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('bearerToken');
  }

  getToken(): string | null {
    return localStorage.getItem('bearerToken');
  }
}
