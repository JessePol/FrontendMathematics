import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../auth.service';
import {LoginBoxComponent} from '../components/login-box/login-box.component';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import {MatDivider} from '@angular/material/divider';
import {CartService} from '../cart.service';

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
    AsyncPipe,
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
  private authService = inject(AuthService);
  public cartService = inject(CartService);
  private dialog = inject(MatDialog);

  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
    this.cartService.clearCart();
  }

  openLoginBox(): void {
    this.dialog.open(LoginBoxComponent, {
      width: '350px',
      disableClose: true
    });
  }

}
