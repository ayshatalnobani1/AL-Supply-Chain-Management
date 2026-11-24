import type { AuthUser } from '../services/auth.service';

export function sessionDestination(user: AuthUser): string {
  if (user.companyId == null) return '/account';
  if (user.verifiedCompanyType === 'company') return '/company/dashboard';
  if (user.verifiedCompanyType === 'supplier') return '/supplier/dashboard';
  return '/account';
}
