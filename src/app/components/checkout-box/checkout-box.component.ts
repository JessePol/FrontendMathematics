import {Component, inject, signal} from '@angular/core';
import {CartService} from '../../service/cart.service';
import {Order, OrderService} from '../../service/order.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatList, MatListItem} from '@angular/material/list';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-checkout-box',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinner,
    MatButton,
    MatDialogClose,
    MatIcon,
    MatDivider,
    MatList,
    MatListItem,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './checkout-box.component.html',
  styleUrl: './checkout-box.component.scss'
})
export class CheckoutDialogComponent {
  public cartService = inject(CartService);
  private orderService = inject(OrderService);
  private dialogRef = inject(MatDialogRef<CheckoutDialogComponent>);

  isLoading = signal(false);
  order = signal<Order | null>(null);
  error = signal<string | null>(null);

  confirmPurchase(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.orderService.createOrder().subscribe({
      next: (createdOrder) => {
        this.order.set(createdOrder);
      },
      error: (err) => {
        this.error.set(err.message || 'An unknown error occurred.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
