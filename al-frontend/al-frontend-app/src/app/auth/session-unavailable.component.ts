import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-session-unavailable',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main>
      <section>
        <h1>Session unavailable</h1>
        <p>We could not verify your session. Check your connection and try again.</p>
        <button type="button" [disabled]="retrying" (click)="retry()">Try again</button>
        <a routerLink="/login">Go to login</a>
      </section>
    </main>
  `,
  styles: [`
    main { min-height: 100vh; padding: 2rem; background: #dceeee; color: #0a3b35; font-family: Arial, sans-serif; }
    section { max-width: 40rem; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 6px rgba(10,59,53,.2); }
    button { background: #0a3b35; color: white; border: 0; border-radius: 20px; padding: 8px 16px; cursor: pointer; margin-right: 1rem; }
    a { color: #0a3b35; }
  `]
})
export class SessionUnavailableComponent {
  retrying = false;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  retry(): void {
    this.retrying = true;
    this.auth.getCurrentUser().subscribe({
      next: () => {
        const target = this.route.snapshot.queryParamMap.get('returnUrl') || '/account';
        this.router.navigateByUrl(/^\/(company|supplier|account)(?:[/?#]|$)/.test(target) ? target : '/account');
      },
      error: error => {
        this.retrying = false;
        if (error.status === 401) this.router.navigate(['/login']);
      }
    });
  }
}
