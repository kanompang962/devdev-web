import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@layout/navbar.component/navbar.component';
import { SidebarComponent } from '@layout/sidebar.component/sidebar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly sidebarCollapsed = signal(true);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
