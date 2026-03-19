import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';



@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);

  menuClick      = output<void>();
  dropdownOpen   = signal(false);

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  logout(): void {
    this.closeDropdown();
    this.auth.logout();
  }
}
