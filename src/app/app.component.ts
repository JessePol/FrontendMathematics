import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {AuthService} from './auth.service';
import {CartService} from './cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  title = 'FrontendMathematicsInc';

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.cartService.getCart().subscribe();
      } else {
        this.cartService.clearCart();
      }
    });
  }
}
