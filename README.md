### providers
-   วิธีที่ 1 — provide ใน Component (แนะนำ — scoped lifetime)
```
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  providers: [DashboardStore], // ← เพิ่มตรงนี้
  imports: [...],
})
export class DashboardPageComponent {
  readonly store = inject(DashboardStore);
}
```
-   วิธีที่ 2 — provide ใน Route (scoped ต่อ route)
```
// users.routes.ts
{
  path: '',
  providers: [UsersStore], // ← provide ระดับ route
  loadComponent: () =>
    import('./pages/users-list/users-list.component').then(
      (c) => c.UsersListComponent,
    ),
}
```
-   วิธีที่ 2 — provide ใน Route (scoped ต่อ route)
```
// เหมาะกับ store ที่ต้องแชร์ข้าม feature เช่น auth, ui
export const appConfig: ApplicationConfig = {
  providers: [
    DashboardStore, // ← global
  ],
};
```