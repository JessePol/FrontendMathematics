import {inject, Injectable} from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface UserDetail {
  id: number;
  username: string;
  userRole: UserRole;
}

export interface UpdateRoleRequest {
  userRole: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAllUsers(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.baseUrl}/users`).pipe(
      catchError(err => {
        console.error('Failed to fetch all users', err);
        return throwError(() => new Error('Could not retrieve the list of users.'));
      })
    );
  }

  updateUserRole(userId: number, role: UserRole): Observable<UserDetail> {
    const body: UpdateRoleRequest = { userRole: role };
    return this.http.put<UserDetail>(`${this.baseUrl}/users/${userId}/role`, body).pipe(
      catchError(err => {
        console.error(`Failed to update role for user with ID ${userId}`, err);
        return throwError(() => new Error('Could not update the user\'s role.'));
      })
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`).pipe(
      catchError(err => {
        console.error(`Failed to delete user with ID ${userId}`, err);
        return throwError(() => new Error('Could not delete the user.'));
      })
    );
  }
}
