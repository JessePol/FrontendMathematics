import {Component, inject, OnInit, signal} from '@angular/core';
import {Order, OrderService} from '../../service/order.service';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDivider} from '@angular/material/divider';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
@Component({
  selector: 'app-orders',
  imports: [
    MatIcon,
    MatListItem,
    MatList,
    CurrencyPipe,
    DatePipe,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatProgressSpinner,
    MatDivider,
    MatCardContent,
    MatCardSubtitle,
    MatCardHeader,
    MatCardTitle,
    MatCard
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  isLoading = signal(true);
  orders = signal<Order[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
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
