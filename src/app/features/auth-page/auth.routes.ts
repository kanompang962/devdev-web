import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  {
    path: 'login',
    title: 'เข้าสู่ระบบ',
    loadComponent: () => import('@features/auth-page/login.component/login.component').then((c) => c.LoginComponent),
  },
];
