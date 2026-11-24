import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';

interface MarketplaceProduct { name: string; category: string; price: number | null; imageUrl?: string; }

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  searchTerm: string = '';
  productList: MarketplaceProduct[] = [];
  loading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    forkJoin({ products: this.productService.getProducts(), images: this.productService.getProductImages() }).subscribe({
      next: ({ products, images }) => {
        const imageByProduct = new Map(images.filter(image => !!image.imageUrl).map(image => [image.productId, image.imageUrl!]));
        this.productList = products.map(product => ({
          name: product.productName || 'Unnamed product',
          category: product.productCategory || 'Uncategorized',
          price: product.price,
          imageUrl: imageByProduct.get(product.productId)
        }));
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Products could not be loaded. Please try again later.'; this.loading = false; }
    });
  }

  filteredProducts() {
    if (!this.searchTerm.trim()) {
      return this.productList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.productList.filter(product =>
      product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
    );
  }

}
