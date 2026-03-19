// Map HTTP errors → AppError (typed, human-readable)
// 401 handled โดย jwt.interceptor แล้ว

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '@core/services/logger.service';

export interface AppError {
  status:  number;
  code:    string;
  message: string;
  fields?: Record<string, string>; // validation field errors
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((raw: HttpErrorResponse) => {
      const error = toAppError(raw);
      logger.error(`[HTTP ${error.status}] ${req.url}`, error);
      return throwError(() => error);
    }),
  );
};

function toAppError(err: HttpErrorResponse): AppError {
  const body = err.error;
  return {
    status:  err.status,
    code:    body?.code    ?? `HTTP_${err.status}`,
    message: body?.message ?? defaultMessage(err.status),
    fields:  body?.errors  ?? undefined,
  };
}

function defaultMessage(status: number): string {
  const map: Record<number, string> = {
    400: 'คำขอไม่ถูกต้อง กรุณาตรวจสอบข้อมูล',
    403: 'คุณไม่มีสิทธิ์เข้าถึงทรัพยากรนี้',
    404: 'ไม่พบข้อมูลที่ต้องการ',
    408: 'การเชื่อมต่อหมดเวลา กรุณาลองใหม่',
    409: 'ข้อมูลซ้ำกัน กรุณาตรวจสอบ',
    422: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบ',
    429: 'คำขอมากเกินไป กรุณารอสักครู่',
    500: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่ภายหลัง',
    502: 'เซิร์ฟเวอร์ไม่ตอบสนอง',
    503: 'ระบบปิดปรับปรุงชั่วคราว',
  };
  return map[status] ?? 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
}