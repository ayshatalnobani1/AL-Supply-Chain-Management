import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-reports',
  imports: [BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  loading = true;
  errorMessage = '';
  hasData = false;
  chartData: ChartData<'bar'> = { labels: [], datasets: [{ label: 'Products', data: [], backgroundColor: '#19706a', borderColor: '#0a3b35', borderWidth: 1 }] };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { title: { display: true, text: 'Shared Marketplace Products by Category', color: '#0a3b35' }, legend: { display: false } },
    scales: { x: { title: { display: true, text: 'Category' } }, y: { beginAtZero: true, title: { display: true, text: 'Product count' }, ticks: { precision: 0 } } }
  };

  constructor(private products: ProductService) {}

  ngOnInit(): void {
    this.products.getProducts().subscribe({
      next: products => {
        const counts = new Map<string, number>();
        for (const product of products) {
          const category = product.productCategory?.trim() || 'Uncategorized';
          counts.set(category, (counts.get(category) || 0) + 1);
        }
        this.chartData = { labels: [...counts.keys()], datasets: [{ ...this.chartData.datasets[0], data: [...counts.values()] }] };
        this.hasData = counts.size > 0;
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Marketplace report could not be loaded.'; this.loading = false; }
    });
  }
}
