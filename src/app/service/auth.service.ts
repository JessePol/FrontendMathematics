import {computed, Injectable, Signal, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';

export interface User {
  username: string;
  userRole: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  userRole: string;
}

export interface RegisterResponse {
  username: string;
  userRole: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  private currentUserState = signal<User | null>(null);
  public currentUser: Signal<User | null> = this.currentUserState.asReadonly();

  public isAdmin = computed(() => this.currentUser()?.userRole === 'ROLE_ADMIN');

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser() {
    const token = this.getToken();
    if (token) {
      const username = localStorage.getItem('username');
      const userRole = localStorage.getItem('userRole');
      if (username && userRole) {
        this.currentUserState.set({ username, userRole });
      }
    }
  }

  login(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('bearerToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userRole', response.userRole);

        this.currentUserState.set({ username: response.username, userRole: response.userRole });
      })
    );
  }

  loginAdmin(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.userRole !== 'ROLE_ADMIN') {
          throw new Error('User is not an administrator.');
        }

        localStorage.setItem('bearerToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userRole', response.userRole);

        this.currentUserState.set({ username: response.username, userRole: response.userRole });
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
    localStorage.removeItem('userRole');
    this.currentUserState.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('bearerToken');
  }

  getToken(): string | null {
    return localStorage.getItem('bearerToken');
  }
}
