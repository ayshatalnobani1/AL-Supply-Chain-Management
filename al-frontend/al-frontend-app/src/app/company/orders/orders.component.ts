import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

interface DisplayOrder { orderId: number; productName: string; quantity: number | null; orderDate: string | null; userId: number | null; status: string; totalAmount: number | null; }

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: DisplayOrder[] = [];
  loading = true;
  errorMessage = '';
  constructor(private orderService: OrderService, private productService: ProductService) {}
  ngOnInit(): void {
    forkJoin({ orders: this.orderService.getOrders(), products: this.productService.getProducts(), statuses: this.orderService.getStatuses() }).subscribe({
      next: data => {
        const products = new Map(data.products.map(product => [product.productId, product.productName || 'Unnamed product']));
        const statuses = new Map(data.statuses.map(status => [status.statusId, status.statusName]));
        this.orders = data.orders.map(order => ({ orderId: order.supplierOrderId, productName: products.get(order.productId ?? -1) || 'Product unavailable', quantity: order.quantity, orderDate: order.orderDate, userId: order.userId, status: statuses.get(order.statusId ?? -1) || order.status || 'Status unavailable', totalAmount: order.totalAmount }));
        this.loading = false;
      }, error: () => { this.errorMessage = 'Orders could not be loaded.'; this.loading = false; }
    });
  }
}
