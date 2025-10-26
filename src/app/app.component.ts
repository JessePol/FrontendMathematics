import {Component, effect, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {AuthService} from './service/auth.service';
import {CartService} from './service/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  title = 'FrontendMathematicsInc';

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();

      if (user) {
        console.log('User logged in, fetching cart...');
        this.cartService.getCart().subscribe();
      } else {
        console.log('User logged out, clearing cart...');
        this.cartService.clearCart();
      }
    });
  }
}
