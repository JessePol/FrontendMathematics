import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './service/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  if (currentUser && currentUser.userRole === 'ROLE_ADMIN') {
    return true;
  }

  router.navigate(['/webshop']);
  return false;
};
