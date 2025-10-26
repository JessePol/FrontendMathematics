import { Routes } from '@angular/router';
import {WebshopComponent} from './webshop/webshop.component';
import {AboutComponent} from './about/about.component';
import {OrdersComponent} from './orders/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/webshop', pathMatch: 'full' },
  { path: 'webshop', component: WebshopComponent },
  { path: 'about', component: AboutComponent },
  { path: 'orders', component: OrdersComponent }
];
