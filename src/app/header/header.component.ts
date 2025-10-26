import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../auth.service';
import {LoginBoxComponent} from '../components/login-box/login-box.component';
import {MatIcon} from '@angular/material/icon';
import {CurrencyPipe} from '@angular/common';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import {MatDivider} from '@angular/material/divider';
import {CartService} from '../cart.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    RouterLinkActive,
    MatAnchor,
    RouterLink,
    MatIcon,
    MatIconButton,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatBadge,
    MatDivider,
    CurrencyPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  logout(): void {
    this.authService.logout();
  }

  openLoginBox(): void {
    this.dialog.open(LoginBoxComponent, {
      width: '350px',
      disableClose: true
    });
  }

  removeItemFromCart(productId: number): void {
    this.cartService.removeItem(productId).subscribe({
      error: () => {
        this.snackBar.open('Could not remove item from cart.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItemFromCart(productId);
      return;
    }

    this.cartService.updateItemQuantity(productId, quantity).subscribe({
      error: () => {
        this.snackBar.open('Could not update item quantity.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to empty your cart?')) {
      this.cartService.emptyCart().subscribe({
        error: () => {
          this.snackBar.open('Could not empty cart', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
