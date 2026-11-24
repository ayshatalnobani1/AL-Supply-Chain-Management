import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return toObservable(auth.status).pipe(
    filter(status => status !== 'checking'),
    take(1),
    map(status => status === 'authenticated' && auth.user()
      ? true
      : status === 'unavailable'
        ? router.createUrlTree(['/session-unavailable'], { queryParams: { returnUrl: state.url } })
        : router.createUrlTree(['/login']))
  );
};
