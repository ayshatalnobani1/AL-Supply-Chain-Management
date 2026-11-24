import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiWarehouse, ReportService } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedReport: string = '';
  warehouses: ApiWarehouse[] = [];
  warehousesLoading = true;
  warehousesError = '';
  hasWarehouseCapacityChartData = false;
  warehouseCapacityChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Capacity', data: [], backgroundColor: '#0a3b35', borderColor: '#0a3b35', borderWidth: 1, borderRadius: 4 }]
  };
  warehouseCapacityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Warehouse Capacity Comparison', color: '#0a3b35', font: { size: 16 } },
      legend: { display: false },
      tooltip: { callbacks: { label: context => `Capacity: ${context.parsed.y}` } }
    },
    scales: {
      x: { title: { display: true, text: 'Warehouse location', color: '#0a3b35' }, ticks: { color: '#0a3b35' } },
      y: { beginAtZero: true, title: { display: true, text: 'Capacity', color: '#0a3b35' }, ticks: { color: '#0a3b35' } }
    }
  };
  supplierOrders: { orderId: number; product: string; quantity: number | null; orderDate: string | null; status: string; totalAmount: number | null; }[] = [];
  supplierOrdersLoading = true;
  supplierOrdersError = '';
  hasSupplierOrderStatusChartData = false;
  hasSupplierOrderTimelineChartData = false;
  supplierOrderStatusChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#0a3b35', '#19706a', '#4d9993', '#8cc8c3', '#b4d8d6', '#dceeee'], borderColor: '#ffffff', borderWidth: 2 }]
  };
  supplierOrderStatusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Orders by Status', color: '#0a3b35', font: { size: 16 } },
      legend: { display: true, position: 'bottom', labels: { color: '#0a3b35' } },
      tooltip: { callbacks: { label: context => {
        const count = Number(context.parsed) || 0;
        const total = context.dataset.data.reduce((sum, value) => sum + Number(value || 0), 0);
        const percentage = total ? ((count / total) * 100).toFixed(1) : '0.0';
        return `${context.label || 'Unknown'}: ${count} (${percentage}%)`;
      } } }
    }
  };
  supplierOrderTimelineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: 'Orders', data: [], borderColor: '#0a3b35', backgroundColor: 'rgba(10, 59, 53, 0.15)', pointBackgroundColor: '#19706a', pointBorderColor: '#0a3b35', fill: true, tension: 0.25 }]
  };
  supplierOrderTimelineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Orders Over Time', color: '#0a3b35', font: { size: 16 } },
      legend: { display: true, position: 'bottom', labels: { color: '#0a3b35' } },
      tooltip: { callbacks: { label: context => `Orders: ${context.parsed.y}` } }
    },
    scales: {
      x: { title: { display: true, text: 'Month and year', color: '#0a3b35' }, ticks: { color: '#0a3b35' } },
      y: { beginAtZero: true, title: { display: true, text: 'Order count', color: '#0a3b35' }, ticks: { color: '#0a3b35', precision: 0 } }
    }
  };
  inventoryMovements: { movementId: number; product: string; warehouse: string; type: string | null; quantity: number | null; date: string | null; reason: string; supplierOrderId: number | null; }[] = [];
  inventoryLoading = true;
  inventoryError = '';
  hasInventoryQuantityChartData = false;
  hasInventoryHistoryChartData = false;
  inventoryQuantityChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Recorded quantity', data: [], backgroundColor: '#19706a', borderColor: '#0a3b35', borderWidth: 1, borderRadius: 4 }]
  };
  inventoryQuantityChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Recorded Quantity by Movement Type', color: '#0a3b35', font: { size: 16 } },
      legend: { display: false },
      tooltip: { callbacks: { label: context => `Recorded quantity: ${context.parsed.y}` } }
    },
    scales: {
      x: { title: { display: true, text: 'Movement type', color: '#0a3b35' }, ticks: { color: '#0a3b35' } },
      y: { beginAtZero: true, title: { display: true, text: 'Recorded quantity', color: '#0a3b35' }, ticks: { color: '#0a3b35' } }
    }
  };
  inventoryHistoryChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ label: 'Movements', data: [], borderColor: '#0a3b35', backgroundColor: 'rgba(10, 59, 53, 0.15)', pointBackgroundColor: '#19706a', pointBorderColor: '#0a3b35', fill: true, tension: 0.25 }]
  };
  inventoryHistoryChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Inventory Movement History', color: '#0a3b35', font: { size: 16 } },
      legend: { display: true, position: 'bottom', labels: { color: '#0a3b35' } },
      tooltip: { callbacks: { label: context => `Movements: ${context.parsed.y}` } }
    },
    scales: {
      x: { title: { display: true, text: 'Month and year', color: '#0a3b35' }, ticks: { color: '#0a3b35' } },
      y: { beginAtZero: true, title: { display: true, text: 'Movement count', color: '#0a3b35' }, ticks: { color: '#0a3b35', precision: 0 } }
    }
  };
  payments: { paymentId: number; supplierOrderId: number | null; amount: number | null; date: string | null; method: string | null; status: string | null; }[] = [];
  paymentsLoading = true;
  paymentsError = '';
  hasPaymentAmountChartData = false;
  hasPaymentStatusChartData = false;
  paymentAmountChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Recorded payment amount', data: [], backgroundColor: '#19706a', borderColor: '#0a3b35', borderWidth: 1, borderRadius: 4 }]
  };
  paymentAmountChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Recorded Payment Amounts by Method', color: '#0a3b35', font: { size: 16 } },
      legend: { display: false },
      tooltip: { callbacks: { label: context => `Recorded payment amount: ${context.parsed.y}` } }
    },
    scales: {
      x: { title: { display: true, text: 'Payment method', color: '#0a3b35' }, ticks: { color: '#0a3b35' } },
      y: { beginAtZero: true, title: { display: true, text: 'Recorded payment amount (currency unspecified)', color: '#0a3b35' }, ticks: { color: '#0a3b35' } }
    }
  };
  paymentStatusChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#0a3b35', '#19706a', '#4d9993', '#8cc8c3', '#b4d8d6', '#dceeee'], borderColor: '#ffffff', borderWidth: 2 }]
  };
  paymentStatusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Payments by Status', color: '#0a3b35', font: { size: 16 } },
      legend: { display: true, position: 'bottom', labels: { color: '#0a3b35' } },
      tooltip: { callbacks: { label: context => {
        const count = Number(context.parsed) || 0;
        const total = context.dataset.data.reduce((sum, value) => sum + Number(value || 0), 0);
        const percentage = total ? ((count / total) * 100).toFixed(1) : '0.0';
        return `${context.label || 'Unknown'}: ${count} (${percentage}%)`;
      } } }
    }
  };

  constructor(private reports: ReportService) {}

  ngOnInit(): void {
    forkJoin({ warehouses: this.reports.getWarehouses(), orders: this.reports.getSupplierOrders(), products: this.reports.getProducts(), statuses: this.reports.getOrderStatuses(), inventory: this.reports.getInventoryMovements(), payments: this.reports.getPayments() }).subscribe({
      next: data => {
        this.warehouses = data.warehouses;
        this.updateWarehouseCapacityChart();
        this.warehousesLoading = false;
        const products = new Map(data.products.map(product => [product.productId, product.productName || 'Product unavailable']));
        const statuses = new Map(data.statuses.map(status => [status.statusId, status.statusName]));
        this.supplierOrders = data.orders.map(order => ({ orderId: order.supplierOrderId, product: products.get(order.productId ?? -1) || 'Product unavailable', quantity: order.quantity, orderDate: order.orderDate, status: statuses.get(order.statusId ?? -1) || order.status || 'Status unavailable', totalAmount: order.totalAmount }));
        this.updateSupplierOrderCharts();
        this.supplierOrdersLoading = false;
        const warehouses = new Map(data.warehouses.map(warehouse => [warehouse.warehouseId, warehouse.warehouseLocation || 'Warehouse unavailable']));
        this.inventoryMovements = data.inventory.map(movement => ({ movementId: movement.movementId, product: products.get(movement.productId ?? -1) || 'Product unavailable', warehouse: warehouses.get(movement.warehouseId ?? -1) || 'Warehouse unavailable', type: movement.movementType, quantity: movement.quantity, date: movement.movementDate, reason: movement.movementReason || 'Not available', supplierOrderId: movement.supplierOrderId }));
        this.updateInventoryCharts();
        this.inventoryLoading = false;
        this.payments = data.payments.map(payment => ({ paymentId: payment.paymentId, supplierOrderId: payment.supplierOrderId, amount: payment.amount, date: payment.paymentDate, method: payment.paymentMethod?.trim() || null, status: payment.paymentStatus?.trim() || null }));
        this.updatePaymentCharts();
        this.paymentsLoading = false;
      },
      error: () => { this.warehousesError = 'Warehouses could not be loaded.'; this.warehousesLoading = false; this.supplierOrdersError = 'Supplier orders could not be loaded.'; this.supplierOrdersLoading = false; this.inventoryError = 'Inventory movements could not be loaded.'; this.inventoryLoading = false; this.paymentsError = 'Payments could not be loaded.'; this.paymentsLoading = false; }
    });
  }

  showReport(reportName: string) {
    this.selectedReport = reportName;
  }

  private updateWarehouseCapacityChart(): void {
    const warehousesWithCapacity = this.warehouses.filter((warehouse): warehouse is ApiWarehouse & { capacity: number } =>
      typeof warehouse.capacity === 'number' && Number.isFinite(warehouse.capacity)
    );
    this.warehouseCapacityChartData = {
      labels: warehousesWithCapacity.map(warehouse => warehouse.warehouseLocation?.trim() || `Warehouse ${warehouse.warehouseId}`),
      datasets: [{ ...this.warehouseCapacityChartData.datasets[0], data: warehousesWithCapacity.map(warehouse => warehouse.capacity) }]
    };
    this.hasWarehouseCapacityChartData = warehousesWithCapacity.length > 0;
  }

  private updateSupplierOrderCharts(): void {
    const statusCounts = new Map<string, number>();
    const monthCounts = new Map<number, number>();

    this.supplierOrders.forEach(order => {
      const status = order.status?.trim();
      const statusLabel = !status || status === 'Status unavailable' ? 'Unknown' : status;
      statusCounts.set(statusLabel, (statusCounts.get(statusLabel) || 0) + 1);

      if (!order.orderDate) return;
      const date = new Date(order.orderDate);
      if (Number.isNaN(date.getTime())) return;
      const monthStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
      monthCounts.set(monthStart, (monthCounts.get(monthStart) || 0) + 1);
    });

    this.supplierOrderStatusChartData = {
      labels: [...statusCounts.keys()],
      datasets: [{ ...this.supplierOrderStatusChartData.datasets[0], data: [...statusCounts.values()] }]
    };
    this.hasSupplierOrderStatusChartData = statusCounts.size > 0;

    const months = [...monthCounts.entries()].sort(([first], [second]) => first - second);
    this.supplierOrderTimelineChartData = {
      labels: months.map(([month]) => new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(month)),
      datasets: [{ ...this.supplierOrderTimelineChartData.datasets[0], data: months.map(([, count]) => count) }]
    };
    this.hasSupplierOrderTimelineChartData = months.length > 0;
  }

  private updateInventoryCharts(): void {
    const quantitiesByType = new Map<string, number>();
    const monthCounts = new Map<number, number>();

    this.inventoryMovements.forEach(movement => {
      const type = movement.type?.trim();
      if (type && typeof movement.quantity === 'number' && Number.isFinite(movement.quantity)) {
        quantitiesByType.set(type, (quantitiesByType.get(type) || 0) + movement.quantity);
      }

      if (!movement.date) return;
      const date = new Date(movement.date);
      if (Number.isNaN(date.getTime())) return;
      const monthStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
      monthCounts.set(monthStart, (monthCounts.get(monthStart) || 0) + 1);
    });

    this.inventoryQuantityChartData = {
      labels: [...quantitiesByType.keys()],
      datasets: [{ ...this.inventoryQuantityChartData.datasets[0], data: [...quantitiesByType.values()] }]
    };
    this.hasInventoryQuantityChartData = quantitiesByType.size > 0;

    const months = [...monthCounts.entries()].sort(([first], [second]) => first - second);
    this.inventoryHistoryChartData = {
      labels: months.map(([month]) => new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(month)),
      datasets: [{ ...this.inventoryHistoryChartData.datasets[0], data: months.map(([, count]) => count) }]
    };
    this.hasInventoryHistoryChartData = months.length > 0;
  }

  private updatePaymentCharts(): void {
    const amountsByMethod = new Map<string, number>();
    const statusCounts = new Map<string, number>();

    this.payments.forEach(payment => {
      const method = payment.method || 'Unknown';
      if (typeof payment.amount === 'number' && Number.isFinite(payment.amount)) {
        amountsByMethod.set(method, (amountsByMethod.get(method) || 0) + payment.amount);
      }

      const status = payment.status || 'Unknown';
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
    });

    this.paymentAmountChartData = {
      labels: [...amountsByMethod.keys()],
      datasets: [{ ...this.paymentAmountChartData.datasets[0], data: [...amountsByMethod.values()] }]
    };
    this.hasPaymentAmountChartData = amountsByMethod.size > 0;

    this.paymentStatusChartData = {
      labels: [...statusCounts.keys()],
      datasets: [{ ...this.paymentStatusChartData.datasets[0], data: [...statusCounts.values()] }]
    };
    this.hasPaymentStatusChartData = statusCounts.size > 0;
  }
}
