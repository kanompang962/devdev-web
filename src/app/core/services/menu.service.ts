import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, catchError, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ApiResponse } from '@shared/models/api-response.model';

export interface MenuItem {
  id:       number;
  name:     string;
  path:     string;
  icon:     string | null;
  order:    number;
  parentId: number | null;
  children: MenuItem[];
}

export function resolveIcon(icon: string | null): string {
  if (!icon) return 'circle';
  return icon.toLowerCase() ?? 'circle';
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly api  = `${environment.apiUrl}/Menu`;

  // shareReplay — เรียก API ครั้งเดียว cache ไว้ตลอด session
  private readonly menus$ = this.http
    .get<ApiResponse<MenuItem[]>>(`${this.api}/my-menus`)
    .pipe(
      map((res) => res.data.sort((a, b) => a.order - b.order)),
      shareReplay(1),
      catchError((err) => {
        throwError(() => err);
        return of([] as MenuItem[]);
      }),
    );

  getMyMenus(): Observable<MenuItem[]> {
    return this.menus$;
  }
}