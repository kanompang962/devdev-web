import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface KpiCard {
  id:       string;
  label:    string;
  value:    number;
  unit:     string;
  change:   number; // percent vs last period
  trend:    'up' | 'down' | 'flat';
  icon:     string;
}

export interface ActivityItem {
  id:        string;
  user:      string;
  avatar?:   string;
  action:    string;
  target:    string;
  createdAt: string;
}

export interface DashboardSummary {
  kpis:       KpiCard[];
  activities: ActivityItem[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api  = `${environment.apiUrl}/dashboard`;

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.api}/summary`);
  }

  getActivities(limit = 10): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.api}/activities`, {
      params: { limit },
    });
  }
}