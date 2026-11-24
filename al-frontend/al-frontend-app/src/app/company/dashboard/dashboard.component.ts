import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { DashboardService, DatedRecord } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = true; errorMessage = ''; totalOrders: number | null = null; productsInStock: number | null = null; supplierCount: number | null = null; recentActivity: { date: string; text: string }[] = [];
  constructor(private products: ProductService, private dashboard: DashboardService) {}
  ngOnInit(): void { forkJoin({ products: this.products.getProducts(), orders: this.dashboard.getOrders(), suppliers: this.dashboard.getSuppliers(), inventory: this.dashboard.getInventory(), payments: this.dashboard.getPayments(), productions: this.dashboard.getProductions() }).subscribe({ next: d => { this.totalOrders=d.orders.length; this.productsInStock=d.products.filter(p=>(p.stockQuantity??0)>0).length; this.supplierCount=d.suppliers.length; this.recentActivity=[...this.toActivity(d.orders,'orderDate','Supplier order recorded'),...this.toActivity(d.inventory,'movementDate','Inventory movement recorded'),...this.toActivity(d.payments,'paymentDate','Payment recorded'),...this.toActivity(d.productions,'productionDate','Production recorded')].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5); this.loading=false; }, error:()=>{this.errorMessage='Dashboard data could not be loaded.';this.loading=false;} }); }
  private toActivity(records: DatedRecord[], field: keyof DatedRecord, text: string) { return records.filter(r=>!!r[field]).map(r=>({date:r[field] as string,text})); }
}
