import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { computed } from '@angular/core';
import { pipe, switchMap } from 'rxjs';
import { ActivityItem, DashboardService, KpiCard } from '../dashboard.service';

interface DashboardState {
  kpis:          KpiCard[];
  activities:    ActivityItem[];
  loadingKpis:   boolean;
  loadingFeed:   boolean;
  error:         string | null;
}

const initialState: DashboardState = {
  kpis:        [],
  activities:  [],
  loadingKpis: false,
  loadingFeed: false,
  error:       null,
};

export const DashboardStore = signalStore(
  withState(initialState),
  withComputed(({ kpis }) => ({
    totalRevenue: computed(() =>
      kpis().find((k) => k.id === 'revenue')?.value ?? 0,
    ),
    hasData: computed(() => kpis().length > 0),
  })),
  withMethods((store, service = inject(DashboardService)) => ({

    loadKpis: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { loadingKpis: true, error: null });
          return service.getSummary().pipe(
            tapResponse({
              next: ({ kpis, activities }) =>
                patchState(store, { kpis, activities, loadingKpis: false }),
              error: (err: { message: string }) =>
                patchState(store, { error: err.message, loadingKpis: false }),
            }),
          );
        }),
      ),
    ),

    loadActivities: rxMethod<number>(
      pipe(
        switchMap((limit) => {
          patchState(store, { loadingFeed: true });
          return service.getActivities(limit).pipe(
            tapResponse({
              next: (activities) =>
                patchState(store, { activities, loadingFeed: false }),
              error: (err: { message: string }) =>
                patchState(store, { error: err.message, loadingFeed: false }),
            }),
          );
        }),
      ),
    ),

  })),
);