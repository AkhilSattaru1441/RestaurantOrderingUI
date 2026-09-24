import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-category',
  styleUrl: './category.css',
  templateUrl: './category.html',
})
export class Category implements OnInit {

  categories: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router

  ) {

  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {

    this.http.get('https://localhost:7173/api/Categories')
      .subscribe({

        next: (response: any) => {

          this.categories = response;

          this.cdr.detectChanges();

          console.log(this.categories);

        },

        error: (error) => {

          console.log(error);

        }

      });

  }

  selectCategory(categoryId: number) {

  this.router.navigate(['/food-item'], {
    queryParams: { categoryId: categoryId }
  });

}

}