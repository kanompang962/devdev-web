import { Component, input } from '@angular/core';
import { ActivityItem } from '@features/dashboard/dashboard.service';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { initials } from '@shared/utils/string.utils';

@Component({
  selector: 'app-activity-feed',
  imports: [TimeAgoPipe],
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.scss',
})
export class ActivityFeedComponent {
  activities = input.required<ActivityItem[]>();
  loading    = input(false);

  initials = initials;
}
