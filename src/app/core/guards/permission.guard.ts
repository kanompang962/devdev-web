// Usage: canActivate: [permissionGuard('users:write')]

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Permission } from '@core/auth/auth.model';

export const permissionGuard = (...permissions: Permission[]): CanActivateFn =>
  () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated())            return router.createUrlTree(['/auth/login']);
    if (auth.hasAllPermissions(...permissions)) return true;

    return router.createUrlTree(['/403']);
  };