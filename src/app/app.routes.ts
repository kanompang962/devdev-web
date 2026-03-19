import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { noAuthGuard } from '@core/guards/no-auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    // ── Public (ไม่มี Shell) ──
    {
        path: 'auth',
        canActivate: [noAuthGuard],
        loadChildren: () =>
        import('./features/auth-page/auth.routes').then((r) => r.authRoutes),
    },

     // ── Protected (อยู่ใน Shell) ──
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
        import('./layout/shell.component/shell.component').then((c) => c.ShellComponent),
        children: [
        {
            path: 'dashboard',
            loadChildren: () =>
            import('./features/dashboard/dashboard.routes').then((r) => r.dashboardRoutes),
        },
        {
            path: 'users',
            loadChildren: () =>
            import('./features/users/users.routes').then((r) => r.usersRoutes),
        },
        ],
    },

    // Error pages
    {
        path: '403',
        loadComponent: () =>
        import('./shared/components/forbidden.component/forbidden.component').then((c) => c.ForbiddenComponent),
    },
    {
        path: '**',
        loadComponent: () =>
        import('./shared/components/not-found.component/not-found.component').then((c) => c.NotFoundComponent),
    },

];
