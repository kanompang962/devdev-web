import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User, USER_STATUS_LABEL, USER_STATUS_VARIANT } from '@features/users/user.model';
import { UsersService } from '@features/users/users.service';
import { BadgeComponent } from '@shared/components/badge.component/badge.component';
import { SpinnerComponent } from '@shared/components/spinner.component/spinner.component';
import { formatDate } from '@shared/utils/date.utils';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, BadgeComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  id = input.required<string>();

  private readonly service = inject(UsersService);

  readonly user    = signal<User | null>(null);
  readonly loading = signal(true);
  readonly error   = signal<string | null>(null);

  readonly STATUS_LABEL   = USER_STATUS_LABEL;
  readonly STATUS_VARIANT = USER_STATUS_VARIANT;
  readonly formatDate     = formatDate;

  ngOnInit(): void {
    this.service.getUserById(this.id()).subscribe({
      next:  (u) => { this.user.set(u); this.loading.set(false); },
      error: (e) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
}