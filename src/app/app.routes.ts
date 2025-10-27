import { Routes } from '@angular/router';
import {WebshopComponent} from './user/webshop/webshop.component';
import {AboutComponent} from './user/about/about.component';
import {OrdersComponent} from './user/orders/orders.component';
import {AdminLoginComponent} from './admin/admin-login/admin-login.component';
import {adminGuard} from './admin.guard';
import {AdminProductsComponent} from './admin/admin-products/admin-products.component';
import {UserLayoutComponent} from './user/user-layout/user-layout.component';
import {AdminLayoutComponent} from './admin/admin-layout/admin-layout.component';
import {AdminOrdersComponent} from './admin/admin-orders/admin-orders.component';
import {AdminUsersComponent} from './admin/admin-users/admin-users.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'webshop', pathMatch: 'full' },
      { path: 'webshop', component: WebshopComponent },
      { path: 'about', component: AboutComponent },
      { path: 'orders', component: OrdersComponent }
    ]
  },

  {
    path: '_admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
          { path: '', redirectTo: 'products', pathMatch: 'full' },
          { path: 'products', component: AdminProductsComponent },
          { path: 'orders', component: AdminOrdersComponent },
          { path: 'users', component: AdminUsersComponent },
        ]
      }
    ]
  },

  { path: '**', redirectTo: 'webshop' }
];
