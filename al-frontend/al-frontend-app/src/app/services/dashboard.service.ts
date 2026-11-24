import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface DatedRecord { orderDate?: string; movementDate?: string; paymentDate?: string; productionDate?: string; }
@Injectable({ providedIn: 'root' })
export class DashboardService { private readonly apiUrl = 'http://localhost:3000'; constructor(private http: HttpClient) {} getOrders(): Observable<DatedRecord[]> { return this.http.get<DatedRecord[]>(`${this.apiUrl}/supplier-orders`); } getSuppliers(): Observable<unknown[]> { return this.http.get<unknown[]>(`${this.apiUrl}/suppliers`); } getInventory(): Observable<DatedRecord[]> { return this.http.get<DatedRecord[]>(`${this.apiUrl}/inventory`); } getPayments(): Observable<DatedRecord[]> { return this.http.get<DatedRecord[]>(`${this.apiUrl}/payments`); } getProductions(): Observable<DatedRecord[]> { return this.http.get<DatedRecord[]>(`${this.apiUrl}/productions`); } }
