import { HttpInterceptorFn } from '@angular/common/http';
import { catchError,throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

return next(req).pipe(
  catchError(error => {
    if (error.status === 401) {
      localStorage.removeItem('token');
    }

    return throwError(() => error);
  })
);
}