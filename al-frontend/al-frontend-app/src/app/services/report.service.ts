import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiProduct, ProductService } from './product.service';
import { ApiOrder, ApiOrderStatus, OrderService } from './order.service';

export interface ApiWarehouse { warehouseId: number; warehouseLocation: string | null; capacity: number | null; manager: string | null; }
export interface ApiInventoryMovement { movementId: number; productId: number | null; warehouseId: number | null; movementType: string | null; quantity: number | null; movementDate: string | null; movementReason: string | null; supplierOrderId: number | null; }
export interface ApiPayment { paymentId: number; supplierOrderId: number | null; amount: number | null; paymentDate: string | null; paymentMethod: string | null; paymentStatus: string | null; }
export interface ApiRecipe { recipeId: number; recipeName: string | null; ingredients: string | null; preparationMethod: string | null; }
export interface ApiStockAdjustment { adjustmentId: number; productId: number | null; adjustmentDate: string | null; quantityAdjusted: number | null; reason: string | null; }

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient, private products: ProductService, private orders: OrderService) {}
  getWarehouses(): Observable<ApiWarehouse[]> { return this.http.get<ApiWarehouse[]>(`${this.apiUrl}/warehouses`); }
  getInventoryMovements(): Observable<ApiInventoryMovement[]> { return this.http.get<ApiInventoryMovement[]>(`${this.apiUrl}/inventory`); }
  getPayments(): Observable<ApiPayment[]> { return this.http.get<ApiPayment[]>(`${this.apiUrl}/payments`); }
  getProducts(): Observable<ApiProduct[]> { return this.products.getProducts(); }
  getSupplierOrders(): Observable<ApiOrder[]> { return this.orders.getOrders(); }
  getOrderStatuses(): Observable<ApiOrderStatus[]> { return this.orders.getStatuses(); }
  getRecipes(): Observable<ApiRecipe[]> { return this.http.get<ApiRecipe[]>(`${this.apiUrl}/production-recipes`); }
  getStockAdjustments(): Observable<ApiStockAdjustment[]> { return this.http.get<ApiStockAdjustment[]>(`${this.apiUrl}/stock-adjustments`); }
}
