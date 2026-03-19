// Usage: canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN')]

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UserRole } from '@core/auth/auth.model';

export const roleGuard = (...roles: UserRole[]): CanActivateFn =>
  () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated())     return router.createUrlTree(['/auth/login']);
    if (auth.hasAnyRole(...roles))   return true;

    return router.createUrlTree(['/403']);
  };