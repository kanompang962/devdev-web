// Functional Interceptor (Angular 17+)
// Flow: attach token → 401 → silent refresh → retry
// ป้องกัน parallel refresh ด้วย BehaviorSubject queue

import {HttpInterceptorFn, HttpRequest,HttpHandlerFn, HttpErrorResponse,} from '@angular/common/http';
import {catchError, switchMap, throwError, BehaviorSubject, filter, take,} from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn,) => {
  const auth = inject(AuthService);

  if (isAuthEndpoint(req.url)) return next(req);

  const token   = auth.getToken();
  const authReq = token ? cloneWithToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      // Already refreshing → queue this request
      if (isRefreshing) {
        return refreshDone$.pipe(
          filter(Boolean),
          take(1),
          switchMap((newToken) => next(cloneWithToken(req, newToken))),
        );
      }

      isRefreshing = true;
      refreshDone$.next(null);

      return auth.refreshToken().pipe(
        switchMap((newToken) => {       // ← รับ string ตรงๆ แทน void
          isRefreshing = false;
          refreshDone$.next(newToken);
          return next(cloneWithToken(req, newToken));
        }),
        catchError((refreshError) => {
          isRefreshing = false;
          refreshDone$.next(null);      // ← reset ด้วย
          auth.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};

function cloneWithToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders:      { Authorization: `Bearer ${token}` },
    withCredentials: true, // ← ส่ง cookie ไปด้วยทุก request
  });
}

function isAuthEndpoint(url: string): boolean {
  return ['/auth/login', '/auth/refresh'].some((p) =>
    url.includes(p),
  );
}