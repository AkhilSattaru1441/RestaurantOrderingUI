import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    cartItems: any[] = [];

    addToCart(food: any) {
      this.cartItems.push({
        food: food,
        quantity:1
      });  
    }

}