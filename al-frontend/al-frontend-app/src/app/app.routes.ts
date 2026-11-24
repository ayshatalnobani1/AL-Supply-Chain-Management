import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AccountComponent } from './auth/account/account.component';
import { authGuard } from './auth/auth.guard';
import { organizationGuard } from './auth/organization.guard';
import { SessionUnavailableComponent } from './auth/session-unavailable.component';
import { LandingComponent } from './landing/landing.component';
import { CompanyComponent } from './company/company.component';
import { OrdersComponent } from './company/orders/orders.component';
import { ReportsComponent } from './company/reports/reports.component';
import { DashboardComponent } from './company/dashboard/dashboard.component';
import { MarketplaceComponent } from './company/marketplace/marketplace.component';
import { FormsComponent } from './company/forms/forms.component';
import { AboutComponent } from './company/about/about.component';
import { SupplierComponent } from './supplier/supplier.component';
import { DashboardComponent as SupplierDashboardComponent } from './supplier/dashboard/dashboard.component';
import { OrdersComponent as SupplierOrdersComponent } from './supplier/orders/orders.component';
import { FormsComponent as SupplierFormsComponent } from './supplier/forms/forms.component';
import { ReportsComponent as SupplierReportsComponent } from './supplier/reports/reports.component';
import { AboutComponent as SupplierAboutComponent } from './supplier/about/about.component';
import { MarkerplaceComponent as SupplierMarketPlaceComponent } from './supplier/markerplace/markerplace.component';


export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'session-unavailable', component: SessionUnavailableComponent },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [authGuard, organizationGuard],
    canActivateChild: [authGuard, organizationGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'marketplace', component: MarketplaceComponent },
      { path: 'forms', component: FormsComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  {
    path: 'supplier',
    component: SupplierComponent,
    canActivate: [authGuard, organizationGuard],
    canActivateChild: [authGuard, organizationGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SupplierDashboardComponent },
      {path: 'marketplace', component: SupplierMarketPlaceComponent },
      { path: 'orders', component: SupplierOrdersComponent },
      { path: 'forms', component: SupplierFormsComponent },
      { path: 'reports', component: SupplierReportsComponent },
      { path: 'about', component: SupplierAboutComponent }
    ]
  }
];

export const appConfig = provideRouter(routes);

