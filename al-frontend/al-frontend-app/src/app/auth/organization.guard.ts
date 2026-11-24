import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { sessionDestination } from './session-destination';

export const organizationGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return toObservable(auth.status).pipe(
    filter(status => status !== 'checking'),
    take(1),
    map(status => {
      const user = auth.user();
      if (status === 'unavailable') return router.createUrlTree(['/session-unavailable'], { queryParams: { returnUrl: state.url } });
      if (status !== 'authenticated' || !user) return router.createUrlTree(['/login']);
      const destination = sessionDestination(user);
      const portal = /^\/(company|supplier)(?:[/?#]|$)/.exec(state.url)?.[1];
      return portal && destination === `/${portal}/dashboard` ? true : router.parseUrl(destination);
    })
  );
};
