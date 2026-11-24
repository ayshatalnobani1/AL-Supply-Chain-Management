import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = true;
  errorMessage = '';
  productCount: number | null = null;
  categoryCount: number | null = null;

  constructor(private products: ProductService) {}

  ngOnInit(): void {
    this.products.getProducts().subscribe({
      next: products => {
        this.productCount = products.length;
        this.categoryCount = new Set(products.map(product => product.productCategory?.trim()).filter((category): category is string => !!category)).size;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Marketplace statistics could not be loaded.';
        this.loading = false;
      }
    });
  }
}
