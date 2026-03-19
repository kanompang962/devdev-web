import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { KpiCard } from '@features/dashboard/dashboard.service';

@Component({
  selector: 'app-kpi-card',
  imports: [NgClass],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  card = input.required<KpiCard>();

  trendClass = computed(() => ({
    'trend--up':   this.card().trend === 'up',
    'trend--down': this.card().trend === 'down',
    'trend--flat': this.card().trend === 'flat',
  }));

  trendIcon = computed(() => {
    const t = this.card().trend;
    return t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
  });

  formattedValue = computed(() => {
    const { value, unit } = this.card();
    if (unit === 'THB') return `฿${value.toLocaleString('th-TH')}`;
    if (unit === '%')   return `${value}%`;
    return value.toLocaleString('th-TH');
  });
}