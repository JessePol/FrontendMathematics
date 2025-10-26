import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../auth.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {RegisterBoxComponent} from '../register-box/register-box.component';

@Component({
  selector: 'app-login-box',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './login-box.component.html',
  styleUrl: './login-box.component.scss'
})
export class LoginBoxComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginBoxComponent>,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    });
  }

  openRegisterBox(): void {
    this.dialogRef.close();

    this.dialog.open(RegisterBoxComponent, {
      width: '350px',
      disableClose: true
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
