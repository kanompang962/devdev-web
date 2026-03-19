import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  variant   = input<ButtonVariant>('primary');
  size      = input<ButtonSize>('md');
  type      = input<'button' | 'submit' | 'reset'>('button');
  disabled  = input(false);
  loading   = input(false);
  fullWidth = input(false);

  classes = computed(() => ({
    'btn':               true,
    [`btn--${this.variant()}`]: true,
    [`btn--${this.size()}`]:    true,
    'btn--full':         this.fullWidth(),
    'btn--loading':      this.loading(),
  }));
}
