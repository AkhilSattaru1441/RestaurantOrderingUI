import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItemService } from '../../services/food-item';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-food-item',
  imports: [CommonModule],
  templateUrl: './food-item.html',
  styleUrl: './food-item.css'
})
export class FoodItem implements OnInit {

  foodItems: any[] = [];
  cart: any[] = [];
  cartTotal = 0;
  categoryName = 'Food Items';

  constructor(
    private foodItemService: FoodItemService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cart = this.cartService.cartItems;
    this.calculateTotal();
  }

  ngOnInit() {
    this.loadFoodItems();
  }

  loadFoodItems() {

    this.foodItemService.getFoodItems().subscribe({

      next: (response: any) => {

        const categoryId = this.route.snapshot.queryParamMap.get('categoryId');

        if (categoryId) {

          this.foodItems = response.filter(
            (food: any) => food.categoryId === Number(categoryId)
          );

          this.loadCategoryName(Number(categoryId));

        } else {

          this.foodItems = response;
          this.categoryName = 'All Food Items';

        }

        this.cdr.detectChanges();

        console.log('FOOD ITEMS:', this.foodItems);

      },

      error: (error: any) => {

        console.log(error);

      }

    });

  }

  loadCategoryName(categoryId: number) {

    this.http.get('https://localhost:7173/api/Categories')
      .subscribe({

        next: (response: any) => {

          const category = response.find(
            (item: any) => item.categoryId === categoryId
          );

          if (category) {

            this.categoryName = category.categoryName;

          }

          this.cdr.detectChanges();

        },

        error: (error: any) => {

          console.log('Category Error:', error);

        }

      });

  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(food: any) {

    const existingItem = this.cart.find(
      item => item.food.foodId === food.foodId
    );

    if (existingItem) {

      existingItem.quantity++;

    } else {

      this.cart.push({
        food: food,
        quantity: 1
      });

    }

    this.calculateTotal();

    console.log('Cart:', this.cart);
    console.log('Total:', this.cartTotal);
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

    const index = this.cart.indexOf(item);

    if (index !== -1) {

      this.cart.splice(index, 1);
    }

    this.calculateTotal();
  }

  calculateTotal() {

    this.cartTotal = 0;

    for (let item of this.cart) {

      this.cartTotal += item.food.price * item.quantity;
    }
  }

  placeOrder() {

    const order = {
      userId: 1
    };

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

        for (let item of this.cart) {

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

              if (completedItems === this.cart.length) {

                console.log('All Order Items Created');

                alert(`Order placed successfully! Order ID: ${orderId}`);

                this.cart = [];
                this.cartTotal = 0;
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