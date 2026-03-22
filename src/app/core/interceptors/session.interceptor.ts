import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // ✅ 401 = token expiré ou invalide
      if (error.status === 401) {
        sessionService.showExpiredAlert();
      }
      return throwError(() => error);
    })
  );
};