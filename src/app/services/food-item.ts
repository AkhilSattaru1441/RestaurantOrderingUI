import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodItemService {

  constructor(private http: HttpClient) {

  }

  getFoodItems() {
    return this.http.get('https://localhost:7173/api/FoodItems');
  }

}