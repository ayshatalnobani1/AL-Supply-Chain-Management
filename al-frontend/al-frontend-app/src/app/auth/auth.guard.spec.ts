import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let status: ReturnType<typeof signal<'checking' | 'authenticated' | 'unauthenticated' | 'unavailable'>>;
  let user: ReturnType<typeof signal<object | null>>;
  let router: Router;

  beforeEach(() => {
    status = signal('checking');
    user = signal<object | null>(null);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: { status, user } }] });
    router = TestBed.inject(Router);
  });

  function decision(): Array<boolean | UrlTree> {
    const values: Array<boolean | UrlTree> = [];
    const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, { url: '/company/dashboard' } as RouterStateSnapshot));
    if (!result || typeof result !== 'object' || !('subscribe' in result)) throw new Error('Expected observable guard');
    result.subscribe(value => values.push(value as boolean | UrlTree));
    TestBed.flushEffects();
    return values;
  }

  it('waits for restoration and allows a verified session', () => {
    const values = decision();
    expect(values.length).toBe(0);
    user.set({ userId: 1 });
    status.set('authenticated');
    TestBed.flushEffects();
    expect(values).toEqual([true]);
  });

  it('redirects unauthenticated and expired sessions to login', () => {
    status.set('unauthenticated');
    expect(router.serializeUrl(decision()[0] as UrlTree)).toBe('/login');
  });

  it('distinguishes connection failures from invalid sessions', () => {
    status.set('unavailable');
    expect(router.serializeUrl(decision()[0] as UrlTree)).toContain('/session-unavailable');
  });

  it('does not allow authenticated status without a user', () => {
    status.set('authenticated');
    expect(router.serializeUrl(decision()[0] as UrlTree)).toBe('/login');
  });
});
