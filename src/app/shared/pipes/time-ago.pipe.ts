import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { timeAgo } from '../utils/date.utils';

@Pipe({ name: 'timeAgo', standalone: true, pure: false })
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private readonly cd    = inject(ChangeDetectorRef);
  private timer: ReturnType<typeof setInterval> | null = null;

  transform(value: Date | string): string {
    this.startTimer();
    return timeAgo(value);
  }

  private startTimer(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.cd.markForCheck(), 60_000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}