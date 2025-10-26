import {Component, effect, inject} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {CartService} from '../../service/cart.service';
import {HeaderComponent} from '../header/header.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  constructor() {

    effect(() => {
      const user = this.authService.currentUser();

      if (user) {
        console.log('User logged in, fetching cart...');
        this.cartService.getCart().subscribe();
      } else {
        console.log('User logged out.');
        this.cartService.clearCart();
      }
    });
  }
}
