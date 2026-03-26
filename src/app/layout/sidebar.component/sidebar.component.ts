import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem, MenuService, resolveIcon } from '@core/services/menu.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  collapsed      = input(false);
  toggleCollapse = output<void>();

  private readonly menuService = inject(MenuService);
  readonly expandedIds = signal<Set<number>>(new Set());
  readonly resolveIcon = resolveIcon;

  // โหลด menus จาก API → signal
  readonly menus = toSignal(this.menuService.getMyMenus(), {
    initialValue: [],
  });

  constructor() {
    // watch menus เมื่อโหลดเสร็จ → set default expanded
    effect(() => {
      const menus = this.menus();
      if (menus.length === 0) return;

      const ids = new Set<number>(
        menus
          .filter((item) => item.children.length > 0)
          .map((item) => item.id),
      );
      this.expandedIds.set(ids);
    });
  }

  isExpanded(id: number): boolean {
    return this.expandedIds().has(id);
  }

  toggleExpand(id: number): void {
    // ถ้า collapsed อยู่ → ขยาย sidebar ก่อนแล้วค่อย expand
    if (this.collapsed()) {
      this.toggleCollapse.emit(); // ขยาย sidebar
      // หน่วงเล็กน้อยให้ animation เสร็จก่อน
      setTimeout(() => {
        this.expandedIds.update((set) => {
          const next = new Set(set);
          next.add(id);
          return next;
        });
      }, 50);
      return;
    }

    this.expandedIds.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  hasChildren(item: MenuItem): boolean {
    return item.children.length > 0;
  }
}
