import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}


export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = environment.apiUrl;
  private cartState: WritableSignal<Cart | null> = signal(null);

  public cart: Signal<Cart | null> = this.cartState.asReadonly();
  public cartItems: Signal<CartItem[]> = computed(() => this.cartState()?.items ?? []);
  public totalItems: Signal<number> = computed(() =>
    this.cartState()?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  );
  public totalPrice: Signal<number> = computed(() => this.cartState()?.totalPrice ?? 0);

  constructor(private http: HttpClient) {
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${(this.baseUrl)}/cart`).pipe(
      tap(cart => this.cartState.set(cart)),
      catchError(err => {
        console.error('Failed to get cart', err);
        this.cartState.set(null);
        return of(null as any);
      })
    );
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    const payload: AddToCartPayload = {productId, quantity};
    return this.http.post<Cart>(`${(this.baseUrl)}/cart/items`, payload).pipe(
      tap(updatedCart => this.cartState.set(updatedCart)),
      catchError(err => {
        console.error('Failed to add item to cart', err);
        throw err;
      })
    );
  }

  removeItem(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/cart/items/${productId}`).pipe(
      tap(updatedCart => this.cartState.set(updatedCart)),
      catchError(err => {
        console.error(`Failed to remove item ${productId} from cart`, err);
        throw err;
      })
    );
  }

  updateItemQuantity(productId: number, quantity: number): Observable<Cart> {
    const payload = { quantity };
    return this.http.put<Cart>(`${this.baseUrl}/cart/items/${productId}`, payload).pipe(
      tap(updatedCart => this.cartState.set(updatedCart)),
      catchError(err => {
        console.error(`Failed to update quantity for item ${productId}`, err);
        throw err;
      })
    );
  }

  emptyCart(): Observable<Cart | null> {
    return this.http.delete<Cart | null>(`${this.baseUrl}/cart`).pipe(
      tap(response => {
        this.cartState.set(response ?? null);
      }),
      catchError(err => {
        console.error('Failed to empty the cart', err);
        throw err;
      })
    );
  }

  clearCart(): void {
    this.cartState.set(null);
  }
}
