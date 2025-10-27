import {Component, inject} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-admin-header',
  imports: [
    MatToolbar,
    RouterLink,
    MatAnchor,
    MatIcon,
    MatButton,
    RouterLinkActive
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
