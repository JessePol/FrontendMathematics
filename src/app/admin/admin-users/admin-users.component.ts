import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserDetail, UserRole, UserService} from '../../service/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-admin-users',
  imports: [
    MatProgressSpinner,
    MatIcon,
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatFormField,
    MatSelect,
    MatOption,
    MatHeaderRow,
    MatRow,
    MatIconButton,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatLabel
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  public users = signal<UserDetail[]>([]);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  public displayedColumns: string[] = ['id', 'username', 'userRole', 'actions'];
  public availableRoles: UserRole[] = ['ROLE_USER', 'ROLE_ADMIN'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
        this.snackBar.open(err.message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    });
  }

  onUpdateRole(user: UserDetail, newRole: UserRole): void {
    if (user.userRole === newRole) {
      return;
    }

    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        this.users.update(currentUsers =>
          currentUsers.map(u => u.id === user.id ? updatedUser : u)
        );
        this.snackBar.open(`Role for ${updatedUser.username} updated to ${updatedUser.userRole}`, 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        this.loadUsers();
      }
    });
  }

  onDeleteUser(userId: number, username: string): void {
    if (confirm(`Are you sure you want to delete the user "${username}"? This action cannot be undone.`)) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users.update(currentUsers =>
            currentUsers.filter(u => u.id !== userId)
          );
          this.snackBar.open(`User "${username}" was deleted successfully.`, 'OK', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      });
    }
  }
}
