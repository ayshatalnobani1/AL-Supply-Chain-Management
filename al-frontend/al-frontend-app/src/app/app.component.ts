import { Component, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { sessionDestination } from './auth/session-destination';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(authService: AuthService, router: Router) {
    effect(() => {
      const status = authService.status();
      const user = authService.user();
      const url = router.url;
      if (!/^\/(company|supplier|account)(?:[/?#]|$)/.test(url)) return;
      if (status === 'unauthenticated') router.navigate(['/login']);
      if (status === 'unavailable') router.navigate(['/session-unavailable'], { queryParams: { returnUrl: url } });
      if (status === 'authenticated' && user) {
        const portal = /^\/(company|supplier)(?:[/?#]|$)/.exec(url)?.[1];
        const destination = sessionDestination(user);
        if (portal && destination !== `/${portal}/dashboard`) router.navigateByUrl(destination);
      }
    });
  }
  title = 'al-frontend-app';
}
