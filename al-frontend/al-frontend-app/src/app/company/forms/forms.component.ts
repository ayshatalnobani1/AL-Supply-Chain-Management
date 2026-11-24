import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService } from '../../services/report.service';

type Resource = 'products' | 'warehouses' | 'recipes' | 'adjustments';
type Cell = string | number | null;

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent {
  activeForm: Resource | '' = '';
  title = '';
  scope = '';
  limitation = '';
  columns: string[] = [];
  rows: Cell[][] = [];
  loading = false;
  errorMessage = '';
  private requestId = 0;

  constructor(private reports: ReportService) {}

  show(resource: Resource): void {
    const requestId = ++this.requestId;
    this.activeForm = resource;
    this.rows = [];
    this.loading = true;
    this.errorMessage = '';
    const handleError = (error: HttpErrorResponse) => {
      if (requestId !== this.requestId) return;
      this.loading = false;
      this.errorMessage = error.status === 403 ? 'You do not have access to this data.' : 'Data could not be loaded. Please try again.';
    };
    const complete = (rows: Cell[][]) => {
      if (requestId !== this.requestId) return;
      this.rows = rows;
      this.loading = false;
    };

    switch (resource) {
      case 'products':
        this.title = 'Products';
        this.scope = 'Shared marketplace catalog; these products are not necessarily owned by your company.';
        this.limitation = 'Product editing is unavailable until the company association and publication rules are confirmed.';
        this.columns = ['ID', 'Product', 'Category', 'Stock'];
        this.reports.getProducts().subscribe({ next: data => complete(data.map(item => [item.productId, item.productName, item.productCategory, item.stockQuantity])), error: handleError });
        break;
      case 'warehouses':
        this.title = 'Warehouses';
        this.scope = 'Global local-development data, available only when authorized by the server.';
        this.limitation = 'Warehouse editing is unavailable because warehouse ownership is not established.';
        this.columns = ['ID', 'Location', 'Capacity', 'Manager'];
        this.reports.getWarehouses().subscribe({ next: data => complete(data.map(item => [item.warehouseId, item.warehouseLocation, item.capacity, item.manager])), error: handleError });
        break;
      case 'recipes':
        this.title = 'Production Recipes';
        this.scope = 'Global local-development data, available only when authorized by the server.';
        this.limitation = 'Recipe editing is unavailable because recipe ownership and sharing are not established.';
        this.columns = ['ID', 'Recipe', 'Ingredients', 'Preparation'];
        this.reports.getRecipes().subscribe({ next: data => complete(data.map(item => [item.recipeId, item.recipeName, item.ingredients, item.preparationMethod])), error: handleError });
        break;
      case 'adjustments':
        this.title = 'Stock Adjustments';
        this.scope = 'Global local-development data, available only when authorized by the server.';
        this.limitation = 'Stock adjustment editing is unavailable because adjustment ownership is not established.';
        this.columns = ['ID', 'Product ID', 'Date', 'Quantity adjusted', 'Reason'];
        this.reports.getStockAdjustments().subscribe({ next: data => complete(data.map(item => [item.adjustmentId, item.productId, item.adjustmentDate, item.quantityAdjusted, item.reason])), error: handleError });
        break;
    }
  }
}
