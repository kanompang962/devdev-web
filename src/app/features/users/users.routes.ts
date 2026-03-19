import { Routes } from '@angular/router';
import { roleGuard } from '@core/guards/role.guard';


export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/users-list.component/users-list.component').then(
        (c) => c.UsersListComponent,
      ),
    title: 'จัดการผู้ใช้งาน',
  },
  {
    path: 'create',
    canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN')],
    loadComponent: () =>
      import('./pages/user-form.component/user-form.component').then(
        (c) => c.UserFormComponent,
      ),
    title: 'เพิ่มผู้ใช้งาน',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/user-detail.component/user-detail.component').then(
        (c) => c.UserDetailComponent,
      ),
    title: 'รายละเอียดผู้ใช้งาน',
  },
  {
    path: ':id/edit',
    canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN')],
    loadComponent: () =>
      import('./pages/user-form.component/user-form.component').then(
        (c) => c.UserFormComponent,
      ),
    title: 'แก้ไขผู้ใช้งาน',
  },
];