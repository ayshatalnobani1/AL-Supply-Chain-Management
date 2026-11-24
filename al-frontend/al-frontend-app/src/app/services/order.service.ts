import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiOrder { supplierOrderId: number; userId: number | null; orderDate: string | null; status: string | null; totalAmount: number | null; statusId: number | null; productId: number | null; companyId: number | null; quantity: number | null; }
export interface ApiOrderStatus { statusId: number; statusName: string | null; }
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  getOrders(): Observable<ApiOrder[]> { return this.http.get<ApiOrder[]>(`${this.apiUrl}/supplier-orders`); }
  getStatuses(): Observable<ApiOrderStatus[]> { return this.http.get<ApiOrderStatus[]>(`${this.apiUrl}/order-status`); }
}
