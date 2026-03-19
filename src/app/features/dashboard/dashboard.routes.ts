import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () => import('./pages/dashboard-page.component/dashboard-page.component').then((c) => c.DashboardPageComponent),
  },
];