import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
  dot     = input(false);

  classes = computed(() => ({
    'badge':                    true,
    [`badge--${this.variant()}`]: true,
    'badge--dot':               this.dot(),
  }));
}
