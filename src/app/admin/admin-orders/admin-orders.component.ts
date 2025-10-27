import {Component, inject, signal} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass} from "@angular/common";
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem} from "@angular/material/list";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Order, OrderService, OrderStatus} from '../../service/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatChip, MatChipListbox} from '@angular/material/chips';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-admin-orders',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatAccordion,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    MatList,
    MatListItem,
    MatProgressSpinner,
    MatChipListbox,
    MatChip,
    NgClass,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);

  public readonly orderStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  isLoading = signal(true);
  orders = signal<Order[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An unknown error occurred.');
        this.isLoading.set(false);
      }
    });
  }

  onStatusChange(order: Order, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        this.orders.update(currentOrders =>
          currentOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
        );
        this.snackBar.open(`Order #${order.id} status updated to ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Close', { duration: 5000 });
      }
    });
  }
}
