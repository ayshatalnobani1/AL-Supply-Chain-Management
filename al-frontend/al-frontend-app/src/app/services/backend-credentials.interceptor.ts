import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { BACKEND_ORIGIN } from './backend-origin';

export const backendCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  let url: URL;
  try {
    url = new URL(request.url, document.baseURI);
  } catch {
    return next(request);
  }
  if (url.origin !== BACKEND_ORIGIN) return next(request);

  const credentialedRequest = request.clone({ withCredentials: true });
  // Authentication requests manage their own state and must not recursively inject AuthService.
  if (url.pathname === '/auth' || url.pathname.startsWith('/auth/')) return next(credentialedRequest);

  const auth = inject(AuthService);
  const generation = auth.sessionGeneration;
  return next(credentialedRequest).pipe(catchError((error: unknown) => {
    if (error instanceof HttpErrorResponse && error.status === 401) auth.invalidateSession(generation);
    return throwError(() => error);
  }));
};
