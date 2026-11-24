import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="account-page">
      <section class="account-card">
        <h1>Account</h1>
        @if (authService.user(); as user) {
          <p>{{ user.fullName?.trim() || user.username }}</p>
          <p>Role: {{ user.roleName || 'Unavailable' }}</p>
          <p>No verified organization is assigned to your account. Contact an administrator for assistance.</p>
          <button type="button" (click)="logout()">Logout</button>
        } @else if (authService.status() === 'checking') {
          <p>Loading account...</p>
        } @else if (authService.status() === 'unavailable') {
          <p>Account information is temporarily unavailable.</p>
          <button type="button" (click)="authService.restoreSession()">Try again</button>
          <button type="button" (click)="logout()">Logout</button>
        } @else {
          <p>You are not signed in.</p>
          <a routerLink="/login">Log in</a>
        }
      </section>
    </main>
  `,
  styles: [`
    .account-page { min-height: 100vh; padding: 2rem; background: #dceeee; color: #0a3b35; font-family: Arial, sans-serif; }
    .account-card { max-width: 40rem; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 6px rgba(10, 59, 53, 0.2); }
    button { background: #0a3b35; color: white; border: 0; border-radius: 20px; padding: 8px 16px; cursor: pointer; margin-right: 0.5rem; }
    a { color: #0a3b35; }
  `]
})
export class AccountComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Logout could not be confirmed. Please try again.')
    });
  }
}
