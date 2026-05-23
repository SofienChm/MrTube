import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  let cloned = req;
  if (auth.token) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } });
  }
  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && auth.token) {
        auth.logout();
        router.navigate(['/auth']);
      }
      return throwError(() => err);
    }),
  );
};
