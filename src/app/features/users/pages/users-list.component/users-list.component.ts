import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '@shared/components/badge.component/badge.component';
import { SpinnerComponent } from '@shared/components/spinner.component/spinner.component';
import { AuthService } from '@core/auth/auth.service';;
import { CommonModule } from '@angular/common';
import { UsersStore } from '@features/users/store/users.store';
import { UsersService } from '@features/users/users.service';
import { User, USER_STATUS_LABEL, USER_STATUS_VARIANT } from '@features/users/user.model';

@Component({
  selector: 'app-users-list',
  providers: [UsersStore],
  imports: [RouterLink, FormsModule, BadgeComponent, SpinnerComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  readonly store   = inject(UsersStore);
  readonly auth    = inject(AuthService);
  private readonly usersService = inject(UsersService);

  readonly searchQuery  = signal('');
  readonly deletingId   = signal<string | null>(null);

  readonly STATUS_LABEL   = USER_STATUS_LABEL;
  readonly STATUS_VARIANT = USER_STATUS_VARIANT;

  readonly canManage = this.auth.hasAnyRole('ADMIN', 'SUPER_ADMIN');

  ngOnInit(): void {
    this.store.loadUsers({ page: 1, limit: 20 });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.store.setSearch(value);
  }

  onPageChange(page: number): void {
    this.store.setPage(page);
  }

  onDelete(user: User): void {
    if (!confirm(`ยืนยันการลบ ${user.name}?`)) return;

    this.deletingId.set(user.id);
    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.store.removeLocally(user.id);
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  trackByUser(_: number, user: User): string {
    return user.id;
  }

  get pages(): number[] {
    return Array.from({ length: this.store.totalPages() }, (_, i) => i + 1);
  }
}