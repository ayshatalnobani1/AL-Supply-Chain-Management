import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiProduct { productId: number; productName: string | null; productCategory: string | null; price: number | null; stockQuantity: number | null; expiryDate: string | null; isActive: string | null; warehouseId: number | null; companyId: number | null; }
export interface ApiProductImage { imageId: number; productId: number; imageUrl: string | null; }

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  getProducts(): Observable<ApiProduct[]> { return this.http.get<ApiProduct[]>(`${this.apiUrl}/products`); }
  getProductImages(): Observable<ApiProductImage[]> { return this.http.get<ApiProductImage[]>(`${this.apiUrl}/product-images`); }
}
