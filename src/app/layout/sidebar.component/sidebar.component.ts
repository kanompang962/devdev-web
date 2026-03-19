import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

export interface NavItem {
  label:       string;
  icon:        string;
  route:       string;
  permission?: string;
  roles?:      string[];
  badge?:      string;
  children?:   NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon:  '📊',
    route: '/dashboard',
  },
  {
    label: 'ผู้ใช้งาน',
    icon:  '👥',
    route: '/users',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'รายงาน',
    icon:  '📈',
    route: '/reports',
    roles: ['ADMIN', 'SUPER_ADMIN', 'MANAGER'],
  },
  {
    label: 'ตั้งค่า',
    icon:  '⚙️',
    route: '/settings',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  collapsed      = input(false);
  toggleCollapse = output<void>();

  private readonly auth = inject(AuthService);

  readonly navItems = computed(() =>
    NAV_ITEMS.filter((item) => {
      if (!item.roles?.length) return true;
      return item.roles.some((r) => this.auth.hasRole(r as any));
    }),
  );
}
