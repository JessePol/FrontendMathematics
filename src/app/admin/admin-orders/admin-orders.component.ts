import {Component, inject, signal} from '@angular/core';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem} from "@angular/material/list";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Order, OrderService} from '../../service/order.service';

@Component({
  selector: 'app-admin-orders',
    imports: [
        CurrencyPipe,
        DatePipe,
        MatAccordion,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        MatDivider,
        MatExpansionPanel,
        MatExpansionPanelDescription,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon,
        MatList,
        MatListItem,
        MatProgressSpinner
    ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
  private orderService = inject(OrderService);

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
}
