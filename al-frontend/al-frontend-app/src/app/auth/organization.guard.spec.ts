import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { AuthService, AuthUser } from '../services/auth.service';
import { organizationGuard } from './organization.guard';

describe('organizationGuard', () => {
  let status: ReturnType<typeof signal<'checking' | 'authenticated' | 'unauthenticated' | 'unavailable'>>;
  let user: ReturnType<typeof signal<AuthUser | null>>;
  let router: Router;
  const identity = (companyId: number | null, verifiedCompanyType: string | null, companyType: string | null = null): AuthUser => ({
    userId: 1, username: 'test', fullName: null, email: null, phoneNumber: null,
    roleId: 1, roleName: null, companyId, companyName: null, verifiedCompanyType, companyType
  });

  beforeEach(() => {
    status = signal('checking');
    user = signal<AuthUser | null>(null);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: { status, user } }] });
    router = TestBed.inject(Router);
  });

  function decision(url: string): Array<boolean | UrlTree> {
    const values: Array<boolean | UrlTree> = [];
    const result = TestBed.runInInjectionContext(() => organizationGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));
    if (!result || typeof result !== 'object' || !('subscribe' in result)) throw new Error('Expected observable guard');
    result.subscribe(value => values.push(value as boolean | UrlTree));
    TestBed.flushEffects();
    return values;
  }

  function evaluate(identityValue: AuthUser, url: string): boolean | string {
    user.set(identityValue);
    status.set('authenticated');
    const result = decision(url)[0];
    return result === true ? true : router.serializeUrl(result as UrlTree);
  }

  it('allows company users into company routes and redirects them from supplier routes', () => {
    expect(evaluate(identity(1, 'company'), '/company/orders')).toBeTrue();
    expect(evaluate(identity(1, 'company'), '/supplier/dashboard')).toBe('/company/dashboard');
  });
  it('allows supplier users into supplier routes and redirects them from company routes', () => {
    expect(evaluate(identity(2, 'supplier'), '/supplier/orders')).toBeTrue();
    expect(evaluate(identity(2, 'supplier'), '/company/dashboard')).toBe('/supplier/dashboard');
  });
  it('sends unassigned users from either portal to account', () => {
    expect(evaluate(identity(null, null), '/company/dashboard')).toBe('/account');
    expect(evaluate(identity(null, null), '/supplier/dashboard')).toBe('/account');
  });
  it('uses verified company type instead of conflicting declared type or role', () => {
    expect(evaluate(identity(2, 'supplier', 'company'), '/supplier/dashboard')).toBeTrue();
    expect(evaluate(identity(2, 'supplier', 'company'), '/company/dashboard')).toBe('/supplier/dashboard');
    expect(evaluate(identity(null, 'company', 'company'), '/company/dashboard')).toBe('/account');
  });
  it('waits for session restoration before making an organization decision', () => {
    const result = decision('/company/dashboard');
    expect(result.length).toBe(0);
    user.set(identity(1, 'company'));
    status.set('authenticated');
    TestBed.flushEffects();
    expect(result).toEqual([true]);
  });
  it('preserves unavailable and unauthenticated handling', () => {
    status.set('unavailable');
    expect(router.serializeUrl(decision('/company/dashboard')[0] as UrlTree)).toContain('/session-unavailable');
    status.set('unauthenticated');
    expect(router.serializeUrl(decision('/supplier/dashboard')[0] as UrlTree)).toBe('/login');
  });
});
