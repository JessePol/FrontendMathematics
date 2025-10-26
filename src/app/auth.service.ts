import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject, switchMap} from 'rxjs';
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

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser() {
    const token = this.getToken();
    if (token) {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      if (username && role) {
        this.currentUserSubject.next({ username, role });
      }
    }
  }

  login(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('bearerToken', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        const user: User = { username: response.username, role: response.role };
        this.currentUserSubject.next(user);
      })
    );
  }

  register(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, credentials).pipe(
      switchMap(registerResponse => {
        console.log('Registration successful:', registerResponse);
        return this.login(credentials);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('bearerToken');
  }

  getToken(): string | null {
    return localStorage.getItem('bearerToken');
  }
}
