import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  cartItems: any[] = [];
  cartTotal = 0;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

    console.log('CART COMPONENT LOADED');

    this.cartItems = this.cartService.cartItems;

    this.calculateTotal();

    console.log('CART PAGE:', this.cartItems);
  }

  calculateTotal() {

    this.cartTotal = 0;

    for (let item of this.cartItems) {
      this.cartTotal += item.food.price * item.quantity;
    }

  }

  increaseQuantity(item: any) {
    item.quantity++;

    this.calculateTotal();

  }
  
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

   removeFromCart(item: any) {

  const index = this.cartItems.indexOf(item);

  if (index !== -1) {

    this.cartItems.splice(index, 1);

  }

  this.calculateTotal();

}
  

  placeOrder() {
    if (this.cartItems.length===0){
      alert('Your cart is empty!');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    const userId = Number(localStorage.getItem('userId'));
    const order = { userId: userId};

    let completedItems = 0;

    this.http.post<any>(
      'https://localhost:7173/api/Orders',
      order
    )
    .subscribe({
      next: (response) => {

        console.log('Order Created:', response);

        const orderId = response.orderId;

        console.log('New Order ID:', orderId);

        for (let item of this.cartItems) {

          const orderItem = {
            orderId: orderId,
            foodId: item.food.foodId,
            quantity: item.quantity
          };

          this.http.post<any>(
            'https://localhost:7173/api/OrderItems',
            orderItem
          )
          .subscribe({
            next: (itemResponse) => {

              console.log('Order Item Created:', itemResponse);

              completedItems++;

              if (completedItems === this.cartItems.length) {

                console.log('All Order Items Created');

                alert(`Order placed successfully! Order ID: ${orderId}`);

                this.cartService.cartItems.length = 0;
                this.cartItems = this.cartService.cartItems;
                this.cartTotal = 0;

                this.cdr.detectChanges();

              }

            },

            error: (error) => {

              console.log('Order Item Error:', error);

            }
          });

        }

      },

      error: (error) => {

        console.log('Order Error:', error);

      }
    });

  }
}