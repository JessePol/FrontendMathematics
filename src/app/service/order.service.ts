import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export interface OrderUser {
  id: number;
  username: string;
  userRole: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  priceAtPurchase: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  user: OrderUser;
  orderDate: string;
  totalPrice: number;
  status: string;
  orderItems: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  createOrder(): Observable<Order> {

    return this.http.post<Order>(`${this.baseUrl}/orders`, {}).pipe(
      catchError(err => {
        console.error('Failed to create order', err);
        return throwError(() => new Error('Order creation failed. Please try again.'));
      })
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/me`).pipe(
      catchError(err => {
        console.error('Failed to fetch orders', err);
        return throwError(() => new Error('Could not retrieve your orders.'));
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`).pipe(
      catchError(err => {
        console.error('Failed to fetch orders', err);
        return throwError(() => new Error('Could not retrieve your orders.'));
      })
    );
  }
}
