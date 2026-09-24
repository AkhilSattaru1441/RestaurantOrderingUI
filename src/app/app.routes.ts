import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Category } from './components/category/category';
import { Login } from './components/login/login';
import { FoodItem } from './components/food-item/food-item';
import { Cart } from './components/cart/cart';
import { Register } from './register/register';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  { path: '',  redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: Home },
  { path: 'category', component: Category },
  { path: 'login', component: Login },
  { path: 'food-item', component: FoodItem },
  { path: 'cart', component: Cart,canActivate:[authGuard] },
  { path: 'register', component: Register},
];