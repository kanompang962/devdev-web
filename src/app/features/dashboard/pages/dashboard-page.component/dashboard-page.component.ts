import { Component, inject, OnInit } from '@angular/core';
import { DashboardStore } from '@features/dashboard/store/dashboard.store';
import { ActivityFeedComponent } from "@features/dashboard/components/activity-feed.component/activity-feed.component";
import { KpiCardComponent } from "@features/dashboard/components/kpi-card.component/kpi-card.component";
import { SpinnerComponent } from "@shared/components/spinner.component/spinner.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [ActivityFeedComponent, KpiCardComponent, SpinnerComponent],
  providers: [DashboardStore],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent  implements OnInit {
  readonly store = inject(DashboardStore);

  ngOnInit(): void {
    this.store.loadKpis();
  }
}
